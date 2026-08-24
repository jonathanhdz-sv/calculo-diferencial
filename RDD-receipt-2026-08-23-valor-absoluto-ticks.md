# RDD Receipt — Valor absoluto: números (ticks) en ejes del plano (CAD941)

**Fecha:** 2026-08-23
**Proyecto:** `materias/CAD941/proyecto/calculadora-desigualdades/`
**Repositorio:** `jonathanhdz-sv/calculo-diferencial`

## Qué se pidió (feedback)

En el plano cartesiano no se veían **números en los ejes x e y**, por lo que era difícil
identificar valores (ej. saber que un punto sale del 2).

## Qué se hizo

Se agregaron **etiquetas numéricas (ticks)** en los ejes, alineadas con la malla de enteros:

- Eje **x**: número debajo del eje para cada entero en el rango (excepto el 0, que ya tenía
  su etiqueta).
- Eje **y**: número a la izquierda del eje para cada entero en el rango (excepto el 0).

Se aplicó en `graficarAbs` (módulo de valor absoluto) y también en `graficarFuncion`
(gráficas de funciones), que compartía el mismo problema. Así se identifican valores como
el 2 de forma inmediata.

## Cómo se probó

`test-abs.js` (Node, stubs de DOM): **38/38 PASS**. Añadidos:
- El plano cartesiano contiene al menos 6 etiquetas numéricas (`<text>…</text>` con entero).
- El número `2` aparece como tick en el plano cartesiano.

## Riesgos / pendientes

- Verificación manual en navegador/celular: que los números de los ejes no se amontonen con
  la V, el sombreado ni las etiquetas `y = ±k` en pantallas pequeñas.
- Falta commitear este avance (index.html + spec/design/tasks + test-abs.js).