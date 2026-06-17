import { 
    ISO_SCALE, LABEL_ISO_Z, X_UNIT, Y_UNIT, Z_UNIT,
    LABEL_LETTER_HEIGHT, LABEL_LETTER_WIDTH,
    MAX_SEA_ISO_DEPTH, MIN_LAND_ISO_Z, ROW_HEIGHT,
    TERRAIN_COLOR_SEA,
    COLOR_TEXT_L, COLOR_TEXT_L_OUTLINE,
    WIDTH_STROKE_OUTLINE, WIDTH_STROKE_UNDERLINE,
    LABEL_DEPRESS_Z, LABEL_LINE_HEIGHT,
    HEIGHT_MAIN_SECTION, HEIGHT_MAIN_SECTION_GAP,
    TERRAIN_TYPES, TERRAIN_COLOR_LAND, TERRAIN_SEA_NOISE,
    WIDTH_PAGE_BG_MAX
} from "../consts";
import { Canvas } from "./Canvas";
import { LabelLetter } from "./Label";
import { Noise } from "./Noise";
import { Splash } from "./Splash";
import { Cublet } from "./Cublet";
import { tColorLayers, tTerrain } from "../types";
import { LABELS } from "./main";
import { _DEBUG_renderBaseIso, _DEBUG_showPreRenderTerrain, _DEBUG_showTerrainControls, _DEBUG_updateTerrainControls } from "../_debug";


//
// Properties
//

const
    NOISE_SEA = new Noise(...TERRAIN_SEA_NOISE),
    SECTION_TERRAIN: tTerrain[] = [],
    OVERSHOOT_MIN_SEA  = -3 * ROW_HEIGHT,
    OVERSHOOT_MIN_LAND = 19 * ROW_HEIGHT,
    OVERSHOOT_MIN_OBJ  = 19 * ROW_HEIGHT,
    OVERSHOOT_MAX_SEA  =  9 * ROW_HEIGHT,
    OVERSHOOT_MAX_OBJ  =  7 * ROW_HEIGHT,
    LETTER_Z = LABEL_ISO_Z * Z_UNIT,
    CAN_SEA_PRE_RENDER = new Canvas('', X_UNIT, (MAX_SEA_ISO_DEPTH + 1) * Z_UNIT, true),
    LAND_PRE_RENDER_Q = 10,
    LAND_PRE_RENDER_DEPTH_ISO = 4,
    LAND_PRE_RENDER_DEPTH = (LAND_PRE_RENDER_DEPTH_ISO * Z_UNIT) + (Y_UNIT),
    CAN_LAND_PRE_RENDER = new Canvas(
        '',
        X_UNIT * LAND_PRE_RENDER_Q,
        LAND_PRE_RENDER_DEPTH * TERRAIN_TYPES.length,
        true
    );

let
    terrainLayout_sectionFullHeight: number,
    terrainLayout_offsetY: number;


//
// Render functions
//

export function init() {
    LABELS.forEach((_, li) => {
        const T = TERRAIN_TYPES[li % TERRAIN_TYPES.length];
        SECTION_TERRAIN.push({
            x: 0,
            y: 0,
            z: T[1],
            distBase: T[0],
            dist: 0,
            noiseWidthBase: T[2],
            noise: new Noise(1, T[3], T[4]),
            color: (
                T[5]
                    .map((l, li) => [l, TERRAIN_COLOR_LAND[li]])
                    .filter(l => l[0] as number > -1)
            ) as tColorLayers
        })
    });

    // _DEBUG_showTerrainControls();
    // _DEBUG_showPreRenderTerrain(CAN_LAND_PRE_RENDE);

    const CL = CAN_LAND_PRE_RENDER.CTX;
    CL.translate(X_UNIT * 0.5, Y_UNIT);
    TERRAIN_TYPES.forEach((_, ti) => {
        CL.save();
            for (let i = 0; i < LAND_PRE_RENDER_Q; i++) {
                renderSingleIso(
                    CL,
                    0, 0,
                    -1 * LAND_PRE_RENDER_DEPTH_ISO, 0,
                    getTerrainColor((8 * (i / LAND_PRE_RENDER_Q)) - 2.9, ti)
                );
                CL.translate(X_UNIT, 0);
            }
        CL.restore();
        CL.translate(0, LAND_PRE_RENDER_DEPTH);
    });

    const CS = CAN_SEA_PRE_RENDER.CTX;
    CS.translate(X_UNIT * 0.5, Y_UNIT);
    renderSingleIso(
        CS,
        0, 0,
        -MAX_SEA_ISO_DEPTH, 0,
        getTerrainColor(MAX_SEA_ISO_DEPTH, -1)
    );
}

export function resize(width: number, height: number) {
    const TERRAIN_WIDTH = Math.min(width, WIDTH_PAGE_BG_MAX);
    terrainLayout_sectionFullHeight = (HEIGHT_MAIN_SECTION + HEIGHT_MAIN_SECTION_GAP) * height;
    terrainLayout_offsetY = (1 + HEIGHT_MAIN_SECTION_GAP) * height;

    SECTION_TERRAIN.forEach((t, ti) => {
        t.x = (width * 0.5) + (TERRAIN_WIDTH * (ti % 2 ? -0.25 : 0.25));
        t.y = terrainLayout_offsetY + (ti * terrainLayout_sectionFullHeight) + (HEIGHT_MAIN_SECTION * height * 0.5);
        t.dist = (t.distBase * TERRAIN_WIDTH) ** 2;
        t.noise.width = t.noiseWidthBase * (TERRAIN_WIDTH / WIDTH_PAGE_BG_MAX);

        Cublet.CUBLETS
            .filter(c => c.sectionI === ti)
            .forEach(c => {
                c.x = t.x + ((c.RAND_X - 0.5) * TERRAIN_WIDTH * 0.25);
                c.y = t.y + ((c.RAND_Y - 0.5) * TERRAIN_WIDTH * 0.25);

                c.setAngle();
            });
    });
}

export function render(can: Canvas, fade: number, t: number, dT: number) {
    // _DEBUG_updateTerrainControls(SECTION_TERRAIN);

    const C = can.CTX;

    C.clearRect(0, 0, can.width, can.height);

    C.save();
        // Calculate viewport
        const
            MIN_Y_SEA = Math.max(can.height * 0.75, window.scrollY - OVERSHOOT_MIN_SEA),
            MIN_Y_LAND = MIN_Y_SEA - OVERSHOOT_MIN_LAND,
            MIN_Y_OBJ = MIN_Y_SEA - OVERSHOOT_MIN_OBJ,
            MAX_Y_SEA = can.height + window.scrollY + OVERSHOOT_MAX_SEA,
            MAX_Y_OBJ = MAX_Y_SEA + OVERSHOOT_MAX_OBJ;
            
        // Find visible objects
        const
            LETTERS = LabelLetter.LETTERS.filter(l => l.y > MIN_Y_OBJ && l.y < MAX_Y_OBJ),
            CUBLETS = Cublet.CUBLETS.filter(c => c.y > MIN_Y_OBJ && c.y < MAX_Y_OBJ);
        LETTERS.forEach(l => l.drawen = false);
        CUBLETS.forEach(l => l.drawen = false);

        let offsetRow = false;
        C.translate(0, window.scrollY * -1);

        // Render
        for (let y = MIN_Y_OBJ; y < MAX_Y_OBJ; y += ROW_HEIGHT) {
            offsetRow = !offsetRow;

            // Terrain
            if (y >= MIN_Y_LAND && y <= MAX_Y_SEA) {
                const HORIZON_ISO_Z = getHorizonIsoZOfRow(offsetRow, y);
                for (let x = 0; x < can.width + X_UNIT; x += X_UNIT) {
                    const
                        ISO_PT = ptFromScreen(
                            x + (offsetRow ? X_UNIT * 0.5 : 0),
                            y
                        ),
                        SCR_PT = ptToScreen(...ISO_PT),
                        [LAND_Z, SEA_Z, MAX_Z, SECTION_I] = getTerrainIsoZ(
                            t,
                            ...ISO_PT,
                            ...SCR_PT,
                            HORIZON_ISO_Z
                        );

                    renderTerrainIso(
                        can,
                        ...SCR_PT,
                        ...ISO_PT,
                        LAND_Z, SEA_Z,
                        y >= MIN_Y_SEA,
                        SECTION_I,
                        HORIZON_ISO_Z
                    );

                    // Cublets
                    C.strokeStyle = COLOR_TEXT_L;
                    C.fillStyle = COLOR_TEXT_L;
                    C.lineWidth = 2;
                    CUBLETS
                        .filter(c => c.isoX === undefined)
                        .filter(c => !c.drawen && c.y <= y && c.x <= x)
                        .forEach(c => {
                            c.isoX = ISO_PT[0];
                            c.isoY = ISO_PT[1];
                            if (MAX_Z - LAND_Z > 1) {
                                c.inSea = true;
                                c.setAngle(true);
                            }
                        });

                    CUBLETS
                        .filter(c => c.isoX === ISO_PT[0] && c.isoY === ISO_PT[1])
                        .forEach(c => {
                            renderCublet(
                                can,
                                c,
                                SCR_PT[0],
                                SCR_PT[1] - (MAX_Z * Z_UNIT) + window.scrollY,
                                fade
                            );
                            c.drawen = true;
                        });
                }
            }

            // Labels
            LETTERS
                .filter(l => !l.drawen && l.y <= y)
                .forEach(l => {
                    renderLetter(C, t, l, fade);
                    l.drawen = true;
                });
        }
        
        Splash.splashes.forEach(s => s.step(dT));
    C.restore();
}

// Draw isometic terrain blocks for one x, y point
function renderTerrainIso(
    can: Canvas,
    x: number, y: number,
    isoX: number, isoY: number,
    landZ: number, seaZ: number,
    drawSea: boolean,
    sectionI: number,
    horizonIsoZ: number
) {
    const MIN_Z = MIN_LAND_ISO_Z - horizonIsoZ;

    // Render land
    if (landZ > MIN_Z) {
        can.CTX.drawImage(
            CAN_LAND_PRE_RENDER.CAN,
            X_UNIT * Math.floor(LAND_PRE_RENDER_Q * Math.min(1, Math.max(0, ((landZ + horizonIsoZ) + 3) / 8))),
            (sectionI % TERRAIN_TYPES.length) * LAND_PRE_RENDER_DEPTH,
            X_UNIT, LAND_PRE_RENDER_DEPTH,
            x - (X_UNIT * 0.5),
            y - (landZ * Z_UNIT) - Y_UNIT + window.scrollY,
            X_UNIT, LAND_PRE_RENDER_DEPTH
        );
    }

    if (drawSea) {
        // Render sea independent of land
        if (landZ <= MIN_Z || seaZ - landZ > MAX_SEA_ISO_DEPTH) {
            can.CTX.drawImage(
                CAN_SEA_PRE_RENDER.CAN,
                x - (X_UNIT * 0.5),
                y - (seaZ * Z_UNIT) - Y_UNIT + window.scrollY
            );
        }
        
        // Render shallow sea over land
        else if (seaZ > landZ) {
            renderSingleIso(
                can.CTX,
                isoX, isoY,
                landZ, seaZ,
                getTerrainColor(seaZ - landZ, -1)
            );
        }
    }
}

// Draw a single isometic block
export function renderSingleIso(
    c: CanvasRenderingContext2D,
    x: number, y: number,
    z0: number, z: number,
    color: string[]
) {
    const H = (z - z0) * 2;
    c.save();

    c.scale(-ISO_SCALE, ISO_SCALE);
    c.translate(
        (x * -2) + (y * 2),
        x + y + (z * -2)
    );
    c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(-2, -1);
        c.lineTo(0, -2);
        c.lineTo(2, -1);
    c.fillStyle = color[0];
    c.fill();
    c.beginPath();
        c.moveTo(0, H);
        c.lineTo(-2, H - 1);
        c.lineTo(-2, -1);
        c.lineTo(0, 0);
    c.fillStyle = color[1]
    c.fill();
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(0, H);
        c.lineTo(2, H - 1);
        c.lineTo(2, -1);
        c.fillStyle = color[2];
        c.fill();
    c.restore();
}

function renderLetter(
    c: CanvasRenderingContext2D,
    t: number,
    letter: LabelLetter,
    fade: number
) {
    const
        LABEL = letter.LABEL,
        LABEL_DEPRESS =
            (LABEL.pressAni.value * LABEL_DEPRESS_Z) +
            fade * Z_UNIT * -20,
        HORIZON_Z = getHorizonIsoZ(letter.y),
        HORIZON_Z_LETTER = HORIZON_Z * Z_UNIT * 1.25,
        TERRAIN_Z = getTerrainIsoZ(
            t,
            ...ptFromScreen(letter.x, letter.y),
            letter.x, letter.y - window.scrollY,
            HORIZON_Z
        )[2] * Z_UNIT;
    
    c.save();
        // _DEBUG_renderBaseIso(c, ...ptFromScreen(letter.x, letter.y))

        c.globalAlpha = Math.max(0, 1 - fade);

        c.translate(
            LABEL_LETTER_WIDTH * -0.5,
            LABEL_LETTER_HEIGHT * -1.5
        );

        c.save();

            // Shadow
            c.save();
                const
                    SHADOW_SIZE = 1 + (LABEL_DEPRESS * 0.005),
                    HALF_CAN_W = letter.CAN_BG.width * 0.5,
                    HALF_CAN_H = letter.CAN_BG.height * 0.5;
                c.translate(
                    letter.x + HALF_CAN_W,
                    letter.y - TERRAIN_Z + HALF_CAN_H
                );
                c.scale(SHADOW_SIZE, SHADOW_SIZE);
                c.drawImage(
                    letter.CAN_BG,
                    HALF_CAN_W * -1,
                    HALF_CAN_H * -1
                );
            c.restore();

            // Letter
            c.translate(
                letter.x,
                letter.y + HORIZON_Z_LETTER - LETTER_Z + LABEL_DEPRESS
            );
            let scale = 1 - (HORIZON_Z / 6);
            c.scale(1, scale);
            c.drawImage(
                letter.CAN_FG,
                0, 0
            );

        c.restore();

        // Underline
        if (letter.LAST_LINE) {
            LABEL.setY(HORIZON_Z_LETTER * 1.25);

            const HOVER = LABEL.hoverAni.value;
            if (HOVER) {
                const PTS: [number, number][] = LABEL.LETTERS
                    .slice(letter.LABEL.LETTERS.length - letter.LAST_LINE)
                    .map((l, li) => [
                        l.x + (X_UNIT * 1.5),
                        l.y - Y_UNIT + LABEL_DEPRESS +
                        (getHorizonIsoZ(l.y) * Z_UNIT)
                    ]);
                PTS.unshift([
                    PTS[0][0] - ((PTS[1][0] - PTS[0][0]) * 0.2),
                    PTS[0][1] - ((PTS[1][1] - PTS[0][1]) * 0.2)
                ]);
                PTS.push([
                    PTS[PTS.length - 1][0] - ((PTS[PTS.length - 2][0] - PTS[PTS.length - 1][0]) * 0.2),
                    PTS[PTS.length - 1][1] - ((PTS[PTS.length - 2][1] - PTS[PTS.length - 1][1]) * 0.2)
                ]);

                c.beginPath();
                    for (let i = 0; i < PTS.length; i++) {
                        c.lineTo(...PTS[i]);
                    }
                    c.translate(
                        WIDTH_STROKE_UNDERLINE * HOVER * -1.25,
                        WIDTH_STROKE_UNDERLINE * HOVER * -0.75
                    );
                    for (let i = PTS.length - 1; i >= 0; i--) {
                        c.lineTo(...PTS[i]);
                    }
                c.closePath();
                c.strokeStyle = COLOR_TEXT_L_OUTLINE;
                c.lineWidth = WIDTH_STROKE_OUTLINE * 2 * HOVER;
                c.stroke();
                c.fillStyle = COLOR_TEXT_L;
                c.fill();
            }
        }
    c.restore();
}

function renderCublet(
    can: Canvas,
    cube: Cublet,
    x: number,
    y: number,
    fade: number
) {
    const C = can.CTX;
    
    C.save();
        C.globalAlpha = Math.max(0, 1 - fade);
        C.translate(
            x,
            y - (ISO_SCALE * (cube.inSea ? 0.875 : 1.75)) - (Z_UNIT * 20 * Math.max(0, fade - cube.RAND_X * 0.5))
        );
        cube.draw(C);
    C.restore();
}


//
// Color
//

function getTerrainColor(z: number, sectionI: number): string[] {
    let c, alpha = 1;
    if (sectionI === -1) {
        c = TERRAIN_COLOR_SEA;
        alpha = c[3] * (z < 0.2 ? z / 0.2 : 1);
    } else {
        z = Math.min(1, Math.max(0, (z + 3) / 8));
        const
            COLORS = SECTION_TERRAIN[sectionI].color,
            CI = COLORS.findIndex(c => z <= c[0]),
            C0 = COLORS[CI - 1],
            C1 = COLORS[CI],
            R = 1 - ((C1[0] - z) / (C1[0] - C0[0]));
        c = C0[1].map((h, i) => h + ((C1[1][i] - h) * R));
    }

    return [0, 8, 12]
        .map(h => `hsl(${ c[0] } ${ c[1] }% ${ c[2] - h }% / ${ alpha })`);
}


//
// Co-ordinate look-ups
//

export function ptFromScreen(x: number, y: number): [number, number] {
    x *= -0.5;
    y *= 0.5;

    let
        wx = y - (x * 0.5),
        wy = x + wx;
    x = wx;
    y = wy;

    x /= ISO_SCALE;
    y /= ISO_SCALE;

    x = Math.floor(x);
    y = Math.floor(y);

    return [x, y];
}

export function ptToScreen(x: number, y: number): [number, number] {
    x *= ISO_SCALE;
    y *= ISO_SCALE;

    x = y - x,
    y = y - x * 0.5;

    x /= -0.5;
    y /= 0.5;

    return [x, y - window.scrollY];
}

function getHorizonIsoZOfRow(xOffset: boolean = false, y: number): number {
    y = xOffset
        ?   Math.floor((y * 0.5 / ISO_SCALE) + 0.5) +
            Math.floor((y * 0.5 / ISO_SCALE) - 0.5)
        :   Math.floor (y * 0.5 / ISO_SCALE) * 2;

    return getHorizonIsoZ(y * ISO_SCALE);
}

function getHorizonIsoZ(y: number): number {
    y -= window.scrollY;
    return y < 450 ? Math.pow((1 - ((y - 170) / 280)) * 1.9, 2) : 0;
}

function getTerrainIsoZ(
    t: number,
    x: number, y: number,
    sx: number, sy: number,
    horizonIsoZ: number
): [number, number, number, number] {
    const
        [LAND_Z, SECTION_I] = getLandZ(sx, sy + window.scrollY),
        SEA_Z = getSeaZ(t, x, y, sx, sy);
    return [
        LAND_Z - horizonIsoZ,
        SEA_Z - horizonIsoZ,
        Math.max(SEA_Z - horizonIsoZ, LAND_Z - horizonIsoZ),
        SECTION_I
    ];
}

function getLandZ(x: number, y: number): [number, number] {
    const
        SECTION_I = Math.floor((y - terrainLayout_offsetY) / terrainLayout_sectionFullHeight),
        PEAK = SECTION_TERRAIN[SECTION_I];

    if (!PEAK) {
        return [MIN_LAND_ISO_Z, 0];
    }

    const
        DX = PEAK.x - x,
        DY = PEAK.y - y;

    return [
        MIN_LAND_ISO_Z + (
            (Math.max(0, (PEAK.dist - (DX**2 + DY**2)) / PEAK.dist) * PEAK.z) *
            (1 + PEAK.noise.get(DX, DY))
        ),
        SECTION_I
    ];
}

function getSeaZ(t: number, x: number, y: number, sx: number, sy: number): number {
    return (
        // Ebb
        Math.cos((y + (x * 0.25) + (t * 200)) * 0.125) +

        // Splash waves
        Splash.splashes.reduce((sum, s) => sum + s.getZ(sx, sy), 0) +

        // Noise
        (NOISE_SEA.get(x, y) * 0.15)
    );
}
