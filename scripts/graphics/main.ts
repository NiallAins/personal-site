import { SKY_HEIGHT_RATIO, DURATION_SH } from "../consts";
import { Canvas } from "./Canvas";
import { Splash } from "./Splash";
import { Label } from "./Label";
import { init as initTerrain, render as renderTerrain, resize as resizeTerrain } from "./terrain";
import { requestFrameScaled } from "../util";
import { EL_TOPIC_BUTTONS } from "../pages";
import { Cublet } from "./Cublet";
import { PAGE_DATA } from "../data/pages.json";
import { Ease } from "./Ease";
import { _DEBUG_logDt } from "../_debug";
import { eEaseType } from "../types";


//
// Readonly properties
//

const
    CAN_SKY = new Canvas('CAN_SKY'),
    CAN_SEA = new Canvas('CAN_SEA');

export const
    LABELS: Label[] = [],
    CUBLETS: Cublet[][] = PAGE_DATA
        .map((p, pi) => p.items.map(i => new Cublet(pi, i.title)));


//
// State
//

let
    sectionOpen: boolean = false,
    paused: boolean = false,
    fades: Ease[] = [];

export function togglePause() {
    paused = !paused;
}

export function toggleSectionOpen(sectionI: number) {
    sectionOpen = !sectionOpen;
    fades[sectionI].play();
    if (paused) {
        paused = false;
    } else {
        setTimeout(() => paused = true, DURATION_SH * 2);
    }
}


//
// Init
//

export function init() {
    CAN_SEA.CAN.onmousemove = e => Splash.createSplash(e.clientX, e.clientY);
    EL_TOPIC_BUTTONS.forEach((el, i) => {
        LABELS.push(new Label(el, i));
        fades.push(new Ease(DURATION_SH, eEaseType.EaseOut, true));
    });
    LABELS.forEach(l => l.preRender());
    initTerrain();

    window.requestAnimationFrame(() => animate());
}

export function setCanvasSize(pageWidth: number, pageHeight: number) {
    CAN_SKY.setSize(pageWidth, pageHeight * SKY_HEIGHT_RATIO);
    CAN_SEA.setSize(pageWidth, pageHeight);
    LABELS.forEach(l => l.setPosition(pageWidth, pageHeight));
    renderSky(CAN_SKY);
    resizeTerrain(pageWidth, pageHeight);
}


//
// Animation loop
//

function animate(t: number = 0, dT: number = 1) {
    if (!paused) {
        Ease.step(dT);

        renderTerrain(CAN_SEA, fades.map(f => f.value), t, dT);
        t = (t + (0.00075 * dT)) % 1;
    }

    _DEBUG_logDt(dT);
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
