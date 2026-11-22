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
    Typescript,
    Canvas,
    Bash,
    VueJS,
    Javascipt,
    NodeJS,
    PHP,
    WebAudio,
    StravaAPI,
    StripeAPI,
    UmamiAnalytics,
    CameraAPI
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
};

export enum eKey {
    ArrowUp = 'up',
    ArrowDown = 'down',
    ArrowLeft = 'left',
    ArrowRight = 'right',
    Space = 'space'
};

export enum eAnalyticsEvent {
    BoatAttempt = 'boat-attempt'
};

export enum eBoatEnd {
    Crash = 'crash',
    Timeout = 'timeout',
    BlurTimeout = 'blur-timeout',
    TouchCrash = 'mobile-crash',
    TouchLand = 'mobile-land',
    Win = 'win'
};


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

export type tProjectData = {
    title: string,
    year: number,
    desc: string[],
    linkLive?: string,
    linkCode?: string,
    externalLink?: boolean,
    tags?: ePageTag[]
};

export type tTopicData = {
    title: string,
    hide?: boolean,
    projects: tProjectData[]
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

export type tBoatAttempt = {
    attempt: number,
    started: boolean,
    cublets: number,
    rolls: number,
    flips: number,
    end: eBoatEnd
};