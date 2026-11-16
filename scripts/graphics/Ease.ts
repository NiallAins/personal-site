import { eEaseState, eEaseType, tEaseFunc } from "../types";
import { msToFrames } from "../util";

export class Ease {
    protected static readonly EASES: Ease[] = [];
    protected static EASE_FUNCS: { [key in eEaseType]: tEaseFunc } = {
        // Source https://easings.net
        [eEaseType.Linear]: (x: number) => x,
        [eEaseType.Ease]: (x: number) => (Math.cos(Math.PI * x) - 1) * -0.5,
        [eEaseType.EaseIn]: (x: number) => 1 - Math.cos((x * Math.PI) * 0.5),
        [eEaseType.EaseOut]: (x: number) => Math.sin((x * Math.PI) * 0.5),
        [eEaseType.Elastic]: (x: number) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
        [eEaseType._ElasticIn]: (x: number) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * (2 * Math.PI) / -3)
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
    private _stateQueue: eEaseState[] = [];
    private _restarting: boolean = true;
    private readonly _FRAMES_FORWARD: number;
    private readonly _FRAMES_BACKWARD: number;
    private readonly _FRAMES_DELAY_BEFORE_BACKWARD: number;
    private readonly _FRAMES_DELAY_BEFORE_FORWARD: number;
    private readonly _PREVENT_DELAY_ON_PLAY: boolean;
    private readonly _EASE_FUNC: [
        forward: tEaseFunc,
        backwards: tEaseFunc
    ];

    public onForwardStart: (() => void) | null = null;
    public onForwardComplete: (() => void) | null = null;
    public onBackwardStart: (() => void) | null = null;
    public onBackwardComplete: (() => void) | null = null;

    constructor(
        duration: number | [number, number, number?, number?, boolean?] = 1000,
        easeType: eEaseType | [eEaseType, eEaseType] = eEaseType.Ease
    ) {
        if (typeof duration === 'number') {
            this._FRAMES_BACKWARD = this._FRAMES_FORWARD = msToFrames(duration);
            this._FRAMES_DELAY_BEFORE_FORWARD = this._FRAMES_DELAY_BEFORE_BACKWARD = 0;
            this._PREVENT_DELAY_ON_PLAY = false;
        } else {
            this._FRAMES_FORWARD = msToFrames(duration[0]);
            this._FRAMES_BACKWARD = msToFrames(duration[1]);
            this._FRAMES_DELAY_BEFORE_FORWARD = msToFrames(duration[2] ?? 0);
            this._FRAMES_DELAY_BEFORE_BACKWARD = msToFrames(duration[3] ?? duration[2] ?? 0);
            this._PREVENT_DELAY_ON_PLAY = !!duration[4];
        }

        const
            NO_EASE_BACKWARD = typeof easeType === 'number',
            EASE_FORWARD = NO_EASE_BACKWARD ? easeType : easeType[0],
            EASE_BACKWARD = NO_EASE_BACKWARD ? Ease.EASE_FUNCS_REVERSE_MAP[easeType] || easeType : easeType[1];
        this._EASE_FUNC = [
            Ease.EASE_FUNCS[EASE_FORWARD],
            Ease.EASE_FUNCS[EASE_BACKWARD]
        ];

        Ease.EASES.push(this);
    }

    get value(): number {
        return Math.min(1, Math.max(0, this._valueEase));
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
                if (this._state !== eEaseState.Paused) {
                    this._valueLinear += this._valueDelay % 1;
                }
                this._valueDelay = 0;
                this._delay = 0;
            }
        }

        if (!this._delay) {
            if (this._state === eEaseState.Paused && this._stateQueue.length) {
                this._state = this._stateQueue.pop()!;
            }

            if (this._state !== eEaseState.Paused) {
                const IS_FORWARD = this._state > eEaseState.Paused;
                this._valueLinear += dT / (IS_FORWARD ? this._FRAMES_FORWARD : this._FRAMES_BACKWARD * -1);

                if (this._restarting) {
                    // Trigger callback
                    if (IS_FORWARD) {
                        this.onForwardStart?.();
                    } else {
                        this.onBackwardStart?.();
                    }
                    this._restarting = false;
                }

                // End current state
                if (
                    (IS_FORWARD && this._valueLinear >= 1) ||
                    (!IS_FORWARD && this._valueLinear <= 0)
                ) {
                    // Trigger callback
                    if (IS_FORWARD) {
                        this.onForwardComplete?.();
                    } else {
                        this.onBackwardComplete?.();
                    }

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
                    let nextState = {
                        [eEaseState.BackwardReverseLoop]: eEaseState.ForwardReverseLoop,
                        [eEaseState.BackwardReverse]: eEaseState.Forward,
                        [eEaseState.BackwardLoop]: eEaseState.BackwardLoop,
                        [eEaseState.Backward]: eEaseState.Paused,
                        [eEaseState.Forward]: eEaseState.Paused,
                        [eEaseState.ForwardLoop]: eEaseState.ForwardLoop,
                        [eEaseState.ForwardReverse]: eEaseState.Backward,
                        [eEaseState.ForwardReverseLoop]: eEaseState.BackwardReverseLoop
                    }[this._state]!

                    if (nextState === eEaseState.Paused && this._stateQueue.length) {
                        nextState = this._stateQueue.pop()!;
                    }

                    this._state = eEaseState.Paused;

                    if (nextState > eEaseState.Paused && this._FRAMES_DELAY_BEFORE_FORWARD) {
                        this._valueLinear = 0;
                        this._delay = this._FRAMES_DELAY_BEFORE_FORWARD;
                    } else if (nextState < eEaseState.Paused && this._FRAMES_DELAY_BEFORE_BACKWARD) {
                        this._valueLinear = 1;
                        this._delay = this._FRAMES_DELAY_BEFORE_BACKWARD;
                    }

                    if (nextState !== eEaseState.Paused) {
                        this._stateQueue.push(nextState);
                    }

                    this._restarting = true;
                }

                this._valueEase = this.easeValue(this._valueLinear, !IS_FORWARD);
            }
        }
    }

    public easeValue(value: number, backward: boolean = false) {
        return this._EASE_FUNC[backward ? 0 : 1](value);
    }

    public easeTime(time: number, backward: boolean = false) {
        const VALUE = time / (backward ? this._FRAMES_BACKWARD : this._FRAMES_FORWARD);
        return this.easeValue(VALUE);
    }

    public play(state?: eEaseState, fromStart: boolean = false) {
        const NEXT_STATE = state !== undefined
            ? state
            : this._stateQueue.length
                ? this._stateQueue.pop()!
                : this._state === eEaseState.Paused && this._valueLinear === 1
                    ? eEaseState.Backward
                    : eEaseState.Forward;

        if (fromStart) {
            this._valueLinear = this._state < eEaseState.Paused ? 1 : 0;
            this._restarting = true;
        }

        this._valueDelay = 0;
        this._delay = !this._restarting || this._PREVENT_DELAY_ON_PLAY
            ? 0
            : this._state > 0
                ? this._FRAMES_DELAY_BEFORE_BACKWARD
                : this._FRAMES_DELAY_BEFORE_FORWARD;

        this._state = eEaseState.Paused;
        this._stateQueue.push(NEXT_STATE);
    }

    public queue(state: eEaseState) {
        this._stateQueue.unshift(state);
    }

    public clearQueue() {
        this._stateQueue = [];
    }

    public pause() {
        this._stateQueue.push(this._state);
        this._state = eEaseState.Paused;
    }

    public reverse() {
        this._state *= -1;
        if (this._stateQueue) {
            this._stateQueue = this._stateQueue.map(s => s * -1);
        }
    }

    public map(from: number, to: number = 0, float: boolean = false) {
        const MAP = to + ((from - to) * this._valueEase);
        return float ? MAP : Math.floor(MAP);
    }
}