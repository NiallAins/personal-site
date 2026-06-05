//
// Animation
//

import { SKY_HEIGHT_RATIO, ANI_SH, WIDTH_PAGE_MAX } from "../consts";
import { Canvas } from "./Canvas";
import { Splash } from "./Splash";
import { Label } from "./Label";
import { render as renderTerrain } from "./terrain";
import { msToFrames, requestFrameScaled } from "../util";
import { EL_TOPIC_BUTTONS } from "../pages";
import { Cublet } from "./Cublet";
import { PAGE_DATA } from "../pages.json";


//
// Readonly properties
//

const
    ANI_PER_FRAME = 1 / msToFrames(ANI_SH),
    CAN_SKY = new Canvas('CAN_SKY'),
    CAN_SEA = new Canvas('CAN_SEA');

export const
    LABELS: Label[] = [],
    CUBLETS: Cublet[][] = PAGE_DATA
        .map(p => p.items.map(i => new Cublet()))


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
    paused = !paused;
}


//
// Init
//

export function init() {
    CAN_SEA.CAN.onmousemove = e => Splash.createSplash(e.clientX, e.clientY);
    EL_TOPIC_BUTTONS.forEach((el, i) => LABELS.push(new Label(el, i)));
    LABELS.forEach(l => l.preRender());
    CUBLETS.forEach((t, ti) => {
        t.forEach(c => {
            c.x =
                (CAN_SEA.width * 0.5) + (
                    (Math.random() * Math.min(CAN_SEA.width, WIDTH_PAGE_MAX) * 0.5) *
                    (ti % 2 ? -1 : 1)
                );
            c.y = ((ti + 2) * CAN_SEA.height * 0.5) + (Math.random() * CAN_SEA.height * 0.5);
        });
    });

    animate();
}

export function setCanvasSize(pageWidth: number, pageHeight: number) {
    CAN_SKY.setSize(pageWidth, pageHeight * SKY_HEIGHT_RATIO);
    CAN_SEA.setSize(pageWidth, pageHeight);
    LABELS.forEach(l => l.setPosition(pageWidth, pageHeight));
    renderSky(CAN_SKY);
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
    // logDt(dT);
    requestFrameScaled(animate.bind(null, t));
}


//
// Sky
//

function renderSky(can: Canvas) {
    for (let i = 0; i < 50; i++) {
        const
            X = Math.random() * can.width,
            Y = Math.random() * can.height;
        can.CTX.fillStyle = `hsl(${Math.floor(Math.random() * 360)}deg, 100%, 90%)`
        can.CTX.save();
            can.CTX.translate(X, Y);
            can.CTX.rotate(0.785);
            const W = 1 + (Math.random() * 2);
            can.CTX.fillRect(0, 0, W, W);
        can.CTX.restore();
    }
}
