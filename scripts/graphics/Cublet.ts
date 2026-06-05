import { ISO_SCALE, WIDTH_PAGE_MAX } from "../consts-css";
import { tPointArr } from "../types";

export class Cublet {
    public static readonly CUBLETS: Cublet[] = [];

    private readonly _PTS: tPointArr[];
    private readonly _WIDTH: number = ISO_SCALE * 2;
    private readonly _RAND_X: number = Math.random();
    private readonly _RAND_Y: number = Math.random();

    public x: number = 0;
    public y: number = 0;
    public drawen: boolean = false;

    constructor() {
        const
            X_ANG = Math.random() * Math.PI * 2,
            Y_ANG = Math.random() * Math.PI * 2,
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
                p[1] = y*X_ANG_C - z*X_ANG_S;
                p[2] = y*X_ANG_S + z*X_ANG_C;

                y = p[1];
                z = p[2];
                p[0] = x*Y_ANG_C + z*Y_ANG_S;
                p[2] = z*Y_ANG_C - x*Y_ANG_S;

                return p as tPointArr;
            });

        Cublet.CUBLETS.push(this);
    }

    public setPosition(
        cw: number, ch: number,
        section: number
    ) {
        const
            W = Math.min(WIDTH_PAGE_MAX, cw),
            W_OFF = (this._WIDTH + cw - W) * 0.5,
            H = ch * 0.5,
            H_OFF = ch * 1.1,
            H_PAD = ch * 0.1;
        this.x = W_OFF + (section % 2 ? 0 : W * 0.5) + (W * 0.5 * this._RAND_X);
        this.y = H_OFF + (section * H) + H_PAD + ((H - (H_PAD * 2)) * this._RAND_Y);
    }

    public draw(c: CanvasRenderingContext2D) {
        const PTS = this._PTS as [number, number][];

        c.save();
            c.beginPath();
                for (let i = 0; i < 4; i++) {
                    c.lineTo(...PTS[i]);
                }
            c.fill();
            c.beginPath();
                for (let i = 0; i < 4; i++) {
                    c.moveTo(...PTS[i]);
                    c.lineTo(...PTS[i + 4]);
                }
                for (let i = 4; i < 8; i++) {
                    c.lineTo(...PTS[i]);
                }
            c.stroke();
        c.restore();
    }
}