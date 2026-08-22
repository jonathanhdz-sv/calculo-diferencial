# Spec — Calculadora de Cálculo Diferencial

## Finalidad (qué es y para qué sirve)

Herramienta de estudio personal para la materia **Cálculo Diferencial (CAD941), Unidad 1**.
Resuelve ejercicios paso a paso, mostrando el **procedimiento completo** y respetando el
**método oficial de la docente** (cuadro de validación de zonas, cuadro de pruebas y
resultados en fracción, no en decimal).

**Objetivo de despliegue:** estar disponible **en línea** para acceder desde cualquier parte
o dispositivo (celular, tablet, otro equipo), sin instalar nada.

- Repositorio: `https://github.com/jonathanhdz-sv/calculo-diferencial`
- Sitio publicado (GitHub Pages): `https://jonathanhdz-sv.github.io/calculo-diferencial/`

> Regla de fondo: en guías y parciales se evalúa el procedimiento oficial, no solo la
> respuesta. Por eso la calculadora no debe limitarse a dar el resultado: debe mostrar
> **cómo** se llega a él.

## Alcance (qué SÍ hace)

1. **Desigualdad lineal** (`ax + b < cx + d`): agrupar términos, simplificar, despejar `x`,
   invertir el signo al dividir entre negativo, cuadro de pruebas (verde/rojo) y recta real.
2. **Desigualdad cuadrática** (`ax² + bx + c < 0`): puntos críticos, zonas de la recta,
   cuadro de validación (zona | x prueba | sustitución | signo | ¿cumple?), gráfica de recta.
   - Dos métodos: **fórmula general** y **factorización (tijera)**.
3. **Valor absoluto** (`|x − a| < k`): regla del centro (`<`) y regla de las puntas (`>`).
4. **Intervalos**: desigualdad → intervalo, intervalo → desigualdad, y operaciones
   `∩` (intersección), `∪` (unión), `−` (diferencia).
5. **Intersecciones con los ejes**: corte con X (`y = 0`) y corte con Y (`x = 0`).
6. **Intersecciones entre curvas**: `f(x) = g(x)`, con curvas lineales y con raíz.
7. **Funciones y gráficas**: función constante, lineal y cuadrática. Para la **cuadrática**
   la resolución sigue **exactamente** el flujo que exige la docente, con el procedimiento
   paso a paso visible (nada de solo dar la respuesta):
   - **Coeficientes**: `a`, `b`, `c`.
   - **Dominio**: `Df = R`.
   - **Eje de simetría**: fórmula `x = −b/(2a)`, sustitución con valores y resultado.
   - **Vértice**: `h = −b/(2a)`, `k = f(h)` con la sustitución desarrollada y `V(h, k)`.
   - **Forma canónica por dos métodos**: (a) método del vértice `f(x) = a(x − h)² + k`;
     (b) método de completar cuadrados paso a paso (factor común → completar el trinomio →
     factorizar → simplificar).
   - **Gráfica por método tabular**: tabla obligatoria con **mínimo 5 valores** (`x | f(x) |
     Punto`) simétricos respecto a `x = h`, con la nota de simetría entre pares de puntos.
   - **Gráfica**: plano cartesiano con la parábola y **todos los puntos** de la tabla.
   - **Rango**: `a > 0 → abre hacia arriba` / `a < 0 → abre hacia abajo`, el extremo es `k`,
     y `Rf` según el signo de `a`.
   Las funciones constante y lineal también muestran su desarrollo (coeficientes, dominio,
   tabla de valores, gráfica y rango). — *en reescritura para cumplir el formato oficial*
8. **Dominio y rango** (módulo independiente): acepta **cualquier tipo de función algebraica**
   de la Unidad 1 y calcula dominio (siempre) y rango (cuando es determinable en el nivel):
   - **Polinómica**: constante, lineal, cuadrática y grado ≥ 3.
   - **Racional** `P(x)/Q(x)`: dominio excluye los ceros de `Q(x)`.
   - **Irracional** `√(g(x))`: dominio donde `g(x) ≥ 0`.
   - **Valor absoluto** `|g(x)|`.
9. **Glosario / flashcards**: conceptos, reglas de oro, fórmulas y tips.

## Fuera de alcance (qué NO hace)

- **Dominio y rango** de funciones trascendentes (exponenciales, logarítmicas,
  trigonométricas) — son Unidad 2.
- Rango de casos donde se necesite análisis fino (asíntotas/derivadas de racionales
  complejas): se da dominio y se indica la limitación.
- Funciones definidas por tramos.
- Límites, derivadas (unidades 3–5 de la materia).
- Resolver sistemas con más de 2 ecuaciones, o curvas que no sean lineal/raíz/cuadrática.
- Persistencia de datos (no guarda historial; es 100% cliente y estático).
- Soporte multiidioma (interfaz en español).

## Stack

- **Un solo archivo** `index.html`: HTML + CSS (estilos embebidos) + JavaScript vanilla.
- Sin dependencias, sin build, sin servidor: se abre directo en el navegador.
- Gráficas generadas con **SVG** en el propio código.
- **Deploy:** GitHub Pages desde la rama `main`. Al hacer `git push`, el sitio se actualiza
  en `https://jonathanhdz-sv.github.io/calculo-diferencial/`.

## Usuario

Estudiante de CAD941 que estudia en español, con base matemática en construcción.
La herramienta prioriza claridad didáctica (progresión: analogía → concepto → formal).
