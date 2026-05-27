import { tTerrainDetail } from "./types";
import { getEls } from "./util";


//
// Styles
//

export * from "./consts-css";


//
// Page dimensions
//

export const
    PAGE_WIDTH_MAX: number = 2000,
    PAGE_HEIGHT_MAX: number = 1250,
    WINDOW_RESIZE_DEBOUNCE: number = 200;


//
// Labels
//

export const
    EL_SECTION_LABELS = getEls<HTMLButtonElement>('.main__topic-button'),
    LABEL_LETTER_WIDTH: number = 74,
    LABEL_LETTER_HEIGHT: number = 48,
    LABEL_LETTER_SHADOW: number = 4;


//
// Graphics
//

export const
    SKY_HEIGHT_RATIO: number = 0.75,
    ISO_SCALE: number = 16,
    TERRAIN_SEA: tTerrainDetail =
        [0.5, [174, 53, 40, 0.5]],
    TERRAIN: tTerrainDetail[] = [
        [0.0, [ 18,  70,  20]],
        [0.3, [ 62,  82,  35]],
        [1.0, [106,  80,  15]]
    ],
    SPLASH_MAX_DIST: number = 90000,
    SPLASH_FADE_DIST: number = SPLASH_MAX_DIST / 6,
    SPLASH_FADE_TIME: number = 0.0002,
    TARGET_FPS: number = 33.33;
