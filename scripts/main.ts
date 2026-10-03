import {
    CLASS_PAGE_POST_FOUC,
    DURATION_SH,
    EL_BODY,
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
    prevWindowWidth: number = 0,
    prevWindowHeight: number = 0;
function onResize() {
    // Prevent mobile browser nav hide/show trigger re-render
    if (Math.abs(window.innerHeight - prevWindowHeight) < prevWindowHeight * 0.1) {
        prevWindowHeight = window.innerHeight
    }

    if (
        window.innerWidth !== prevWindowWidth ||
        window.innerHeight !== prevWindowHeight
    ) {
        window.clearTimeout(resizeDebounce);
        resizeDebounce = window.setTimeout(resize, WINDOW_RESIZE_DEBOUNCE);
    }
}
function resize() {
    setCanvasSize(
        Math.min(PAGE_WIDTH_MAX, window.innerWidth),
        Math.min(PAGE_HEIGHT_MAX, window.innerHeight)
    );
    prevWindowWidth = window.innerWidth;
    prevWindowHeight = window.innerHeight;
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
    resize();

    window.onhashchange = () => openPageFromUrl();
    openPageFromUrl();

    // Hide FOUC
    document.body.onload = () => setTimeout(
        () => EL_BODY.classList.add(CLASS_PAGE_POST_FOUC),
        DURATION_SH
    );
}

init();