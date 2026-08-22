# Tasks — Calculadora de Cálculo Diferencial

Estado del proyecto. Se actualiza cada vez que se trabaja un cambio.

## Completado

- [x] Módulo **Desigualdad lineal** (`resolver`) con cuadro de pruebas y recta real.
- [x] Módulo **Desigualdad cuadrática** (`resolverCuadratica`) con cuadro de validación.
- [x] Método **Fórmula general** (`resolverFormulaGeneral`).
- [x] Método **Factorización / tijera** (`resolverFactorizacion`).
- [x] Módulo **Valor absoluto** (`resolverAbs`) — centro y puntas.
- [x] Módulo **Intervalos** — conversión en ambos sentidos y operaciones `∩`, `∪`, `−`.
- [x] Módulo **Intersecciones con los ejes** (`resolverIntercepcionX/Y`).
- [x] Módulo **Intersecciones entre curvas** (`resolverCurvas`).
- [x] **Glosario / flashcards** con filtros.
- [x] Módulo **Funciones y gráficas** (`resolverFuncion` + `graficarFuncion`) — escrito y
      **probado** con Node (constante, lineal y cuadrática producen dominio/rango, vértice,
      eje de simetría y gráfica SVG correctos, sin NaN).

## En progreso — Reescribir Funciones y gráficas al formato oficial

- [x] Anotar el flujo exacto que exige la docente (coeficientes → dominio → eje → vértice →
      dos formas canónicas → tabla de 5 puntos → gráfica → rango).
- [x] Reescribir `resolverFuncion` cuadrática: coeficientes, dominio, eje con sustitución,
      vértice desarrollado, dos métodos de forma canónica, tabla tabular de 5 puntos, gráfica
      con los 5 puntos y rango con la justificación de `a`.
- [x] Reescribir constante y lineal con desarrollo completo (coeficientes, dominio, tabla,
      gráfica, rango).
- [x] Probar con Node el ejemplo exacto de la docente `f(x) = −4x² + 8x + 1` y verificar cada
      sección del flujo (29/29 PASS).
- [x] Probar casos adicionales: a > 0, h negativo, lineal, constante y fracciones — OK.
- [x] Actualizar `spec.md` y `design.md` (ya hechos).
- [x] Coeficientes `a`, `b`, `c` como **referencia lateral** (`.fila-funcion` + `.ref-coef`) junto
      a la expresión, no como sección aparte. Aplicado a cuadrática, lineal (`m`, `b`) y
      constante (`c`). Probado con Node.

## En progreso

- [x] Probar el módulo **Funciones y gráficas** con los 3 ejemplos cargados.
      Resultado: los 3 tipos resuelven bien; pendiente solo afinar un detalle de escape.

## Pendiente (backlog)

- [x] Escapar `<` y `>` en la línea "a > 0 → abre hacia arriba / a < 0 → abre hacia abajo"
      de `resolverFuncion` (ahora va con `escapar()`, probado con Node en ambos casos).

## En curso — Observaciones del usuario (22 ago 2026)

- [x] **Distributiva en lineal**: `2(x-3) < 4x + 2` expande a `2x - 6 < 4x + 2` (probado).
- [x] **Fracciones con variable**: `(X/2) + 3 > 5` y `0 > 5 - (X/2) - 3` → `x > 4`
      (normalizar `X`→`x`, `x/2`→`(1/2)x`; probado).
- [x] **División en despeje**: mostrar `x > 9/3` antes de `x > 3` (probado).
- [x] **Cuadro de pruebas**: sustitución sin caracteres extra (`3(2) + 5 > 14`, no `+ 14`;
      fracciones como `(1/2)(3)`, no `0.5(3)`; probado).
- [x] **Teclado matemático global**: componente flotante reutilizable (Básico/Símbolos,
      Resolver del módulo activo). HTML+CSS+JS integrados.
- [x] Probar con Node cada fix y el teclado (33/33 PASS en el módulo lineal).

## En curso — Módulo Dominio y Rango

- [x] Crear en `index.html` la vista `#modulo-dominio-rango` (input, botón Resolver, ejercicios).
- [x] `detectarTipoFuncion(expr)`: clasificar en polinómica / racional / irracional / valor absoluto.
- [x] Calcular dominio por tipo (ℝ, ℝ−{ceros de Q}, g(x) ≥ 0).
- [x] Calcular rango por tipo (constante, lineal, cuadrática, grado impar, valor absoluto, raíz).
- [x] Casos difíciles: racional compleja → dominio + nota de límite.
- [x] Salida en formato cuaderno + recta real + detalles expandibles.
- [x] Agregar tarjeta en el inicio (`data-modulo="dominio-rango"`) y quitar "Próximamente".
- [x] Subpáginas por tipo: `#modulo-domrango-polinomica`, `-racional`, `-irracional`, `-abs`.
- [x] Probar con Node: polinómicas, racionales (incl. `g(x) = (x²−3)/(25x−x³)` → `ℝ − {0, 5, -5}`), irracionales y valor absoluto — todas correctas.
- [x] Quitar la tarjeta "Valor absoluto básico" (duplicada de "Valor absoluto") — eliminada.
- [ ] Commitear el avance actual del módulo "Funciones y gráficas".
- [ ] Revisar casos borde: `D < 0`, raíz doble, coeficientes con fracciones en todos los módulos.

## En curso — Corrección de posición y tamaño del teclado (22 ago 2026)

- [x] **Layout**: el teclado NO cubre el contenido — `body` en flex columna `100vh` con
      `overflow: hidden`; `.container` pasa a ser el área scrollable (`flex: 1`, `overflow-y: auto`).
- [x] **Teclado en el flujo**: `.teclado-flotante` deja de ser `position: fixed` y pasa a ser
      hermano estático al pie (`flex: 0 0 auto`, `width: 100%`, sin `z-index`). Quitar la regla
      `body.teclado-abierto { padding-bottom: 200px; }` y su toggle en JS.
- [x] **Scroll suave**: en `focusin` (con teclado visible) y al abrir el teclado, hacer
      `scrollIntoView({ behavior: 'smooth', block: 'center' })` del campo activo.
- [x] **Pestañas**: Básico = solo números y operadores básicos; mover avanzados
      (`< > ≤ ≥ =`, `x²`, `√`, `|`, `[ ] { } ∞`, `f(x)`, `^`, `x³`) a la pestaña Símbolos.
- [x] **Móvil**: media query `@media (max-width: 600px)` con teclas más pequeñas (36px).
- [x] **z-index**: teclado sin `z-index` (en flujo); botón TE con `z-index: 100` (antes 1001).
- [x] Probar con Node (extraer JS): inserción de teclas, capas, Resolver, backspace, clear,
      scroll suave, capas reorganizadas y regresiones (24/24 nuevo + 33 lineal + 15 smoke
      + 5 teclado previo).
- [ ] Verificación manual en navegador: abrir teclado en un módulo y confirmar que el
      contenido scrollea por encima del teclado y el campo enfocado queda visible.

## Cómo verificar (sdd-verify)

1. Abrir `index.html` en el navegador.
2. Para cada módulo, pulsar los botones de ejercicios precargados y revisar que:
   - El resultado final coincida con el de la guía / clase.
   - El procedimiento siga el método oficial (cuadro de validación, fracciones).
   - Las gráficas (SVG) se vean bien y los colores verde/rojo sean correctos.
3. Probar un caso manual (input propio) para confirmar que el parser acepta el formato.
