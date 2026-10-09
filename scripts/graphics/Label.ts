import {
    BREAKPOINT_W_MD,
    CLASS_TOPIC_BUTTON_DISABLED,
    COLOR_TEXT_L, COLOR_TEXT_L_OUTLINE, COLOR_TEXT_SHADOW,
    DURATION_SH,
    HEIGHT_MAIN_SECTION,
    HEIGHT_MAIN_SECTION_GAP_VS, HEIGHT_MAIN_SECTION_GAP_VL,
    FONT_FAM_TITLE, FONT_WEIGHT_SECTION,
    LABEL_ANGLE, LABEL_LETTER_SHADOW_BLUR, 
    LABEL_LETTER_HEIGHT, LABEL_LETTER_WIDTH, LABEL_LINE_HEIGHT, FONT_SIZE_SECTION,
    LABEL_LETTER_HEIGHT_SM, LABEL_LETTER_WIDTH_SM, LABEL_LINE_HEIGHT_SM, FONT_SIZE_SECTION_SM,
    WIDTH_PAGE_MAX,
    WIDTH_STROKE_OUTLINE,
} from "../consts";
import { eEaseState, eEaseType } from "../types";
import { Canvas } from "./Canvas";
import { Ease } from "./Ease";
import { isoScale as ISO_SCALE, labelIsoZ as LABEL_ISO_Z } from "./main";

export class Label {
    private EL: HTMLButtonElement;
    private readonly BREAK_CHAR: string = '/';
    
    public readonly LETTERS: LabelLetter[];
    public readonly INDEX: number;

    public pressAni: Ease = new Ease(100, eEaseType.Ease, true);
    public hoverAni: Ease = new Ease(DURATION_SH, eEaseType.Ease, true);

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
            .match(new RegExp(`(^|\\${ this.BREAK_CHAR })([^\\${ this.BREAK_CHAR }]+)$`))![2]
            .length;
        this.LETTERS = this.EL.innerText
            .split('')
            .filter(l => l !== ' ')
            .map((l, li, lArr) => new LabelLetter(
                this,
                l,
                li === lArr.length - LAST_LINE ? LAST_LINE : 0
            ));
        this.EL.innerText = this.EL.innerText.replace(this.BREAK_CHAR, this.BREAK_CHAR + ' ');
    }

    public setPosition(pageWidth: number, pageHeight: number) {
        const
            VIEWPORT_SM = pageWidth < BREAKPOINT_W_MD,
            LETTER_WIDTH = VIEWPORT_SM ? LABEL_LETTER_WIDTH_SM : LABEL_LETTER_WIDTH,
            LETTER_HEIGHT = VIEWPORT_SM ? LABEL_LETTER_HEIGHT_SM : LABEL_LETTER_HEIGHT,
            LINE_HEIGHT = VIEWPORT_SM ? LABEL_LINE_HEIGHT_SM : LABEL_LINE_HEIGHT;

        const
            BREAK = this.LETTERS.findIndex(l => l.LETTER === this.BREAK_CHAR),
            LINE_0_LENGTH = BREAK === -1 ? this.LETTERS.length - 1 : BREAK,
            LINE_1_LENGTH = this.LETTERS.length - LINE_0_LENGTH,
            LINE_0_WIDTH = (LINE_0_LENGTH * LETTER_WIDTH),
            LINE_1_WIDTH = (LINE_1_LENGTH * LETTER_WIDTH),
            LINE_0_OFF_X = (LINE_0_WIDTH * -0.5) + (LETTER_WIDTH * 0.5),
            LINE_1_OFF_X = (LINE_1_WIDTH * -0.5) + (LETTER_WIDTH * 0.5),
            LINE_0_OFF_Y = LETTER_HEIGHT * -0.5,
            LINE_1_OFF_Y = LINE_0_OFF_Y + LINE_HEIGHT;

        const
            IS_LEFT = this.INDEX % 2 === 0,
            SECTION_WIDTH = Math.min(pageWidth, WIDTH_PAGE_MAX) * 0.5,
            SECTION_HEIGHT = pageHeight * HEIGHT_MAIN_SECTION,
            SECTION_GAP = pageHeight * (VIEWPORT_SM ? HEIGHT_MAIN_SECTION_GAP_VS : HEIGHT_MAIN_SECTION_GAP_VL),
            ALIGN_X = VIEWPORT_SM
                ? 0
                : IS_LEFT
                ? -0.5
                : 0.5,
            SECTION_OFFSET_X =
                (pageWidth * (VIEWPORT_SM && this.LETTERS.length < 12 ? 0.6 : 0.5)) +
                (SECTION_WIDTH * ALIGN_X) -
                (LETTER_WIDTH * 0.5),
            SECTION_OFFSET_Y =
                pageHeight +
                SECTION_GAP +
                (this.INDEX * (SECTION_HEIGHT + SECTION_GAP)) +
                (SECTION_HEIGHT * 0.5) +
                (VIEWPORT_SM ? pageHeight * 0.17 : 0) +
                (LETTER_HEIGHT * 0.25) +
                LABEL_ISO_Z;

        this.LETTERS.forEach((l, li) => {
            const
                LINE_1 = li > LINE_0_LENGTH,
                X =
                    (LINE_1 ? LINE_1_OFF_X : LINE_0_OFF_X) +
                    ((LINE_1 ? li - LINE_0_LENGTH : li) * LETTER_WIDTH),
                Y = LINE_1 ? LINE_1_OFF_Y : LINE_0_OFF_Y,
                MAG = Math.sqrt(X**2 + Y**2),
                ANG = Math.atan2(Y, X) + LABEL_ANGLE;

            l.x = SECTION_OFFSET_X + (Math.cos(ANG) * MAG);
            l.y = SECTION_OFFSET_Y + (Math.sin(ANG) * MAG);
        });
    }

    public preRender(isSmallViewport: boolean) {
        this.LETTERS.forEach(l => l.preRender(isSmallViewport));
    }

    public setY(y: number) {
        this.EL.style.top = y + 24 + 'px';
        this.EL.classList.toggle(CLASS_TOPIC_BUTTON_DISABLED, y > 100);
    }
}

export class LabelLetter {
    public static readonly LETTERS: LabelLetter[] = [];
    
    public x: number = 0;
    public y: number = 0;
    public drawen: boolean = false;
    public readonly LETTER: string;
    public readonly CAN_FG: Canvas = new Canvas();
    public readonly CAN_BG: Canvas = new Canvas();
    public readonly LAST_LINE: number;
    public readonly LABEL: Label;

    constructor(parent: Label, letter: string, lastLine: number) {
        this.LABEL = parent;
        this.LETTER = letter;
        this.LAST_LINE = lastLine;

        LabelLetter.LETTERS.push(this);
    }

    public preRender(isViewportSmall: boolean) {
        const
            CTX_FG = this.CAN_FG.CTX,
            CTX_BG = this.CAN_BG.CTX,
            CAN_W = isViewportSmall ? LABEL_LETTER_WIDTH_SM : LABEL_LETTER_WIDTH, 
            CAN_H = isViewportSmall ? LABEL_LETTER_WIDTH_SM : LABEL_LETTER_WIDTH,
            FONT_SIZE = (isViewportSmall ? FONT_SIZE_SECTION_SM : FONT_SIZE_SECTION) / ISO_SCALE,
            OFF_X = (isViewportSmall ? LABEL_LETTER_WIDTH_SM : LABEL_LETTER_WIDTH) * 0.55,
            OFF_Y = (isViewportSmall ? LABEL_LETTER_HEIGHT_SM : LABEL_LETTER_HEIGHT) * 0.4;

        this.CAN_FG.setSize(CAN_W, CAN_H, true);
        this.CAN_BG.setSize(CAN_W, CAN_H, true);

        CTX_FG.strokeStyle = COLOR_TEXT_L_OUTLINE;
        CTX_FG.fillStyle = COLOR_TEXT_L;
        
        CTX_BG.strokeStyle = '#0000';
        CTX_BG.fillStyle = COLOR_TEXT_SHADOW;
        CTX_BG.filter = `blur(${ LABEL_LETTER_SHADOW_BLUR }px)`;

        [CTX_FG, CTX_BG].forEach(c => {
            c.save();
                c.font = `${ FONT_WEIGHT_SECTION } ${ FONT_SIZE }px "${ FONT_FAM_TITLE }"`;
                c.textAlign = 'center';
                c.textBaseline = 'middle';
                c.lineWidth = (WIDTH_STROKE_OUTLINE * 2) / ISO_SCALE;

                c.translate(OFF_X, OFF_Y);
                c.scale(1.25 * ISO_SCALE, 0.75 * ISO_SCALE);
                c.rotate(-0.7);
                c.strokeText(this.LETTER, 0, 0);
                c.fillText(this.LETTER, 0, 0);
            c.restore();
        });
    }
}