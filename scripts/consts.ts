import {
    COLOR_HSL_TERRAIN_LAND_1, COLOR_HSL_TERRAIN_LAND_2, COLOR_HSL_TERRAIN_LAND_3, COLOR_HSL_TERRAIN_LAND_4,
    COLOR_HSL_TERRAIN_SEA,
    LABEL_LETTER_SPACE, LABEL_LINE_HEIGHT
} from "./consts.scss";
import { ePages, tColor, tTerrainParams } from "./types";
import { getEl, getEls } from "./util";


//
// Styles
//

export * from "./consts.scss";

//
// Routes
//

export const ROUTES: { [key in ePages]?: string } = {
    [ePages.Main]: '',
    [ePages.Contact]: 'Contact',
    [ePages.Experience]: 'Experience',
}


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
    EL_PAGE_MAIN                   = getEl('#page_main'),
    EL_TOPICS                      = getEl('#topics'),
    EL_HEADER_NAV_LINKS_EXPERIENCE = getEl('#header_navLinksExperience'),
    EL_HEADER_NAV_LINKS_CONTACT    = getEl('#header_navLinksContact'),
    EL_HEADER_NAV_MORE             = getEl('#header_navMore'),
    EL_PAGE_CLOSES                 = getEls('.page__close'),
    EL_PAGE_EXPERIENCE             = getEl('#page_experience'),
    EL_PAGE_CONTACT                = getEl('#page_contact'),
    EL_PAGE_TOPIC                  = getEl('#page_topic'),
    EL_PAGE_PROJECT                = getEl('#page_project'),
    EL_PROJECT_CLOSE               = getEl('#project_close'),
    EL_PROJECT_IMAGE               = getEl('#project_image'),
    EL_PROJECT_TITLE               = getEl('#project_title'),
    EL_PROJECT_TAGS                = getEl('#project_tags'),
    EL_PROJECT_DESC                = getEl('#project_desc'),
    EL_PROJECT_LINK_LIVE           = getEl<HTMLAnchorElement>('#project_linkLive'),
    EL_PROJECT_LINK_CODE           = getEl<HTMLAnchorElement>('#project_linkCode');


//
// Graphics
//

export const
    CAN_QUALITY = window.devicePixelRatio,
    SKY_HEIGHT_RATIO: number = 0.75,
    MAX_SEA_ISO_DEPTH: number = 2,
    MIN_LAND_ISO_Z: number = -3,
    ISO_SCALE_LG: number = 14,
    ISO_SCALE_SM: number = 10,
    X_UNIT_SCALE: number = 4,
    Y_UNIT_SCALE: number = 2,
    Z_UNIT_SCALE: number = 2,
    ROW_HEIGHT_SCALE: number = 1,
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
        10, 0.75, 8881155010
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
    ],
    CUBLET_SEEDS: number[] = [
        434981953,
        434981953,
        434981953,
        434981953,
        434981953,
        434981953
    ];

    
//
// Labels
//

export const
    LABEL_LETTER_WIDTH: number = 74,
    LABEL_LETTER_HEIGHT: number = 48,
    LABEL_LETTER_WIDTH_SM: number = 55,
    LABEL_LETTER_HEIGHT_SM: number = 36,
    LABEL_LETTER_SHADOW_BLUR: number = 4,
    LABEL_Z_SCALE: number = 3,
    LABEL_DEPRESS_Z_SCALE: number = 1;
