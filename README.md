# Mindsight Game

This repository contains a simple shape guessing game used for calibration and testing.

## Message API

When a session ends, `main.js` posts a message to the embedding window with the user's results. Listeners can capture this event via `window.addEventListener('message', ...)`.

```javascript
{
  type: 'GAME_RESULT',
  payload: {
    date: '<ISO date string>',
    results: [ /* per–round result objects */ ]
  }
}
```

The `results` array mirrors the round results stored by the game and includes the shape information and whether the user answered correctly for each round.
