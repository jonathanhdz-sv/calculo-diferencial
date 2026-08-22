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

## En progreso

- [x] Probar el módulo **Funciones y gráficas** con los 3 ejemplos cargados.
      Resultado: los 3 tipos resuelven bien; pendiente solo afinar un detalle de escape.

## Pendiente (backlog)

- [ ] Escapar `<` y `>` en la línea "a > 0 → abre hacia arriba / a < 0 → abre hacia abajo"
      de `resolverFuncion` (hoy van sin `escapar()`; renderiza bien, pero es frágil).

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
- [ ] Quitar la tarjeta "Valor absoluto básico" (duplicada de "Valor absoluto") o darle uso.
- [ ] Commitear el avance actual del módulo "Funciones y gráficas".
- [ ] Revisar casos borde: `D < 0`, raíz doble, coeficientes con fracciones en todos los módulos.

## Cómo verificar (sdd-verify)

1. Abrir `index.html` en el navegador.
2. Para cada módulo, pulsar los botones de ejercicios precargados y revisar que:
   - El resultado final coincida con el de la guía / clase.
   - El procedimiento siga el método oficial (cuadro de validación, fracciones).
   - Las gráficas (SVG) se vean bien y los colores verde/rojo sean correctos.
3. Probar un caso manual (input propio) para confirmar que el parser acepta el formato.
