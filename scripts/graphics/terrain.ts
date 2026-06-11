import { 
    ISO_SCALE, LABEL_ISO_Z, X_UNIT, Y_UNIT, Z_UNIT,
    LABEL_LETTER_HEIGHT, LABEL_LETTER_WIDTH,
    MAX_SEA_ISO_DEPTH, MIN_LAND_ISO_Z, ROW_HEIGHT,
    TERRAIN, TERRAIN_SEA,
    COLOR_TEXT_L, COLOR_TEXT_L_OUTLINE,
    WIDTH_STROKE_OUTLINE, WIDTH_STROKE_UNDERLINE,
    LABEL_DEPRESS_Z, LABEL_LETTER_SPACE_ISO, LABEL_LINE_HEIGHT_ISO,
    LABEL_LINE_HEIGHT
} from "../consts";
import { LABELS } from "./main";
import { Canvas } from "./Canvas";
import { LabelLetter } from "./Label";
import { Noise } from "./Noise";
import { Splash } from "./Splash";
import { Cublet } from "./Cublet";


//
// Properties
//

const
    NOISE = new Noise(),
    OVERSHOOT_MIN_SEA = -4 * ROW_HEIGHT,
    OVERSHOOT_MIN_OBJ = 12 * ROW_HEIGHT,
    OVERSHOOT_MAX_SEA =  5 * ROW_HEIGHT,
    OVERSHOOT_MAX_OBJ =  7 * ROW_HEIGHT,
    LETTER_Z = LABEL_ISO_Z * Z_UNIT,
    TEXT_UNDERLINE_WIDTH_OFFSET = WIDTH_STROKE_UNDERLINE / ISO_SCALE,
    CAN_SEA_PRE_RENDER = new Canvas('', X_UNIT, (MAX_SEA_ISO_DEPTH + 1) * Z_UNIT);


//
// Render functions
//

export function init() {
    const C = CAN_SEA_PRE_RENDER.CTX;
    C.translate(X_UNIT * 0.5, Y_UNIT);
    renderSingleIso(
        CAN_SEA_PRE_RENDER.CTX,
        0, 0,
        -MAX_SEA_ISO_DEPTH, 0,
        getTerrainColor(MAX_SEA_ISO_DEPTH, true)
    );
}

export function render(can: Canvas, fade: number, t: number, dT: number) {
    const C = can.CTX;

    C.clearRect(0, 0, can.width, can.height);

    C.save();
        // Calculate viewport
        const
            MIN_Y_SEA = Math.max(can.height * 0.75, window.scrollY - OVERSHOOT_MIN_SEA),
            MIN_Y_OBJ = MIN_Y_SEA - OVERSHOOT_MIN_OBJ,
            MAX_Y_SEA = (can.height * (fade === 1 ? 0.4 : 1)) + window.scrollY + OVERSHOOT_MAX_SEA,
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
            if (y >= MIN_Y_SEA && y <= MAX_Y_SEA) {
                const HORIZON_ISO_Z = getHorizonIsoZOfRow(offsetRow, y);
                for (let x = 0; x < can.width + X_UNIT; x += X_UNIT) {
                    const
                        ISO_PT = ptFromScreen(
                            x + (offsetRow ? X_UNIT * 0.5 : 0),
                            y
                        ),
                        SCR_PT = ptToScreen(...ISO_PT),
                        [LAND_Z, SEA_Z] = getTerrainIsoZ(
                            can.width, can.height,
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
                        HORIZON_ISO_Z
                    );

                }
            }

            // Labels
            LETTERS
                .filter(l => !l.drawen && l.y <= y)
                .forEach(l => {
                    renderLetter(can, t, l, fade);
                    l.drawen = true;
                });

            // Cublets
            C.strokeStyle = COLOR_TEXT_L;
            C.fillStyle = COLOR_TEXT_L;
            C.lineWidth = 2;
            CUBLETS
                .filter(c => !c.drawen && c.y <= y)
                .forEach(c => {
                    renderCublet(can, t, c, fade);
                    c.drawen = true;
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
    horizonIsoZ: number
) {
    const MIN_Z = MIN_LAND_ISO_Z - horizonIsoZ;

    // Render land
    if (landZ > MIN_Z) {
        renderSingleIso(
            can.CTX,
            isoX, isoY,
            MIN_Z, landZ,
            getTerrainColor(landZ + horizonIsoZ, false)
        );

        // Render sea over land
        if (seaZ >= landZ) {
            renderSingleIso(
                can.CTX,
                isoX, isoY,
                Math.max(landZ, seaZ - MAX_SEA_ISO_DEPTH), seaZ,
                getTerrainColor(seaZ - landZ + horizonIsoZ, true)
            );
        }
    }

    else {
        // Render sea without land
        can.CTX.drawImage(
            CAN_SEA_PRE_RENDER.CAN,
            x - (X_UNIT * 0.5),
            y - (seaZ * Z_UNIT) - Y_UNIT + window.scrollY
        );
    }
}

// Draw a single isometic block
function renderSingleIso(
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
        c.lineTo(2.125, H - 1);
        c.lineTo(2.125, -1);
        c.fillStyle = color[2];
        c.fill();
    c.restore();
}

function renderLetter(
    can: Canvas,
    t: number,
    letter: LabelLetter,
    fade: number
) {
    const
        C = can.CTX,
        LABEL = letter.LABEL,
        LABEL_DEPRESS = LABEL.pressAni.value * LABEL_DEPRESS_Z,
        HORIZON_Z = getHorizonIsoZ(letter.y),
        HORIZON_Z_LETTER = HORIZON_Z * Z_UNIT * 1.25,
        TERRAIN_Z = getTerrainIsoZ(
            can.width, can.height,
            t,
            ...ptFromScreen(letter.x, letter.y),
            letter.x, letter.y - window.scrollY,
            HORIZON_Z
        )[2] * Z_UNIT;
    
    C.save();
        // renderSingleIso(
        //     C,
        //     ...ptFromScreen(letter.x, letter.y),
        //     0, 0, ['red']
        // );

        C.globalAlpha = Math.max(0, 1 - fade);

        C.translate(
            LABEL_LETTER_WIDTH * -0.5,
            LABEL_LETTER_HEIGHT * -1.5
        );

        C.save();

            // Shadow
            C.save();
                const
                    SHADOW_SIZE = 1 + (LABEL_DEPRESS * 0.005),
                    HALF_CAN_W = letter.CAN_BG.width * 0.5,
                    HALF_CAN_H = letter.CAN_BG.height * 0.5;
                C.translate(
                    letter.x + HALF_CAN_W,
                    letter.y - TERRAIN_Z + HALF_CAN_H
                );
                C.scale(SHADOW_SIZE, SHADOW_SIZE);
                C.drawImage(
                    letter.CAN_BG,
                    HALF_CAN_W * -1,
                    HALF_CAN_H * -1
                );
            C.restore();

            // Letter
            C.translate(
                letter.x,
                letter.y + HORIZON_Z_LETTER - LETTER_Z + LABEL_DEPRESS
            );
            let scale = 1 - (HORIZON_Z / 6);
            C.scale(1, scale);
            C.drawImage(
                letter.CAN_FG,
                0, 0
            );

        C.restore();

        // Underline
        if (letter.LAST_LINE) {
            LABEL.setY(HORIZON_Z_LETTER * 1.25);

            const HOVER = LABEL.hoverAni.value;
            if (HOVER) {
                const PTS: [number, number][] = LABEL.LETTERS
                    .slice(letter.LABEL.LETTERS.length - letter.LAST_LINE)
                    .map((l, li) => [
                        2 + (li * LABEL_LETTER_WIDTH / ISO_SCALE),
                        -1.5 - (li * LABEL_LINE_HEIGHT / Y_UNIT) +
                        (getHorizonIsoZ(l.y) * 2)
                    ]);
                PTS.unshift([
                    PTS[0][0] - ((PTS[1][0] - PTS[0][0]) * 0.25),
                    PTS[0][1] - ((PTS[1][1] - PTS[0][1]) * 0.25)
                ]);
                PTS.push([
                    PTS[PTS.length - 1][0] - ((PTS[PTS.length - 2][0] - PTS[PTS.length - 1][0]) * 0.2),
                    PTS[PTS.length - 1][1] - ((PTS[PTS.length - 2][1] - PTS[PTS.length - 1][1]) * 0.2)
                ]);

                C.translate(
                    letter.x + (X_UNIT * 0.5),
                    letter.y + (Y_UNIT * -0.25) + LABEL_DEPRESS
                );
                C.scale(ISO_SCALE, ISO_SCALE);
                C.beginPath();
                    for (let i = 0; i < PTS.length; i++) {
                        C.lineTo(...PTS[i]);
                    }
                    C.translate(
                        TEXT_UNDERLINE_WIDTH_OFFSET * HOVER * -1.25,
                        TEXT_UNDERLINE_WIDTH_OFFSET * HOVER * -0.75
                    );
                    for (let i = PTS.length - 1; i >= 0; i--) {
                        C.lineTo(...PTS[i]);
                    }
                C.closePath();
                C.strokeStyle = COLOR_TEXT_L_OUTLINE;
                C.lineWidth = (WIDTH_STROKE_OUTLINE * 2 * HOVER) / ISO_SCALE;
                C.stroke();
                C.fillStyle = COLOR_TEXT_L;
                C.fill();
            }
        }
    C.restore();
}

function renderCublet(
    can: Canvas,
    t: number,
    cube: Cublet,
    fade: number
) {
    const
        C = can.CTX,
        HORIZON_Z = getHorizonIsoZ(cube.y),
        TERRAIN_Z = getTerrainIsoZ(
            can.width, can.height,
            t,
            ...ptFromScreen(cube.x, cube.y),
            cube.x, cube.y - window.scrollY,
            HORIZON_Z
        )[2] * Z_UNIT;
    
    C.save();
        C.globalAlpha = Math.max(0, 1 - fade);
        C.translate(
            cube.x - (ISO_SCALE * 3),
            cube.y - (ISO_SCALE * 2) - TERRAIN_Z
        );
        cube.draw(C);
    C.restore();
}


//
// Color
//

function getTerrainColor(z: number, isSea: boolean): string[] {
    let c, alpha = 1;
    if (isSea) {
        c = TERRAIN_SEA[1];
        alpha = c[3] * (z < 0.2 ? z / 0.2 : 1);
    } else {
        z = Math.min(1, Math.max(0, (z + 3) / 8));
        const
            CI = TERRAIN.findIndex(c => z <= c[0]),
            C0 = TERRAIN[CI - 1],
            C1 = TERRAIN[CI],
            R = 1 - ((C1[0] - z) / (C1[0] - C0[0]));
        c = C0[1].map((h, i) => h + ((C1[1][i] - h) * R));
    }

    return [0, 8, 12]
        .map(h => `hsl(${c[0]} ${c[1]}% ${c[2] - h}% / ${alpha})`);
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
    cw: number, ch: number,
    t: number,
    x: number, y: number,
    sx: number, sy: number,
    horizonIsoZ: number
): [number, number, number] {
    const
        LAND_Z = getLandZ(sx, sy, cw, ch) - horizonIsoZ,
        SEA_Z = getSeaZ(t, x, y, sx, sy) - horizonIsoZ;
    return [
        LAND_Z,
        SEA_Z,
        Math.max(SEA_Z, LAND_Z)
    ];
}

function getLandZ(x: number, y: number, width: number, height: number): number {
    return -5;

    if (
        y < height
    ) {
        return -5;
    }

    // Islands
    const
        PHASE_X = width * 0.5,
        PHASE_Y = height * 0.5,
        PHASE_Z = -1,
        PERIOD_X = width / 6,
        PERIOD_Y = height / 6,
        AMP = 5;
    return (
        PHASE_Z +
        (
            AMP *
            Math.sin((x + PHASE_X) / PERIOD_X) *
            Math.sin((y + PHASE_Y) / PERIOD_Y)
        ) +
        (NOISE.get(x / 32, y / 32) * 0.25)
    );
}

function getSeaZ(t: number, x: number, y: number, sx: number, sy: number): number {
    // return 0;
    return (
        // Ebb
        Math.cos((y + (x * 0.25) + (t * 200)) * 0.125) +

        // Splash waves
        Splash.splashes.reduce((sum, s) => sum + s.getZ(sx, sy), 0) +0

        // Noise
        // (NOISE.get(x, y) * 0.15)
    );
}
