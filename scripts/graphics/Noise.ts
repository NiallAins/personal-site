import { tPoint } from "../types";


//
// Generates a perlin noise function
//

export class Noise {
    _width: number;
    _height: number;
    _gradients: { [pt: string]: tPoint } = {};
    
    constructor(width: number = 10, height: number = 5) {
        this._width = width;
        this._height = height * 1.438;
    }
    
    get(x: number, y: number = 0): number {
        x /= this._width;
        y /= this._width;
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
    
    _randVect(): tPoint {
        let theta = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(theta),
            y: Math.sin(theta)
        };
    }

    _dotProd(x: number, y: number, vx: number, vy: number): number {
        let
            g_vect,
            d_vect = { x: x - vx, y: y - vy };
        if (this._gradients[[vx, vy].join()]){
            g_vect = this._gradients[[vx,vy].join()];
        } else {
            g_vect = this._randVect();
            this._gradients[[vx, vy].join()] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }

    _smootherStep(x: number): number {
        return 6*x**5 - 15*x**4 + 10*x**3;
    }

    _interp(x: number, a: number, b: number): number {
        return a + this._smootherStep(x) * (b - a);
    }
}