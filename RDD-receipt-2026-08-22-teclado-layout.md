# RDD — Receipt de revisión: teclado matemático sin tapar el contenido (22 ago 2026)

**Contexto ambiental:** igual que el receipt anterior, el CLI `gentle-ai review capture-result`
no puede materializar receipts nativos porque la carpeta vive en una ruta montada de Google
Drive (reparse point, error "unsafe RAR authority path"). La revisión se ejecutó con evidencia
real (Node). Este documento cumple el receipt RDD.

---

## Qué se pidió

Corregir el teclado matemático global para que **NO se superponga al contenido** (especialmente
la sección de ejercicios y guías). Requisitos:

1. El teclado debe comportarse como un teclado de sistema real: la app ocupa `100vh` y, al
   abrirse, el área de contenido se reduce a la altura restante (contenido con scroll propio).
2. El contenedor principal debe tener `padding-bottom`/scroll dinámico igual a la altura real
   del teclado (contenido nunca oculto detrás).
3. Jerarquía: el teclado no debe tener `z-index` excesivo que impida el scroll del contenido.
4. Scroll suave: al tocar el campo y desplegarse el teclado, `scrollIntoView()` del campo para
   que siempre quede visible.
5. Recomendaciones de diseño: botones más pequeños en móvil; Básico solo números y operadores
   básicos (avanzados movidos obligatoriamente a la pestaña Símbolos).

## Qué se hizo

- **Layout nuevo en `index.html`**:
  - `body`: `display: flex; flex-direction: column; height: 100vh` (fallback `100dvh`);
    `overflow: hidden`. Sin `padding` (se movió al contenedor).
  - `.container`: `flex: 1 1 auto; min-height: 0; overflow-y: auto` (área de contenido con su
    propio scroll) + `padding: 32px 16px 24px`.
  - `.teclado-flotante`: dejó de ser `position: fixed; z-index: 1000` → hermano **estático**
    al pie del flujo (`flex: 0 0 auto; width: 100%; max-width: 760px;`). Al abrirse ocupa su
    altura real y el contenedor se encoge solo; nunca lo tapa.
  - Eliminada la regla `body.teclado-abierto { padding-bottom: 200px; }` y su toggle en JS.
  - Botón **TE**: `z-index` bajado de `1001` a `100` (sigue flotante, es pequeño).
- **Scroll suave**: al abrir el teclado y en `focusin` (con teclado visible) se ejecuta
  `input.scrollIntoView({ behavior: 'smooth', block: 'center' })` para mantener el campo visible.
- **Pestañas reorganizadas**:
  - **Básico**: solo `0-9`, `+ − * /`, `( )`, `.`, `,`, `x`, `y`.
  - **Símbolos**: `< > ≤ ≥ =`, `x² x³ ^`, `√`, `f(x)`, `[ ] { }`, `|`, `∞`.
- **Móvil**: media query `@media (max-width: 600px)` con teclas de `36px` (antes `42px`) y
  tipografía menor.

## Cómo se probó

| Suite | Resultado |
|-------|-----------|
| `test-teclado-fix.js` (nuevo): CSS del layout, capas Básico/Símbolos, abrir/cerrar teclado, `scrollIntoView` en abrir y en `focusin` (visible/no visible), inserción, backspace, limpiar, Resolver | 24/24 OK |
| `test-lineal.js` (regresión módulo lineal) | 33/33 OK |
| `test-smoke.js` (regresión todos los módulos) | 15/15 OK |
| `test-teclado.js` (regresión teclado previo) | 5/5 OK |

Detalle del test nuevo: se verificó por inspección estática (CSS/HTML) y por harness con stub
de DOM (jsdom no disponible en este entorno; el stub manual `calc-harness.js` se extendió con
captura de `focusin`, `scrollIntoView` y `classList.contains`).

## Riesgos / notas

- `scrollIntoView` con `block: 'center'` centra el campo; en pantallas muy pequeñas el campo
  queda visible y centrado (comportamiento esperado, similar a teclado de sistema).
- El cambio de `body` de página a flex-columna `100vh` puede notarse en equipos de escritorio:
  el scroll ahora ocurre dentro del contenedor (barra sobre el área de contenido). Es el
  comportamiento deseado para que el teclado nunca tape el contenido.
- `100dvh` es un fallback progresivo; si el navegador no lo soporta se usa `100vh`.
- Pendiente: verificación manual en el navegador/celular (el usuario debe confirmar que el
  campo enfocado queda visible y que la guía/ejercicios scrollean por encima del teclado).

## Verificación manual recomendada

1. Abrir `index.html` en el navegador (idealmente en el celular).
2. Entrar a un módulo (ej. Desigualdad lineal) y abrir el teclado (TE).
3. Confirmar que el contenido de arriba hace scroll y NO queda oculto detrás del teclado.
4. Tocar el campo de texto y confirmar que el campo se centra (scrollIntoView).
5. Cambiar a la pestaña Símbolos y confirmar que están todos los avanzados y que Básico quedó
   limpio (solo números y operadores).