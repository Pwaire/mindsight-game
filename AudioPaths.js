/**
 * Map of the base file name for each audio cue used in the game.
 * The language specific path will be resolved at runtime.
 */
export const audioFileNames = {
  star: 'star.mp3',
  square: 'square.mp3',
  new_shape_displayed: 'new_shape_displayed.mp3',
  swipe_rule: 'swipe_rule.mp3',
  guess_success: 'guess_success.mp3',
  guess_error: 'guess_error.mp3'
};

/**
 * Returns an object containing the full paths for all audio files for the
 * provided language. Most files live under `audio/<lang>/` while
 * language-agnostic cues like `guess_success` and `guess_error`
 * reside directly under `audio/`.
 *
 * @param {string} lang ISO language code like `en` or `fr`.
 */
export function getAudioPaths(lang = 'en') {
  const base = `audio/${lang}/`;
  const globalBase = 'audio/';
  return Object.fromEntries(
    Object.entries(audioFileNames).map(([key, file]) => {
      const root = (key === 'guess_success' || key === 'guess_error') ? globalBase : base;
      return [key, root + file];
    })
  );
}
