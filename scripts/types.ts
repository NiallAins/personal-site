export interface iWindow extends Window {
    prevFrameTime: number;
};

export type tPageData = {
    title: string,
    desc: string,
    img: string,
    demo: string,
    code: string
};

export type tPointArr = [ number, number ];
export type tPoint = {
    x: number,
    y: number
};

export type tSplash = {};
export type tTerrainDetail = [number, number[]];

