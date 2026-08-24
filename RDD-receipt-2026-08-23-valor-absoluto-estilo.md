# RDD Receipt — Valor absoluto: tamaño de ejes y explicación de pasos (CAD941)

**Fecha:** 2026-08-23
**Proyecto:** `materias/CAD941/proyecto/calculadora-desigualdades/`
**Repositorio:** `jonathanhdz-sv/calculo-diferencial`

## Qué se pidió (feedback)

1. Los números de las gráficas se ven **muy grandes** → hacerlos un poco más pequeños.
2. La explicación de los **pasos** no se aprecia bien → mejorar ese formato, que se entienda.

## Qué se hizo

### 1. Tamaño de los números en los planos cartesianos
Se redujo la tipografía de las etiquetas de los planos cartesianos (`graficarAbs`,
`graficarFuncion`, `renderPlano`):
- Ticks de eje x e y: `11` → `9`.
- Etiqueta del origen `0`: `12` → `10`.
- Letras de ejes `x`/`y`: `14` → `12`.
- Etiquetas `y = ±k`: `12` → `10`.

### 2. Explicación de los pasos más didáctica
Se reemplazó el desplegable de 2 pasos por **4 pasos** bien explicados por caso.

**Centro (`|u| < k`):**
1. ¿Qué significa `|u| < k`? — valor absoluto = distancia al 0 → franja entre −k y k.
2. Aplicar la regla a la expresión (desaparece el | |).
3. Despejar x en la triple desigualdad (misma operación a los tres lados; invertir si
   coeficiente negativo).
4. Leer la solución: qué se sombrea en la recta y en el plano (V por debajo de y = k).

**Puntas (`|u| > k`):**
1. ¿Qué significa `|u| > k`? — distancia > k → por debajo de −k o por encima de k (dos casos).
2. Aplicar la regla → dos desigualdades.
3. Resolver cada rama por separado.
4. Leer la solución: unión (∪), recta sombrea extremos, plano es la V por encima de y = k.

## Cómo se probó

`test-abs.js` (Node, stubs de DOM): **41/41 PASS**. Ajustados/añadidos:
- Explicación con 4 pasos (`Paso 1 —` … `Paso 4 —`) en centro y puntas.
- Conclusión antes del desplegable.
- Plano cartesiano usa `font-size="9"` (ticks) y `font-size="10"` (0).

## Riesgos / pendientes

- Verificación manual en navegador/celular: que los números de los ejes queden legibles pero
  discretos, y que la explicación expandida se lea cómoda sin amontonarse.
- Falta commitear este avance (index.html + spec/design/tasks + test-abs.js).