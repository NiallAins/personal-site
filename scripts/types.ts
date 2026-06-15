//
// Enums
//

export enum tPageTag {
    Hide,
    Incomplete,
    Vue,
    Javascipt,
    Typescript,
    Canvas
};

export enum eEaseType {
    Linear,
    Ease,
    EaseIn,
    EaseOut,
    Elastic,
    _ElasticIn
};

export enum eEaseState {
    BackwardReverseLoop = -4,
    BackwardReverse = -3,
    BackwardLoop = -2,
    Backward = -1,
    Paused = 0,
    Forward = 1,
    ForwardLoop = 2,
    ForwardReverse = 3,
    ForwardReverseLoop = 4
}


//
// Interfaces
//

export interface iWindow extends Window {
    prevFrameTime: number;
};


//
// Types
//

export type tHTMLEvent = (e: Event) => void;
export type tHTMLTemplateValue = string | number | tHTMLEvent;
export type tHTMLTemplateResult = HTMLElement[];
export type tHTMLTemplateVar = tHTMLTemplateValue | tHTMLTemplateResult;

export type tPageData = {
    label: string,
    items: {
        title: string,
        desc: string,
        linkLive?: string,
        linkCode?: string,
        tags?: tPageTag[]
    }[]
};

export type tPointArr = [
    x: number,
    y: number,
    z?: number
];
export type tPoint = {
    x: number,
    y: number,
    z?: number
};

export type tEaseFunc = (x: number) => number;

export type tSplash = {};
export type tColor = [number, number, number, number];
export type tColorLayers = [number, tColor][];
export type tTerrainSettings = [
    rad: number,
    maxZ: number,
    noiseW: number,
    noiseH: number,
    noiseSeed: number,
    colorLayers: number[]
];
