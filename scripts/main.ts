import {
    CLASS_PAGE_POST_FOUC,
    EL_HEADER_NAV_MORE,
    FONT_FAM_TITLE_PRIMARY, FONT_FAM_TITLE_SRC,
    PAGE_HEIGHT_MAX, PAGE_WIDTH_MAX,
    WINDOW_RESIZE_DEBOUNCE
} from './consts';
import { loadFont } from './util';
import { init as initGraphics, setCanvasSize } from './graphics/main';
import { initPages, openPageFromUrl } from './pages';
import { _DEBUG_log } from './_debug';

let
    resizeDebounce: number = 0,
    prevWindowWidth: number = 0;
function onResize() {
    if (window.innerWidth !== prevWindowWidth) {
        window.clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(resize, WINDOW_RESIZE_DEBOUNCE);
    }
}
function resize(isInitial: boolean) {
    setCanvasSize(
        Math.min(PAGE_WIDTH_MAX, window.innerWidth),
        Math.min(PAGE_HEIGHT_MAX, window.innerHeight),
        isInitial
    );
    prevWindowWidth = window.innerWidth;
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
        FONT_FAM_TITLE_PRIMARY,
        FONT_FAM_TITLE_SRC,
    );

    initGraphics();
    resize(true);

    window.onhashchange = () => openPageFromUrl();
    openPageFromUrl();
    
    // Hide FOUC
    document.body.onload = () => setTimeout(
        () => document.body.classList.add(CLASS_PAGE_POST_FOUC)
    );
}

init();