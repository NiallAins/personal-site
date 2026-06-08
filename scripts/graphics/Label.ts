import {
    COLOR_TEXT_L, COLOR_TEXT_L_OUTLINE, COLOR_TEXT_SHADOW,
    DURATION_LG, DURATION_SH,
    FONT_FAM_TITLE, FONT_SIZE_SECTION, FONT_WEIGHT_SECTION,
    ISO_SCALE, LABEL_LETTER_HEIGHT, LABEL_LETTER_SHADOW_BLUR, LABEL_LETTER_SPACE, LABEL_LETTER_WIDTH,
    LABEL_LINE_HEIGHT,
    WIDTH_STROKE_OUTLINE
} from "../consts";
import { eEaseState, eEaseType } from "../types";
import { Canvas } from "./Canvas";
import { Ease } from "./Ease";

export class Label {
    public pressAni: Ease = new Ease(DURATION_LG, eEaseType.Elastic, true);
    public hoverAni: Ease = new Ease(DURATION_SH, eEaseType.Ease, true);
    public readonly LETTERS: LabelLetter[];

    private EL: HTMLButtonElement;
    private readonly INDEX: number;

    constructor(el: HTMLButtonElement, index: number) {
        this.EL = el;
        this.INDEX = index;

        this.EL.onmousedown  = () => this.pressAni.play(eEaseState.Forward);
        this.EL.onmouseup    = () => this.pressAni.play(eEaseState.Backward);
        this.EL.onmouseenter = () => this.hoverAni.play(eEaseState.Forward);
        this.EL.onmouseleave = () => {
            this.pressAni.play(eEaseState.Backward);
            this.hoverAni.play(eEaseState.Backward);
        };

        this.EL.setAttribute('aria-label', this.EL.innerText);
        this.EL.innerText = this.EL.innerText.replace(/ /g, '');

        const LAST_LINE = this.EL.innerText
            .match(/(^|\/)([^\/]+)$/)![2]
            .length;
        this.LETTERS = this.EL.innerText
            .split('')
            .filter(l => l !== ' ')
            .map((l, li, lArr) => new LabelLetter(
                this,
                l,
                li === lArr.length - LAST_LINE ? LAST_LINE : 0
            ));
        this.EL.innerText = this.EL.innerText.replace('/', '/ ');
    }

    public setPosition(pageWidth: number, pageHeight: number) {
        const
            BREAK = this.LETTERS.findIndex(l => l.LETTER === '/'),
            X = (pageWidth * (this.INDEX % 2 ? 0.65 : 0.35)) - ((BREAK > -1 ? BREAK : this.LETTERS.length) * ISO_SCALE * 2),
            Y = (pageHeight * 1.5) + (pageHeight * 0.5 * this.INDEX);

        let
            x = X,
            y = Y;
        this.LETTERS.forEach(l => {
            l.x = x;
            l.y = y;

            x += LABEL_LETTER_SPACE;
            y -= LABEL_LINE_HEIGHT;

            if (l.LETTER === '/') {
                x = X + LABEL_LINE_HEIGHT;
                y = Y + (LABEL_LINE_HEIGHT * 2);
            }
        });
    }

    public preRender() {
        this.LETTERS.forEach(l => l.preRender());
    }

    public setY(y: number) {
        this.EL.style.top = y + 'px';
        this.EL.style.pointerEvents = y > 100 ? 'none' : 'all';
    }
}

export class LabelLetter {
    public static readonly LETTERS: LabelLetter[] = [];

    private readonly CTX_FG: CanvasRenderingContext2D;
    private readonly CTX_BG: CanvasRenderingContext2D;
    
    public x: number = 0;
    public y: number = 0;
    public drawen: boolean = false;
    public readonly LETTER: string;
    public readonly CAN_FG: HTMLCanvasElement;
    public readonly CAN_BG: HTMLCanvasElement;
    public readonly LAST_LINE: number;
    public readonly LABEL: Label;

    constructor(parent: Label, letter: string, lastLine: number) {
        this.LABEL = parent;
        this.LETTER = letter;
        this.LAST_LINE = lastLine;

        const
            CAN_FG = new Canvas('', LABEL_LETTER_WIDTH, LABEL_LETTER_HEIGHT, true),
            CAN_BG = new Canvas('', LABEL_LETTER_WIDTH, LABEL_LETTER_HEIGHT, true);

        this.CTX_FG = CAN_FG.CTX;
        this.CTX_BG = CAN_BG.CTX;
        this.CAN_FG = CAN_FG.CAN;
        this.CAN_BG = CAN_BG.CAN;

        LabelLetter.LETTERS.push(this);
    }

    public preRender() {
        this.CTX_FG.strokeStyle = COLOR_TEXT_L_OUTLINE;
        this.CTX_FG.fillStyle = COLOR_TEXT_L;
        
        this.CTX_BG.strokeStyle = '#0000';
        this.CTX_BG.fillStyle = COLOR_TEXT_SHADOW;
        this.CTX_BG.filter = `blur(${ LABEL_LETTER_SHADOW_BLUR }px)`;

        [this.CTX_FG, this.CTX_BG].forEach(c => {
            c.font = `${ FONT_WEIGHT_SECTION } ${ FONT_SIZE_SECTION / ISO_SCALE }px "${ FONT_FAM_TITLE }"`;
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.lineWidth = (WIDTH_STROKE_OUTLINE * 2) / ISO_SCALE;

            c.translate(LABEL_LETTER_WIDTH * 0.55, LABEL_LETTER_HEIGHT * 0.4);
            c.scale(1.25 * ISO_SCALE, 0.75 * ISO_SCALE);
            c.rotate(-0.7);
            c.strokeText(this.LETTER, 0, 0);
            c.fillText(this.LETTER, 0, 0);
        });
    }
}