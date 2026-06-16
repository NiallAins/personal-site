import { tPoint } from "../types";


//
// Generates a perlin noise function
//

export class Noise {
    private readonly _RNG = [0x80000000, 1103515245, 12345, 0];
    private _gradients: { [pt: string]: tPoint } = {};
    private _height: number = 1;

    public width: number;
    
    constructor(width: number = 10, height: number = 1, seed: number = 8881155010) {
        this._RNG[3] = seed;
        this.width = width;
        this.height = height;
    }

    set height(v: number) {
        this._height = v * 1.438;
    }

    public reseed(): number {
        this._gradients = {};
        this._RNG[3] = Math.floor(Math.random()*10**10);
        return this._RNG[3];
    }
    
    public get(x: number, y: number = 0): number {
        x /= this.width;
        y /= this.width;
        let
            xf = Math.floor(x),
            yf = Math.floor(y),
            tl = this._dotProd(x, y, xf, yf),
            tr = this._dotProd(x, y, xf + 1, yf),
            bl = this._dotProd(x, y, xf, yf + 1),
            br = this._dotProd(x, y, xf + 1, yf + 1),
            xt = this._interp(x - xf, tl, tr),
            xb = this._interp(x - xf, bl, br),
            v = this._interp(y - yf, xt, xb);
        return this._height * v;
    }

    private _rand(x: number, y: number): number {
        const C = (Math.floor(x) * 123) + (Math.floor(y) * 321);
        return ((C *this._RNG[1] * this._RNG[3] + this._RNG[2]) % this._RNG[0]) / this._RNG[0];
    }
    
    private _randVect(x: number, y: number): tPoint {
        const THETA = this._rand(x, y) * 2 * Math.PI;
        return {
            x: Math.cos(THETA),
            y: Math.sin(THETA)
        };
    }

    private _dotProd(x: number, y: number, vx: number, vy: number): number {
        let
            g_vect,
            d_vect = { x: x - vx, y: y - vy };
        if (this._gradients[[vx, vy].join()]){
            g_vect = this._gradients[[vx,vy].join()];
        } else {
            g_vect = this._randVect(x, y);
            this._gradients[[vx, vy].join()] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }

    private _smootherStep(x: number): number {
        return 6*x**5 - 15*x**4 + 10*x**3;
    }

    private _interp(x: number, a: number, b: number): number {
        return a + this._smootherStep(x) * (b - a);
    }
}