# Echo Survivor

Roguelite de acción top-down: te mueves, el ataque es automático y cada eco que invocas te hace más fuerte y más frágil.

## Cómo jugar

- WASD o flechas para moverte. En el móvil, joystick.
- El ataque es automático.
- **E** o el botón Eco usa lo que tengas delante: fantasma, eco, cofre, altar, cristal, árbol, pilar o roca.
- Espacio para el dash. Esc para pausar.
- Toca el nombre de un eco en el medidor para soltarlo.

## Estructuras

| Cosa | Qué hace |
|---|---|
| Cristal | Te cura y baja la cordura. Luego descansa. |
| Árbol | Suelta un recuerdo (XP). También tapa disparos. |
| Pilar | Pulso que hiere a los enemigos cercanos. Sube un poco la cordura. |
| Roca | Se rompe (a golpes o con E) y abre camino. |
| Fantasma / Eco | Te ofrece un aliado espectral. |
| Cofre | Fragmentos y vida. |
| Altar | Más vida máxima y menos cordura. |

Los disparos enemigos no atraviesan árboles, pilares, rocas ni cristales. Los espectros sí atraviesan el terreno.

## Plaza

Abajo hay cuatro sitios. La Plaza elige el nivel (15 minutos; cada uno sube un 25 % la vida y el daño). Comprar abre cofres de calidad. Equipo muestra las piezas con su dibujo: el marco cambia con la calidad (común, raro, épico, legendario).

## Equipo

Dentro de la run, los cofres tienen un 12 % de probabilidad de soltar equipo, los élites un 10 % y los jefes un 30 %. Los cofres normales que aparecen al derrotar enemigos también son menos frecuentes (2,5 %). Cada objeto tiene una ranura (arma, casco, armadura, botas o reliquia), una calidad y efectos:

| Calidad | Efectos | Valores |
|---|---|---|
| Común | 1 | base |
| Raro | 2 | ×1.4 |
| Épico | 3 | ×1.9 |
| Legendario | 4 | ×2.6 |

El nivel del objeto sube cada 3 minutos de run. Los efectos equipados se aplican al empezar la siguiente run. Desmontar un objeto no equipado da fragmentos según su calidad. Los objetos de la tienda siguen en la misma pestaña, debajo del inventario.

Los valores y pesos de caída están en `src/game/gear.ts`.

## Niveles

Una run completa (15 minutos) es un nivel. Si la superas, desbloqueas el siguiente.

- **Cada 3 niveles** (3, 6, 9…): un objeto común de ranura aleatoria.
- **Cada 5 niveles** (5, 10, 15…): cofre especial con 2 objetos, sin común. Si coincide con un hito de 3 niveles, solo se entrega el cofre especial. Pesos: raro 50 %, épico 38 %, legendario 12 %.
- **Dificultad:** cada nivel sube un 25 % la vida y el daño de los enemigos.

Puedes elegir cualquier nivel ya desbloqueado desde la Plaza. Los pesos del cofre especial están en `LEVEL_CHEST_WEIGHTS` (`src/game/gear.ts`) y la escala en `LEVEL_ENEMY_SCALE` (`src/game/config.ts`).

## Enemigos nuevos

Brasa (explota), Luz errante (embiste), Armadura hueca (escudo), Sanguijuela (cura aliados), Espora (frena). Jefes a los 4:00 (Custodio de la Niebla), 8:00 (Corrupto) y 12:00 (Reina de los Ecos). Al morir, si hay hoja `*_death`, se reproducen sus cuatro cuadros.


## Coordinación con otras IA

Antes de editar el juego, lee [el informe técnico y la hoja de ruta para IA](docs/AI_HANDOFF_AND_TECHNICAL_ROADMAP.md). Allí están los hallazgos, el contrato de sprites, las decisiones de diseño y el plan de implementación.

## Arranque

```bash
npm install
npm run dev
```

Abre el puerto 8080.
