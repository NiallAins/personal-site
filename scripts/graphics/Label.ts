import {
    COLOR_TEXT_L, COLOR_TEXT_SHADOW,
    FONT_FAM_TITLE,
    FONT_SIZE_SECTION,
    FONT_WEIGHT_SECTION,
    ISO_SCALE,
    LABEL_LETTER_HEIGHT, LABEL_LETTER_SHADOW, LABEL_LETTER_WIDTH
} from "../consts";
import { Canvas } from "./Canvas";
import { toggleSectionOpen } from "./main";
import { ptFromScreen } from "./terrain";

export class Label {
    public hover: number = 0;

    private EL: HTMLButtonElement;
    private readonly letters: LabelLetter[];
    private readonly INDEX: number;

    constructor(el: HTMLButtonElement, index: number) {
        this.EL = el;
        this.INDEX = index;

        this.EL.onclick = () => toggleSectionOpen();
        this.EL.onmouseenter = () => this.hover = 0.1;
        this.EL.onmouseleave = () => this.hover = 0;

        this.letters = this.EL.innerText
            .split('')
            .map(l => new LabelLetter(this, l));
    }

    public setPosition(pageWidth: number, pageHeight: number) {
        const PT = ptFromScreen(
            (pageWidth * (this.INDEX % 2 ? 0.65 : 0.35)) - (this.letters.length * ISO_SCALE * 2),
            (pageHeight * 1.425) + (pageHeight * 0.5 * this.INDEX)
        );

        this.EL.style.left = (pageWidth * (this.INDEX % 2 ? 0.65 : 0.325)) + 'px';

        this.letters.forEach((l, li) => {
            l.x = PT[0];
            l.y = PT[1] - (li * 2)
        });
    }

    public findLetter(x: number, y: number): LabelLetter | undefined {
        return this.letters.find(l => l.x === x && l.y === y);
    }

    public draw() {
        this.letters.forEach(l => l.draw());
    }

    public toggleClick(state: boolean) {
        this.EL.style.pointerEvents = state ? 'all' : 'none';
    }

    public setY(y: number) {
        this.EL.style.top = y + 'px';
    }
}

export class LabelLetter {
    private readonly LETTER: string;
    private readonly CTX_FG: CanvasRenderingContext2D;
    private readonly CTX_BG: CanvasRenderingContext2D;

    public x: number = 0;
    public y: number = 0;
    public readonly CAN_FG: HTMLCanvasElement;
    public readonly CAN_BG: HTMLCanvasElement;
    public readonly LABEL: Label;

    constructor(parent: Label, letter: string) {
        this.LABEL = parent;
        this.LETTER = letter;

        const
            CAN_FG = new Canvas('', LABEL_LETTER_WIDTH, LABEL_LETTER_HEIGHT),
            CAN_BG = new Canvas('', LABEL_LETTER_WIDTH, LABEL_LETTER_HEIGHT);

        this.CTX_FG = CAN_FG.CTX;
        this.CTX_BG = CAN_BG.CTX;
        this.CAN_FG = CAN_FG.CAN;
        this.CAN_BG = CAN_BG.CAN;
    }

    public draw() {
        this.CTX_FG.fillStyle = COLOR_TEXT_L;
        this.CTX_BG.fillStyle = COLOR_TEXT_SHADOW;
        this.CTX_BG.filter = `blur(${ LABEL_LETTER_SHADOW }px)`;

        [this.CTX_FG, this.CTX_BG].forEach(c => {
            c.translate(LABEL_LETTER_WIDTH * 0.5, LABEL_LETTER_HEIGHT * 0.45);
            c.scale(1.25 * ISO_SCALE, 0.75 * ISO_SCALE);
            c.rotate(-0.7616);
            c.font = `${ FONT_WEIGHT_SECTION } ${ FONT_SIZE_SECTION / ISO_SCALE }px "${ FONT_FAM_TITLE }"`;
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.fillText(this.LETTER, 0, 0);
        });
    }
}