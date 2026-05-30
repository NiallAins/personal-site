import { loadFont } from './util';
import { init as initGraphics, setCanvasSize } from './graphics/main';
import { initPages } from './pages';
import { FONT_FAM_TITLE, FONT_FAM_TITLE_SRC, PAGE_HEIGHT_MAX, PAGE_WIDTH_MAX, WINDOW_RESIZE_DEBOUNCE } from './consts';

let resizeDebounce: number = 0;
function onResize() {
    window.clearTimeout(resizeDebounce);
    resizeDebounce = window.setTimeout(
        () => setCanvasSize(
            Math.min(PAGE_WIDTH_MAX, window.innerWidth),
            Math.min(PAGE_HEIGHT_MAX, window.innerHeight)
        ),
        WINDOW_RESIZE_DEBOUNCE
    );
}

async function init() {
    window.onresize = onResize;

    initPages();
    await loadFont(
        FONT_FAM_TITLE,
        FONT_FAM_TITLE_SRC,
    );
    
    onResize();
    initGraphics();
}

init();