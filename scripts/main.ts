import {
    EL_HEADER_NAV_MORE,
    FONT_FAM_TITLE, FONT_FAM_TITLE_SRC,
    PAGE_HEIGHT_MAX, PAGE_WIDTH_MAX,
    WINDOW_RESIZE_DEBOUNCE
} from './consts';
import { loadFont } from './util';
import { init as initGraphics, setCanvasSize } from './graphics/main';
import { initPages, openPageFromUrl } from './pages';

let resizeDebounce: number = 0;
function onResize() {
    window.clearTimeout(resizeDebounce);
    resizeDebounce = window.setTimeout(resize, WINDOW_RESIZE_DEBOUNCE);
}
function resize() {
    setCanvasSize(
        Math.min(PAGE_WIDTH_MAX, window.innerWidth),
        Math.min(PAGE_HEIGHT_MAX, window.innerHeight)
    );
}

function moreClick() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
}

async function init() {
    window.onresize = () => onResize();

    EL_HEADER_NAV_MORE.onclick = () => moreClick();

    initPages();
    await loadFont(
        FONT_FAM_TITLE,
        FONT_FAM_TITLE_SRC,
    );

    initGraphics();
    resize();

    window.onhashchange = () => openPageFromUrl();
    openPageFromUrl();
}

init();