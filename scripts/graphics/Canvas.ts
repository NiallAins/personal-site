import { CAN_QUALITY } from "../consts";

export class Canvas {
    public readonly CAN: HTMLCanvasElement;
    public readonly CTX: CanvasRenderingContext2D;
    public width: number = 300;
    public height: number = 150;

    constructor(id: string, width?: number, height?: number, preventScale?: boolean) {
        this.CAN = id
            ? document.getElementById(id) as HTMLCanvasElement
            : document.createElement('canvas');
        this.CTX = this.CAN.getContext('2d')!;

        if (width) {
            this.setSize(width, height || width, preventScale);
        }
    }

    public setSize(width: number, height: number, preventScale: boolean = false) {
        const QUALITY = preventScale ? 1 : CAN_QUALITY;
        this.width = width;
        this.height = height;
        this.CAN.width = width * QUALITY;
        this.CAN.height = height * QUALITY;
        this.CAN.style.width = width + 'px';
        this.CAN.style.height = height + 'px';

        this.CTX.miterLimit = 1;
        this.CTX.textAlign = 'center';
        this.CTX.textBaseline = 'middle';
        this.CTX.scale(QUALITY, QUALITY);
    }
}