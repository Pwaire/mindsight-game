export const translations = {
  en: {
    calibrate: 'Calibrate',
    start_game: 'Start Game',
    next: 'Next',
    play_again: 'Play Again',
    your_score: 'Your Score:',
    round_results: 'Round Results:',
    round_of: (c, t) => `Round ${c} of ${t}`,
  },
  es: {
    calibrate: 'Calibrar',
    start_game: 'Iniciar Juego',
    next: 'Siguiente',
    play_again: 'Jugar de Nuevo',
    your_score: 'Tu Puntuación:',
    round_results: 'Resultados de la Ronda:',
    round_of: (c, t) => `Ronda ${c} de ${t}`,
  }
};

export class LangHelper {
  static getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') || 'en';
  }

  static getStrings(lang) {
    return translations[lang] || translations.en;
  }

  static applyUIText(lang) {
    const t = this.getStrings(lang);

    document.documentElement.lang = lang;

    const mapping = {
      'calibrate-button': t.calibrate,
      'nextShape-calibrate-button': t.next,
      'calibrate-start-button': t.start_game,
      'start-button': t.start_game,
      'end-calibrate-button': t.calibrate,
      'playAgain-button': t.play_again
    };

    for (const [id, text] of Object.entries(mapping)) {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    }

    const scoreHeader = document.querySelector('#result-container h2');
    if (scoreHeader) scoreHeader.textContent = t.your_score;
  }
}

