import {
    WIDTH_ISO_SCALE,
    COLOR_HSL_TERRAIN_LAND_1, COLOR_HSL_TERRAIN_LAND_2, COLOR_HSL_TERRAIN_LAND_3, COLOR_HSL_TERRAIN_LAND_4, COLOR_HSL_TERRAIN_SEA,
    LABEL_LETTER_SPACE, LABEL_LINE_HEIGHT
} from "./consts.scss";
import { tColor, tTerrainParams } from "./types";
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
    CAN_QUALITY = window.devicePixelRatio,
    SKY_HEIGHT_RATIO: number = 0.75,
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
// Terrain settings
//

export const
    TERRAIN_COLOR_SEA: tColor =
        COLOR_HSL_TERRAIN_SEA,
    TERRAIN_COLOR_LAND: tColor[] = [
        COLOR_HSL_TERRAIN_LAND_1,
        COLOR_HSL_TERRAIN_LAND_2,
        COLOR_HSL_TERRAIN_LAND_3,
        COLOR_HSL_TERRAIN_LAND_4
    ],
    TERRAIN_SEA_NOISE: [number, number, number] = [
        10, 5, 8881155010
    ],
    TERRAIN_TYPES: tTerrainParams[] = [
        // Island
        [0.24, 5.2, 227, 0.71,  523303901, [0,  -1, 0.3, 1.0]],
        // Rocks
        [0.26, 2.2, 168, 1.95, 7553011583, [0, 0.2, 0.7, 1.0]],
        // Desert
        [0.30, 3.6, 256, 0.48, 3351662809, [0,  -1, 0.3, 1.0]],
        // Cliff
        [0.21, 4.6, 234, 2.62, 8818974905, [0,  -1,  -1, 1.0]]
    ];

//
// Labels
//

export const
    LABEL_LETTER_WIDTH: number = 74,
    LABEL_LETTER_HEIGHT: number = 48,
    LABEL_LETTER_SHADOW_BLUR: number = 4,
    LABEL_LETTER_SPACE_ISO: number = LABEL_LETTER_SPACE / ISO_SCALE,
    LABEL_LINE_HEIGHT_ISO: number = LABEL_LINE_HEIGHT / ISO_SCALE;
