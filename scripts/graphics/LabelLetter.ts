import {
    COLOR_TEXT_D, COLOR_TEXT_SHADOW,
    FONT_TITLE,
    ISO_SCALE,
    LABEL_LETTER_HEIGHT, LABEL_LETTER_SHADOW, LABEL_LETTER_WIDTH,
    PAGE_HEIGHT, PAGE_WIDTH, SECTION_LABELS
} from "../consts";
import { openPage } from "../pages";
import { Canvas } from "./Canvas";
import { ptFromScreen, toggleSectionOpen } from "./graphics";

export class LabelLetter {
    private readonly LETTER: string;
    private readonly CTX_FG: CanvasRenderingContext2D;
    private readonly CTX_BG: CanvasRenderingContext2D;

    public readonly X: number;
    public readonly Y: number;
    public readonly CAN_FG: HTMLCanvasElement;
    public readonly CAN_BG: HTMLCanvasElement;
    public hover: number = 0;

    constructor(x: number, y: number, letter: string) {
        this.X = x;
        this.Y = y;
        this.LETTER = letter;

        const
            CAN_FG = new Canvas('', LABEL_LETTER_WIDTH, LABEL_LETTER_HEIGHT),
            CAN_BG = new Canvas('', LABEL_LETTER_WIDTH, LABEL_LETTER_HEIGHT);

        this.CTX_FG = CAN_FG.CTX;
        this.CTX_BG = CAN_BG.CTX;
        this.CAN_FG = CAN_FG.CAN;
        this.CAN_BG = CAN_BG.CAN;
    }

    public static generateFromLabelEl(el: HTMLButtonElement, index: number): LabelLetter[] {
        const
            TEXT = SECTION_LABELS[index],
            PT = ptFromScreen(
                (PAGE_WIDTH * (index % 2 ? 0.65 : 0.35)) - (TEXT.length * ISO_SCALE * 2),
                (PAGE_HEIGHT * 1.425) + (PAGE_HEIGHT * 0.5 * index)
            );

        el.style.left = (PAGE_WIDTH * (index % 2 ? 0.65 : 0.325)) + 'px';
        el.onclick = () => toggleSectionOpen();

        return TEXT
            .split('')
            .map((letter, li) => {
                const LETTER = new LabelLetter(PT[0], PT[1] - (li * 2), letter);
                el.addEventListener('mouseenter', () => LETTER.hover = 0.1);
                el.addEventListener('mouseleave', () => LETTER.hover = 0);
                return LETTER;
            });
    }

    public draw() {
        this.CTX_FG.fillStyle = COLOR_TEXT_D;
        this.CTX_BG.fillStyle = COLOR_TEXT_SHADOW;
        this.CTX_BG.filter = `blur(${ LABEL_LETTER_SHADOW }px)`;

        [this.CTX_FG, this.CTX_BG].forEach(c => {
            c.translate(LABEL_LETTER_WIDTH * 0.5, LABEL_LETTER_HEIGHT * 0.45);
            c.scale(1.25 * ISO_SCALE, 0.75 * ISO_SCALE);
            c.rotate(-0.7616);
            c.font = `500 4px "${ FONT_TITLE }"`;
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.fillText(this.LETTER, 0, 0);
        });
    }
}