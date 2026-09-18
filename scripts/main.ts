import {
    EL_HEADER_NAV_LINKS_CONTACT,
    EL_HEADER_NAV_LINKS_EXPERIENCE,
    EL_HEADER_NAV_MORE,
    FONT_FAM_TITLE, FONT_FAM_TITLE_SRC,
    PAGE_HEIGHT_MAX, PAGE_WIDTH_MAX,
    WINDOW_RESIZE_DEBOUNCE
} from './consts';
import { loadFont } from './util';
import { init as initGraphics, setCanvasSize, togglePause } from './graphics/main';
import { initPages } from './pages';

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

    // EL_HEADER_NAV_LINKS_EXPERIENCE.onclick = () => moveSlider(-1);
    // EL_HEADER_NAV_LINKS_CONTACT.onclick = () => moveSlider(1);
    EL_HEADER_NAV_MORE.onclick = () => moreClick();

    initPages();
    await loadFont(
        FONT_FAM_TITLE,
        FONT_FAM_TITLE_SRC,
    );

    initGraphics();
    resize();
}

init();