import { loadFont } from './util';
import { init as initGraphics } from './graphics/graphics';
import { createPages } from './pages';
import { FONT_TITLE, FONT_TITLE_SRC } from './consts';

async function init() {
    createPages();
    await loadFont(
        FONT_TITLE,
        FONT_TITLE_SRC,
    );
    initGraphics();
}

init();