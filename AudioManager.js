export const AudioManager = (() => {
    const audios = new Set();
    function register(audio) {
        if (audio && typeof audio.play === 'function') {
            audios.add(audio);
        }
        return audio;
    }
    function play(audio) {
        if (!audio) return;
        audios.forEach(a => {
            if (a !== audio) {
                a.pause();
                a.currentTime = 0;
            }
        });
        audio.currentTime = 0;
        audio.play();
    }
    function stopAll() {
        audios.forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
    }
    return { register, play, stopAll };
})();
