//
// Animation
//

import { Canvas } from "./Canvas";
import { Noise } from "./Noise";
import { Splash } from "./Splash";
import {
    SKY_HEIGHT_RATIO,
    ISO_SCALE,
    EL_SECTION_LABELS,
    TERRAIN_SEA,
    TERRAIN,
    ANI_SH,
    CLASS_CAN_SEA_LOWER,
} from "../consts";
import { msToFrames, requestFrameScaled } from "../util";
import { Label, LabelLetter } from "./Label";


//
// Readonly properties
//

const
    ANI_PER_FRAME = 1 / msToFrames(ANI_SH),
    NOISE = new Noise(),
    LABELS = EL_SECTION_LABELS.map((_, i) => new Label(i)),
    CAN_SKY = new Canvas('CAN_SKY'),
    CAN_SEA = new Canvas('CAN_SEA');


//
// State
//

let
    sectionOpen: boolean = false,
    transFade: number = 0,
    paused: boolean = false;

export function togglePause() {
    paused = !paused;
}

export function toggleSectionOpen() {
    sectionOpen = !sectionOpen;
}


//
// Init
//

export function init() {
    CAN_SEA.CAN.onmousemove = e => Splash.createSplash(e.clientX, e.clientY);
    LABELS.forEach(l => l.draw());
    animate();
}

export function setCanvasSize(pageWidth: number, pageHeight: number) {
    CAN_SKY.setSize(pageWidth, pageHeight * SKY_HEIGHT_RATIO);
    CAN_SEA.setSize(pageWidth, pageHeight);
    LABELS.forEach(l => l.setPosition(pageWidth, pageHeight));
    renderSky(CAN_SKY.CTX);
}


//
// Animation loop
//

function animate(t: number = 0, dT: number = 1) {
    if (!paused) {
        renderTerrain(CAN_SEA, t, dT);
        t = (t + (0.00075 * dT)) % 1;
    }
    if (sectionOpen && transFade < 1) {
        if (transFade === 0) {
            CAN_SEA.CAN.classList.add(CLASS_CAN_SEA_LOWER);
        }
        transFade += ANI_PER_FRAME * dT;
    } else if (!sectionOpen && transFade > 0) {
        if (transFade === 1) {
            CAN_SEA.CAN.classList.remove(CLASS_CAN_SEA_LOWER);
        }
        transFade -= ANI_PER_FRAME * dT;
    }
    transFade = Math.max(0, Math.min(1, transFade));
    requestFrameScaled(animate.bind(null, t));
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

function ptToScreen(x: number, y: number): [number, number] {
    x *= ISO_SCALE;
    y *= ISO_SCALE;

    x = y - x,
        y = y - x * 0.5;

    x /= -0.5;
    y /= 0.5;

    return [x, y - window.scrollY];
}

function getLandZ(x: number, y: number, width: number, height: number): number {
    y += window.scrollY;
    if (
        x > width ||
        y < height ||
        y > height * 3.6
    ) {
        return -5;
    }
    const
        PHASE_X = width / 28,
        PHASE_Y = height * 0.55,
        PHASE_Z = -3,
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
        Splash.splashes.reduce((sum, s) => sum + s.getZ(sx, sy), 0) +

        // Noise
        (NOISE.get(x, y) * 0.15)
    );
}


//
// Render functions
//

function renderSky(c: CanvasRenderingContext2D) {
    for (let i = 0; i < 50; i++) {
        const
            X = Math.random() * c.canvas.width,
            Y = Math.random() * c.canvas.height;
        c.fillStyle = `hsl(${Math.floor(Math.random() * 360)}deg, 100%, 90%)`
        c.save();
            c.translate(X, Y);
            c.rotate(0.785);
            const W = 1 + (Math.random() * 2);
            c.fillRect(0, 0, W, W);
        c.restore();
    }
}

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

function renderTerrain(can: Canvas, t: number, dT: number) {
    const C = can.CTX;

    C.clearRect(0, 0, can.width, can.height);

    // Draw isometic
    C.save();
        C.translate(0, window.scrollY * -1);
        let offsetRow = false;
        LABELS.forEach(l => l.toggleClick(false));
        LABELS.forEach(l => l.hover && l.hover < 1 ? l.hover += 0.2 * dT : null);
        const MAX_Y = (can.height * (transFade === 1 ? 0.4 : 1)) + window.scrollY + (ISO_SCALE * 10);
        for (
            let y = Math.max(can.height * 0.75, window.scrollY - (ISO_SCALE * 6));
            y < MAX_Y;
            y += ISO_SCALE
        ) {
            const ROW = Math.floor(y / ISO_SCALE) - 80;
            if (ROW >= 0 && ROW < 150 && ROW % 30 === 0) {
                const
                    SY = y - window.scrollY,
                    DY = SY < 500 ? Math.pow((1 - ((SY - 200) / 300)) * 10.5, 2) : 0,
                    Y = y + DY - (ISO_SCALE * 10),
                    I = ROW / 30;
                if (DY < 180) {
                    LABELS[I].toggleClick(true);
                    LABELS[I].setY(Y - 945);
                }
            }

            offsetRow = !offsetRow;
            for (let x = 0; x < can.width + (ISO_SCALE * 4); x += ISO_SCALE * 4) {
                const
                    ISO_PT = ptFromScreen(
                        x + (offsetRow ? ISO_SCALE * 2 : 0),
                        y
                    ),
                    SCR_PT = ptToScreen(ISO_PT[0], ISO_PT[1]);

                renderTerrainIso(
                    can,
                    t,
                    ISO_PT[0], ISO_PT[1],
                    SCR_PT[0], SCR_PT[1]
                );
            }
        }
        
        Splash.splashes.forEach(s => s.step(dT));
    C.restore();
}

// Draw isometic terrain blocks for one x, y point
function renderTerrainIso(
    can: Canvas,
    t: number,
    x: number, y: number,
    sx: number, sy: number
) {
    const
        LAND_Z = getLandZ(sx, sy, can.width, can.height),
        SEA_Z = getSeaZ(t, x, y, sx, sy),
        MIN_Z = -3,
        FADE_Z = sy < 450 ? Math.pow((1 - ((sy - 170) / 280)) * 1.9, 2) : 0;

    // Render land
    if (LAND_Z > MIN_Z) {
        renderSingleIso(
            can.CTX,
            x, y,
            MIN_Z - FADE_Z, LAND_Z - FADE_Z,
            getTerrainColor(LAND_Z, false)
        );
    }

    // Render sea
    if (
        SEA_Z >= LAND_Z &&
        sy > 0 &&
        sy < window.innerHeight + ISO_SCALE * 4
    ) {
        let label;
        for (let i = 0; i < LABELS.length; i++) {
            label = LABELS[i].findLetter(x, y);
            if (label) {
                break;
            }
        }
        renderSingleIso(
            can.CTX,
            x, y,
            Math.max(LAND_Z, SEA_Z - 2) - FADE_Z, SEA_Z - FADE_Z,
            getTerrainColor(SEA_Z - LAND_Z, true),
            label
        );
    }
}

// Draw a single isometic block
function renderSingleIso(
    c: CanvasRenderingContext2D,
    x: number, y: number,
    z0: number, z: number,
    color: string[],
    letter?: LabelLetter
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

        if (letter) {
            c.scale(1 / -ISO_SCALE, 1 / ISO_SCALE);
            c.globalAlpha = Math.max(0, 1 - transFade);
            
            // Shdaow
            c.drawImage(
                letter.CAN_BG,
                2.25 * -ISO_SCALE,
                -3.5 * ISO_SCALE
            );

            // Letter
            c.drawImage(
                letter.CAN_FG,
                -2 * ISO_SCALE,
                (-5 - (letter.LABEL.hover ? 2 * Math.min(letter.LABEL.hover, 1) : 0)) * ISO_SCALE
            );
        }

    c.restore();
}