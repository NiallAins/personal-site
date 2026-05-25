export class Canvas {
    public readonly CAN: HTMLCanvasElement;
    public readonly CTX: CanvasRenderingContext2D;
    public readonly WIDTH: number;
    public readonly HEIGHT: number;

    constructor(id: string, width: number, height: number) {
        this.CAN = id
            ? document.getElementById(id) as HTMLCanvasElement
            : document.createElement('canvas');
        this.CTX = this.CAN.getContext('2d')!;
        this.WIDTH = width;
        this.HEIGHT = height;
        this.CAN.width = this.WIDTH;
        this.CAN.height = this.HEIGHT;
        this.CTX.miterLimit = 1;
        this.CTX.textAlign = 'center';
        this.CTX.textBaseline = 'middle';
    }
}