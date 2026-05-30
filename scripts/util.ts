import { TARGET_FPS } from "./consts";
import { iWindow, tHTMLEvent, tHTMLTemplateResult, tHTMLTemplateVar } from "./types";

declare const window: iWindow;
export function requestFrameScaled(
    cb: (dt: number) => void,
    fps = TARGET_FPS
) {
    const
        T = +new Date(),
        DT = Math.min(T - (window.prevFrameTime || T), 1000);
    window.prevFrameTime = T;
    window.requestAnimationFrame(() => cb(DT / fps));
};

const LOG_DT = {
    t: 0,
    dtSum: 0,
    el: document.createElement('div')
};
export function logDt(dT: number) {
    if (!LOG_DT.el.parentElement) {
        document.body.appendChild(LOG_DT.el);
        LOG_DT.el.style.position = 'fixed';
        LOG_DT.el.style.top = '0px';
        LOG_DT.el.style.left = '0px';
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

export function msToFrames(ms: number) {
    return (ms / 1000) * TARGET_FPS;
}

export function getEl<tEl extends HTMLElement = HTMLDivElement>(query: string): tEl {
    return document.querySelector(query) as tEl;
}

export function getEls<tEl extends HTMLElement = HTMLDivElement>(query: string): tEl[] {
    return  Array.from(document.querySelectorAll(query)) as tEl[];
}

export async function loadFont(name: string, src: string) {
    try {
        const F = await new FontFace(name, src).load();
        document.fonts.add(F);
    } catch (e) {
        console.warn('Font unavailable');
    }
    return;
}

export function toCamelCase(text: string): string {
    return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z-]/g, '');
}

export function html(
    strs: TemplateStringsArray,
    ...vars: (tHTMLTemplateVar | tHTMLTemplateVar[])[]
): tHTMLTemplateResult {
    const
        STRS = Array.from(strs),
        CHILD_RESULTS: tHTMLTemplateResult[] = [],
        EVENTS: [string, tHTMLEvent][] = [],
        EL_TEMP = document.createElement('div');

    // Flatten array vars
    // debugger;
    vars = vars.flatMap((v, vi) => {
        if (typeof v === 'object' && !v[0].hasOwnProperty('tagName')) {
            STRS.splice(vi + 1, 0, ...new Array(v.length - 1).fill(''));
            return v as tHTMLTemplateVar[];
        }
        return [v];
    });
    
    EL_TEMP.innerHTML = STRS
        .map((s, si, sarr) => {
            // Store child results
            if (typeof vars[si] === 'object') {
                CHILD_RESULTS.push(vars[si] as tHTMLTemplateResult);
                return s + `<div _child="${ CHILD_RESULTS.length - 1}"></div>`;
            }

            // Store events
            if (typeof vars[si] === 'function') {
                return s.replace(
                    /([^\s=]+)\s*=\s*(["']?)$/,
                    (_, eventName, quote) => {
                        EVENTS.push([
                            eventName.replace(/^on/, ''),
                            vars[si] as tHTMLEvent
                        ]);
                        return `_event=${ quote }${ EVENTS.length - 1}`;
                    }
                );
            }

            // Concat with var values
            return si === sarr.length - 1 ? s : s + vars[si];
        })
        .join('')

        // Tag capture elements
        .replace(
            /<#([^\s>]+)/g,
            (_, tagName) => `<${ tagName } _capture`
        );

    // Apply event listeners
    EVENTS.forEach((e, i) => {
        const EL = EL_TEMP.querySelector(`[_event="${ i }"]`)!;
        EL.addEventListener(...e);
        EL.removeAttribute('_event');
    });

    // Capture elements
    const EL_CAPTURES = Array.from(EL_TEMP.querySelectorAll('[_capture]')) as HTMLElement[];
    EL_CAPTURES.forEach(el => el.removeAttribute('_capture'));

    // Insert child results
    CHILD_RESULTS.forEach((els, i) => {
        const EL = EL_TEMP.querySelector(`[_child="${ i }"]`)!;
        EL.insertAdjacentElement('beforebegin', els[0]);
        EL.parentElement?.removeChild(EL);
    });

    return [
        EL_TEMP.children[0] as HTMLElement,
        ...EL_CAPTURES,
        ...CHILD_RESULTS
            .map(c => c.slice(1))
            .flat()
    ];
}