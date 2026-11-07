import * as Three from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { _DEBUG_log } from "../_debug";
import { KEYS, toggleKeyLock } from "./Inputs";
import { renderSingleIso, ptToScreen } from "./terrain";
import { Splash } from './Splash';
import { CAN_QUALITY, CLASS_BOAT_ACTIVE, COLOR_TEXT_L, EL_BOAT, ISO_SCALE_LG, Z_UNIT_SCALE } from '../consts';
import { Canvas } from './Canvas';

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
    public static readonly CAN_CENTER_X = Boat.CAN_W * 0.5;
    public static readonly CAN_CENTER_Y = Boat.CAN_CENTER_X - (Boat.CAN_W * 0.125);

    // PLanar movement
    protected static DDP = 0.03;
    protected static DDP_REV = Boat.DDP * -0.2;
    protected static DP_MAX2 = (0.8)**2;

    // Vertical movement
    protected static DP_JUMP = 1;
    protected static GRAV = -0.08;
    protected static FRIC_P = {
        [eSurface.Sea]: -0.03,
        [eSurface.Land]: -0.3,
        [eSurface.Air]: 0
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
            [eRotation.Flip]: 0.4,
            [eRotation.Roll]: 0.4
        }
    };
    protected static FRIC_A = {
        [eSurface.Sea]: -0.3,
        [eSurface.Land]: -0.5,
        [eSurface.Air]: 0
    };


    //
    // Private properties
    //

    private p  = new Vec(0, 0, 0);
    private prevP  = new Vec(0, 0, 0);
    private dP = new Vec(0, 0, 0);
    private a  = new Vec(0, 0, 0);
    private dA = new Vec(0, 0, 0);
    private fP = new Vec(0, 0, 0);
    private fA = new Vec(0, 0, 0);
    private grad = new Vec(0, 0);
    private surface = eSurface.Sea;
    private prevSurface = eSurface.Sea;
    private doubleKeyDAReset = 0;
    private flipXActive = false;
    private flipYActive = false;
    private model: Three.Group | null = null;
    private wakeThrottle = 0;
    private allowControl = false;
    private GUI = {
        fade: 0,
        timer: 0,
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

    public readonly CAN: HTMLCanvasElement;
    public hasControl: boolean = false;
    public alti = 0;


    set x(newX: number) {
        this.p.x = newX;
    }
    get x() {
        return this.p.x;
    }

    set y(newY: number) {
        this.p.y = newY;
    }
    get y() {
        return this.p.y;
    }
    
    set z(newZ: number) {
        this.p.z = newZ;
    }
    get z() {
        return this.p.z;
    }

    constructor(x: number, y: number, allowControl: boolean) {
        this.p.x = x;
        this.p.y = y;
        this.allowControl = allowControl;

        if (allowControl) {
            EL_BOAT.addEventListener('click', this.toggleControls.bind(this, true));
            EL_BOAT.style.width = (Boat.CAN_W * Boat.BUTTON_SCALE) + 'px';
            EL_BOAT.style.height = (Boat.CAN_W * Boat.BUTTON_SCALE) + 'px';
            window.addEventListener('mousewheel', this.toggleControls.bind(this, false));
            window.addEventListener('keydown', e => e.code === 'Escape' ? this.toggleControls.bind(this, false) : null);
        }
    
        const
            SCENE = new Three.Scene(),
            CTX = new Three.WebGLRenderer(),
            LIGHT = new Three.DirectionalLight(0xffffff, 2),
            CAM = new Three.OrthographicCamera(
                -1,    1,
                 1,   -1,
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

    public step(
        dT: number,
        getZ: (x: number, y: number) => [number, boolean]
    ) {
        this._setPositionalForces();
        this._setAngularForces();

        this._applyForces(dT);
        this._applySurface(getZ);

        this.fP = new Vec();
        this.fA = new Vec();
        this.prevP = this.p.copy();

        // GUI
        const FADE = 0.1 * dT;
        if (this.GUI.fade > 0 && this.GUI.fade < 1) {
            this.GUI.fade += FADE;
        } else if (this.GUI.fade < 0 && this.GUI.fade > -1) {
            this.GUI.fade -= FADE;
        }
        if (this.hasControl) {
            if (this.GUI.controlsComplete) {
                this.GUI.timer -= 0.001 * dT;
                if (this.GUI.timer <= 0) {
                    this.toggleControls(false);
                }
            } else {
                let c: keyof typeof this.GUI.controls;
                for (c in this.GUI.controls) {
                    if (this.GUI.controls[c] < 1) {
                        this.GUI.controls[c] -= FADE;
                    }
                }
            }
        }
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

            if (this.surface === eSurface.Air) {
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
            if (this.dP.x + this.dP.y > 0) {
                Splash.createSplash(sx, sy - window.scrollY);
                this.wakeThrottle = 5;
            }
        } else {
            this.wakeThrottle -= 1;
        }

        // Shadow
        if (this.alti) {
            const SIZE = Math.max(0, Math.min(1, this.alti / 7));
            C.save();
                C.fillStyle = 'black'; 
                C.beginPath();
                    C.translate(sx, sy + ((this.alti - 0.75) * Z_UNIT_SCALE));
                    C.scale(1, 0.5)
                    C.filter = `blur(${ 2 + (18 * SIZE) }px)`;
                    C.globalAlpha = 0.5 - (0.4 * SIZE);
                    C.arc(0, 0, ISO_SCALE_LG * (1.5 + (2.5 * SIZE)), 0, Math.PI * 2);
                C.fill();
            C.restore();
        }

        // Draw to canvas
        can.drawFromCanvas(
            this.CAN,
            sx - Boat.CAN_CENTER_X,
            sy - Boat.CAN_CENTER_Y
        );

        if (this.hasControl) {
            const
                KEY_W = 18,
                KEY_S = 4;
    
            C.save();
                C.translate(sx + KEY_W*3, sy - KEY_W*2);
                
                const FADE = 0.5 * Math.abs(this.GUI.fade);
                if (this.GUI.controlsComplete) {
                    C.globalAlpha =FADE;
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
                        C.fillRect(0, 0, 4*KEY_W + 3*KEY_S, KEY_W);
                    }
                    
                    C.translate(KEY_W + KEY_S, -1 * (KEY_W + KEY_S*2));
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
        if (state) {
            this.GUI.fade = 0.01;
            this.GUI.timer = 1;
        } else {
            this.GUI.fade = -0.99;
        }
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
            const SCALE = 0.125;
            this.model.scale.set(SCALE, SCALE, SCALE);

            scene.add(this.model!);
        }
    }

    private _renderModel = () => {}
    
    // Z position
    private _moveJump() {
        if (this.surface !== eSurface.Air) {
            this.fP.z += Boat.DP_JUMP * (this.surface === eSurface.Land ? 0.5 : 1);
        }
    }

    // X, Y position
    private _moveAccel(reverse: boolean) {
        if (
            this.surface !== eSurface.Air &&
            this.dP.x** 2 + this.dP.y**2 <= Boat.DP_MAX2
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

    private _setPositionalForces() {
        if (this.hasControl) {
            // Accelerate
            if (KEYS.ArrowUp.pressed) {
                this._setShowControls('up');
                this._moveAccel(false);
            } else  if (KEYS.ArrowDown.pressed) {
                this._setShowControls('down');
                this._moveAccel(true);
            }
        
            // Jump
            if (KEYS.Space.down) {
                this._setShowControls('space');
                this._moveJump();
            }
        }

        // Gravity
        if (this.surface === eSurface.Air) {
            this.fP.z += Boat.GRAV;
        }
    
        // Friction
        this.fP.x += this.dP.x * Boat.FRIC_P[this.surface];
        this.fP.y += this.dP.y * Boat.FRIC_P[this.surface];
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
        // Positional Movement
        this.dP.add(this.fP);
        this.p.add(this.dP.scale(dT, true));

        // Angular movement
        this.dA.add(this.fA);
        this.a.add(this.dA.scale(dT, true));
    }
    
    private _applySurface(getZ: (x: number, y: number) => [number, boolean]) {
        const [
            GROUND_Z,
            ON_LAND_0
         ] = getZ(this.p.x, this.p.y);

        // On ground
        if (this.p.z - GROUND_Z < 0.2) {
            // Move to contact
            this.p.z = GROUND_Z;
            this.alti = 0;
        
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

            if (this.prevSurface === eSurface.Air) {
                this._onJumpEnd();
            }

            this.grad.x = Math.atan2(X0 - X1, CHECK_DIS * 2);
            this.grad.y = Math.atan2(Y0 - Y1, CHECK_DIS * 2);

            _DEBUG_log('g: ' + this.grad.x, 'p: '+ this.dP.x);
            if (this.surface === eSurface.Land) {
                const MAX_GRAD = 0.4;
                if (this.grad.x > MAX_GRAD) {
                    if (this.dP.x < 0) {
                        this.p.x = this.prevP.x;
                    }
                } else if (this.grad.x < -1 * MAX_GRAD) {
                    if (this.dP.x > 0) {
                        this.p.x = this.prevP.x;
                    }
                }
                if (this.grad.y > 0.4) {
                    if (this.dP.y < 0) {
                        this.p.y = this.prevP.y;
                    }
                } else if (this.grad.y < -1 * MAX_GRAD) {
                    if (this.dP.y > 0) {
                        this.p.y = this.prevP.y;
                    }
                }
            }
        }
    
        // In air
        else {
            this.surface = eSurface.Air;
            this.alti = this.p.z - GROUND_Z;

            if (this.prevSurface !== eSurface.Air) {
                this._onJumpStart();
            }
        }

        this.prevSurface = this.surface;
    }

    private _onJumpStart() {
        this.dA.y += Math.random()*0.05 - 0.025;
        this.dA.z += Math.random()*0.05 - 0.025;
    }
    
    private _onJumpEnd() {
        this.flipXActive = false;
        this.flipYActive = false;
        
        // Convert y axis half flips to z axis rotation
        let ay = this.a.y % (Math.PI * 2);
        ay = ay > Math.PI ? ay - (Math.PI * 2) : ay < -Math.PI ? ay + (Math.PI * 2) : ay;
        if (Math.abs(ay) > Math.PI * 0.5) {
            this.a.z += Math.PI;
        }

        if (this.dP.z < -0.5) {
            Splash.createSplash(...ptToScreen(this.x, this.y), 1);
        }

        this.a.x = 0;
        this.a.y = 0;
        this.dA.x = 0;
        this.dA.y = 0;
        this.dP.z = 0;
    }

    private _setShowControls(key: keyof typeof this.GUI.controls) {
        if (!this.GUI.controlsComplete) {
            if (this.GUI.controls[key] === 1) {
                this.GUI.controls[key] -= 0.1;
            }
            if (Object.values(this.GUI.controls).every(O => O <= 0)) {
                this.GUI.controlsComplete = true;
                this.GUI.fade = 0.1;
                this.GUI.timer = 1;
            }
        }
    }
}

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
