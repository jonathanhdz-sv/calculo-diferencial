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
- **Valor absoluto** (`resolverAbs`): formato cuaderno. Si `<`/`<=` usa la regla del centro
  (`|u| < a ⇔ −a < u < a`) y resuelve la desigualdad compuesta en cadena (`−k < ax+b < k` →
  mover constante con `sumaSignada` → simplificar → dividir por `a` mostrando la división
  intermedia → simplificar → `x ∈ (lo, hi)`). Si `>`/`>=` usa la regla de las puntas
  (`u < −a  o  u > a`) y resuelve las dos ramas en paralelo hasta `x ∈ (−∞, lo) ∪ (hi, ∞)`.
  - Con `a < 0` los signos de la división se invierten (lado izquierdo y derecho).
  - Casos especiales: `k < 0` (ninguna en centro / todas en puntas), `k = 0` en centro
    (`<` → ninguna; `<=` → punto único `x = −b/a`), `a = 0` (constante → todas/ninguna).
  - La **gráfica es lineal** (recta real con `renderNumberLine`).
  - La **explicación conceptual** va en `<details class="detalle">` **al final** del
    resultado, no al inicio.
  - Helpers: `parsearLinealAbs` (coef/c) y `sumaSignada` (escribe `a + b` con signo, p. ej.
    `−5 + 1`). Se retiraron `resolverLinealAbs`, `intervaloDesdeSol` y `escFormat`
    (quedaron sin uso).
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

## Módulos nuevos — Funciones avanzadas (Guía 1 #6, #9, #11–#18)

Todos los módulos reutilizan la capa de utilidades existente (`limpiarFuncionExp`,
`detectarTipoFuncion`, `parsearPolinomioGeneral`, `resolverDominio*`, `graficarFuncion`,
`renderPlano`, plantillas `paso`/`cuadernoLinea`/`cuadernoResultado`). Se crea un helper
nuevo de sustitución simbólica `sustituirEn(expr, gExpr, nomG)` para componer funciones
(cuando no se puede simplificar la expresión resultante, se muestra la sustitución
literal — formato cuaderno — en vez de un "error").

### A. Operaciones con funciones (resolverOpFunciones)
- **Entrada**: `f(x)` y `g(x)` (dos campos).
- **Salida**: para cada operación `f+g`, `f−g`, `fg`, `f/g`: la expresión resultante
  (suma/resta algebraica de polinomios; producto; cociente con restricción `g(x) ≠ 0`),
  su dominio y su rango cuando es determinable en el nivel (reutiliza `resolverDominio*`).

### B. Composición de funciones (resolverComposicion)
- **Entrada**: `f(x)` y `g(x)`, más un valor opcional de `x`.
- **Salida**: `f∘g` y `g∘f` con la sustitución literal y simplificada si aplica; dominio y
  rango; evaluación en `x` si se dio.
- **Parámetros en composición** (#14): modo con `g(x) = ax + b` donde se plantea
  `(f∘g)(x) = x`, se igualan coeficientes y se despeja `a` y `b`.

### C. Función inversa (resolverInversa)
- **Entrada**: `f(x)`.
- **Salida**: pasos para despejar `x` → `f⁻¹(y)` y luego renombrar a `f⁻¹(x)`; dominio y
  rango de `f` y `f⁻¹` (el rango de `f` = dominio de `f⁻¹` y viceversa); gráfica de `f`,
  `f⁻¹` y `y = x` en un plano; verificación `(f∘f⁻¹)(x) = x` y `(f⁻¹∘f)(x) = x`.
- **Alcance**: funciones lineales, cuadráticas invertibles (dominio restringido) y racionales
  simples de la Unidad 1.

### D. Pares/impares y simetría (resolverSimetria)
- **Entrada**: `y = f(x)`.
- **Salida**: calcula `f(−x)` sustituyendo `−x` por `x`; compara con `f(x)`:
  - `f(−x) = f(x)` → **par**, simétrica al **eje y**.
  - `f(−x) = −f(x)` → **impar**, simétrica al **origen**.
  - si ninguna → determina simetría respecto a eje x, eje y y origen.
- Nota didáctica: ejes de simetría mostrados antes del veredicto.

### E. Funciones seccionadas (resolverSeccionada)
- **Entrada**: texto tipo `f(x) = { 3-x, x <= 1; 2x, x > 1 }`.
- **Parser** (`parsearSeccionada`): separa en pares `(expresión, condición)` por `;`/`,`.
- **Salida**: clasificación de cada tramo, dominio total (unión de condiciones), rango total,
  y **gráfica por tramos** (cada tramo dibujado en su dominio, con punto lleno/vacío según
  la condición sea `≤`/`<`).

## Convenciones

- Resultados en **fracción** cuando son exactos; decimal solo si no hay fracción limpia.
- Símbolos: usar `≤`, `≥`, `²`, `−`, `∞` (Unicode) en la UI; internamente `<=`, `>=`, `^2`, `-`.
- Todo el HTML generado escapa el texto del usuario con `escapar()`.
- Las zonas que cumplen van en verde (`#10b981`), las que no en rojo (`#f43f5e`).

## Teclado matemático global (componente reutilizable)

- **Layout (anclado al campo, no cubre contenido)**: `body` es un flex en columna con
  `height: 100vh` (fallback `100dvh`) y `overflow: hidden`. `.container` es el área de
  contenido con su propio scroll (`flex: 1 1 auto; min-height: 0; overflow-y: auto`).
  El `.teclado-flotante` ya NO es hijo fijo de `body`: **al abrirse, se mueve en el DOM para
  quedar justo después de la `.card` del campo activo** (inserción vía `insertBefore`).
  Como es un elemento en flujo dentro de `.container`, el contenido que sigue (ejercicios,
  guías, resultados) se empuja hacia abajo y nunca queda tapado. Al cerrarse, vuelve al final
  de `body` (oculto, `display: none`).
- **Tamaño compacto**: teclas de `32px` de alto con tipografía reducida y gaps pequeños
  (antes `42px`). El panel ocupa solo el ancho del contenedor (igual que la barra de entrada).
- **HTML**: panel oculto por defecto, con botón de alternar (**TE**, flotante pequeño,
  `z-index: 100`). Capas/pestañas:
  - **Básico** (solo números y operadores básicos): `0-9`, `+ − * /`, `( )`, `.`, `,`,
    `x`, `y`.
  - **Símbolos** (obligatorio para avanzados): `< > ≤ ≥ =`, `x² x³ ^`, `| |`, `[ ] { } ∞`,
    `f(x)`, `√`.
- **JS**: `inputActivo` guarda la caja de texto enfocada (`focusin`); las teclas insertan el
  símbolo en la posición del cursor (o lo reemplazan si hay selección). El botón **Resolver**
  busca el botón del módulo activo vía `inputActivo.closest('.modulo')` y hace `click()`,
  reutilizando el motor existente (`bind`/`mostrarVista`).
  - `tecladoAnclar()`: ubica `tecladoInput` (o el primer input visible del módulo activo) y
    mueve `#tecladoMat` tras su `.card` (`.closest('.card')`). Devuelve `false` si no hay
    campo al que anclarse (no abre el teclado).
  - `tecladoOcultar()`: oculta el teclado, lo devuelve al final de `body` y vuelve a mostrar
    el botón **TE**. Se usa al cerrar y en `mostrarVista` (navegar de módulo cierra el teclado).
- **Scroll suave**: en `focusin` (con el teclado visible) y al abrir el teclado, se re-ancla
  y se ejecuta `input.scrollIntoView({ behavior: 'smooth', block: 'center' })`.
- **Móvil**: media query `@media (max-width: 600px)` reduce aún más la altura y tipografía de
  las teclas.
- **Validación**: al pulsar Resolver, si la caja está vacía no hace nada (cada módulo ya
  muestra su propio error). La inserción preserva el `data-fill`/`data-run` de los ejercicios.
