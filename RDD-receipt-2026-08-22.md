# RDD — Receipt de revisión (22 ago 2026)

**Lineage (CLI):** `review-2911389ab844796a` (iniciado con `gentle-ai review start`)
**Nota ambiental:** el CLI no pudo materializar el receipt nativo porque la carpeta
`.git/gentle-ai` vive en una ruta montada de Google Drive (reparse point), y `capture-result`
rechaza crear directorios "RAR" en rutas no confiables. La revisión sí se ejecutó con
evidencia real (Node). Este documento cumple el receipt que el protocolo RDD exige:
qué se pidió, qué se hizo, cómo se probó y qué riesgos quedan.

---

## Qué se pidió

1. Corregir el módulo **Desigualdad lineal**:
   - Mostrar la línea de división `x > 9/3` antes de `x > 3` (formato cuaderno).
   - Corregir el cuadro de pruebas: la sustitución mostraba caracteres extra
     (`3(2) + 5 > + 14` en vez de `3(2) + 5 > 14`).
   - Aplicar la propiedad distributiva: `2(x − 3) < 4x + 2` → `2x − 6 < 4x + 2`.
   - Soportar fracciones con variable: `(X/2) + 3 > 5` y `0 > 5 − (X/2) − 3` → `x > 4`
     (normalizar `X`→`x`, `x/2`→`(1/2)x`), eliminando los errores `NaN`.
2. Crear un **teclado matemático global reutilizable** que inserte símbolos en la caja
   activa de cualquier módulo, con capas Básico/Símbolos y botón **Resolver**.

## Qué se hizo

- **Parser lineal v2** (`normalizarLineal`, `parsearMonomioLineal`, `expandirTermino`,
  `expandirExpresionLineal`, `parsearLado`) en `index.html`: expande paréntesis con
  distributiva, interpreta `x/2` y `(1/2)x` como coeficientes fraccionarios, normaliza
  `X`→`x`, y maneja decimales y signos.
- **División intermedia**: en `resolver()`, se calcula la fracción sin simplificar
  (`constFinalFrac / coefFinalFrac`) y se muestra como línea `x > 9/3` solo cuando difiere
  del resultado simplificado.
- **Sustitución corregida**: `fmtLadoEvaluado` ya no antepone `+` cuando el lado solo tiene
  constante, y muestra fracciones (`(1/2)(3)`) en lugar de decimales (`0.5(3)`).
- **Teclado matemático global**: HTML+CSS+JS fijo en la parte inferior con capas
  Básico/Símbolos, inserción en el input activo (focus), `⌫ Borrar`, `Limpiar`, y
  **Resolver** que dispara el botón del módulo activo.
- **SDD**: `spec.md`, `design.md` y `tasks.md` actualizados ANTES de codear.

## Cómo se probó

| Suite | Resultado |
|-------|-----------|
| `test-lineal.js` (distributiva, fracciones, X, división, sustitución) | 33/33 OK |
| `test-smoke.js` (todos los módulos: lineal, cuadrática, fórmula, factor, abs, intersecciones, curvas, funciones, dominio y rango) | 15/15 OK |
| `test-teclado.js` (inserción, backspace, limpiar, Resolver, capas) | 5/5 OK |
| Casos borde parser (`1.5x`, `-(1/2)x`, `-(1/2)(x-3)`, etc.) | 6/6 OK |

## Riesgos / notas

- `expandirTermino` descarta silenciosamente productos `esX*esX` (términos `x²`) porque el
  módulo es lineal; un input cuadrático en este módulo no es objetivo.
- `lineaExpandida` concatena términos x y constantes; si la constante aparece antes en el
  input, el orden visual de esa línea puede diferir, aunque el valor numérico es correcto.
- El CLI de RDD no pudo escribir su receipt nativo por la ruta montada de Google Drive
  (limitación del entorno, no del cambio).

## Verificación manual recomendada

1. Abrir `index.html` en el navegador.
2. Probar `3x + 5 > 14` → debe mostrar `x > 9/3` y luego `x > 3`.
3. Probar `2(x - 3) < 4x + 2` → debe mostrar `2x − 6 < 4x + 2` → `x > -4`.
4. Probar `(X/2) + 3 > 5` y `0 > 5 - (X/2) - 3` → ambos `x > 4`.
5. Abrir el teclado y escribir una desigualdad en un módulo, luego **Resolver**.