const LISTENERS: { [key: string]: (e: Event) => void } = {};

export const KEYS: {
    [code: string]: {
        pressed: boolean;
        down: boolean;
        up: boolean;
        locked: boolean;
    }
} = Object.fromEntries(
    [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Space'
    ]
        .map(code => [
            code,
            {
                pressed: false,
                down: false,
                up: false,
                locked: false
            }
        ])
);

export function init() {
    window.addEventListener('keydown', e => {        
        const KEY = KEYS[e.code];
        if (KEY) {
            if (!e.repeat) {
                KEY.pressed = true;
                KEY.down = true;
            }
            if (KEY.locked) {
                e.preventDefault();
            }
        }
    });
    window.addEventListener('keyup', e => {
        const KEY = KEYS[e.code];
        if (KEY) {
            KEY.pressed = false;
            KEY.up = true;
            if (KEY.locked) {
                e.preventDefault();
            }
        }
    });
    window.addEventListener('blur', () => {
        Object.values(KEYS).forEach(k => {
            k.pressed = false;
            k.down = false;
            k.up = false;
        });
    });

    window.addEventListener('mousedown', () => {
        Object.values(KEYS).forEach(k => k.locked = false);
    });
    window.addEventListener('mousewheel', () => {
        Object.values(KEYS).forEach(k => k.locked = false);
    });
}

export function step() {
    Object.values(KEYS).forEach(k => {
        k.down = false;
        k.up = false;
    });
}

export function toggleKeyLock(codes: string[], state: boolean) {
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