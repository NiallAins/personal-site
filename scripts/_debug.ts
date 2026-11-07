import { TARGET_FPS } from "./consts";
import { WIDTH_PAGE_BG_MAX } from "./consts.scss";
import { Canvas } from "./graphics/Canvas";
import { renderSingleIso } from "./graphics/terrain";
import { tTerrain } from "./types";

const
    PROD = false,
    LOG = {
        t: 0,
        dtSum: 0,
        dtRecord: [] as number[],
        dtRecordMax: 15,
        elDt: document.createElement('div'),
        elLog: document.createElement('div'),
    };

export function _DEBUG_log(...strs: any[]) {
    _DEBUG_renderLog(false, ...strs);
}

export function _DEBUG_logClear() {
    if (PROD) {
        return;
    }
    LOG.elLog.innerHTML = '';
}

export function _DEBUG_logDt(dT: number) {
    if (PROD) {
        return;
    }

    LOG.t += 1;
    LOG.dtSum += dT;
    
    if (LOG.t > TARGET_FPS * 0.5) {
        const DT = LOG.dtSum / LOG.t;
        LOG.dtRecord.push(DT);
        _DEBUG_renderLog(
            true,
            'dt ' + DT.toFixed(2),
            'max ' + Math.max(...LOG.dtRecord).toFixed(2)
        );
        LOG.t = 0;
        LOG.dtSum = 0;
        if (LOG.dtRecord.length > LOG.dtRecordMax) {
            LOG.dtRecord.shift();
        }
    }
}

function _DEBUG_renderLog(isDt: boolean, ...strs: any[]) {
    if (PROD) {
        return;
    }
    
    if (!LOG.elDt.parentElement) {
        const EL_CONTAIN = document.createElement('div');
        document.body.appendChild(EL_CONTAIN);
        EL_CONTAIN.appendChild(LOG.elDt);
        EL_CONTAIN.appendChild(LOG.elLog);
        EL_CONTAIN.style.position = 'fixed';
        EL_CONTAIN.style.top = '0px';
        EL_CONTAIN.style.right = '0px';
        EL_CONTAIN.style.padding = '1rem';
        EL_CONTAIN.style.color = 'red';
        EL_CONTAIN.style.font = '16px "Courier New"';
        EL_CONTAIN.style.fontWeight = 'bold';
        EL_CONTAIN.style.textAlign = 'right';
        EL_CONTAIN.id = 'DEBUG';
    }

    const STR = strs
    .map(s => typeof s === 'object'
        ? JSON.stringify(s)
        : String(s)
    )
    .join('<br/>')
    .replace(/([0-9]\.[0-9]{0,2})[0-9]*/g, '$1');

    if (isDt) {
        LOG.elDt.innerHTML = STR + '<br/>';
    } else {
        LOG.elLog.innerHTML += STR + '<br/>';
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