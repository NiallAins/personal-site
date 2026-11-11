import { eKey } from "../types";

const
    LISTENERS: { [key: string]: (e: Event) => void } = {},
    DOUBLE_DOWN_TIME = 5;

export const KEYS = Object.fromEntries(
    Object
        .values(eKey)
        .map(code => [
            code as eKey,
            {
                pressed: false,
                down: false,
                downSingle: false,
                downDouble: false,
                downDoubleTimer: 0,
                up: false,
                locked: false
            }
        ])
) as {
    [key in eKey]: {
        pressed: boolean;
        down: boolean;
        downSingle: boolean;
        downDouble: boolean;
        downDoubleTimer: number;
        up: boolean;
        locked: boolean;
    }
};

export function init() {
    window.addEventListener('keydown', e => {
        const KEY = e.code in eKey ? KEYS[eKey[e.code as keyof typeof eKey]] : null;
        if (KEY) {
            if (!e.repeat) {
                KEY.pressed = true;
                KEY.down = true;
                if (KEY.downDoubleTimer > 0) {
                    KEY.downDouble = true;
                } else {
                    KEY.downSingle = true;
                    KEY.downDoubleTimer = DOUBLE_DOWN_TIME;
                }
            }
            if (KEY.locked) {
                e.preventDefault();
            }
        }
    });
    window.addEventListener('keyup', e => {
        const KEY = e.code in eKey ? KEYS[eKey[e.code as keyof typeof eKey]] : null;
        if (KEY) {
            KEY.pressed = false;
            KEY.up = true;
            KEY.downDouble = false;
            KEY.downSingle = false;
            if (KEY.locked) {
                e.preventDefault();
            }
        }
    });
    window.addEventListener('blur', () => {
        Object.values(KEYS).forEach(k => {
            k.pressed = false;
            k.down = false;
            k.downDouble = false;
            k.downSingle = false;
            k.up = false;
        });
    });
}

export function step(dT: number) {
    Object.values(KEYS).forEach(k => {
        k.down = false;
        k.up = false;
        if (k.downDoubleTimer > 0) {
            k.downDoubleTimer -= dT;
        }
    });
}

export function toggleKeyLock(codes: eKey[], state: boolean) {
    codes
        .filter(c => KEYS[c])
        .forEach(code =>  KEYS[code].locked = state);
}

export function toggleInputListeners(
    events: string[],
    callback: { [key: string]: (e: Event) => void },
    state: boolean
) {
    events.forEach(event => {
        const [NAME, CB] = Object.entries(callback)[0];
        if (state) {
            window.addEventListener(event, CB);
            LISTENERS[NAME] = CB;
        } else {
            window.removeEventListener(event, LISTENERS[NAME]);
            delete LISTENERS[NAME];
        }
    });
}