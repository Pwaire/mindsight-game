export function requestFullscreen() {
    const elem = document.documentElement;
    if (document.fullscreenElement) return;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem['webkitRequestFullscreen']) {
        elem['webkitRequestFullscreen'](); // Safari
    } else if (elem['msRequestFullscreen']) {
        elem['msRequestFullscreen'](); // IE11
    }
}
