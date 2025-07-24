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

export function exitFullscreen() {
    if (!document.fullscreenElement) return;
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document['webkitExitFullscreen']) {
        document['webkitExitFullscreen']();
    } else if (document['msExitFullscreen']) {
        document['msExitFullscreen']();
    }
}
