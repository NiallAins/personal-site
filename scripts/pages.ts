import {
    CLASS_BODY_PAGE_OPEN, CLASS_PAGE_OPEN,
    DURATION_SH,
    EL_BODY, EL_MAIN, EL_PAGE_CONTAINER
} from "./consts";
import { PAGE_DATA } from "./pages.json";
import { toggleSectionOpen as toggleGraphicsSectionOpen } from "./graphics/main";
import { html, toCamelCase } from "./util";

const
    EL_PAGES: HTMLDivElement[] = [],
    EL_IMGS: HTMLImageElement[][] = [];

export const
    EL_TOPIC_BUTTONS: HTMLButtonElement[] = [];

export function initPages() {
    PAGE_DATA.forEach((page, pi) => {
        // Add topic button
        const [EL_TOPIC, EL_TOPIC_BUTTON] = html`
            <div class="main__section">
                <#button
                    class="main__section-button"
                    onclick="${ openPage.bind(null, pi) }"
                >
                    ${ page.label }
                </button>
            </div>
        `;
        EL_MAIN.appendChild(EL_TOPIC);
        EL_TOPIC_BUTTONS.push(EL_TOPIC_BUTTON as HTMLButtonElement);

        // Add page
        const [EL_PAGE, ...EL_PAGE_IMGS] = html`
            <div class="pages__page">
                <div class="pages__page-container">
                    ${
                        page.items.map(item => html`
                            <button class="pages__page-item">
                                <div class="pages__page-item-top"></div>
                                <div class="pages__page-item-image">
                                    <#img
                                        class="pages__page-item-image-image"
                                        data-src="./images/${ toCamelCase(item.title) }.sm.png"
                                        alt='screenshot from the project "${ item.title }"'
                                    />
                                </div>
                                <h3 class="pages__page-item-label">
                                    ${ item.title }
                                </h3>
                            </button>
                        `)
                    }
                </div>
            </div>
        `;
        
        EL_IMGS.push(EL_PAGE_IMGS as HTMLImageElement[])
        EL_PAGES.push(EL_PAGE as HTMLDivElement);
        EL_PAGE_CONTAINER.appendChild(EL_PAGE);
    });

    EL_PAGE_CONTAINER.appendChild(html`
        <button
            class="pages__close"
            onclick="${ closePage }"
        >
            <span class="pages__close-caret"></span>
        </buttin>
    `[0]);
}

export function openPage(index: number) {
    toggleGraphicsSectionOpen();

    setTimeout(() => {
        EL_BODY.classList.add(CLASS_BODY_PAGE_OPEN);
        EL_PAGES[index].classList.add(CLASS_PAGE_OPEN);
    }, DURATION_SH);

    // Lazy load images
    EL_IMGS[index]
        .filter(img => !img.getAttribute('src'))
        .forEach(img => img.setAttribute('src', img.dataset.src!));
}

export function closePage() {
    toggleGraphicsSectionOpen();
    EL_BODY.classList.remove(CLASS_BODY_PAGE_OPEN);
    EL_PAGES.forEach(p => p.classList.remove(CLASS_PAGE_OPEN));
}