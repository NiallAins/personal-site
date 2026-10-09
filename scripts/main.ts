import {
    BREAKPOINT_MOBILE,
    CLASS_PAGE_POST_FOUC,
    EL_HEADER_NAV_MORE,
    FONT_FAM_TITLE_PRIMARY, FONT_FAM_TITLE_SRC,
    PAGE_HEIGHT_MAX, PAGE_WIDTH_MAX,
    VAR_PAGE_HEIGHT,
    WINDOW_RESIZE_DEBOUNCE
} from './consts';
import { loadFont } from './util';
import { init as initGraphics, setCanvasSize } from './graphics/main';
import { initPages, resize as pageResize, openPageFromUrl } from './pages';
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
    const
        HEIGHT = window.innerHeight,
        WIDTH = window.innerWidth,
        VIEWPORT_SM = WIDTH < BREAKPOINT_MOBILE;
    setCanvasSize(
        Math.min(PAGE_WIDTH_MAX, WIDTH),
        Math.min(PAGE_HEIGHT_MAX, HEIGHT),
        VIEWPORT_SM,
        isInitial
    );
    pageResize(HEIGHT, VIEWPORT_SM);
    prevWindowWidth = window.innerWidth;
    document.documentElement.style.setProperty(VAR_PAGE_HEIGHT, HEIGHT + 'px');
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
    window.addEventListener(
        'load',
        () => setTimeout(() => document.body.classList.add(CLASS_PAGE_POST_FOUC))
    );
    // Show page if onload not triggered with 2000ms
    setTimeout(
        () =>  document.body.classList.add(CLASS_PAGE_POST_FOUC),
        2000
    );
}

init();