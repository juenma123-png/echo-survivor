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

## Arranque

```bash
npm install
npm run dev
```

Abre el puerto 8080.
