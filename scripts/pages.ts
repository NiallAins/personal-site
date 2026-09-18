import {
    CLASS_BODY_PAGE_OPEN, CLASS_PAGE_ACTIVE, CLASS_PAGE_OPEN,
    COLOR_BG_L,
    DURATION_LG,
    DURATION_SH,
    EL_BODY, EL_HEADER_NAV_LINKS_CONTACT, EL_HEADER_NAV_LINKS_EXPERIENCE, EL_MAIN, EL_PAGE_CONTAINER,
    EL_PAGES_CONTACT,
    EL_PAGES_EXPERIENCE,
    EL_PAGES_PROJECT,
    EL_PAGES_PROJECT_DESC,
    EL_PAGES_PROJECT_IMAGE,
    EL_PAGES_PROJECT_LINK_CODE,
    EL_PAGES_PROJECT_LINK_LIVE,
    EL_PAGES_PROJECT_TAGS,
    EL_PAGES_PROJECT_TITLE
} from "./consts";
import { PAGE_DATA } from "./data/pages.json";
import { toggleSectionOpen as toggleGraphicsSectionOpen } from "./graphics/main";
import { html, toCamelCase } from "./util";
import { DATA_BG } from "./data/images.json";
import { tPageData, tPageDataItem, tPageTag } from "./types";

const
    EL_PAGES: HTMLDivElement[] = [],
    PAGE_IMG_URLS: [HTMLDivElement, string][][] = [];

export const
    EL_TOPIC_BUTTONS: HTMLButtonElement[] = [];

let openPageIndex: number = -1;

export function initPages() {

    //
    // Topic pages
    //

    PAGE_DATA.forEach((page, pi) => {
        // Add topic button
        const [EL_TOPIC, EL_TOPIC_BUTTON] = html`
            <div class="main__section">
                <#button
                    class="main__section-button"
                    onclick="${ openPage.bind(null, pi, true) }"
                >
                    ${ page.label }
                </button>
            </div>
        `;
        EL_MAIN.appendChild(EL_TOPIC);
        EL_TOPIC_BUTTONS.push(EL_TOPIC_BUTTON as HTMLButtonElement);

        // Add page
        const [EL_PAGE, ...EL_IMGS] = html`
            <section class="pages__page">
                <div class="
                    block-layout
                    ${ page.items.length < 5 ? 'block-layout--2-col' : ''}
                ">
                    ${
                        page.items.map(item => html`
                            <div class="block-layout__slot">
                                <button
                                    class="block-layout__item"
                                    onclick="${ openProjectPage.bind(null, item) }"
                                >
                                    <div></div>
                                    <#div
                                        class="block-layout__item-image"
                                        style="--bg-color: ${ DATA_BG[toCamelCase(item.title)] || COLOR_BG_L }"
                                    ></div>
                                    <h3 class="
                                        block-layout__item-label
                                        ${
                                            item.title
                                                .match(/[^ ]+/g)!
                                                .sort((a, b) => b.length - a.length)
                                                [0].length > 8
                                            ? 'block-layout__item-label--sm'
                                            : ''
                                        }
                                    ">
                                        ${ item.title }
                                    </h3>
                                </button>
                            </div>
                        `)
                    }
                </div>
            </section>
        `;
        
        PAGE_IMG_URLS.push(page.items.map((item, i) => [
            EL_IMGS[i] as HTMLDivElement,
            `url(./assets/${ toCamelCase(item.title) }.sm.png)`
        ]));
        EL_PAGES.push(EL_PAGE as HTMLDivElement);
        EL_PAGE_CONTAINER.appendChild(EL_PAGE);
    });


    //
    // Nav pages
    //

    EL_PAGES.push(EL_PAGES_EXPERIENCE);
    EL_HEADER_NAV_LINKS_EXPERIENCE.onclick = openPage.bind(null, EL_PAGES.length - 1, false);
    
    EL_PAGES.push(EL_PAGES_CONTACT);
    EL_HEADER_NAV_LINKS_CONTACT.onclick =  openPage.bind(null, EL_PAGES.length - 1, false);


    //
    // Individual project page
    //

    EL_PAGES.push(EL_PAGES_PROJECT);


    //
    // Close button
    //

    EL_PAGE_CONTAINER.appendChild(html`
        <button
            class="pages__close"
            onclick="${ closePage }"
        >
            <span class="pages__close-caret"></span>
        </button>
    `[0]);

}

function openProjectPage(item: tPageDataItem) {
    EL_PAGES_PROJECT_TITLE.innerHTML = item.title;
    EL_PAGES_PROJECT_DESC.innerHTML = item.desc;
    EL_PAGES_PROJECT_IMAGE.src = `./assets/${ toCamelCase(item.title) }.sm.png`;

    EL_PAGES_PROJECT_LINK_LIVE.innerHTML =
        item.linkLive
            ? `<a class="project__link" href="${ item.linkLive }"> Go to ${ item.title } </a>`
            : '';

    EL_PAGES_PROJECT_LINK_CODE.innerHTML =
        item.linkCode
            ? `<a class="project__link" href="${ item.linkCode }"> View source code for ${ item.title } </a>`
            : '';

    EL_PAGES_PROJECT_TAGS.innerHTML = (item.tags || [])
        .map(t => `<span class="project__tag project__tag--${ tPageTag[t] }">${ tPageTag[t] }</span>`)
        .join('');

    openPage(EL_PAGES.length - 1, false);
}

export function openPage(index: number, animationDelay: boolean) {
    openPageIndex = index;

    toggleGraphicsSectionOpen(openPageIndex);

    EL_PAGES[index].classList.add(CLASS_PAGE_ACTIVE);
    setTimeout(() => {
        EL_BODY.classList.add(CLASS_BODY_PAGE_OPEN);
        EL_PAGES[index].classList.add(CLASS_PAGE_OPEN);
    }, animationDelay ? DURATION_SH : 0);

    // Lazy load images
    PAGE_IMG_URLS[index]?.forEach(img => img[0].style.setProperty('--bg-url', img[1]));
}

export function closePage() {
    toggleGraphicsSectionOpen(openPageIndex);
    EL_BODY.classList.remove(CLASS_BODY_PAGE_OPEN);
    EL_PAGES.forEach(p => p.classList.remove(CLASS_PAGE_OPEN));
    setTimeout( 
        () => EL_PAGES.forEach(p => p.classList.remove(CLASS_PAGE_ACTIVE)),
        DURATION_LG
    );
}