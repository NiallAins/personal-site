import { HEIGHT_MAIN_SECTION, HEIGHT_MAIN_SECTION_GAP, ISO_SCALE, WIDTH_PAGE_MAX } from "../consts";
import { tPointArr } from "../types";

export class Cublet {
    public static readonly CUBLETS: Cublet[] = [];

    private readonly _WIDTH: number = ISO_SCALE * 1.5;
    private _PTS: tPointArr[] = [];
    
    public readonly RAND_X: number = Math.random();
    public readonly RAND_Y: number = Math.random();
    public x: number = 0;
    public y: number = 0;
    public isoX?: number;
    public isoY?: number;
    public inSea: boolean = false;
    public sectionI: number = 0;
    public drawen: boolean = false;

    constructor(sectionI: number) {
        this.sectionI = sectionI;
        Cublet.CUBLETS.push(this);
    }

    public setAngle(rand: boolean = false) {
        const
            X_ANG = rand ? this.RAND_X * Math.PI * 2 : 0.615,
            Y_ANG = rand ? this.RAND_Y * Math.PI * 2 : 0.785,
            X_ANG_C = Math.cos(X_ANG),
            X_ANG_S = Math.sin(X_ANG),
            Y_ANG_C = Math.cos(Y_ANG),
            Y_ANG_S = Math.sin(Y_ANG);

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
            .map(p => {
                let [x, y, z] = p;
                p[0] = x*Y_ANG_C + z*Y_ANG_S;
                p[2] = z*Y_ANG_C - x*Y_ANG_S;

                [x, y, z] = p;
                p[1] = y*X_ANG_C - z*X_ANG_S;
                p[2] = y*X_ANG_S + z*X_ANG_C;

                return p as tPointArr;
            });
    }

    public draw(c: CanvasRenderingContext2D) {
        const PTS = this._PTS as [number, number][];

        c.save();
            c.beginPath();
                for (let i = 0; i < 4; i++) {
                    c.moveTo(...PTS[i]);
                    c.lineTo(...PTS[i + 4]);
                }
                for (let i = 4; i < 8; i++) {
                    c.lineTo(...PTS[i]);
                }
            c.stroke();
            c.beginPath();
                for (let i = 0; i < 4; i++) {
                    c.lineTo(...PTS[i]);
                }
            c.fill();
        c.restore();
    }
}