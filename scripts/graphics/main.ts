//
// Animation
//

import {
    SKY_HEIGHT_RATIO,
    ANI_SH,
    EL_LABEL_BUTTONS,
} from "../consts";
import { Canvas } from "./Canvas";
import { Splash } from "./Splash";
import { Label } from "./Label";
import { render as renderTerrain } from "./terrain";
import { msToFrames, requestFrameScaled } from "../util";


//
// Readonly properties
//

const
    ANI_PER_FRAME = 1 / msToFrames(ANI_SH),
    CAN_SKY = new Canvas('CAN_SKY'),
    CAN_SEA = new Canvas('CAN_SEA');

export const
    LABELS = EL_LABEL_BUTTONS.map((el, i) => new Label(el, i));


//
// State
//

let
    sectionOpen: boolean = false,
    paused: boolean = false,
    fade: number = 0;

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
        renderTerrain(CAN_SEA, fade, t, dT);
        t = (t + (0.00075 * dT)) % 1;

        if (sectionOpen && fade < 1) {
            fade += ANI_PER_FRAME * dT;
        } else if (!sectionOpen && fade > 0) {
            fade -= ANI_PER_FRAME * dT;
        }
        fade = Math.max(0, Math.min(1, fade));
    }
    requestFrameScaled(animate.bind(null, t));
}


//
// Sky
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
