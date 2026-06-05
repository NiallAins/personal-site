import { COLOR_TEXT_L, ISO_SCALE, TERRAIN, TERRAIN_SEA, WIDTH_PAGE_MAX, WIDTH_STROKE_UNDERLINE } from "../consts";
import { CUBLETS, LABELS } from "./main";
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
    ROW_OVERSHOOT_MIN = -4,
    ROW_OVERSHOOT_MAX = 8,
    ROW_OVERSHOOT_MIN_OBJ = 14,
    LETTER_Z = 4 * ISO_SCALE,
    TEXT_UNDERLINE_WIDTH_OFFSET = WIDTH_STROKE_UNDERLINE / ISO_SCALE,
    TERRAIN_MAX_X = WIDTH_PAGE_MAX * 0.5;


//
// Render functions
//

export function render(can: Canvas, fade: number, t: number, dT: number) {
    const C = can.CTX;

    C.clearRect(0, 0, can.width, can.height);

    // Draw isometic
    C.save();
        LABELS.forEach(l => l.toggleAllowClick(false));
        LABELS.forEach(l => {
            if (l.hovering) {
                if (l.hover < 0.9) {
                    l.hover += 0.2 * dT;
                } else if (l.hover !== 1) {
                    l.hover = 1;
                }
            } else {
                if (l.hover > 0.1) {
                    l.hover -= 0.2 * dT;
                } else if (l.hover !== 0) {
                    l.hover = 0;
                }
            }
        });

        const
            MIN_Y_SEA = Math.max(can.height * 0.75, window.scrollY - (ISO_SCALE * ROW_OVERSHOOT_MIN)),
            MIN_Y_OBJ = MIN_Y_SEA - (ISO_SCALE * ROW_OVERSHOOT_MIN_OBJ),
            MAX_Y = (can.height * (fade === 1 ? 0.4 : 1)) + window.scrollY + (ISO_SCALE * ROW_OVERSHOOT_MAX);

        const
            LETTERS = LabelLetter.LETTERS.filter(l => l.y > MIN_Y_OBJ && l.y < MAX_Y),
            CUBLETS = Cublet.CUBLETS.filter(c => c.y > MIN_Y_OBJ && c.y < MAX_Y);
        LETTERS.forEach(l => l.drawen = false);
        CUBLETS.forEach(l => l.drawen = false);

        let offsetRow = false;
        C.translate(0, window.scrollY * -1);

        for (let y = MIN_Y_OBJ; y < MAX_Y; y += ISO_SCALE) {
            offsetRow = !offsetRow;

            if (y >= MIN_Y_SEA) {
                const HORIZON_ISO_Z = getHorizonIsoZOfRow(offsetRow, y);
                for (let x = 0; x < can.width + (ISO_SCALE * 4); x += ISO_SCALE * 4) {
                    const
                        ISO_PT = ptFromScreen(
                            x + (offsetRow ? ISO_SCALE * 2 : 0),
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
                        ...ISO_PT,
                        LAND_Z, SEA_Z,
                        HORIZON_ISO_Z
                    );

                }
            }

            LETTERS
                .filter(l => !l.drawen && l.y <= y)
                .forEach(l => {
                    renderLetter(can, t, l, fade);
                    l.drawen = true;
                });

            CUBLETS
                .filter(c => !c.drawen && c.y <= y)
                .forEach(c => {
                    c.draw(can.CTX, fade, getHorizonIsoZ(c.y));
                    c.drawen = true;
                });

            // LETTERS
            //     .filter(l => !l.drawen && Math.abs(l.y - y) <= ISO_SCALE * 0.5)
            //     .forEach(l => {
            //         renderLetter(can, t, l, fade);
            //         l.drawen = true;
            //     });
        }
        
        Splash.splashes.forEach(s => s.step(dT));
    C.restore();
}

// Draw isometic terrain blocks for one x, y point
function renderTerrainIso(
    can: Canvas,
    x: number, y: number,
    landZ: number, seaZ: number,
    horizonIsoZ: number
) {
    const MIN_Z = -3 - horizonIsoZ;

    // Render land
    if (landZ > MIN_Z) {
        renderSingleIso(
            can.CTX,
            x, y,
            MIN_Z, landZ,
            getTerrainColor(landZ + horizonIsoZ, false)
        );
    }

    // Render sea
    if (seaZ >= landZ) {
        renderSingleIso(
            can.CTX,
            x, y,
            Math.max(landZ, seaZ - 2), seaZ,
            getTerrainColor(seaZ - landZ + horizonIsoZ, true)
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
    const H = Math.max(0, (z - z0) * 2);
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
        HORIZON_Z = getHorizonIsoZ(letter.y),
        HORIZON_Z_LETTER = HORIZON_Z * ISO_SCALE * 2.5,
        HORIZON_Z_SHADOW = HORIZON_Z * ISO_SCALE * 0.25,
        TERRAIN_Z = getTerrainIsoZ(
            can.width, can.height,
            t,
            ...ptFromScreen(letter.x, letter.y),
            letter.x, letter.y - window.scrollY,
            HORIZON_Z
        )[2] * ISO_SCALE * 2;
    
    C.save();
        C.globalAlpha = Math.max(0, 1 - fade);
        C.translate(ISO_SCALE * -3, ISO_SCALE * -4.5);

        // Shadow
        C.drawImage(
            letter.CAN_BG,
            letter.x,
            letter.y - TERRAIN_Z + HORIZON_Z_SHADOW
        );

        // Letter
        C.drawImage(
            letter.CAN_FG,
            letter.x,
            letter.y - LETTER_Z + HORIZON_Z_LETTER
        );

        // Underline
        if (letter.LAST_LINE) {
            letter.LABEL.setY(HORIZON_Z_LETTER * 1.25);

            if (letter.LABEL.hover) {
                const PTS: [number, number][] = letter.LABEL.LETTERS
                    .slice(letter.LABEL.LETTERS.length - letter.LAST_LINE)
                    .map((l, li) => [
                        3 + (li * 4),
                        -2 - (li * 2) +
                        (getHorizonIsoZ(l.y) * 2.5)
                    ]);
                PTS.unshift([
                    PTS[0][0] - ((PTS[1][0] - PTS[0][0]) * 0.4),
                    PTS[0][1] - ((PTS[1][1] - PTS[0][1]) * 0.4)
                ]);
                PTS.push([
                    PTS[PTS.length - 1][0] - ((PTS[PTS.length - 2][0] - PTS[PTS.length - 1][0]) * 0.2),
                    PTS[PTS.length - 1][1] - ((PTS[PTS.length - 2][1] - PTS[PTS.length - 1][1]) * 0.2)
                ]);
                C.translate(letter.x + (ISO_SCALE * 2), letter.y + (ISO_SCALE * 1))
                C.scale(ISO_SCALE, ISO_SCALE);
                C.beginPath();
                    for (let i = 0; i < PTS.length; i++) {
                        C.lineTo(...PTS[i]);
                    }
                    C.translate(
                        TEXT_UNDERLINE_WIDTH_OFFSET * letter.LABEL.hover * -1.25,
                        TEXT_UNDERLINE_WIDTH_OFFSET * letter.LABEL.hover * -0.625
                    );
                    for (let i = PTS.length - 1; i >= 0; i--) {
                        C.lineTo(...PTS[i]);
                    }
                C.fillStyle = COLOR_TEXT_L;
                C.fill();
            }
        }
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

    // if (
    //     x > TERRAIN_MAX_X ||
    //     x < TERRAIN_MAX_X * -1 ||
    //     y < height
    // ) {
    //     return -5;
    // }

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
    return (
        // Ebb
        Math.cos((y + (x * 0.25) + (t * 200)) * 0.125) +

        // Splash waves
        Splash.splashes.reduce((sum, s) => sum + s.getZ(sx, sy), 0) +0

        // Noise
        // (NOISE.get(x, y) * 0.15)
    );
}
