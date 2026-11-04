# Echo Survivor — informe técnico y plan compartido

> Documento de coordinación para todas las IA y colaboradores. Actualizarlo al cerrar cada bloque de trabajo. No asumir que un cambio está probado si no se ejecutaron las comprobaciones indicadas.

## Fuente de verdad y estado

- Repositorio: https://github.com/juenma123-png/echo-survivor
- Rama base: `main`.
- Rama de trabajo: `kai/engine-fixes-and-ai-handoff-2026-11-04`.
- Esta rama parte de la rama del PR #1 para conservar sus cambios de balance y estructuras.
- PR #1: https://github.com/juenma123-png/echo-survivor/pull/1
- No hacer commits directamente en `main`. Integrar por Pull Request.
- Replit queda fuera del flujo de trabajo.
- Grok se encarga del arte/animaciones de enemigos; las demás IA deben respetar el contrato de sprites y no cambiar balance/IA/hitboxes sin coordinación.

## Cambios heredados del PR #1

Se conservan en esta rama:
- Botín de equipo: cofres 12 %, élites 10 %, jefes 30 %.
- Cofres de enemigos normales: 2,5 %.
- Recompensa común cada 3 niveles y cofre especial cada 5; el hito de 5 prevalece si coincide.
- Cuatro estructuras visibles desde el spawn y altar más cercano.
- Fallback vectorial para props, cofres y altar cuando no cargan sprites.
- README actualizado con las reglas anteriores.

## Hallazgos técnicos priorizados

### Críticos / alta prioridad
1. **React/HUD a frecuencia de frame:** el motor marca el HUD como sucio en cada update. En móvil esto fuerza renders excesivos. Plan: limitar emisiones del HUD durante juego a ~12 Hz; eventos discretos siguen emitiendo de inmediato.
2. **Dash vertical/diagonal incorrecto:** el fallback horizontal usaba `p.flip` cuando `mx=0`. Debe respetarse el vector de entrada.
3. **Experiencia acumulada:** al subir varios niveles en un solo pickup, una selección podía sobrescribir a otra. Plan: cola de elecciones, una mejora por nivel.
4. **Límite de enemigos:** invocaciones de jefes no pasaban por el límite de oleadas. Plan: límite global dentro de `spawnEnemy`, priorizando jefes/élites y retirando un enemigo normal si hace falta.
5. **Contacto enemigo:** distancia calculada antes del movimiento. Recalcular tras movimiento antes de aplicar daño.

### Prioridad media
6. Limpiar `window.__controlsTest` al destruir el motor y exponerlo solo en desarrollo.
7. Evitar emisión asíncrona de `boot()` si el componente ya se desmontó.
8. Restaurar preferencias de audio al inicializar el contexto de audio.
9. Filtrar mejoras ya agotadas (crítico, soledad y vínculo) para evitar elecciones sin efecto.
10. Corregir discrepancia entre inventario lleno, auto-desmontaje y recompensa mostrada al ganar.
11. Validar completamente el esquema de datos guardados y normalizar números/objetos.
12. Optimizar colisiones: `solidAt` reconstruye colliders y la separación de enemigos es O(n²).
13. Evitar automatización de audio de cordura en cada frame si el valor no ha cambiado materialmente.
14. Evitar dibujar el mundo entero en pantallas de menú cuando no se ve.
15. Revisar `setStick`/estado React durante pointermove y el doble listener resize.
16. Añadir tests específicos del motor y del equipo; actualmente las pruebas se concentran en scripts/auth/app-data.

### Arquitectura y deuda
- El sistema antiguo `GEAR`/tool/relic convive con inventario moderno por ranuras; no eliminar sin revisar migración y partidas antiguas.
- El módulo P2P existe pero no está conectado a una ruta de señalización ni al loop del juego.
- Hay infraestructura de auth/app-data que parece venir de la plantilla; no borrar sin validar requisitos del despliegue.
- `.vercel/output` contiene artefactos generados versionados; decidir si son necesarios para el hosting antes de retirarlos.
- No existía workflow de CI; añadirlo sin ejecutar migraciones de base de datos en el job de build.
- Revisar código muerto y helpers aparentemente no usados con búsqueda global antes de eliminar.

## Contrato de colaboración para IA de arte (Grok)

- El motor actual dibuja enemigos con spritesheets de 2×2 y 4 frames.
- Los archivos se sirven desde `public/sprites/` y las rutas se declaran en `SPRITE_URLS` de `src/game/config.ts`.
- Mantener nombres/rutas existentes o documentar claramente los nuevos.
- No cambiar estadísticas, hitboxes, velocidad, daño, IA, drops ni balance al crear animaciones.
- Entregar sprites con dimensiones consistentes, transparencia limpia y orden de frames documentado.
- Proponer estados idle/walk/attack/death; no asumir que el motor ya cambia correctamente entre todos ellos. Coordinar la conexión de estados antes de renombrar hojas.
- Verificar que ningún frame quede recortado y que el tamaño visual sea coherente entre enemigos.

## Plan futuro de implementación

### Fase 1 — estabilidad del motor
- Cerrar y revisar los cambios de esta rama.
- Corregir cola de level-ups, dash, límite de enemigos, frecuencia del HUD y distancia de contacto.
- Revisar preferencias de audio y ciclo de vida del motor.
- Añadir pruebas unitarias de reglas puras y pruebas de regresión donde el diseño del motor lo permita.

### Fase 2 — integridad de progreso
- Auditar `readMeta`, `writeMeta`, `grantGear`, `completeLevel`, equipar/desmontar.
- Definir explícitamente qué ocurre con el botín si el inventario está lleno.
- Garantizar que UI, inventario y guardado muestran el mismo resultado.
- Mantener la pérdida de gemas al morir como decisión de diseño salvo nueva instrucción del creador.

### Fase 3 — rendimiento móvil
- Medir antes/después: HUD, colisiones, separación de enemigos, partículas, gradientes y ordenación de sprites.
- Cachear colliders y reducir trabajo fuera de cámara solo si no altera colisiones/jugabilidad.
- Mantener resolución lógica 16:9 y controles táctiles.
- Evitar micro-optimizaciones sin medición.

### Fase 4 — calidad y mantenimiento
- Validación estricta de guardado y migraciones compatibles.
- CI: install, typecheck, lint, tests y build de desarrollo.
- Añadir pruebas del motor; no confundir compilación con prueba visual.
- Revisar archivos generados, dependencias y código muerto con evidencia.

### Fase 5 — animación e identidad
- Integrar las hojas nuevas de Grok con un contrato explícito de estados.
- Añadir transiciones visuales idle/walk/attack/death sin alterar gameplay.
- Validar legibilidad y rendimiento en móvil.

## Reglas de trabajo para otras IA

1. Leer este documento antes de editar.
2. Consultar la rama y el commit más recientes; este documento puede quedar desactualizado.
3. No sobrescribir trabajo ajeno ni hacer cambios en `main`.
4. Crear rama o trabajar en la rama asignada; usar PR para integrar.
5. No declarar tests/build/QA como exitosos si no se ejecutaron.
6. No añadir dependencias sin justificar necesidad, tamaño y alternativa.
7. Separar cambios de arte, lógica, balance y contenido para facilitar revisión.
8. Actualizar este documento con cambios, decisiones, riesgos, pruebas ejecutadas y pendientes.
9. No borrar sistemas heredados ni datos guardados sin plan de migración.
10. Mantener los comentarios y textos de juego en español salvo que el producto requiera otro idioma.

## Estado de verificación

- Cambios descritos en esta rama: revisión estática por IA.
- Build/typecheck/lint/tests: pendientes de ejecutar.
- Prueba visual en navegador y móvil: pendiente.
- No afirmar que los bugs están resueltos en runtime hasta ejecutar pruebas.
