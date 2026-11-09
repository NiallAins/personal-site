import * as Three from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { _DEBUG_log } from "../_debug";
import { KEYS, toggleKeyLock } from "./Inputs";
import { renderSingleIso, ptToScreen } from "./terrain";
import { Splash } from './Splash';
import { CAN_QUALITY, CLASS_BOAT_ACTIVE, COLOR_TEXT_L, DURATION_LG, EL_BOAT, INV_45, ISO_SCALE_LG, Z_UNIT_SCALE } from '../consts';
import { Canvas } from './Canvas';
import { zUnit as Z_UNIT } from './main';
import { Cublet } from './Cublet';

enum eSurface {
    Sea,
    Land,
    Air
};

enum eRotation {
    Turn,
    Flip,
    Roll
};

class Vec {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public scale(s: number | Vec, copy: boolean = false) {
        let v = copy ? this.copy() : this;
        if (typeof s === 'number') {
            v.x *= s;
            v.y *= s;
            v.z *= s;
        } else {
            v.x *= s.x;
            v.y *= s.y;
            v.z *= s.z;
        }
        return v;
    }

    public add(s: number | Vec, copy: boolean = false) {
        let v = copy ? this.copy() : this;
        if (typeof s === 'number') {
            v.x += s;
            v.y += s;
            v.z += s;
        } else {
            v.x += s.x;
            v.y += s.y;
            v.z += s.z;
        }
        return v;
    }

    public copy(): Vec {
        return new Vec(this.x, this.y, this.z);
    }
}

export class Boat {

    //
    // Static properties
    //

    // Model
    protected static readonly CAN_W = 128 * CAN_QUALITY;
    protected static readonly BUTTON_SCALE = 1.25;
    protected static readonly MODEL_SRC: string = './assets/boat.glb';
    protected static readonly MODEL_ROT_X: number = 35.264 * (Math.PI / 180);
    protected static readonly MODEL_ROT_Y: number = 0.25 * Math.PI;
    protected static readonly COLLECT_DIST2: number = 5 ** 2;
    public static readonly CAN_CENTER_X = Boat.CAN_W * 0.5;
    public static readonly CAN_CENTER_Y = Boat.CAN_CENTER_X + (Boat.CAN_W * 0.125);

    // Planar movement
    protected static DDP = 0.035;
    protected static DDP_REV = Boat.DDP * -0.2;
    protected static DP_MAX2 = (0.7) ** 2;

    // Vertical movement
    protected static DP_JUMP = 1;
    protected static GRAV = -0.08;
    protected static FRIC_P = {
        [eSurface.Sea]: 0.97,
        [eSurface.Land]: 0.95,
        [eSurface.Air]: 1
    };

    // Anglular movement
    protected static DDA = {
        [eSurface.Sea]: 0.06,
        [eSurface.Land]: 0.025,
        [eSurface.Air]: {
            [eRotation.Turn]: 0.01,
            [eRotation.Flip]: 0.03,
            [eRotation.Roll]: 0.03
        }
    };
    protected static DDA_MAX = {
        [eSurface.Sea]: 0.15,
        [eSurface.Land]: 0.075,
        [eSurface.Air]: {
            [eRotation.Turn]: 0.3,
            [eRotation.Flip]: 0.35,
            [eRotation.Roll]: 0.4
        }
    };
    protected static FRIC_A = {
        [eSurface.Sea]: -0.25,
        [eSurface.Land]: -0.3,
        [eSurface.Air]: 0
    };
    protected static CRASH_TOLERANCE = 0.15;


    //
    // Private properties
    //

    private initP = new Vec(0, 0, 0);
    private p = new Vec(0, 0, 0);
    private alti = 0;
    private bounds: [number, number, number, number] = [0, 0, 0, 0];
    private dP = new Vec(0, 0, 0);
    private a = new Vec(0, 0, 0);
    private dA = new Vec(0, 0, 0);
    private fP = new Vec(0, 0, 0);
    private fA = new Vec(0, 0, 0);
    private grad = new Vec(0, 0);
    private surface = eSurface.Sea;
    private doubleKeyDAReset = 0;
    private flipXActive = false;
    private flipYActive = false;
    private model: Three.Group | null = null;
    private wakeThrottle = 0;
    private allowControl = false;
    private crashFade = 0;
    private winState = false;
    private readonly CAN: HTMLCanvasElement;
    private readonly GUI = {
        fade: 0,
        timer: 1,
        controlsComplete: false,
        controls: {
            left: 1,
            right: 1,
            down: 1,
            up: 1,
            space: 1
        }
    };


    //
    // Public properties
    //

    public hasControl: boolean = false;

    get x() {
        return this.p.x;
    }
    get y() {
        return this.p.y;
    }
    get z() {
        return this.p.z;
    }


    constructor(x: number, y: number, allowControl: boolean) {
        this.p.x = x;
        this.p.y = y;
        this.allowControl = allowControl;

        if (allowControl) {
            EL_BOAT.style.width = (Boat.CAN_W * Boat.BUTTON_SCALE) + 'px';
            EL_BOAT.style.height = (Boat.CAN_W * Boat.BUTTON_SCALE) + 'px';
            EL_BOAT.addEventListener('click', () => {
                this.toggleControls(true);
                if (!this.GUI.fade) {
                    this.GUI.fade = 0.01;
                }
            });
            window.addEventListener('mousewheel', this.toggleControls.bind(this, false));
            window.addEventListener('keydown', e => e.code === 'Escape' ? this.toggleControls.bind(this, false) : null);
            window.addEventListener('keydown', e => e.code === 'Tab' ? this.toggleControls.bind(this, false) : null);
        }

        const
            SCENE = new Three.Scene(),
            CTX = new Three.WebGLRenderer(),
            LIGHT = new Three.DirectionalLight(0xffffff, 2),
            CAM = new Three.OrthographicCamera(
                -1, 1,
                1, -1,
                1, 2000
            );

        CTX.setSize(Boat.CAN_W, Boat.CAN_W);
        CTX.setClearColor(0x00ff00, 0);
        this.CAN = CTX.domElement;

        LIGHT.position.set(10, 20, 10);
        SCENE.add(LIGHT);

        CAM.position.set(0, 0, 100);
        this._renderModel = () => CTX.render(SCENE, CAM);

        this._loadModel(SCENE);
    }


    //
    // Public methods
    //

    public setPosition(x: number, y: number, ...bounds: [number, number, number, number]) {
        this.initP.x = x;
        this.initP.y = y;
        this.bounds = bounds;

        this.reset();
    }

    public step(
        dT: number,
        getZ: (x: number, y: number) => [number, boolean]
    ) {
        this._setPositionalForces(dT);
        this._setAngularForces();

        this._applyForces(dT);
        this._applySurface(getZ);
        this._applyBounds();

        this.fP = new Vec();
        this.fA = new Vec();

        // GUI
        const FADE = 0.1 * dT;
        if (this.GUI.fade > 0 && this.GUI.fade < 1) {
            this.GUI.fade += FADE;
        } else if (this.GUI.fade < 0 && this.GUI.fade > -1) {
            this.GUI.fade -= FADE;
        }
        if (this.GUI.fade) {
            if (this.GUI.controlsComplete) {
                this.GUI.timer -= 0.001 * dT;
                if (this.GUI.timer <= 0) {
                    this.crashFade -= 0.01;
                    this.hasControl = false;
                    this.GUI.timer = 0;
                }
            } else {
                let c: keyof typeof this.GUI.controls;
                for (c in this.GUI.controls) {
                    if (this.GUI.controls[c] < 1) {
                        this.GUI.controls[c] -= FADE;
                    }
                }
                if (Object.entries(this.GUI.controls).every(([c, v]) => v <= 0 || c === 'down')) {
                    this.GUI.controlsComplete = true;
                    this.GUI.fade = 0.01;
                    this.GUI.timer = 1;
                }
            }
        }

        if (this.crashFade < 1) {
            this.crashFade -= FADE * 0.1;
            if (this.crashFade <= 0) {
                this.reset();
            }
        }

        // Dragging cublets
        if (this.alti < 2) {
            Cublet.CUBLETS
                .filter(c => !c.caught)
                .forEach(c => {
                    if (((this.p.x - c.isoX) ** 2) + ((this.p.y - c.isoY) ** 2) < Boat.COLLECT_DIST2) {
                        c.caught = true;
                    }
                });
            if (Cublet.CUBLETS.every(c => c.caught)) {
                this.winState = true;
            }
        }
        Cublet.CUBLETS
            .filter(c => c.caught)
            .forEach(c => c.hideFade += FADE);
    }

    public render(
        can: Canvas,
        sx: number,
        sy: number,
        horZ: number
    ) {
        const C = can.CTX;

        // Rotate and render modal
        if (this.model) {
            this.model.rotation.x = Boat.MODEL_ROT_X;
            this.model.rotation.z = 0;
            this.model.rotation.y = Boat.MODEL_ROT_Y;

            if (this.surface === eSurface.Air || this.crashFade < 1) {
                this.model.rotateOnAxis(new Three.Vector3(0, 1, 0), this.a.z * -1);
                this.model.rotateOnAxis(new Three.Vector3(0, 0, 1), this.a.x);
                this.model.rotateOnAxis(new Three.Vector3(1, 0, 0), this.a.y);
            } else {
                this.model.rotateOnAxis(new Three.Vector3(0, 1, 0), this.a.z * -1);
                this.model.rotateOnWorldAxis(new Three.Vector3(0, 0, 1), this.grad.x * -1);
                this.model.rotateOnWorldAxis(new Three.Vector3(1, 0, 0), this.grad.y - Math.min(1.5, horZ / 200));
            }
        }
        this._renderModel();

        // Wake
        if (this.wakeThrottle === 0) {
            if (Math.abs(this.dP.x) + Math.abs(this.dP.y) > 0.1) {
                Splash.createSplash(sx, sy - window.scrollY);
                this.wakeThrottle = 5;
            }
        } else {
            this.wakeThrottle -= 1;
        }

        // Shadow
        if (this.alti > 0) {
            const SIZE = Math.max(0, Math.min(1, this.alti / 7));
            C.save();
            C.fillStyle = 'black';
            C.beginPath();
            C.translate(sx, sy + ((this.alti - 0.75) * Z_UNIT));
            C.scale(1, 0.5);
            C.filter = `blur(${2 + (18 * SIZE)}px)`;
            C.globalAlpha = 0.5 - (0.4 * SIZE);
            C.arc(0, 0, ISO_SCALE_LG * (1.5 + (2.5 * SIZE)), 0, Math.PI * 2);
            C.fill();
            C.restore();
        }

        // Dragging cublets
        Cublet.CUBLETS
            .filter(c => c.caught && c.hideFade && c.hideFade < 1)
            .forEach(c => {
                const
                    DIST_X = sx - c.x,
                    DIST_Y = sy - c.y;

                c.x += DIST_X * c.hideFade;
                c.y += DIST_Y * c.hideFade;
            });

        // Draw to canvas
        can.CTX.globalAlpha = this.crashFade;
        can.drawFromCanvas(
            this.CAN,
            sx - Boat.CAN_CENTER_X,
            sy - Boat.CAN_CENTER_Y + ((1 - this.crashFade) * Boat.CAN_CENTER_Y * 1.5)
        );
        can.CTX.globalAlpha = 1;

        const FADE = Math.max(0, (this.GUI.fade >= 0 ? this.GUI.fade : 1 + this.GUI.fade) * 0.5);
        if (FADE) {
            const
                KEY_W = 18,
                KEY_S = 4;

            C.save();
            C.translate(sx + KEY_W * 3, sy - KEY_W * 2);

            if (this.GUI.controlsComplete) {
                C.globalAlpha = FADE;
                C.strokeStyle = COLOR_TEXT_L;
                C.lineWidth = KEY_W * 0.5;
                C.beginPath();
                C.arc(
                    KEY_W, KEY_W * -3,
                    KEY_W * 1.5,
                    (Math.PI * -0.5) + (Math.PI * 2 * this.GUI.timer),
                    Math.PI * -0.5,
                    true
                );
                C.stroke();
            } else {
                C.fillStyle = COLOR_TEXT_L;

                if (this.GUI.controls.space > 0) {
                    C.globalAlpha = FADE * this.GUI.controls.space;
                    C.fillRect(0, 0, 4 * KEY_W + 3 * KEY_S, KEY_W);
                }

                C.translate(KEY_W + KEY_S, -1 * (KEY_W + KEY_S * 2));
                if (this.GUI.controls.left > 0) {
                    C.globalAlpha = FADE * this.GUI.controls.left;
                    C.fillRect(0, 0, KEY_W, KEY_W);
                }
                if (this.GUI.controls.down > 0) {
                    C.globalAlpha = FADE * this.GUI.controls.down;
                    C.fillRect(KEY_W + KEY_S, 0, KEY_W, KEY_W);
                }
                if (this.GUI.controls.right > 0) {
                    C.globalAlpha = FADE * this.GUI.controls.right;
                    C.fillRect((KEY_W + KEY_S) * 2, 0, KEY_W, KEY_W);
                }

                C.translate(KEY_W + KEY_S, -1 * (KEY_W + KEY_S));
                if (this.GUI.controls.up > 0) {
                    C.globalAlpha = FADE * this.GUI.controls.up;
                    C.fillRect(0, 0, KEY_W, KEY_W);
                }
            }
            C.restore();
        }

        // Button
        if (this.allowControl) {
            EL_BOAT.style.left = (sx - (Boat.CAN_CENTER_X * Boat.BUTTON_SCALE)) + 'px';
            EL_BOAT.style.top = (sy - (Boat.CAN_CENTER_Y * Boat.BUTTON_SCALE) - window.scrollY) + 'px';
        }

        // renderSingleIso(
        //     C,
        //     this.x,
        //     this.y,
        //     this.z, this.z,
        //     ['#ff000066']
        // );
    }

    public toggleControls(state: boolean) {
        this.hasControl = state;
        toggleKeyLock(
            [
                'ArrowUp',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
                'Space'
            ],
            state
        );
        EL_BOAT.classList.toggle(CLASS_BOAT_ACTIVE, state);
    }


    //
    // Private methods
    //

    private async _loadModel(scene: Three.Scene) {
        const LOADER = new GLTFLoader();

        this.model = await new Promise(
            resolve => LOADER.load(
                Boat.MODEL_SRC,
                model => resolve(model.scene)
            )
        );

        if (this.model) {
            const SCALE = 0.1;
            this.model.scale.set(SCALE, SCALE, SCALE);

            scene.add(this.model!);
        }
    }

    private _renderModel = () => { }

    private reset() {
        this.a = new Vec(0, 0, 0);
        this.p = this.initP.copy();
        this.GUI.fade = 0;
        this.GUI.timer = 1;
        Cublet.CUBLETS.forEach(c => {
            c.hideFade = 0;
            c.caught = false;
        });
        this.toggleControls(false);
        setTimeout(() => this.crashFade = 1);
    }

    // Z position
    private _moveJump(dT: number) {
        if (this.surface !== eSurface.Air) {
            this.fP.z += Boat.DP_JUMP * (this.surface === eSurface.Land ? 0.5 : 1) / dT;
        }
    }

    // X, Y position
    private _moveAccel(reverse: boolean) {
        if (
            this.surface !== eSurface.Air &&
            this.dP.x ** 2 + this.dP.y ** 2 <= Boat.DP_MAX2
        ) {
            const M = reverse ? Boat.DDP_REV : Boat.DDP;
            this.fP.x += Math.cos(this.a.z) * M;
            this.fP.y += Math.sin(this.a.z) * M;
        }
    }

    // Z rotate
    private _moveTurn(clockwise: boolean) {
        const
            DAA: number = this.surface === eSurface.Air
                ? Boat.DDA[this.surface][eRotation.Turn]
                : Boat.DDA[this.surface],
            MAX: number = this.surface === eSurface.Air
                ? Boat.DDA_MAX[this.surface][eRotation.Turn]
                : Boat.DDA_MAX[this.surface];

        if (clockwise && this.dA.z > -MAX) {
            this.fA.z -= DAA;
            return;
        }
        if (!clockwise && this.dA.z < MAX) {
            this.fA.z += DAA;
            return;
        }
    }

    // X, Y rotate
    private _moveFlip(isRoll: boolean, anti: boolean) {
        if (this.surface === eSurface.Air) {
            if (isRoll) {
                if (anti && this.dA.x > -Boat.DDA_MAX[eSurface.Air][eRotation.Roll]) {
                    this.fA.x += Boat.DDA[eSurface.Air][eRotation.Roll];
                    return;
                }
                if (!anti && this.dA.x < Boat.DDA_MAX[eSurface.Air][eRotation.Roll]) {
                    this.fA.x -= Boat.DDA[eSurface.Air][eRotation.Roll];
                }
            } else {
                if (anti && this.dA.y > -Boat.DDA_MAX[eSurface.Air][eRotation.Flip]) {
                    this.fA.y -= Boat.DDA[eSurface.Air][eRotation.Flip];
                    return;
                }
                if (!anti && this.dA.y < Boat.DDA_MAX[eSurface.Air][eRotation.Flip]) {
                    this.fA.y += Boat.DDA[eSurface.Air][eRotation.Flip];
                }
            }
        }
    }

    private _setPositionalForces(dT: number) {
        if (this.hasControl) {
            // Accelerate
            if (KEYS.ArrowUp.pressed) {
                this._setShowControls('up');
                this._moveAccel(false);
            } else if (KEYS.ArrowDown.pressed) {
                this._setShowControls('down');
                this._moveAccel(true);
            }

            // Jump
            if (KEYS.Space.down) {
                this._setShowControls('space');
                this._moveJump(dT);
            }
        }

        // Gravity
        if (this.surface === eSurface.Air) {
            this.fP.z += Boat.GRAV;
        }
    }

    private _setAngularForces() {
        if (this.hasControl) {
            // Z ground rotate
            if (this.surface !== eSurface.Air) {
                if (KEYS.ArrowLeft.pressed) {
                    this._setShowControls('left');
                    this._moveTurn(true);
                } else if (KEYS.ArrowRight.pressed) {
                    this._setShowControls('right');
                    this._moveTurn(false);
                }
            } else {
                // Active X, Y axis flip control
                if (KEYS.ArrowLeft.downDouble || KEYS.ArrowRight.downDouble) {
                    this.flipXActive = true;
                }
                if (KEYS.ArrowUp.down || KEYS.ArrowDown.down) {
                    this.flipYActive = true;
                }

                // Roll
                if (this.flipXActive) {
                    if (KEYS.ArrowLeft.pressed) {
                        this._moveFlip(true, false);
                    } else if (KEYS.ArrowRight.pressed) {
                        this._moveFlip(true, true);
                    }
                }
                // Turn
                else {
                    if (KEYS.ArrowLeft.pressed) {
                        this._moveTurn(true);
                    } else if (KEYS.ArrowRight.pressed) {
                        this._moveTurn(false);
                    }
                }

                // Flip
                if (this.flipYActive) {
                    if (KEYS.ArrowUp.pressed) {
                        this._moveFlip(false, false);
                    } else if (KEYS.ArrowDown.pressed) {
                        this._moveFlip(false, true);
                    }
                }

                // Prevent inital single key rotation after double key pressed
                if (KEYS.ArrowLeft.downSingle || KEYS.ArrowRight.downSingle) {
                    this.doubleKeyDAReset = this.dA.z;
                } else if (KEYS.ArrowLeft.downDouble || KEYS.ArrowRight.downDouble) {
                    this.dA.z = this.doubleKeyDAReset;
                }
            }
        }

        // Friction
        this.fA.add(this.dA.scale(Boat.FRIC_A[this.surface], true));
    }

    private _applyForces(dT: number) {
        // Positional movement
        this.dP.add(this.fP.scale(dT, true));

        // Add friction
        let
            fricX = Boat.FRIC_P[this.surface],
            fricY = Boat.FRIC_P[this.surface];
        if (this.surface === eSurface.Land) {
            if (this.dP.x * this.grad.x < 0) {
                fricX -= fricX * Math.abs(this.grad.x) * INV_45;
            }
            if (this.dP.y * this.grad.y < 0) {
                fricY -= fricY * Math.abs(this.grad.y) * INV_45;
            }
        }

        this.dP.x *= fricX;
        this.dP.y *= fricY;
        this.p.add(this.dP.scale(dT, true));

        // Angular movement
        this.dA.add(this.fA.scale(dT, true));
        this.a.add(this.dA.scale(dT, true));
    }

    private _applySurface(getZ: (x: number, y: number) => [number, boolean]) {
        const [
            GROUND_Z,
            ON_LAND_0
        ] = getZ(this.p.x, this.p.y);

        let
            jumpStart = false,
            jumpEnd = false;

        // Jump start
        if (this.surface !== eSurface.Air && this.dP.z > 0) {
            this.surface = eSurface.Air;
            jumpStart = true;
        }

        // In air
        if (this.surface === eSurface.Air) {
            this.alti = this.p.z - GROUND_Z;

            // Jump end
            if (this.alti <= 0 && this.dP.z < 0) {
                this.alti = 0;
                this.surface = eSurface.Sea;
                this.dP.z = 0;
                this.dA.x = 0;
                this.dA.y = 0;
                jumpEnd = true;
            }
        }

        // On ground
        if (this.surface !== eSurface.Air) {
            // Move to contact
            this.p.z = GROUND_Z;

            // Match gradient angle
            const
                CHECK_DIS = 1.5,
                [X0, ON_LAND_1] = getZ(this.p.x - CHECK_DIS, this.p.y),
                [X1, ON_LAND_2] = getZ(this.p.x + CHECK_DIS, this.p.y),
                [Y0, ON_LAND_3] = getZ(this.p.x, this.p.y - CHECK_DIS),
                [Y1, ON_LAND_4] = getZ(this.p.x, this.p.y + CHECK_DIS);

            this.surface = ON_LAND_0 || ON_LAND_1 || ON_LAND_2 || ON_LAND_3 || ON_LAND_4
                ? eSurface.Land
                : eSurface.Sea;

            this.grad.x = Math.atan2(X0 - X1, CHECK_DIS * 2);
            this.grad.y = Math.atan2(Y0 - Y1, CHECK_DIS * 2);
        }

        if (jumpStart) {
            this._onJumpStart();
        } else if (jumpEnd) {
            this._onJumpEnd();
        }
    }

    private _applyBounds() {
        // Top / Bottom
        if (this.p.x + this.p.y < this.bounds[0]) {
            const OVER = 0.5 * (this.bounds[0] - (this.p.x + this.p.y));
            this.p.x += OVER;
            this.p.y += OVER;
        } else if (this.p.x + this.p.y > this.bounds[2]) {
            const OVER = 0.5 * (this.bounds[2] - (this.p.x + this.p.y));
            this.p.x += OVER;
            this.p.y += OVER;
        }

        // Right / Left
        if (this.p.x - this.p.y > this.bounds[1]) {
            const OVER = 0.5 * (this.bounds[1] - (this.p.x - this.p.y));
            this.p.x += OVER;
            this.p.y -= OVER;
        } else if (this.p.x - this.p.y < this.bounds[3]) {
            const OVER = 0.5 * (this.bounds[3] - (this.p.x - this.p.y));
            this.p.x += OVER;
            this.p.y -= OVER;
        }
    }

    private _onJumpStart() {
        this.dA.y += Math.random() * 0.05 - 0.025;
        this.dA.z += Math.random() * 0.05 - 0.025;
    }

    private _onJumpEnd() {
        this.flipXActive = false;
        this.flipYActive = false;

        const
            FLIP = Math.abs(this.a.y / (Math.PI * 2)),
            ROLL = Math.abs(this.a.x / (Math.PI * 2)),
            FLIP_MOD = FLIP % 1,
            ROLL_MOD = ROLL % 1;

        if (
            (
                (FLIP_MOD > Boat.CRASH_TOLERANCE && FLIP_MOD < 1 - Boat.CRASH_TOLERANCE) ||
                (ROLL_MOD > Boat.CRASH_TOLERANCE && ROLL_MOD < 1 - Boat.CRASH_TOLERANCE)
            ) &&
            !(
                FLIP_MOD > 0.5 - Boat.CRASH_TOLERANCE && FLIP_MOD < 0.5 + Boat.CRASH_TOLERANCE &&
                ROLL_MOD > 0.5 - Boat.CRASH_TOLERANCE && ROLL_MOD < 0.5 + Boat.CRASH_TOLERANCE
            )
        ) {
            this.hasControl = false;
            this.crashFade -= 0.01;
            this.GUI.fade = -0.01;
        } else {
            if (FLIP >= 1 - Boat.CRASH_TOLERANCE) {
                this.GUI.timer += 0.1;
            }
            if (ROLL >= 1 - Boat.CRASH_TOLERANCE) {
                this.GUI.timer += 0.2;
            }

            // Convert y axis half flips to z axis rotation
            let ay = this.a.y % (Math.PI * 2);
            ay = ay > Math.PI ? ay - (Math.PI * 2) : ay < -Math.PI ? ay + (Math.PI * 2) : ay;
            if (Math.abs(ay) > Math.PI * 0.5) {
                this.a.z += Math.PI;
                this.GUI.timer += 0.2;
            }

            this.GUI.timer = Math.min(1, this.GUI.timer);

            this.a.x = 0;
            this.a.y = 0;
        }

        Splash.createSplash(...ptToScreen(this.x, this.y), 1);
    }

    private _setShowControls(key: keyof typeof this.GUI.controls) {
        if (!this.GUI.controlsComplete && this.GUI.controls[key] === 1) {
            this.GUI.controls[key] -= 0.1;
        }
    }
}
