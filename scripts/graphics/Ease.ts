import { eEaseState, eEaseType, tEaseFunc } from "../types";
import { msToFrames } from "../util";

export class Ease {
    protected static readonly EASES: Ease[] = [];
    protected static EASE_FUNCS: { [key in eEaseType]: tEaseFunc } = {
        // Source https://easings.net
        [eEaseType.Linear]:     (x: number) => x,
        [eEaseType.Ease]:       (x: number) => (Math.cos(Math.PI * x) - 1) * -0.5,
        [eEaseType.EaseIn]:     (x: number) => 1 - Math.cos((x * Math.PI) * 0.5),
        [eEaseType.EaseOut]:    (x: number) => Math.sin((x * Math.PI) * 0.5),
        [eEaseType.Elastic]:    (x: number) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x)      * Math.sin((x * 10 -  0.75) * (2 * Math.PI) /  3) + 1,
        [eEaseType._ElasticIn]: (x: number) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2,  10 * x - 10) * Math.sin((x * 10 - 10.75) * (2 * Math.PI) / -3)
    };
    protected static EASE_FUNCS_REVERSE_MAP: { [key in eEaseType]?: eEaseType } = {
        [eEaseType.EaseIn]: eEaseType.EaseOut,
        [eEaseType.EaseOut]: eEaseType.EaseIn,
        [eEaseType.Elastic]: eEaseType._ElasticIn
    };

    public static step(dT: number = 1) {
        Ease.EASES.forEach(e => e.step(dT));
    }

    private _valueLinear: number = 0;
    private _valueEase: number = 0;
    private _valueDelay: number = 0;
    private _delay: number = 0;
    private _state: eEaseState = eEaseState.Paused;
    private _prevState?: eEaseState;
    private readonly _FRAMES_FORWARD: number;
    private readonly _FRAMES_BACKWARD: number;
    private readonly _FRAMES_DELAY_FORWARD: number;
    private readonly _FRAMES_DELAY_BACKWARD: number;
    private readonly _EASE_FUNC: [
        forward: tEaseFunc,
        forward: tEaseFunc
    ];

    public onForwardComplete: () => void = () => {};
    public onBackwardComplete: () => void = () => {};

    constructor(
        duration: number | [number, number, number?, number?] = 1000,
        easeType: eEaseType = eEaseType.Ease,
        reverseEase: boolean = false
    ) {
        this._FRAMES_FORWARD = msToFrames(typeof duration === 'number' ? duration : duration[0]);
        this._FRAMES_BACKWARD = msToFrames(typeof duration === 'number' ? duration : duration[1]);
        this._FRAMES_DELAY_FORWARD = msToFrames(typeof duration === 'number' ? 0 : duration[2] || 0);
        this._FRAMES_DELAY_BACKWARD = msToFrames(typeof duration === 'number' ? 0 : duration[3] || duration[2] || 0);

        const
            EASE = Ease.EASE_FUNCS[easeType],
            EASE_REVERSE = Ease.EASE_FUNCS_REVERSE_MAP[easeType];
        this._EASE_FUNC = [
            EASE,
            reverseEase && EASE_REVERSE ? Ease.EASE_FUNCS[EASE_REVERSE] : EASE
        ];

        Ease.EASES.push(this);
    }

    get value(): number {
        return this._valueEase;
    }

    set value(v: number) {
        this._valueLinear = v;
    }

    get state(): eEaseState {
        return this._state;
    }

    protected step(dT: number) {
        if (this._delay) {
            this._valueDelay += dT / this._delay;

            if (this._valueDelay >= 1) {
                this._valueLinear += this._valueDelay % 1;
                this.play();
            }
        }
        
        if (this._state !== eEaseState.Paused) {             
            const IS_FORWARD = this._state > eEaseState.Paused;
            this._valueLinear += dT / (IS_FORWARD ? this._FRAMES_FORWARD : this._FRAMES_BACKWARD * -1);
            
            if (
                (IS_FORWARD && this._valueLinear >= 1) ||
                (!IS_FORWARD && this._valueLinear <= 0)
            ) {
                // Mod, reverse, or min-max overflow
                const STATE_ABS = Math.abs(this._state);
                if (STATE_ABS >= eEaseState.ForwardReverse) {
                    this._valueLinear = (IS_FORWARD ? 1 : 0) - this._valueLinear;
                } else if (STATE_ABS === eEaseState.ForwardLoop) {
                    this._valueLinear += IS_FORWARD ? 1 : -1;
                } else {
                    this._valueLinear = IS_FORWARD ? 1 : 0
                }

                // Set next state
                this._state = {
                    [eEaseState.BackwardReverseLoop]: eEaseState.ForwardReverseLoop,
                    [eEaseState.BackwardReverse]: eEaseState.Forward,
                    [eEaseState.BackwardLoop]: eEaseState.BackwardLoop,
                    [eEaseState.Backward]: eEaseState.Paused,
                    [eEaseState.Forward]: eEaseState.Paused,
                    [eEaseState.ForwardLoop]: eEaseState.ForwardLoop,
                    [eEaseState.ForwardReverse]: eEaseState.Backward,
                    [eEaseState.ForwardReverseLoop]: eEaseState.BackwardReverseLoop
                }[this._state]!;

                if (this._state === eEaseState.Paused) {
                    this.pause();
                } else {
                    // Trigger inter-state delay
                    if (IS_FORWARD && this._FRAMES_DELAY_FORWARD) {
                        this._valueLinear = 1;
                        this._delay = this._FRAMES_DELAY_FORWARD;
                        this.pause();
                    } else if (!IS_FORWARD && this._FRAMES_DELAY_BACKWARD) {
                        this._valueLinear = 0;
                        this._delay = this._FRAMES_DELAY_BACKWARD;
                        this.pause();
                    }
                }

                if (IS_FORWARD) {
                    this.onForwardComplete();
                } else {
                    this.onBackwardComplete();
                }
            }

            this._valueEase = this.easeValue(this._valueLinear, !IS_FORWARD);
        }
    }

    public easeValue(value: number, backward: boolean = false) {
        return this._EASE_FUNC[backward ? 0 : 1](value);
    }

    public easeTime(time: number, backward: boolean = false) {
        const VALUE = time / (backward ? this._FRAMES_BACKWARD : this._FRAMES_FORWARD);
        return this.easeValue(VALUE);
    }

    public play(state?: eEaseState) {
        this._state = state !== undefined
            ? state
        : this._prevState == undefined
            ? eEaseState.Forward
        : this._prevState === eEaseState.Forward && this._valueLinear === 1
            ? eEaseState.Backward
        : this._prevState === eEaseState.Backward && this._valueLinear === 0
            ? eEaseState.Forward
        : this._prevState;

        if (this._prevState === undefined) {
            this._valueLinear = this._state > eEaseState.Paused ? 0 : 1;
        }

        this._delay = 0;
        this._valueDelay = 0;
    }

    public pause() {
        this._prevState = this.state;
        this._state = eEaseState.Paused;
    }

    public reverse() {
        this._state *= -1;
        if (this._prevState) {
            this._prevState *= -1;
        }
    }

    public map(from: number, to: number = 0, float: boolean = false) {
        const MAP = to + ((from - to) * this._valueEase);
        return float ? MAP : Math.floor(MAP);
    }
}