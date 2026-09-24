import { Noise } from "./graphics/Noise";

//
// Enums
//

export enum ePages {
    Main,
    Contact,
    Experience,
    Topic,
    Project
};

export enum ePageTag {
    VueJS,
    Javascipt,
    Typescript,
    Canvas,
    NodeJS,
    Bash,
    Stripe,
    PHP
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

export type tPageDataItem = {
    title: string,
    year: number,
    desc: string[],
    linkLive?: string,
    linkCode?: string,
    tags?: ePageTag[]
};

export type tPageData = {
    label: string,
    items: tPageDataItem[]
};

export type tPoint2 = [
    x: number,
    y: number
];
export type tPoint3 = [
    x: number,
    y: number,
    z: number
];

export type tEaseFunc = (x: number) => number;

export type tSplash = {};
export type tColor = [number, number, number, number];
export type tColorLayers = [number, tColor][];
export type tTerrainParams = [
    dist: number,
    z: number,
    noiseW: number,
    noiseH: number,
    noiseSeed: number,
    colorLayers: number[]
];
export type tTerrain = {
    x: number,
    y: number,
    z: number,
    distBase: number,
    dist: number,
    color: tColorLayers,
    noiseWidthBase: number,
    noise: Noise
};