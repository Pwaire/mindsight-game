export const translations = {
  en: {
    calibrate: 'Calibrate',
    start_game: 'Start Game',
    next: 'Next',
    play_again: 'Play Again',
    your_score: 'Your Score:',
    round_results: 'Round Results:',
    round_of: function(c, t) { return 'Round ' + c + ' of ' + t; }
  },
  es: {
    calibrate: 'Calibrar',
    start_game: 'Iniciar Juego',
    next: 'Siguiente',
    play_again: 'Jugar de Nuevo',
    your_score: 'Tu Puntuación:',
    round_results: 'Resultados de la Ronda:',
    round_of: function(c, t) { return 'Ronda ' + c + ' de ' + t; }
  }
};

export function LangHelper() {}

LangHelper.getLangFromURL = function() {
  var params = new URLSearchParams(window.location.search);
  return params.get('lang') || 'en';
};

LangHelper.getStrings = function(lang) {
  return translations[lang] || translations.en;
};

LangHelper.applyUIText = function(lang) {
  var t = LangHelper.getStrings(lang);

  document.documentElement.lang = lang;

  var mapping = {
    'calibrate-button': t.calibrate,
    'nextShape-calibrate-button': t.next,
    'calibrate-start-button': t.start_game,
    'start-button': t.start_game,
    'end-calibrate-button': t.calibrate,
    'playAgain-button': t.play_again
  };

  for (var id in mapping) {
    if (mapping.hasOwnProperty(id)) {
      var el = document.getElementById(id);
      if (el) el.textContent = mapping[id];
    }
  }

  var scoreHeader = document.querySelector('#result-container h2');
  if (scoreHeader) scoreHeader.textContent = t.your_score;
};
