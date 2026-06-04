import { COLOR_BG_L, COLOR_TEXT_L, ISO_SCALE, TERRAIN, TERRAIN_SEA, WIDTH_PAGE_MAX, WIDTH_STROKE_UNDERLINE } from "../consts";
import { LABELS } from "./main";
import { Canvas } from "./Canvas";
import { LabelLetter } from "./Label";
import { Noise } from "./Noise";
import { Splash } from "./Splash";


//
// Properties
//

export const
    NOISE = new Noise();

const
    ROW_OVERSHOOT_MIN = -4,
    ROW_OVERSHOOT_MAX = 8,
    ROW_OVERSHOOT_MIN_LETTER = 14,
    LETTER_Z = 3,
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
        C.translate(0, window.scrollY * -1);
        let offsetRow = false;
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
            MIN_Y = Math.max(can.height * 0.75, window.scrollY - (ISO_SCALE * ROW_OVERSHOOT_MIN)),
            MAX_Y = (can.height * (fade === 1 ? 0.4 : 1)) + window.scrollY + (ISO_SCALE * ROW_OVERSHOOT_MAX),
            LETTERS = LabelLetter.LETTERS.filter(l => l.screenY > MIN_Y && l.screenY < MAX_Y);

        // Render "over the horizon" letters
        LabelLetter
            .LETTERS
            .filter(l => (
                l.screenY < MIN_Y &&
                l.screenY > MIN_Y - (ISO_SCALE * ROW_OVERSHOOT_MIN_LETTER)
            ))    
            .forEach(l => {
                const HORIZON_DROP = horizonZDrop(
                    ptToScreen(...ptFromScreen(
                        l.y % 2 ? 0 : ISO_SCALE * 2,
                        l.screenY
                    ))[1]
                );
                renderLetter(
                    can.CTX,
                    fade,
                    0,
                    HORIZON_DROP,
                    l,
                    true
                )
            });

        // Render terrain, with letters
        for (let y = MIN_Y; y < MAX_Y; y += ISO_SCALE) {
            offsetRow = !offsetRow;

            const HORIZON_DROP = horizonZDrop(
                ptToScreen(...ptFromScreen(
                    offsetRow ? ISO_SCALE * 2 : 0,
                    y
                ))[1]
            );

            for (let x = 0; x < can.width + (ISO_SCALE * 4); x += ISO_SCALE * 4) {
                const
                    ISO_PT = ptFromScreen(
                        x + (offsetRow ? ISO_SCALE * 2 : 0),
                        y
                    ),
                    SCR_PT = ptToScreen(...ISO_PT);

                renderTerrainIso(
                    can,
                    fade,
                    t,
                    ISO_PT[0], ISO_PT[1],
                    SCR_PT[0], SCR_PT[1],
                    HORIZON_DROP,
                    LETTERS.find(l => l.x === ISO_PT[0] && l.y === ISO_PT[1])
                );
            }
        }
        
        Splash.splashes.forEach(s => s.step(dT));
    C.restore();
}

// Draw isometic terrain blocks for one x, y point
function renderTerrainIso(
    can: Canvas,
    fade: number,
    t: number,
    x: number, y: number,
    sx: number, sy: number,
    horizonDrop: number,
    letter?: LabelLetter
) {
    const
        LAND_Z = getLandZ(sx, sy, can.width, can.height),
        SEA_Z = getSeaZ(t, x, y, sx, sy),
        MIN_Z = -3;

    // Render land
    if (LAND_Z > MIN_Z) {
        renderSingleIso(
            can.CTX,
            x, y,
            MIN_Z - horizonDrop, LAND_Z - horizonDrop,
            getTerrainColor(LAND_Z, false)
        );
    }

    // Render sea
    if (SEA_Z >= LAND_Z) {
        renderSingleIso(
            can.CTX,
            x, y,
            Math.max(LAND_Z, SEA_Z - 2) - horizonDrop, SEA_Z - horizonDrop,
            getTerrainColor(SEA_Z - LAND_Z, true)
        );
    }

    // Render letter
    if (letter) {
        renderLetter(
            can.CTX,
            fade,
            Math.max(LAND_Z, SEA_Z),
            horizonDrop,
            letter
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
    c: CanvasRenderingContext2D,
    fade: number,
    terrainZ: number,
    horizonDrop: number,
    letter: LabelLetter,
    noShadow: boolean = false
) {
    terrainZ *= 2;
    horizonDrop *= 2;
    
    c.save();
        c.globalAlpha = Math.max(0, 1 - fade);

        if (!noShadow) {
            c.translate(
                ((letter.x * 2) + (letter.y * -2)) * ISO_SCALE,
                (letter.x + letter.y - terrainZ + horizonDrop) * ISO_SCALE
            );

            // Shdaow
            if (!noShadow) {
                c.drawImage(
                    letter.CAN_BG,
                    2.25 * -ISO_SCALE,
                    -3.5 * ISO_SCALE
                );
            }

            c.translate(0, (terrainZ - LETTER_Z) * ISO_SCALE);
        } else {
             c.translate(
                ((letter.x * 2) + (letter.y * -2)) * ISO_SCALE,
                (letter.x + letter.y - LETTER_Z + horizonDrop) * ISO_SCALE
            );
        }

        // Letter
        c.textRendering
        c.drawImage(
            letter.CAN_FG,
            -2 * ISO_SCALE,
            -5 * ISO_SCALE
        );

        // Underline
        if (letter.LAST_LINE) {
            letter.LABEL.setY(horizonDrop * ISO_SCALE);
            
            if (letter.LABEL.hover) {
                const PTS: [number, number][] = letter.LABEL.LETTERS
                    .slice(letter.LABEL.LETTERS.length - letter.LAST_LINE)
                    .map((l, li) => [
                        3 + (li * 4),
                        -2 - (li * 2) +
                        horizonZDrop(
                            ptToScreen(...ptFromScreen(
                                l.y % 2 ? 0 : ISO_SCALE * 2,
                                l.screenY
                            ))[1]
                        ) * 2
                    ]);
                PTS.unshift([
                    PTS[0][0] - ((PTS[1][0] - PTS[0][0]) * 0.4),
                    PTS[0][1] - ((PTS[1][1] - PTS[0][1]) * 0.4)
                ]);
                PTS.push([
                    PTS[PTS.length - 1][0] - ((PTS[PTS.length - 2][0] - PTS[PTS.length - 1][0]) * 0.2),
                    PTS[PTS.length - 1][1] - ((PTS[PTS.length - 2][1] - PTS[PTS.length - 1][1]) * 0.2)
                ]);
                c.scale(ISO_SCALE, ISO_SCALE);
                c.translate(0, -horizonDrop);
                c.beginPath();
                    for (let i = 0; i < PTS.length; i++) {
                        c.lineTo(...PTS[i]);
                    }
                    c.translate(
                        TEXT_UNDERLINE_WIDTH_OFFSET * letter.LABEL.hover * -1.25,
                        TEXT_UNDERLINE_WIDTH_OFFSET * letter.LABEL.hover * -0.625
                    );
                    for (let i = PTS.length - 1; i >= 0; i--) {
                        c.lineTo(...PTS[i]);
                    }
                c.fillStyle = COLOR_TEXT_L;
                c.fill();
            }
        }
    c.restore();
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

function horizonZDrop(y: number) {
    return y < 450 ? Math.pow((1 - ((y - 170) / 280)) * 1.9, 2) : 0;
}

function getLandZ(x: number, y: number, width: number, height: number): number {
    return -3;
    y += window.scrollY; 

    x -= width * 0.5;

    const
        MAX_WIDTH = Math.min(width, WIDTH_PAGE_MAX),
        MAX_Z = 4,
        MIN_Z = -10,
        MIN_Y = height,
        OFF_X = MAX_WIDTH * 0.25,
        LAND_NOISE = 0.25,
        PERIOD = width * 0.25,
        PERIOD_Y = height * 0.5,
        RANGE_Z = MAX_Z - LAND_NOISE - (MIN_Z + LAND_NOISE);

    let amp = MIN_Z + LAND_NOISE + (RANGE_Z * 0.5);

    for (let i = 0; i < LABELS.length; i += 1) {
        amp += 
            RANGE_Z * 0.5 *
            Math.cos((x + (OFF_X * (i % 2 ? -1 : 1))) / PERIOD) *
            Math.sin((y + MIN_Y) / PERIOD);
    }

    // amp += NOISE.get(x / 32, y / 32) * 0.25;

    return amp;

    // if (
    //     x > TERRAIN_MAX_X ||
    //     x < TERRAIN_MAX_X * -1 ||
    //     y < height
    // ) {
    //     return -5;
    // }

    // // Islands
    // const
    //     PHASE_X = width * 0.5,
    //     PHASE_Y = height * 0.5,
    //     PHASE_Z = -1,
    //     PERIOD_X = width / 6,
    //     PERIOD_Y = height / 6,
    //     AMP = 5;
    // return (
    //     PHASE_Z +
    //     (
    //         AMP *
    //         Math.sin((x + PHASE_X) / PERIOD_X) *
    //         Math.sin((y + PHASE_Y) / PERIOD_Y)
    //     ) +
    //     (NOISE.get(x / 32, y / 32) * 0.25)
    // );
}

function getSeaZ(t: number, x: number, y: number, sx: number, sy: number): number {
    return (
        // Ebb
        Math.cos((y + (x * 0.25) + (t * 200)) * 0.125) +

        // Splash waves
        Splash.splashes.reduce((sum, s) => sum + s.getZ(sx, sy), 0) +

        // Noise
        (NOISE.get(x, y) * 0.15)
    );
}