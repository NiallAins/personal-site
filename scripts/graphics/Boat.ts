import * as Three from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { _DEBUG_log } from "../_debug";
import { Canvas } from "./Canvas";
import { KEYS, toggleInputListeners, toggleKeyLock } from "./Inputs";
import { renderSingleIso } from "./terrain";


export class Boat {

    //
    // Static properties
    //

    protected static readonly CAN_W = 96;
    public static readonly CAN_CENTER_X = Boat.CAN_W * 0.5;
    public static readonly CAN_CENTER_Y = Boat.CAN_W * 0.75;
    protected static readonly MODEL_SRC: string = './assets/boat.glb';

    protected static readonly DDP: number = 1.25;
    protected static readonly DAA: number = 0.01;
    protected static readonly DZ_JUMP: number = -50;
    protected static readonly MAX_DP: number = 4**2;
    protected static readonly MAX_DP_REV: number = 2**2;
    protected static readonly MAX_DANG: number = 1;
    protected static readonly FRIC_D: number = 0.92;
    protected static readonly FRIC_A: number = 0.9;
    protected static readonly GRAV: number = 7;


    //
    // Private properties
    //

    private ang: number = Math.PI * 0.125;
    private dAng: number = 0;
    private dP: number = 0;
    private dZ: number = 0;
    private model: Three.Group | null = null;
    private onGround: boolean = false;
    
    
    //
    // Public properties
    //
    
    public readonly CAN: HTMLCanvasElement;
    public x: number;
    public y: number;
    public z: number = 0;
    public hasControl: boolean = false;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;


        //
        // Create scene
        //
    
        const
            SCENE = new Three.Scene(),
            CTX = new Three.WebGLRenderer();
    
        CTX.setSize(Boat.CAN_W, Boat.CAN_W);
        CTX.setClearColor(0x00ff00, 0);
        this.CAN = CTX.domElement;

        const LIGHT = new Three.DirectionalLight(0xffffff, 1);
        LIGHT.position.set(5, 5, 5);
        SCENE.add(LIGHT);
    
    
        //
        // Set isometirc camera
        //
    
        const camera = new Three.OrthographicCamera(
            -1, 1,
            1, -1,
            1, 2000
        );
        camera.position.set(0, 0, 100);

        this._render = () => CTX.render(SCENE, camera);
        this._loadModel(SCENE);

        this.toggleControls(true);
    }


    //
    // Public methods
    //

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
        toggleInputListeners(
            [
                'mousewheel',
                'mousedown'
            ],
            { removeControls: () => this.toggleControls(false) },
            state
        );
    }

    public step(dT: number, groundZ: number) {
        if (this.hasControl) {
            if (KEYS.ArrowUp.pressed) {
                this._move(false);
            }
            if (KEYS.ArrowDown.pressed) {
                this._move(true);
            }
            if (KEYS.ArrowLeft.pressed) {
                this._turn(true);
            }
            if (KEYS.ArrowRight.pressed) {
                this._turn(false);
            }
            if (KEYS.Space.down) {
                this._jump();
            }
        }

        const PREV_ANG = this.ang;
        this.ang += this.dAng * dT;
        this.dAng *= Boat.FRIC_A;

        this.x += this.dP * Math.cos(this.ang) * dT;
        this.y += this.dP * Math.sin(this.ang) * dT;
        this.z += this.dZ * dT;
        this.dP *= Boat.FRIC_D;


        if (this.z < groundZ) {
            this.dZ += Boat.GRAV * dT;
        } else {
            this.z = groundZ;
            this.dZ = 0;
            this.onGround = true;
        }

        if (this.model && PREV_ANG !== this.ang) {
            this.model.rotation.y = Math.PI - this.ang;
            this._render();
        }
    }


    //
    // Private / Protected methods
    //

    protected _move(isReverse: boolean) {
        if (isReverse) {
            this.dP -= Boat.DDP;
            this.dP = Math.max(Boat.MAX_DP_REV * -1, this.dP);
        } else {
            this.dP += Boat.DDP;
            this.dP = Math.min(Boat.MAX_DP, this.dP);
        }
    }

    protected _turn(isCounter: boolean) {
        this.dAng += Boat.DAA * (isCounter ? -1 : 1);
        this.dAng = Math.max(Boat.MAX_DANG * -1, Math.min(Boat.MAX_DANG, this.dAng));
    }

    protected _jump() {
        if (this.onGround) {
            this.dZ = Boat.DZ_JUMP;
            this.onGround = false;
        }
    }

    private async _loadModel(scene: Three.Scene) {
        const LOADER = new GLTFLoader();

        this.model = await new Promise(
            resolve => LOADER.load(
                Boat.MODEL_SRC,
                model => resolve(model.scene)
            )
        );

        this.model!.rotation.y = Math.PI - this.ang;
        this.model!.rotation.x = 35.264 * (Math.PI / 180);

        const SCALE = 0.3;
        this.model!.scale.set(SCALE, SCALE, SCALE);

        scene.add(this.model!);
        this._render();
    }

    private _render: () => void;

    // private _render() {
    //     const C = this._CAN.CTX;
    //     C.clearRect(0, 0, Boat.CAN_W, Boat.CAN_W);
    //     C.save();
    //         C.translate(Boat.CAN_W / 2, Boat.CAN_W / 2);
    //         C.scale(1, -1);
    //         renderSingleIso(C, 0, 0, 0, 0, ['red']);
    //         C.beginPath();
    //             C.beginPath();
    //             C.moveTo(Boat.CAN_W * -0.5, 0);
    //             C.lineTo(Boat.CAN_W *  0.5, 0);
    //             C.moveTo(0, Boat.CAN_W * -0.5);
    //             C.lineTo(0, Boat.CAN_W *  0.5);
    //         C.lineWidth = 3;
    //         C.strokeStyle = 'green';
    //         C.stroke();
    //     C.restore();
    // }
}