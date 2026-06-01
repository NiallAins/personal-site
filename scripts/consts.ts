import { COLOR_HSL_TERRAIN_LAND_1, COLOR_HSL_TERRAIN_LAND_2, COLOR_HSL_TERRAIN_LAND_3, COLOR_HSL_TERRAIN_SEA } from "./consts-css";
import { tTerrainDetail } from "./types";
import { getEl } from "./util";


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
// Elements
//

export const
    EL_BODY = getEl('body'),
    EL_MAIN = getEl('main'),
    EL_PAGE_CONTAINER = getEl('.pages');


//
// Labels
//

export const
    LABEL_LETTER_WIDTH: number = 74,
    LABEL_LETTER_HEIGHT: number = 48,
    LABEL_LETTER_SHADOW: number = 4;


//
// Graphics
//

export const
    CAN_QUALITY = 2,
    SKY_HEIGHT_RATIO: number = 0.75,
    ISO_SCALE: number = 16,
    TERRAIN_SEA: tTerrainDetail =
        [0.5, COLOR_HSL_TERRAIN_SEA],
    TERRAIN: tTerrainDetail[] = [
        [0.0, COLOR_HSL_TERRAIN_LAND_1],
        [0.3, COLOR_HSL_TERRAIN_LAND_2],
        [1.0, COLOR_HSL_TERRAIN_LAND_3]
    ],
    SPLASH_MAX_DIST: number = 90000,
    SPLASH_FADE_DIST: number = SPLASH_MAX_DIST / 6,
    SPLASH_FADE_TIME: number = 0.0002,
    TARGET_FPS: number = 33.33;
