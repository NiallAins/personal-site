import {
    WIDTH_ISO_SCALE,
    COLOR_HSL_TERRAIN_LAND_1, COLOR_HSL_TERRAIN_LAND_2, COLOR_HSL_TERRAIN_LAND_3, COLOR_HSL_TERRAIN_SEA,
    LABEL_LETTER_SPACE, LABEL_LINE_HEIGHT
} from "./consts.scss";
import { tTerrainDetail } from "./types";
import { getEl } from "./util";


//
// Styles
//

export * from "./consts.scss";


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
// Graphics
//

export const
    CAN_QUALITY = 1,
    SKY_HEIGHT_RATIO: number = 0.75,
    TERRAIN_SEA: tTerrainDetail =
        [0.5, COLOR_HSL_TERRAIN_SEA],
    TERRAIN: tTerrainDetail[] = [
        [0.0, COLOR_HSL_TERRAIN_LAND_1],
        [0.3, COLOR_HSL_TERRAIN_LAND_2],
        [1.0, COLOR_HSL_TERRAIN_LAND_3]
    ],
    MAX_SEA_ISO_DEPTH: number = 2,
    MIN_LAND_ISO_Z: number = -3,
    ISO_SCALE: number = WIDTH_ISO_SCALE,
    X_UNIT: number = 4 * ISO_SCALE,
    Y_UNIT: number = 2 * ISO_SCALE,
    Z_UNIT: number = 2 * ISO_SCALE,
    ROW_HEIGHT: number = ISO_SCALE,
    LABEL_ISO_Z: number = 3,
    LABEL_DEPRESS_Z: number = Z_UNIT,
    SPLASH_MAX_DIST: number = 90000,
    SPLASH_FADE_DIST: number = SPLASH_MAX_DIST / 6,
    SPLASH_FADE_TIME: number = 0.0002,
    TARGET_FPS: number = 33.33,
    SECTION_HEIGHT: number = 0.5,
    SECTION_GAP: number = 0.25;


//
// Labels
//

export const
    LABEL_LETTER_WIDTH: number = 74,
    LABEL_LETTER_HEIGHT: number = 48,
    LABEL_LETTER_SHADOW_BLUR: number = 4,
    LABEL_LETTER_SPACE_ISO: number = LABEL_LETTER_SPACE / ISO_SCALE,
    LABEL_LINE_HEIGHT_ISO: number = LABEL_LINE_HEIGHT / ISO_SCALE;
