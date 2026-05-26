import { TARGET_FPS } from "./consts";
import { iWindow } from "./types";

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

export function msToFrames(ms: number) {
    return (ms / 1000) * TARGET_FPS;
}

export function getCssVar(varName: string): string {
    return getComputedStyle(document.body).getPropertyValue('--' + varName);
}

export function getEl<tEl>(query: string): tEl {
    return document.querySelectorAll(query) as tEl;
}

export function getEls<tEl>(query: string): tEl[] {
    return  Array.from(document.querySelectorAll(query)) as tEl[];
}

export async function loadFont(name: string, src: string) {
    const F = await new FontFace(name, src).load();
    document.fonts.add(F);
    
        console.log('loaded');
    return;
}