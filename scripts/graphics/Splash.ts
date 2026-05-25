import { ISO_SCALE, SPLASH_FADE_DIST, SPLASH_FADE_TIME, SPLASH_MAX_DIST } from "../consts";

export class Splash {
    public static splashes: Splash[] = [];

    public x: number = 0;
    public y: number = 0;

    private age: number = 0;
    private fading: boolean = false;
    private period: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static createSplash(x: number, y: number) {
        if (!Splash.splashes.find(s => Math.abs(y - s.y) + Math.abs(x - s.x) < ISO_SCALE * 2)) {
            Splash.splashes.push(new Splash(x, y));
        }
    }

    public getZ(x: number, y: number): number {
        const DIST =
            Math.pow(x - this.x, 2) +
            Math.pow(y - this.y, 2);

        return DIST < SPLASH_MAX_DIST
            ?  Math.cos((DIST / SPLASH_FADE_DIST) - this.period + 3.14) *
                // Time fade
                this.age * SPLASH_FADE_TIME *
                // Distance fade
                ((SPLASH_MAX_DIST - DIST) / SPLASH_MAX_DIST)
            : 0;
    }

    public step(dT: number) {
        this.period += dT * 0.25;

        if (!this.fading) {
            this.age += dT * 150;
            if (this.age > 1000) {
                this.fading = true;
            }
        } else {
            this.age /= 1 + (0.05 * dT);
            if (this.age < 5) {
                Splash.splashes.splice(Splash.splashes.indexOf(this), 1);
            }
        }
    }
}