# RDD — Receipt de revisión: teclado compacto anclado debajo del campo (22 ago 2026)

**Contexto ambiental:** igual que los receipts anteriores, el CLI `gentle-ai review capture-result`
no puede materializar receipts nativos por la ruta montada de Google Drive (reparse point).
La revisión se ejecutó con evidencia real (Node). Este documento cumple el receipt RDD.

---

## Qué se pidió

El usuario probó la corrección previa (teclado en flujo al pie de la pantalla) y la encontró
"bien pero demasiado grande". Pidió:
1. Que el teclado **NO sea flotante** y que **no tape el contenido**.
2. Que aparezca **justo debajo de la barra de entrada del campo** donde escribe.
3. Un **tamaño acorde/compacto** (no que cubra toda la pantalla).
(Opción confirmada por el usuario en diálogo: "Debajo del campo de texto, compacto".)

## Qué se hizo

- **Anclaje al campo** (`tecladoAnclar()` en `index.html`): al abrir el teclado (botón TE) se
  localiza el campo activo (o el primer input del módulo visible) y se mueve `#tecladoMat` en
  el DOM con `insertBefore` para quedar **inmediatamente después de la `.card`** del input.
  Como es un elemento en flujo dentro de `.container`, el contenido que sigue (ejercicios,
  guías, resultados) se empuja hacia abajo y nunca queda tapado.
- **Guard**: si no hay ningún campo visible al que anclarse (ej. en la pantalla de inicio),
  el teclado **no abre** (`tecladoAnclar()` devuelve `false`).
- **Cierre/limpieza** (`tecladoOcultar()`): oculta el teclado, lo devuelve al final de `body`
  (oculto con `display: none`) y vuelve a mostrar el botón TE. `mostrarVista()` ahora llama a
  `tecladoOcultar()` al navegar entre módulos (salir de un módulo cierra el teclado).
- **Re-anclaje al enfocar**: en `focusin`, si el teclado está visible, se re-ejecuta
  `tecladoAnclar()` (el teclado sigue al campo si cambias de input con el teclado abierto).
- **Compacto**: teclas de `32px` de alto (antes `42px`), tipografía `0.9rem` (antes `1.05rem`),
  gaps y cabecera reducidos; en móvil (`≤ 600px`) teclas de `30px`. El panel ahora tiene
  `border-radius` y margen propio (ya no es una barra inferior fija).
- **Scroll suave**: se mantiene `input.scrollIntoView({ behavior: 'smooth', block: 'center' })`
  al abrir y al enfocar con teclado visible.

## Cómo se probó

| Suite | Resultado |
|-------|-----------|
| `test-teclado-ancla.js` (nuevo): CSS compacto (32px/30px, sin fixed/z-index), guard sin campo activo, anclaje `insertBefore`, abrir/cerrar, devolver al body, re-anclaje en focusin, `mostrarVista` cierra el teclado, inserción/backspace/limpiar/Resolver | 24/24 OK |
| `test-teclado-fix.js` (regresión layout 100vh, actualizado al nuevo diseño) | 24/24 OK |
| `test-lineal.js` (regresión módulo lineal) | 33/33 OK |
| `test-smoke.js` (regresión todos los módulos) | 15/15 OK |
| `test-teclado.js` (regresión teclado previo) | 5/5 OK |

Notas de entorno: jsdom no disponible; se usa el stub manual `calc-harness.js`. En el harness,
`FakeEl` inicia con `hidden = false` aunque el HTML real inicia oculto — los tests normalizan
el estado inicial explícitamente. `w.tecladoInput = x` NO modifica el binding `let` del script
(se depuró; los tests usan el flujo real vía `tecladoInsertar`/`focusin`).

## Riesgos / notas

- El teclado ahora es parte del contenido del módulo: si el usuario scrollea hacia abajo, el
  teclado se desplaza con el contenido (es lo esperado: "debajo del campo"). Para escribir hay
  que tener el campo visible (el `scrollIntoView` al abrir lo garantiza).
- El anclaje depende de que el input esté dentro de una `.card` (así están todos los módulos).
  En pantalla de inicio no hay campo, así que el teclado no abre (guard).
- El botón TE sigue siendo un FAB (flotante pequeño) — es el disparador; el panel en sí ya no
  flota ni tapa.
- Pendiente: verificación manual en el navegador/celular.

## Verificación manual recomendada

1. Abrir `index.html` (idealmente en el celular).
2. Entrar a un módulo (ej. Desigualdad lineal) y pulsar TE.
3. Confirmar que el teclado aparece **justo debajo del campo de entrada**, es compacto, y que
   los ejercicios/resultados de abajo se empujan (no se tapan).
4. Escribir algo y pulsar Resolver.
5. Cambiar de módulo y confirmar que el teclado se cierra (y el botón TE vuelve a aparecer).