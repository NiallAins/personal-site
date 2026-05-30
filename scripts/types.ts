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

export type tPointArr = [ number, number ];
export type tPoint = {
    x: number,
    y: number
};

export type tSplash = {};
export type tTerrainDetail = [number, number[]];

