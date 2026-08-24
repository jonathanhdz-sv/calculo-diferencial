# RDD Receipt — Valor absoluto: plano cartesiano y caso trivial (CAD941)

**Fecha:** 2026-08-23
**Proyecto:** `materias/CAD941/proyecto/calculadora-desigualdades/`
**Repositorio:** `jonathanhdz-sv/calculo-diferencial`

## Qué se pidió (feedback)

1. `|x| < 5` no salía bien: en el caso trivial (`a = 1`, `b = 0`) la desigualdad compuesta
   `−5 < x < 5` se mostraba **duplicada** (línea compuesta + resultado final iguales).
2. Se quiere **la recta numérica Y el plano cartesiano** con su gráfica, no solo la recta.

## Qué se hizo

### 1. Caso trivial sin duplicación
En `resolverAbs` (centro): cuando `a === 1 && b === 0`, la línea compuesta ahora se escribe
como `|x| < k  ⇔  −k < x < k` (una sola línea) y **no** se emite un resultado separado, ya
que coinciden. Para el resto (b ≠ 0 o a ≠ 1) se conserva la cadena completa.

### 2. Plano cartesiano
Nueva función `graficarAbs(f, intervalos, k, puntos)` (cerca de `graficarFuncion`):
- Dibuja malla, ejes y origen (SVG).
- Traza la **V** de `y = |ax + b|`.
- Dibuja las líneas horizontales **punteadas** `y = k` y `y = −k` con sus etiquetas.
- Sombra la franja entre `−k` y `k` sobre el/los intervalo(s) de solución (rectángulo
  translúcido).
- Marca los **puntos de corte** `(lo, k)` y `(hi, k)` (donde `|ax+b| = k`).
- El resultado muestra "Recta numérica" y luego "Plano cartesiano · y = |expr|".

Se integró en centro y puntas de `resolverAbs`.

## Cómo se probó

`test-abs.js` (Node, stubs de DOM): **36/36 PASS**. Añadidos casos:
- `|x| < 5` sin duplicación y con la línea `|x| < 5 ⇔ −5 < x < 5`.
- Plano cartesiano presente con `<path>` (V), `<rect>` (sombreado) y etiquetas `y = ±5`.
- Puntas `|2x − 1| > 5` con plano cartesiano y orden recta → plano.

## Riesgos / pendientes

- Verificación manual en navegador/celular: que el SVG del plano cartesiano se vea bien
  (V, franja sombreada, etiquetas `y = ±k`, puntos de corte) con el teclado y el scroll.
- Falta commitear este avance (index.html + spec/design/tasks + test-abs.js).