import { eEaseState, eEaseType, tEaseFunc } from "../types";
import { msToFrames } from "../util";

export class Ease {
    protected static readonly EASES: Ease[] = [];
    protected static EASE_FUNCS: { [key in eEaseType]: tEaseFunc } = {
        /* Source https://easings.net */
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

    private _value: number = 0;
    private _valueAbs: number = 0;
    private _state: eEaseState = eEaseState.Paused;
    private _prevState?: eEaseState;
    private readonly _FRAMES: number;
    private readonly _EASE_FUNC: [
        forward: tEaseFunc,
        forward: tEaseFunc
    ];

    constructor(
        duration: number = 1000,
        easeType: eEaseType = eEaseType.Ease,
        reverseEase: boolean = false
    ) {
        this._FRAMES = msToFrames(duration);

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
        return this._value;
    }

    set value(v: number) {
        this._valueAbs = v;
    }

    get state(): eEaseState {
        return this._state;
    }

    public static step(dT: number = 1) {
        Ease.EASES.forEach(e => e.step(dT));
    }

    protected step(dT: number) {
        if (this._state !== eEaseState.Paused) {
            const IS_FORWARD = this._state > eEaseState.Paused;
            this._valueAbs += (dT / this._FRAMES) * (IS_FORWARD ? 1 : -1);
            if (
                (IS_FORWARD && this._valueAbs >= 1) ||
                (!IS_FORWARD && this._valueAbs <= 0)
            ) {
                this._valueAbs =
                    (IS_FORWARD && this._state !== eEaseState.ForwardLoop) ||
                    this._state === eEaseState.BackwardLoop
                        ? 1
                        : 0;
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
            }
            this._value = this._EASE_FUNC[IS_FORWARD ? 0 : 1](this._valueAbs);
        }
    }

    public play(state?: eEaseState) {
        this._state = state !== undefined
            ? state
            : this._prevState == undefined
            ? eEaseState.Forward
            : this._prevState === eEaseState.Forward && this._valueAbs === 1
            ? eEaseState.Backward
            : this._prevState === eEaseState.Backward && this._valueAbs === 0
            ? eEaseState.Forward
            : this._prevState;

        this._prevState = this._state;
    }

    public pause() {
        this._state = eEaseState.Paused;
    }

    public reverse() {
        this._state *= -1;
        if (this._prevState) {
            this._prevState *= -1;
        }
    }
}