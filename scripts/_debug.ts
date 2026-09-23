import { TARGET_FPS } from "./consts";
import { WIDTH_PAGE_BG_MAX } from "./consts.scss";
import { Canvas } from "./graphics/Canvas";
import { renderSingleIso } from "./graphics/terrain";
import { tTerrain } from "./types";

const
    PROD = false,
    LOG_DT = {
        t: 0,
        dtSum: 0,
        el: document.createElement('div')
    };

export function _DEBUG_logDt(dT: number) {
    if (PROD) {
        return;
    }

    if (!LOG_DT.el.parentElement) {
        document.body.appendChild(LOG_DT.el);
        LOG_DT.el.style.position = 'fixed';
        LOG_DT.el.style.top = '0px';
        LOG_DT.el.style.right = '0px';
        LOG_DT.el.style.padding = '1rem';
        LOG_DT.el.style.color = 'red';
        LOG_DT.el.style.font = '16px "Courier New"';
        LOG_DT.el.style.fontWeight = 'bold';
        LOG_DT.el.innerHTML = '0';
    }

    LOG_DT.t += 1;
    LOG_DT.dtSum += dT;

    if (LOG_DT.t > TARGET_FPS * 0.5) {
        LOG_DT.el.innerHTML = (LOG_DT.dtSum / LOG_DT.t).toFixed(2)
        LOG_DT.t = 0;
        LOG_DT.dtSum = 0;
    }
}

export function _DEBUG_showPreRenderTerrain(CAN_LAND_PRE_RENDER: Canvas) {
    if (PROD) {
        return;
    }

    document.body.appendChild(CAN_LAND_PRE_RENDER.CAN);
    CAN_LAND_PRE_RENDER.CAN.style.position = 'fixed';
    CAN_LAND_PRE_RENDER.CAN.style.top = '0px';
    CAN_LAND_PRE_RENDER.CAN.style.left = '0px';
    CAN_LAND_PRE_RENDER.CAN.style.zIndex = '1000';
}

export function _DEBUG_renderBaseIso(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
) {
    if (PROD) {
        return;
    }

    renderSingleIso(
        ctx,
        x, y,
        0, 0, ['red']
    );
}

export function _DEBUG_showTerrainControls() {
    if (PROD) {
        return;
    }

    const EL = document.createElement('div');
    document.body.appendChild(EL);
    EL.style.position = 'fixed';
    EL.style.padding = '0.5rem';
    EL.style.inset = '0 calc(100% - 200px) auto 0';
    EL.style.backgroundColor = 'white';
    EL.style.zIndex = '1000';
    const PROPS = {
        maxDist:     [  0, 0.5, 0.24 ],
        maxZ:        [ -3,   8, 3.5 ],
        noiseWidth:  [  0, 800, 248 ],
        noiseHeight: [  0,  10, 2.3 ]
    };
    Object
        .entries(PROPS)
        .forEach(o => {
            EL.innerHTML += `
                <strong>${ o[0] }</strong>
                <br/>
                <input
                    type="range"
                    min="${ o[1][0] }"
                    max="${ o[1][1] }"
                    step="any"
                    value="${ o[1][2] }"
                    step="any"
                    oninput="window.terrain_${ o[0] } = event.target.value"
                />
                <br/>
            `;
            (window as any)['terrain_' + o[0]] = o[1][2];
        });
    EL.innerHTML += `
        <br/>
        <button onclick="window.terrain_reseed = 1">
            Reseed
        </button>
        <br/><br/>
        <button onclick="
            ${
                Object
                    .keys(PROPS)
                    .map(p => `console.log('${ p }', window.terrain_${ p });`)
                    .join('')
            }
        ">
            Log
        </button>
        <br/><br/>
    `;
}

export function _DEBUG_updateTerrainControls(peaks: tTerrain[]) {
    if (PROD) {
        return;
    }

    const W = window as any;
    peaks.forEach((p, pi) => {
        if (parseInt(W.terrain_reseed)) {
            console.log(pi, p.noise.reseed());
        }
        const TERRAIN_WIDTH = Math.min(window.innerWidth, WIDTH_PAGE_BG_MAX);
        p.noise.width = parseFloat(W.terrain_noiseWidth) * (TERRAIN_WIDTH / WIDTH_PAGE_BG_MAX);
        p.noise.height = parseFloat(W.terrain_noiseHeight);

        p.dist = (parseFloat(W.terrain_maxDist) * TERRAIN_WIDTH) ** 2;
        p.z = parseFloat(W.terrain_maxZ);
    });
    if (parseInt(W.terrain_reseed)) {
        W.terrain_reseed = 0;
        console.log('------');
    }
}