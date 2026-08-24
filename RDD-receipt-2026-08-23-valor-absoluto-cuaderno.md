# RDD Receipt — Valor absoluto formato cuaderno (CAD941)

**Fecha:** 2026-08-23
**Proyecto:** `materias/CAD941/proyecto/calculadora-desigualdades/`
**Repositorio:** `jonathanhdz-sv/calculo-diferencial`

## Qué se pidió

Cambiar el módulo **Desigualdad con valor absoluto** (`resolverAbs`) para que use el
**formato cuaderno** del método oficial:

1. Mostrar la cadena de pasos como se escribe en el cuaderno:
   - `|2x − 1| < 5` → regla `|u| < a ⇔ −a < u < a` → `−5 < 2x − 1 < 5` →
     `−5 + 1 < 2x < 5 + 1` → `−4 < 2x < 6` → `−4/2 < x < 6/2` → `−2 < x < 3` →
     `x ∈ (−2, 3)`.
2. La **explicación conceptual** (los "pasos") va **al final** en un desplegable, no arriba.
3. La **gráfica es lineal** (recta real); no aplican gráficas cuadráticas.

## Qué se hizo

Se reescribió `resolverAbs` en `index.html`:

- **Centro** (`<`, `<=`): traduce a la triple desigualdad `−k < ax+b < k` y la despeja en
  cadena (mover constante con `sumaSignada` → simplificar → dividir mostrando la división
  intermedia → simplificar) y concluye `x ∈ (lo, hi)` con el cierre según `<=`/`<`.
- **Puntas** (`>`, `>=`): resuelve las dos ramas en paralelo hasta `x ∈ (−∞, lo) ∪ (hi, ∞)`,
  ordenando los dos intervalos de menor a mayor.
- **Coeficiente negativo** (`a < 0`): invierte los signos en la división.
- **Casos especiales**: `k < 0` (ninguna en centro / todas en puntas), `k = 0` en centro
  (`<` → ninguna; `<=` → punto único `x = −b/a`), `a = 0` (expresión constante →
  todas/ninguna).
- La explicación de los pasos quedó en `<details class="detalle">` **después** de la
  conclusión y la gráfica.
- Gráfica lineal con `renderNumberLine` (SVG de recta real).
- Se agregó el helper `sumaSignada` (escribe `a + b` con signo, p. ej. `−5 + 1`) y se
  retiraron los helpers sin uso (`resolverLinealAbs`, `intervaloDesdeSol`, `escFormat`).

## Cómo se probó

`test-abs.js` (Node, extrae el JS del HTML con stubs de DOM): **29/29 PASS**. Cubre:

- Centro: `|x| < 3` → `(-3, 3)`; `|x| <= 3` → `[-3, 3]`; `|2x − 1| < 5` → cadena completa
  en orden y `(-2, 3)`; coef negativo `|1 − 2x| < 5` → `(-2, 3)` con inversión de signos en
  la división; fracción `|x/2| < 1` → `(-2, 2)`.
- Puntas: `|x| > 3`, `|2x − 1| > 5`, `|x| >= 3` (cerrado), coef negativo `|1 − 2x| > 5`.
- Casos especiales: `k < 0`, `k = 0` (`<=` → punto), constantes, formato inválido.
- Presentación: explicación al final, conclusión después de la cadena, gráfica lineal SVG y
  sin `<`/`>` sin escapar (render HTML seguro).

## Bugs corregidos durante el desarrollo

1. **`<` sin escapar** en las líneas de resultado y en el texto explicativo: rompía el
   render en HTML (se trataban como inicio de tag). Se usó `sig(asc)` (`&lt;`/`≤`) y
   `escapar(...)` en el texto de los pasos.
2. **Puntas con `a < 0`**: la construcción de segmentos no seguía la dirección del operador
   tras invertirlo (`|1 − 2x| > 5` daba unión equivocada). Se creó `segPunta(opF, val)` que
   construye el intervalo según el operador final.
3. **Orden de los intervalos** en puntas: se ordenan de menor a mayor para mostrar
   `(−∞, lo) ∪ (hi, ∞)` en el orden natural.

## Riesgos / pendientes

- **Verificación manual en navegador/celular** (pendiente): confirmar que el teclado
  matemático, el scroll y la gráfica SVG se ven bien con el nuevo formato.
- En el caso trivial `|x| < 3` (b = 0, a = 1) la desigualdad compuesta y el resultado final
  coinciden (`−3 < x < 3`), por lo que aparecen dos líneas casi iguales (la última resaltada
  como respuesta). Es intencional (compuesta → respuesta) y no afecta el resultado.
- Falta commitear el avance (index.html + spec/design/tasks + test-abs.js).