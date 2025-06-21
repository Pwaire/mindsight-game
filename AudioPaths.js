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
 * provided language. The files are expected to live under
 * `audio/<lang>/`.
 *
 * @param {string} lang ISO language code like `en` or `fr`.
 */
export function getAudioPaths(lang = 'en') {
  const base = `audio/${lang}/`;
  return Object.fromEntries(
    Object.entries(audioFileNames).map(([key, file]) => [key, base + file])
  );
}
