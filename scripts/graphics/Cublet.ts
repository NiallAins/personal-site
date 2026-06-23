import { CUBLET_SEEDS, ISO_SCALE } from "../consts";
import { tPoint2, tPoint3 } from "../types";
import { Rand, toCamelCase } from "../util";
import { DATA as CUBLET_PIXELS } from "./cublet-pixels.json";

export class Cublet {
    public static readonly CUBLETS: Cublet[] = [];
    public static readonly RANDS: Rand[] = [];

    private readonly _WIDTH: number = ISO_SCALE * 1.5;
    private _PTS: tPoint3[] = [];
    private _PIXELS: number[] | undefined;
    private _X_ANG: number = 0;
    private _Y_ANG: number = 0;
    
    public readonly RAND_X: number;
    public readonly RAND_Y: number;
    public x: number = 0;
    public y: number = 0;
    public isoX?: number;
    public isoY?: number;
    public inSea: boolean = false;
    public sectionI: number = 0;

    constructor(sectionI: number, title: string) {
        this.sectionI = sectionI;
        this._PIXELS = CUBLET_PIXELS[toCamelCase(title)];

        let rand = Cublet.RANDS[sectionI];
        if (!rand) {
            // const SEED = Math.floor(Math.random()*10**10);
            rand = new Rand(CUBLET_SEEDS[sectionI]);
            Cublet.RANDS.push(rand);
        }
        this.RAND_X = rand.get();
        this.RAND_Y = rand.get();

        Cublet.CUBLETS.push(this);
    }

    public setAngle(rand: boolean = false) {
        this._X_ANG = rand ? this.RAND_X * Math.PI * 2 : 0.615;
        this._Y_ANG = rand ? this.RAND_Y * Math.PI * 2 : 0.785 - (this.RAND_Y > 0.5 ? 1.57 : 0);

        this._PTS = [
            [ 1,  1,  1],
            [ 1, -1,  1],
            [-1, -1,  1],
            [-1,  1,  1],
            [ 1,  1, -1],
            [ 1, -1, -1],
            [-1, -1, -1],
            [-1,  1, -1]
        ]
            .map(p => p.map(v => v * this._WIDTH * 0.5))
            .map(p => this._rotatePoint(p as tPoint3));
    }

    private _rotatePoint(p: tPoint3): tPoint3 {
        let [x, y, z] = p;
        p[0] = x*Math.cos(this._Y_ANG) + z*Math.sin(this._Y_ANG);
        p[2] = z*Math.cos(this._Y_ANG) - x*Math.sin(this._Y_ANG);

        [x, y, z] = p;
        p[1] = y*Math.cos(this._X_ANG) - z*Math.sin(this._X_ANG);
        p[2] = y*Math.sin(this._X_ANG) + z*Math.cos(this._X_ANG);

        return p as tPoint3;
    }

    public draw(c: CanvasRenderingContext2D) {
        const PTS = this._PTS as any as tPoint2[];

        c.save();
            c.beginPath();
                for (let i = 0; i < 4; i++) {
                    c.lineTo(...PTS[i]);
                }
                c.lineTo(...PTS[0]);
                for (let i = 4; i < 8; i++) {
                    c.lineTo(...PTS[i]);
                }
                c.lineTo(...PTS[4]);
                for (let i = 1; i < 4; i++) {
                    c.moveTo(...PTS[i]);
                    c.lineTo(...PTS[i + 4]);
                }
            c.stroke();
            if (this._PIXELS) {
                const
                    HALF_W = this._WIDTH * 0.5,
                    PIX_W = (this._PIXELS.length / 3)**0.5;
                for (let y = -HALF_W + 2; y < HALF_W - 2; y++) {
                    for (let x = -HALF_W + 2; x < HALF_W - 2; x++) {
                        const
                            PIX_X = Math.floor(((y + HALF_W) / this._WIDTH) * PIX_W),
                            PIX_Y = Math.floor(((x + HALF_W) / this._WIDTH) * PIX_W),
                            PIX_I = ((PIX_Y * PIX_W) + PIX_X) * 3,
                            [ROT_X, ROT_Y] = this._rotatePoint([x, y, -HALF_W]);
                        c.fillStyle = `rgb(${ this._PIXELS[PIX_I] }, ${ this._PIXELS[PIX_I + 1] }, ${ this._PIXELS[PIX_I + 2] })`;
                        c.fillRect(ROT_X, ROT_Y, 1, 1);
                    }
                }
            }
        c.restore();
    }
}