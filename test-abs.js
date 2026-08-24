const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function stubEl() {
  return {
    addEventListener: function () {},
    querySelectorAll: function () { return []; },
    classList: { add: function () {}, remove: function () {}, contains: function () { return false; } },
    dataset: {},
    hidden: true,
    value: '',
    innerHTML: '',
    textContent: '',
    style: {},
    setAttribute: function () {},
    getAttribute: function () { return null; },
    scrollIntoView: function () {},
    focus: function () {},
    appendChild: function () {},
    remove: function () {}
  };
}
const elements = {};
global.document = {
  getElementById: function (id) { if (!elements[id]) elements[id] = stubEl(); return elements[id]; },
  querySelectorAll: function () { return []; },
  querySelector: function () { return stubEl(); },
  addEventListener: function () {},
  createElement: function () { return stubEl(); },
  body: stubEl()
};
global.window = global;
global.location = { hash: '' };

(0, eval)(js);

let pass = 0, fail = 0;
function t(name, fn) {
  try {
    const ok = fn();
    if (ok) { pass++; }
    else { fail++; console.log('FAIL: ' + name); }
  } catch (e) { fail++; console.log('ERROR ' + name + ': ' + e.message); }
}

function txt(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
}

// ---- CENTRO ----
t('|x| < 3 → conclusión (-3, 3)', function () {
  return txt(resolverAbs('|x| < 3')).indexOf('x ∈ (-3, 3)') !== -1;
});
t('|x| < 3 muestra regla del centro', function () {
  return txt(resolverAbs('|x| < 3')).indexOf('|u| < a ⇔ −a < u < a') !== -1;
});
t('|x| < 3 muestra la desigualdad compuesta', function () {
  return txt(resolverAbs('|x| < 3')).indexOf('−3 < x < 3') !== -1;
});
t('|x| <= 3 → [-3, 3] cerrado', function () {
  return txt(resolverAbs('|x| <= 3')).indexOf('x ∈ [-3, 3]') !== -1;
});
t('|2x − 1| < 5 → conclusión (-2, 3)', function () {
  return txt(resolverAbs('|2x − 1| < 5')).indexOf('x ∈ (-2, 3)') !== -1;
});
t('|2x − 1| < 5 muestra cadena completa en orden', function () {
  const h = txt(resolverAbs('|2x − 1| < 5'));
  const partes = ['−5 < 2x - 1 < 5', '-5 + 1 < 2x < 5 + 1', '-4 < 2x < 6', '-4/2 < x < 6/2', '-2 < x < 3'];
  let prev = -1;
  return partes.every(function (p) {
    const i = h.indexOf(p);
    const ok = i !== -1 && i > prev;
    prev = i;
    return ok;
  });
});
t('|2x − 1| < 5: conclusión después de la cadena', function () {
  const h = txt(resolverAbs('|2x − 1| < 5'));
  return h.indexOf('-2 < x < 3') < h.indexOf('x ∈ (-2, 3)');
});
t('|2x − 1| < 5: explicación al final (details tras conclusión)', function () {
  const h = resolverAbs('|2x − 1| < 5');
  return h.indexOf('x ∈') < h.indexOf('<details');
});
t('|2x − 1| < 5: explicación con 4 pasos', function () {
  const h = resolverAbs('|2x − 1| < 5').split('<details')[1];
  return (h.match(/Paso [1-4] —/g) || []).length === 4;
});
t('coef negativo |1 − 2x| < 5 → (-2, 3)', function () {
  return txt(resolverAbs('|1 − 2x| < 5')).indexOf('x ∈ (-2, 3)') !== -1;
});
t('coef negativo |1 − 2x| < 5 invierte signos en división', function () {
  return txt(resolverAbs('|1 − 2x| < 5')).indexOf('-6/-2 > x > 4/-2') !== -1;
});
t('fracción |x/2| < 1 → (-2, 2)', function () {
  return txt(resolverAbs('|x/2| < 1')).indexOf('x ∈ (-2, 2)') !== -1;
});

// ---- PUNTAS ----
t('|x| > 3 → (-∞, -3) ∪ (3, ∞)', function () {
  return txt(resolverAbs('|x| > 3')).indexOf('x ∈ (−∞, -3) ∪ (3, ∞)') !== -1;
});
t('|2x − 1| > 5 → (-∞, -2) ∪ (3, ∞)', function () {
  return txt(resolverAbs('|2x − 1| > 5')).indexOf('x ∈ (−∞, -2) ∪ (3, ∞)') !== -1;
});
t('|2x − 1| > 5 muestra dos ramas', function () {
  const h = txt(resolverAbs('|2x − 1| > 5'));
  return h.indexOf('2x - 1 < −5') !== -1 && h.indexOf('2x - 1 > 5') !== -1;
});
t('|2x − 1| > 5 muestra división por rama', function () {
  const h = txt(resolverAbs('|2x − 1| > 5'));
  return h.indexOf('x < -4/2') !== -1 && h.indexOf('x > 6/2') !== -1;
});
t('|2x − 1| > 5: conclusión después de ramas', function () {
  const h = txt(resolverAbs('|2x − 1| > 5'));
  return h.indexOf('x < -2') < h.indexOf('x ∈ (−∞, -2)');
});
t('|2x − 1| > 5: explicación al final', function () {
  const h = resolverAbs('|2x − 1| > 5');
  return h.indexOf('x ∈') < h.indexOf('<details');
});
t('|2x − 1| > 5: explicación con 4 pasos', function () {
  const h = resolverAbs('|2x − 1| > 5').split('<details')[1];
  return (h.match(/Paso [1-4] —/g) || []).length === 4;
});
t('|x| >= 3 → (-∞, -3] ∪ [3, ∞) cerrado', function () {
  return txt(resolverAbs('|x| >= 3')).indexOf('x ∈ (−∞, -3] ∪ [3, ∞)') !== -1;
});
t('coef negativo puntas |1 − 2x| > 5 → (-∞, -2) ∪ (3, ∞)', function () {
  return txt(resolverAbs('|1 − 2x| > 5')).indexOf('x ∈ (−∞, -2) ∪ (3, ∞)') !== -1;
});

// ---- CASOS ESPECIALES ----
t('|x| < -3 → no hay solución', function () {
  return /No hay solución/.test(resolverAbs('|x| < -3'));
});
t('|x| > -3 → todos los reales', function () {
  return /todos los números reales/.test(resolverAbs('|x| > -3'));
});
t('|x| < 0 → no hay solución', function () {
  return /No hay solución/.test(resolverAbs('|x| < 0'));
});
t('|x| <= 0 → punto x = 0', function () {
  return /x = 0/.test(resolverAbs('|x| <= 0'));
});
t('constante |3| < 5 → todos los reales', function () {
  return /Todos los reales/.test(resolverAbs('|3| < 5'));
});
t('constante |3| > 5 → ninguno', function () {
  return /Ningún valor/.test(resolverAbs('|3| > 5'));
});
t('formato inválido lanza error', function () {
  let threw = false;
  try { resolverAbs('hola'); } catch (e) { threw = true; }
  return threw;
});

// ---- GRÁFICA LINEAL ----
t('gráfica lineal (SVG recta real) presente', function () {
  const h = resolverAbs('|2x − 1| < 5');
  return h.indexOf('<svg') !== -1;
});
t('sin texto renderNumberLine (SVG ya generado)', function () {
  return resolverAbs('|2x − 1| < 5').indexOf('renderNumberLine') === -1;
});
t('no hay < sin escapar en el resultado (render seguro)', function () {
  const h = resolverAbs('|2x − 1| < 5');
  // fuera de tags y de entidades, no debe aparecer '<' crudo seguido de espacio/letra
  const crudo = h.replace(/<[^>]*>/g, '').replace(/&lt;|&gt;|&amp;/g, '');
  return crudo.indexOf('<') === -1 && crudo.indexOf('>') === -1;
});

// ---- CASO TRIVIAL (a=1, b=0) sin duplicación ----
t('|x| < 5: la cadena no duplica −5 < x < 5', function () {
  const h = resolverAbs('|x| < 5');
  const dec = txt(h.split('Recta numérica')[0]);
  return (dec.split('−5 < x < 5').length - 1) === 1;
});
t('|x| < 5: línea compuesta "|x| < 5 ⇔ −5 < x < 5"', function () {
  return txt(resolverAbs('|x| < 5')).indexOf('|x| < 5 ⇔ −5 < x < 5') !== -1;
});

// ---- PLANO CARTESIANO ----
t('|x| < 5 muestra Recta numérica y Plano cartesiano', function () {
  const h = resolverAbs('|x| < 5');
  return h.indexOf('Recta numérica') !== -1 && h.indexOf('Plano cartesiano') !== -1;
});
t('|x| < 5: plano cartesiano con V, sombreado y y=±5', function () {
  const h = resolverAbs('|x| < 5');
  const graf = h.split('Plano cartesiano')[1].split('<details')[0];
  return graf.indexOf('<path') !== -1 && graf.indexOf('<rect') !== -1 && graf.indexOf('y = 5') !== -1 && graf.indexOf('y = −5') !== -1;
});
t('|2x − 1| < 5: plano cartesiano presente', function () {
  return resolverAbs('|2x − 1| < 5').indexOf('Plano cartesiano') !== -1;
});
t('|2x − 1| > 5: plano cartesiano con V, sombreado y y=±5', function () {
  const h = resolverAbs('|2x − 1| > 5');
  const graf = h.split('Plano cartesiano')[1].split('<details')[0];
  return graf.indexOf('<path') !== -1 && graf.indexOf('<rect') !== -1 && graf.indexOf('y = 5') !== -1;
});
t('|2x − 1| > 5: plano cartesiano después de recta numérica', function () {
  const h = resolverAbs('|2x − 1| > 5');
  return h.indexOf('Recta numérica') < h.indexOf('Plano cartesiano');
});
t('plano cartesiano etiqueta números en ambos ejes', function () {
  const h = resolverAbs('|x| < 5');
  const graf = h.split('Plano cartesiano')[1].split('<details')[0];
  const m = graf.match(/<text[^>]*>(-?\d+)<\/text>/g) || [];
  return m.length >= 6;
});
t('el número 2 aparece como tick en el plano cartesiano', function () {
  const h = resolverAbs('|x| < 5');
  const graf = h.split('Plano cartesiano')[1].split('<details')[0];
  return /<text[^>]*>2<\/text>/.test(graf) && /<text[^>]*>−?2<\/text>/.test(graf);
});
t('números de los ejes más pequeños (font-size 9 en ticks, 10 en el 0)', function () {
  const h = resolverAbs('|x| < 5');
  const graf = h.split('Plano cartesiano')[1].split('<details')[0];
  return graf.indexOf('font-size="9"') !== -1 && graf.indexOf('font-size="10" fill="#64748b">0') !== -1;
});

console.log('\nResultado: ' + pass + ' PASS, ' + fail + ' FAIL');
process.exit(fail ? 1 : 0);