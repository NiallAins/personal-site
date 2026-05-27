export class Canvas {
    public readonly CAN: HTMLCanvasElement;
    public readonly CTX: CanvasRenderingContext2D;
    public width: number;
    public height: number;

    constructor(id: string, width: number = 300, height: number = 150) {
        this.CAN = id
            ? document.getElementById(id) as HTMLCanvasElement
            : document.createElement('canvas');
        this.CTX = this.CAN.getContext('2d')!;
        this.width = width;
        this.height = height;
        this.CAN.width = this.width;
        this.CAN.height = this.height;
        this.CTX.miterLimit = 1;
        this.CTX.textAlign = 'center';
        this.CTX.textBaseline = 'middle';
    }

    setSize(width: number, height: number) {
        this.CAN.width = width;
        this.CAN.height = height;
        this.width = width;
        this.height = height;
    }
}