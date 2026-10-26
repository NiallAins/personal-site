import { CAN_QUALITY } from "../consts";

export class Canvas {
    public readonly CAN: HTMLCanvasElement;
    public readonly CTX: CanvasRenderingContext2D;
    public width: number = 300;
    public height: number = 150;

    constructor(id: string = '', width?: number, height?: number) {
        this.CAN = id
            ? document.getElementById(id) as HTMLCanvasElement
            : document.createElement('canvas');
        this.CTX = this.CAN.getContext('2d')!;

        if (width) {
            this.setSize(width, height || width);
        }
    }

    public setSize(width: number, height: number) {
        width = Math.floor(width);
        height = Math.floor(height);
        
        this.width = width;
        this.height = height;
        this.CAN.width = width * CAN_QUALITY;
        this.CAN.height = height * CAN_QUALITY;
        this.CAN.style.width = width + 'px';
        this.CAN.style.height = height + 'px';

        this.CTX.miterLimit = 1;
        this.CTX.textAlign = 'center';
        this.CTX.textBaseline = 'middle';
        this.CTX.scale(CAN_QUALITY, CAN_QUALITY);
    }
    
    // Draw contents from another canvas, adjusting for CAN_QUALITY scaling
    public drawFromCanvas(
        can: HTMLCanvasElement,
        x: number, y: number,
        w?: number, h?: number,
        dx?: number, dy?: number,
    ): void {
        if (w === undefined) {
            this.CTX.save();
                this.CTX.scale(1 / CAN_QUALITY, 1 / CAN_QUALITY);
                this.CTX.drawImage(
                    can,
                    x * CAN_QUALITY, y * CAN_QUALITY
                );
            this.CTX.restore();
        } else {
            this.CTX.save();
                this.CTX.drawImage(
                    can,
                    x * CAN_QUALITY, y * CAN_QUALITY,
                    w * CAN_QUALITY, h! * CAN_QUALITY,
                    dx!, dy!,
                    w, h!
                );
            this.CTX.restore();
        }
    }
}