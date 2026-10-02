// Val LineUp — langue du site (français / anglais).
// Chaque page déclare window.I18N_EN = { clé: 'texte anglais' } et marque ses éléments avec data-i18n="clé"
// (data-i18n-ph="clé" pour un placeholder). Le texte français reste celui écrit dans la page.
(function () {
  var KEY = 'vlu-lang';
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* stockage indisponible */ }
  var lang = stored === 'fr' || stored === 'en'
    ? stored
    : (/^fr\b/i.test(navigator.language || '') ? 'fr' : 'en');
  var fr = {};

  function apply() {
    var en = window.I18N_EN || {};
    document.documentElement.lang = lang;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var k = el.getAttribute('data-i18n');
      if (!(k in fr)) fr[k] = el.innerHTML;
      el.innerHTML = lang === 'en' && en[k] ? en[k] : fr[k];
    }
    var ph = document.querySelectorAll('[data-i18n-ph]');
    for (var j = 0; j < ph.length; j++) {
      var p = ph[j];
      var kp = p.getAttribute('data-i18n-ph');
      if (!(('ph:' + kp) in fr)) fr['ph:' + kp] = p.getAttribute('placeholder') || '';
      p.setAttribute('placeholder', lang === 'en' && en[kp] ? en[kp] : fr['ph:' + kp]);
    }
    if (window.I18N_TITLE) document.title = lang === 'en' ? window.I18N_TITLE.en : window.I18N_TITLE.fr;
    var btns = document.querySelectorAll('.lang-switch button');
    for (var b = 0; b < btns.length; b++) btns[b].classList.toggle('on', btns[b].getAttribute('data-lang') === lang);
    if (typeof window.onLangChange === 'function') window.onLangChange(lang);
  }

  // Texte d'un message affiché par le script de la page.
  window.L = function (frText, enText) { return lang === 'en' ? enText : frText; };
  window.getLang = function () { return lang; };

  function setLang(l) {
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) { /* rien */ }
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sw = document.createElement('div');
    sw.className = 'lang-switch';
    sw.innerHTML = '<button type="button" data-lang="fr">FR</button><button type="button" data-lang="en">EN</button>';
    sw.addEventListener('click', function (e) {
      var l = e.target && e.target.getAttribute && e.target.getAttribute('data-lang');
      if (l) setLang(l);
    });
    document.body.appendChild(sw);
    apply();
  });
})();
