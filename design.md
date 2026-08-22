# Design — Calculadora de Cálculo Diferencial

## Arquitectura general

Monolito de **un solo archivo** `index.html` con tres capas en el mismo documento:

1. **HTML** — estructura estática: pantalla de inicio (`#home`) + un `<div>` por módulo
   (`#modulo-*`, clase `.modulo`, atributo `hidden`). Cada módulo tiene su `input`, botón
   `Resolver`, zona de error y zona de resultado.
2. **CSS** — en `<style>`: variables de color (`:root`), tarjetas, botones, cuadro de
   validación (`table.tabla`), desarrollo tipo cuaderno (`.linea`), gráficas (`.grafica`).
3. **JS** — en `<script>`: utilidades + un `resolverXxx()` por módulo + wiring al final.

## Navegación entre módulos

- `mostrarVista(id)` oculta `#home` y todos los `.modulo`, y muestra solo el pedido.
- Las tarjetas usan `data-modulo`; los botones "volver" usan `data-volver` (por defecto `home`).
- Los botones de ejercicios (`.ejercicio`) rellenan el input (`data-fill`), y si tienen
  `data-run`, disparan el botón de resolver automáticamente.

## Capa de utilidades (compartidas por todos los módulos)

- **Parsing numérico**: `parseNum` (acepta fracciones `a/b` y decimales), `parsearFrac`,
  fracciones `{n, d}` con `fracSumar/Restar/Dividir` y `simplificar` (usa `mcd`).
- **Formato**: `fmtRacional` (decimal → fracción cuando es exacta), `fmtPolinomio`,
  `fmtPolinomioSustituido`, `terminoX`, `terminoConstante`, `fraccionHtml` (fracción apilada).
- **Inecuaciones**: `separar` (parte en izquierda/signo/derecha, normaliza `≤`→`<=`),
  tablas `NORMALIZA`, `MUESTRA`, `INVERSO` (invertir signo).
- **Intervalos**: segmentos `{from, to, fromClosed, toClosed, color}`; `segsToString`,
  `describir`, y operadores `interseccion`, `union`, `diferencia`.
- **Rendering SVG**: `renderNumberLine` (recta real), `renderQuadraticNumberLine`
  (recta con zonas y signos), `renderPlano` y `graficarFuncion` (plano cartesiano).
- **Plantillas HTML**: `paso`, `ecuacion`, `cuadernoLinea`, `cuadernoResultado`, `tachada`.

## Algoritmos por módulo

- **Lineal** (`resolver`): agrupa términos con `x` a la izquierda y constantes a la derecha
  (cada término cambia de signo al cruzar), simplifica, y despeja `x`. Si el coeficiente es
  negativo, se invierte el signo. Si el coeficiente queda en 0, decide "siempre verdadera"
  o "siempre falsa". Produce: desarrollo, conclusión, recta real y cuadro de pruebas.
  - **Parser con distributiva** (`parsearLado` v2): expande `k(ax + b)`, `−(ax+b)` y
    `(ax+b)/d` antes de tokenizar. `(X/2)` y `x/2` se interpretan como `(1/2)x`; `X`
    mayúscula se normaliza a `x` (regex/expansión simbólica de coeficiente por término).
  - **Despeje con división visible**: antes de la línea final `x > 3` se muestra la
    división intermedia `x > 9/3` (coeficiente pasa a dividir), respetando el formato
    cuaderno.
- **Cuadrática** (`construirSolucionCuadratica`): calcula el discriminante `D`. Con `D < 0`
  decide por el signo de `a`; con `D = 0` maneja raíz doble; con `D > 0` parte la recta en
  tres zonas y prueba un valor por zona. Produce: puntos críticos, zonas, cuadro de
  validación y recta coloreada (verde = cumple, rojo = no).
  - **Fórmula general** (`resolverFormulaGeneral`): pasos de sustitución y resolución.
  - **Factorización** (`resolverFactorizacion`): busca `(px+q)(rx+s)` por divisores y lo
    muestra con el diagrama de **tijera** (SVG).
- **Valor absoluto** (`resolverAbs`): si `<` usa la regla del centro (intersección de dos
  desigualdades); si `>` usa la regla de las puntas (unión de dos ramas).
- **Intervalos**: `desigualdadAIntervalo`, `parseIntervaloNotacion`, `intervaloAInecuacion`
  y `operarIntervalos` para `∩`, `∪`, `−`.
- **Intersecciones con ejes** (`resolverIntercepcionX/Y`): parsea `y = ...` o forma general,
  hace `y = 0` (corte X) o `x = 0` (corte Y), y grafica el punto.
- **Intersecciones entre curvas** (`resolverCurvas`): iguala `f(x) = g(x)`, soporta sistema
  de dos rectas y curva con raíz vs recta (eleva al cuadrado y verifica candidatos).
- **Funciones y gráficas** (`resolverFuncion`): clasifica en constante / lineal / cuadrática.
  Para la cuadrática el orden de salida es el formato oficial de la docente:
  coeficientes → dominio → eje de simetría (fórmula + sustitución + resultado) → vértice
  (`h`, `k = f(h)` desarrollado, `V(h,k)`) → forma canónica por método del vértice → forma
  canónica por completar cuadrados (5 pasos: factor común `a`, completar trinomio, factorizar,
  simplificar) → tabla tabular de 5 puntos (`x | f(x) | Punto`, centrada en `h`, con nota de
  simetría) → gráfica con todos los puntos de la tabla → rango. Constante y lineal muestran
  coeficientes, dominio, tabla de valores, gráfica y rango. Gráfica con `graficarFuncion`.
  Helpers nuevos de formato: `fmtTerminoLineal`, `fmtBinomio`, `fmtCanonica`,
  `fmtSustitucionSinIgual`.

## Módulo Dominio y Rango (nuevo)

- **Entrada**: `f(x) = expresión` o `y = expresión`.
- **Detección de tipo** (`detectarTipoFuncion`): analiza la expresión con regex/parsing:
  - contiene `/` con `x` en el denominador → **racional**.
  - contiene `√(` o `sqrt(` → **irracional**.
  - contiene `|...|` → **valor absoluto**.
  - solo potencias de `x` → **polinómica** (grado por mayor exponente).
- **Dominio** según tipo:
  - polinómica y valor absoluto → `ℝ = (−∞, ∞)`.
  - racional → hallar ceros de `Q(x)` (con `parsearCuadratica`/`factorizarCuadratica` o
    fórmula general), excluirlos: `ℝ − {a, b}`.
  - irracional → resolver `g(x) ≥ 0` (desigualdad lineal o cuadrática) y dar el/los
    intervalos; reutiliza la lógica de soluciones de cuadrática.
- **Rango** según tipo:
  - constante `y = k` → `{k}`.
  - lineal → `ℝ = (−∞, ∞)`.
  - cuadrática → `[vértice_y, ∞)` si `a > 0`; `(−∞, vértice_y]` si `a < 0`.
  - polinómica grado impar → `ℝ`.
  - valor absoluto `|ax + b|` → `[0, ∞)`.
  - raíz `√(lineal)` → `[0, ∞)`.
  - racional / casos no triviales → dominio + nota "rango requiere análisis fino".
- **Salida**: formato cuaderno con pasos (`cuadernoLinea`/`cuadernoResultado`), recta real
  con `renderNumberLine` cuando el dominio sea restringido, y detalles expandibles.

## Convenciones

- Resultados en **fracción** cuando son exactos; decimal solo si no hay fracción limpia.
- Símbolos: usar `≤`, `≥`, `²`, `−`, `∞` (Unicode) en la UI; internamente `<=`, `>=`, `^2`, `-`.
- Todo el HTML generado escapa el texto del usuario con `escapar()`.
- Las zonas que cumplen van en verde (`#10b981`), las que no en rojo (`#f43f5e`).

## Teclado matemático global (componente reutilizable)

- **HTML**: panel fijo en la parte inferior (`position: fixed`), oculto por defecto, con un
  botón de alternar (🧮/⌨). Capas/pestañas: **base** (números 0-9, `+ − × ÷`, `( )`, `x`, `y`,
  `,`, `.`, `⌫`) y **avanzado** (`< > ≤ ≥ =`, `x²`, `^`, `| |`, `[ ] { } ∞`, `f(x)`, `√`).
- **JS**: `inputActivo` guarda la caja de texto enfocada (`focusin`); las teclas insertan el
  símbolo en la posición del cursor (o lo reemplazan si hay selección). El botón **Resolver**
  busca el botón del módulo activo vía `inputActivo.closest('.modulo')` y hace `click()`,
  reutilizando el motor existente (`bind`/`mostrarVista`).
- **Validación**: al pulsar Resolver, si la caja está vacía no hace nada (cada módulo ya
  muestra su propio error). La inserción preserva el `data-fill`/`data-run` de los ejercicios.
