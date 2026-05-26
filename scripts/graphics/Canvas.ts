export class Canvas {
    public readonly CAN: HTMLCanvasElement;
    public readonly CTX: CanvasRenderingContext2D;

    constructor(id: string, width: number, height: number) {
        this.CAN = id
            ? document.getElementById(id) as HTMLCanvasElement
            : document.createElement('canvas');
        this.CTX = this.CAN.getContext('2d')!;
        this.CAN.width = width;
        this.CAN.height = height;
        this.CTX.miterLimit = 1;
        this.CTX.textAlign = 'center';
        this.CTX.textBaseline = 'middle';
    }
}