# Echo Survivor — informe técnico y plan compartido

> Documento de coordinación para todas las IA y colaboradores. Actualizarlo al cerrar cada bloque de trabajo. No asumir que un cambio está probado si no se ejecutaron las comprobaciones indicadas.

## Fuente de verdad y estado

- Repositorio: https://github.com/juenma123-png/echo-survivor
- Rama base: `main`.
- Rama de trabajo: `kai/engine-fixes-and-ai-handoff-2026-11-04`.
- Esta rama parte de la rama del PR #1 para conservar sus cambios de balance y estructuras.
- PR #1: https://github.com/juenma123-png/echo-survivor/pull/1
- PR #2 (borrador): https://github.com/juenma123-png/echo-survivor/pull/2
- No hacer commits directamente en `main`. Integrar por Pull Request.
- **Replit vuelve a formar parte del flujo de QA**: usar el proyecto https://replit.com/@juenma123/echo-survivor para ejecutar y observar el juego. Antes de probar, verificar que Replit está en la rama de trabajo y en el commit esperado; no asumir que está sincronizado.
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

## Contrato de colaboración para IA de arte (Grok)

- El motor actual dibuja enemigos con spritesheets de 2×2 y 4 frames.
- Los archivos se sirven desde `public/sprites/` y las rutas se declaran en `SPRITE_URLS` de `src/game/config.ts`.
- Mantener nombres/rutas existentes o documentar claramente los nuevos.
- No cambiar estadísticas, hitboxes, velocidad, daño, IA, drops ni balance al crear animaciones.
- Entregar sprites con dimensiones consistentes, transparencia limpia y orden de frames documentado.
- Proponer estados idle/walk/attack/death; no asumir que el motor ya cambia correctamente entre todos ellos. Coordinar la conexión de estados antes de renombrar hojas.
- Verificar que ningún frame quede recortado y que el tamaño visual sea coherente entre enemigos.

## Plan de trabajo y QA (orden obligatorio recomendado)

### Fase 0 — sincronización y línea base
- Confirmar en GitHub el commit exacto de la rama de trabajo.
- Confirmar que Replit está en esa misma rama y commit; registrar cualquier diferencia antes de tocar archivos.
- Comprobar que el árbol de trabajo está limpio y que no hay tareas/ejecuciones previas en curso.
- Guardar el resultado de la línea base antes de aplicar nuevas correcciones.

### Fase 1 — pruebas automatizadas y estabilidad del motor
- Ejecutar instalación reproducible y registrar versión de Node/npm.
- Ejecutar typecheck, lint, suite de tests portable/CI y build.
- Ejecutar pruebas de regresión de dash vertical/diagonal, cola de level-ups, límite global de enemigos, distancia de contacto, ciclo de vida del motor, audio y guardado.
- Si una prueba falla, identificar si es fallo real, fixture ausente o entorno; no ocultar fallos ni rebajar cobertura solo para poner CI en verde.
- Corregir fallos confirmados en la rama de trabajo, con cambios pequeños y tests que reproduzcan el problema.
- No editar `main`, no hacer merge ni publicar despliegues.

### Fase 2 — pruebas funcionales en navegador
- Verificar inicio, menú/plaza, continuar/nueva partida, movimiento WASD/flechas, dash, ataque automático, daño recibido, muerte y reinicio.
- Verificar enemigos normales, élites, jefes, límites de spawn y colisiones.
- Verificar XP, subida de varios niveles seguidos, selección de mejoras y que ninguna elección se pierda.
- Verificar cofres, recompensas, equipo, inventario lleno, equipar/desmontar y guardado/carga.
- Verificar Ecos, Cordura y pérdida de gemas al morir según el diseño actual.
- Registrar pasos, resultado esperado, resultado real y evidencia; no marcar como probado algo que solo se inspeccionó estáticamente.

### Fase 3 — pruebas móviles y rendimiento
- Probar joystick táctil, dash/acciones, orientación y distintas resoluciones.
- Medir FPS, memoria y respuesta con oleadas pobladas y partidas largas.
- Buscar errores de consola, fugas/listeners duplicados y degradación progresiva.
- Optimizar solo con mediciones comparables antes/después y sin cambiar el comportamiento del juego.

### Fase 4 — balance y experiencia
- Evaluar ritmo de oleadas, dificultad, frecuencia de recompensas y riesgo/recompensa.
- Mantener la pérdida de gemas al morir como decisión de diseño salvo nueva instrucción del creador; medir su impacto antes de proponer cambios.
- Revisar que las mejoras tengan efecto comprensible y que el inventario/recompensas comuniquen el resultado real.
- No retocar balance durante la depuración de fallos de motor salvo que sea imprescindible y quede separado.

### Fase 5 — animación e identidad
- Integrar las hojas nuevas de Grok con un contrato explícito de estados.
- Añadir transiciones visuales idle/walk/attack/death sin alterar gameplay.
- Validar legibilidad y rendimiento en móvil.
- Mantener arte y lógica en cambios/PR separados cuando sea posible.

## Reglas de trabajo para otras IA

1. Leer este documento antes de editar.
2. Consultar la rama y el commit más recientes; este documento puede quedar desactualizado.
3. No sobrescribir trabajo ajeno ni hacer cambios en `main`.
4. Trabajar en la rama asignada; usar PR para integrar.
5. No declarar tests/build/QA como exitosos si no se ejecutaron.
6. No añadir dependencias sin justificar necesidad, tamaño y alternativa.
7. Separar cambios de arte, lógica, balance y contenido para facilitar revisión.
8. Actualizar este documento con cambios, decisiones, riesgos, pruebas ejecutadas y pendientes.
9. No borrar sistemas heredados ni datos guardados sin plan de migración.
10. Mantener los comentarios y textos de juego en español salvo que el producto requiera otro idioma.
11. Toda corrección debe incluir una prueba reproducible cuando sea viable.
12. Informar los fallos sin maquillarlos; distinguir pruebas automatizadas, manuales, visuales y móviles.

## Estado de verificación

- Cambios descritos en esta rama: revisión estática por IA.
- Typecheck y lint se ejecutan en CI. El primer intento de tests completos reveló dependencias de fixtures locales ignorados en `.grok/`; se separó un subconjunto portable para CI. Resultado de la nueva ejecución: pendiente.
- Prueba visual inicial en Replit: se confirmó que la pantalla inicial carga; no se validaron controles ni gameplay.
- Prueba visual completa en navegador y móvil: pendiente.
- No afirmar que los bugs están resueltos en runtime hasta ejecutar pruebas.
