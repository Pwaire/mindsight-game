export const audioFileNames = {
  star: 'star.mp3',
  square: 'square.mp3',
  swipe_rule: 'swipe_rule.mp3',
  explain_rules: 'explain_rules.mp3',
  guess_success: 'guess_success.mp3',
  guess_error: 'guess_error.mp3',
  session_completed: 'session_completed.mp3'
};

export function getAudioPaths(lang = 'en') {
  const base = 'audio/' + lang + '/';
  const globalBase = 'audio/';
  const result = {};

  // Build the result object without Object.fromEntries
  for (const key in audioFileNames) {
    const file = audioFileNames[key];
    const root = (key === 'guess_success' || key === 'guess_error') ? globalBase : base;
    result[key] = root + file;
  }

  return result;
}
