import { tTerrainDetail } from "./types";
import { getCssVar, getEls } from "./util";


//
// Page dimensions
//

export const
    PAGE_WIDTH_MAX: number = 2000,
    PAGE_HEIGHT_MAX: number = 1250,
    PAGE_WIDTH: number = Math.min(window.innerWidth, PAGE_WIDTH_MAX),
    PAGE_HEIGHT: number = Math.min(window.innerHeight, PAGE_HEIGHT_MAX);


//
// Styles
//

export const
    FONT_TITLE: string = getCssVar('f-fam-title'),
    FONT_TITLE_SRC: string = getCssVar('f-fam-title-src'),
    COLOR_TEXT_L: string = getCssVar('c-text-l'),
    COLOR_TEXT_SHADOW: string = getCssVar('c-text-shadow');


//
// Labels
//

export const
    EL_SECTION_LABELS = getEls<HTMLButtonElement>('.main__topic'),
    SECTION_LABELS: string[] = [
        'Visuals',
        ' Apps',
        'Sites',
        'Games',
        'Tools'
    ],
    LABEL_LETTER_WIDTH = 74,
    LABEL_LETTER_HEIGHT = 48,
    LABEL_LETTER_SHADOW = 4;

    
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
    SPLASH_MAX_DIST = 90000,
    SPLASH_FADE_DIST = SPLASH_MAX_DIST / 6,
    SPLASH_FADE_TIME = 0.0002;