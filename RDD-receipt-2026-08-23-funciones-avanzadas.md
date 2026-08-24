# RDD Receipt — Módulos de funciones avanzadas (CAD941)

**Fecha:** 2026-08-23
**Proyecto:** `materias/CAD941/proyecto/calculadora-desigualdades/`
**Repositorio:** `jonathanhdz-sv/calculo-diferencial`

## Qué se pidió

Ampliar la calculadora de Cálculo Diferencial para cubrir el bloque de **funciones
avanzadas** de la Guía 1 que la página no resolvía: composición de funciones, función
inversa, operaciones con funciones, pares/impares y simetría, y funciones seccionadas.

## Qué se hizo

Se implementaron **5 módulos nuevos** + un motor simbólico reutilizable:

### Motor simbólico (nueva capa base)
- `normalizarSimbolico`, `insertarMultiplicacion`, `tokenizarSimbolico`, `parsearSimbolico`:
  parser de expresiones con precedencia correcta (`-x² = -(x²)`).
- `evaluarAST` (evalúa numéricamente), `sustituirAST` (sustitución simbólica),
  `polinomioDesdeAST` (extrae coeficientes, con `div` por constante), `polinomioTexto`
  (formatea polinomio con fracciones y superíndices).

### Módulos
1. **Composición** (`resolverComposicion` + `resolverParametrosComposicion`): f∘g, g∘f,
   dominio/rango, evaluación en punto, y parámetros (#14 → a, b).
2. **Función inversa** (`resolverInversa`): lineal, cúbica, raíz y racional; dominio/rango,
   gráfica f/f⁻¹/y=x (`graficarMultiples`), verificación de inversas.
3. **Operaciones con funciones** (`resolverOpFunciones`): f+g, f−g, fg, f/g con dominio.
4. **Pares/impares y simetría** (`resolverSimetria`): f(−x), clasificación par/impar/ninguna.
5. **Funciones seccionadas** (`parsearSeccionada`, `parsearCondicion`, `resolverSeccionada`):
   tramos, dominio total, gráfica por tramos con recorte de dominio.

## Cómo se probó

- `test-comp.js` (Node): motor simbólico + composición #13, #14 → **12/13** (el FAIL es de
  expectativa del test: `1/√4 = 0.5`, no 0.25; el motor está correcto).
- `test-inv.js` (Node): inversa #15, #17, #18 → **5/6** (FAIL de expectativa: `(1/3)x` ≡ `x/3`).
- `test-mods.js` (Node): operaciones #12, simetría #6/#9, seccionadas #11 → **8/9** (FAIL de
  expectativa: test usaba estructura vieja `op`/`cond`, ahora es `rango`).
- Verificación de sintaxis: `new Function(...)` sobre el JS extraído → **SYNTAX OK**.

## Bugs corregidos durante el desarrollo

1. `parsearCuadratica` no maneja fracciones (`-x/4`) ni `x³` → se usa el motor simbólico
   para la detección de tipo en la inversa.
2. `polinomioDesdeAST` no soportaba `div` por constante → agregado (necesario para `x/2`).
3. Precedencia del parser: `-x²` se leía como `(-x)²` → reordenado (`parseMulDiv` →
   `parseUnary` → `parsePower` → `parsePrimary`).
4. Dominio de compuestas no polinómicas delegaba mal a `resolverDominioRacional`
   ("nunca se anula") → ahora muestra nota honesta "requiere análisis fino".
5. Parser de seccionadas no soportaba condiciones encadenadas (`-1 < x < 1`) → `parsearCondicion`.
6. `polinomioTexto` mostró `1/3x` (ambiguo) → `(1/3)x`.

## Riesgos / pendientes

- El rango de funciones seccionadas y compuestas no polinómicas es análisis visual
  (no se calcula formalmente) — documentado en spec.md.
- La inversa soporta solo lineal, cúbica (monomio), raíz lineal y racional lineal.
- Falta verificación manual en navegador/celular (gráficas SVG, teclado, scroll).
- Falta commitear el avance (5 módulos + motor + glosario + spec/design/tasks).
