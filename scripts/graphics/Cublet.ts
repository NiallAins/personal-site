import { COLOR_TEXT_L, ISO_SCALE } from "../consts-css";
import { tPointArr } from "../types";

export class Cublet {
    public static readonly CUBLETS: Cublet[] = [];

    private readonly _PTS: tPointArr[];
    private readonly _WIDTH: number = ISO_SCALE * 2;

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

    public draw(c: CanvasRenderingContext2D, fade: number, hDrop: number) {
        const PTS = this._PTS as [number, number][];

        c.save();
            c.strokeStyle = COLOR_TEXT_L;
            c.fillStyle = COLOR_TEXT_L;
            c.lineWidth = 2;
            c.translate(this.x, this.y + (hDrop * ISO_SCALE * 2));
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