import {
    SKY_HEIGHT_RATIO,
    DURATION_SH, DURATION_PAGE_OPEN, DURATION_PAGE_OPEN_DELAY,
    BREAKPOINT_W_MD,
    ISO_SCALE_LG, ISO_SCALE_SM,
    X_UNIT_SCALE, Y_UNIT_SCALE, Z_UNIT_SCALE, ROW_HEIGHT_SCALE, LABEL_DEPRESS_Z_SCALE, LABEL_LETTER_HEIGHT, LABEL_LINE_HEIGHT, LABEL_Z_SCALE
} from "../consts";
import { Canvas } from "./Canvas";
import { Splash } from "./Splash";
import { Label } from "./Label";
import { init as initTerrain, render as renderTerrain, resize as resizeTerrain } from "./terrain";
import { requestFrameScaled } from "../util";
import { EL_TOPIC_BUTTONS } from "../pages";
import { Cublet } from "./Cublet";
import { PROJECT_DATA } from "../../data/projects.json";
import { Ease } from "./Ease";
import { _DEBUG_log, _DEBUG_logDt } from "../_debug";
import { eEaseState, eEaseType } from "../types";


//
// Readonly properties
//

const
    CAN_SKY = new Canvas('canvas_sky'),
    CAN_SEA = new Canvas('canvas_sea');

export const
    LABELS: Label[] = [],
    CUBLETS: Cublet[][] = PROJECT_DATA
        .map((p, pi) => p.projects.map(i => new Cublet(pi, i.title)));


//
// Properties
//

let
    isViewportSmall: boolean = false,
    paused: boolean = false,
    fades: Ease[] = [],
    sectionOpenTimeout: number = -1;

export let
    isoScale: number = 1,
    xUnit: number = 1,
    yUnit: number = 1,
    zUnit: number = 1,
    rowHeight: number = 1,
    labelIsoZ: number = 1,
    labelDepressZ: number = 1,
    labelLetterSpaceIso: number = 1,
    labelLineHeighteIso: number = 1;
    

export function toggleSectionOpen(open: boolean, sectionI: number = -1) {
    clearTimeout(sectionOpenTimeout);

    if (open) {
        if (sectionI >= 0) {
            fades[sectionI].play(eEaseState.Forward);
        }
        sectionOpenTimeout = setTimeout(
            () => paused = true,
            DURATION_PAGE_OPEN + DURATION_PAGE_OPEN_DELAY
        );
    } else {
        paused = false;
        if (sectionI >= 0) {
            sectionOpenTimeout = setTimeout(
                () => fades[sectionI].play(eEaseState.Backward),
                DURATION_PAGE_OPEN
            );
        }
    }
}


//
// Init
//

export function init() {
    CAN_SEA.CAN.onmousemove = e => Splash.createSplash(e.clientX, e.clientY);
    CAN_SEA.CAN.onclick = e => Splash.createSplash(e.clientX, e.clientY, true);
    EL_TOPIC_BUTTONS.forEach((el, i) => {
        LABELS.push(new Label(el, i));
        fades.push(new Ease(DURATION_SH, eEaseType.EaseOut, true));
    });
    initTerrain();

    window.requestAnimationFrame(() => animate());
}

export function setCanvasSize(pageWidth: number, pageHeight: number, isInitial: boolean) {
    const
        VIEWPORT_SMALL = pageWidth < BREAKPOINT_W_MD,
        BREAKPOINT_HIT = VIEWPORT_SMALL !== isViewportSmall;

    if (BREAKPOINT_HIT || isInitial) {
        isViewportSmall = VIEWPORT_SMALL;

        isoScale            = isViewportSmall ? ISO_SCALE_SM : ISO_SCALE_LG;
        xUnit               = X_UNIT_SCALE * isoScale;
        yUnit               = Y_UNIT_SCALE * isoScale;
        zUnit               = Z_UNIT_SCALE * isoScale;
        rowHeight           = ROW_HEIGHT_SCALE * isoScale;
        labelIsoZ           = LABEL_Z_SCALE * zUnit;
        labelDepressZ       = LABEL_DEPRESS_Z_SCALE * zUnit;
        labelLetterSpaceIso = LABEL_LETTER_HEIGHT / isoScale;
        labelLineHeighteIso = LABEL_LINE_HEIGHT / isoScale;

        LABELS.forEach(l => l.preRender(VIEWPORT_SMALL));
    }

    CAN_SKY.setSize(pageWidth, pageHeight * SKY_HEIGHT_RATIO);
    renderSky(CAN_SKY);
    CAN_SEA.setSize(pageWidth, pageHeight);

    LABELS.forEach(l => l.setPosition(pageWidth, pageHeight));
    resizeTerrain(pageWidth, pageHeight, BREAKPOINT_HIT || isInitial);
}


//
// Animation loop
//

function animate(t: number = 0, dT: number = 1) {
    if (!paused) {
        Ease.step(dT);

        renderTerrain(CAN_SEA, fades.map(f => f.value), t, dT, isViewportSmall);
        t = (t + (0.00075 * dT)) % 1;
    }

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
