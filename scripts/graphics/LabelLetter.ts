import {
    COLOR_TEXT_L, COLOR_TEXT_SHADOW,
    ISO_SCALE,
    LABEL_LETTER_HEIGHT, LABEL_LETTER_SHADOW, LABEL_LETTER_WIDTH,
    PAGE_HEIGHT, PAGE_WIDTH, SECTION_LABELS
} from "../consts";
import { openPage } from "../pages";
import { Canvas } from "./Canvas";
import { ptFromScreen } from "./graphics";

export class LabelLetter {
    private readonly LETTER: string;

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

        CAN_FG.CTX.fillStyle = COLOR_TEXT_L;
        CAN_BG.CTX.fillStyle = COLOR_TEXT_SHADOW;
        CAN_BG.CTX.filter = `blur(${ LABEL_LETTER_SHADOW }px)`;

        [CAN_FG, CAN_BG].forEach(c => {
            c.CTX.translate(LABEL_LETTER_WIDTH * 0.45, LABEL_LETTER_HEIGHT * 0.3);
            c.CTX.scale(1.25 * ISO_SCALE, 0.75 * ISO_SCALE);
            c.CTX.rotate(-0.7616);
            c.CTX.font = "4px 'Neuton'";
            c.CTX.textAlign = 'center';
            c.CTX.textBaseline = 'middle';
            c.CTX.fillText(this.LETTER, 0, 0);
        });

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

        el.onclick = () => openPage(index);

        return TEXT
            .split('')
            .map((letter, li) => {
                const LETTER = new LabelLetter(PT[0], PT[1] - (li * 2), letter);
                el.addEventListener('mouseenter', () => LETTER.hover = 0.1);
                el.addEventListener('mouseleave', () => LETTER.hover = 0);
                return LETTER;
            });
    }
}