import {
    COLOR_TEXT_L, COLOR_TEXT_SHADOW,
    FONT_FAM_TITLE,
    FONT_SIZE_SECTION,
    FONT_WEIGHT_SECTION,
    ISO_SCALE,
    LABEL_LETTER_HEIGHT, LABEL_LETTER_SHADOW, LABEL_LETTER_WIDTH
} from "../consts";
import { Canvas } from "./Canvas";
import { ptFromScreen, ptToScreen } from "./terrain";

export class Label {
    public hover: number = 0;
    public hovering: boolean = false;
    public readonly LETTERS: LabelLetter[];

    private EL: HTMLButtonElement;
    private readonly INDEX: number;

    constructor(el: HTMLButtonElement, index: number) {
        this.EL = el;
        this.INDEX = index;

        this.EL.onmouseenter = () => this.hovering = true;
        this.EL.onmouseleave = () => this.hovering = false;

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

        const
            LETTER_SPACE = ISO_SCALE * 2,
            LINE_HEIGHT = ISO_SCALE * 4;
        let
            x = X,
            y = Y;
        this.LETTERS.forEach((l, li) => {
            l.x = x;
            l.y = y;

            x += LETTER_SPACE * 2;
            y -= LETTER_SPACE;

            if (l.LETTER === '/') {
                x = X + LINE_HEIGHT;
                y = Y + LINE_HEIGHT;
            }
        });
    }

    public preRender() {
        this.LETTERS.forEach(l => l.preRender());
    }

    public toggleAllowClick(state: boolean) {
        this.EL.style.pointerEvents = state ? 'all' : 'none';
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
        this.CTX_FG.fillStyle = COLOR_TEXT_L;
        this.CTX_BG.fillStyle = COLOR_TEXT_SHADOW;
        this.CTX_BG.filter = `blur(${ LABEL_LETTER_SHADOW }px)`;

        [this.CTX_FG, this.CTX_BG].forEach(c => {
            c.translate(LABEL_LETTER_WIDTH * 0.55, LABEL_LETTER_HEIGHT * 0.4);
            c.scale(1.25 * ISO_SCALE, 0.75 * ISO_SCALE);
            c.rotate(-0.70);
            c.font = `${ FONT_WEIGHT_SECTION } ${ FONT_SIZE_SECTION / ISO_SCALE }px "${ FONT_FAM_TITLE }"`;
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.fillText(this.LETTER, 0, 0);
        });
    }
}