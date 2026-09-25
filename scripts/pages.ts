import {
    CLASS_PAGE_INACTIVE, CLASS_PAGE_CLOSING, CLASS_PAGE_SUB_OPENING,
    DURATION_PAGE_OPEN,
    COLOR_BG_L,
    EL_BODY, EL_HEADER_NAV_LINKS_CONTACT, EL_HEADER_NAV_LINKS_EXPERIENCE, EL_MAIN,
    EL_PAGE_CLOSES,
    EL_PAGE_CONTACT, EL_PAGE_EXPERIENCE, EL_PAGE_PROJECT, EL_PROJECT_CLOSE, EL_PROJECT_DESC,
    EL_PROJECT_IMAGE, EL_PROJECT_LINK_CODE, EL_PROJECT_LINK_LIVE,
    EL_PROJECT_TAGS, EL_PROJECT_TITLE, EL_PAGE_TOPIC,
    ROUTES,
    DURATION_PAGE_OPEN_DELAY,
    CLASS_PROJECT_LINK_MISSING
} from "./consts";
import { PAGE_DATA } from "./data/pages.json";
import { toggleSectionOpen as toggleGraphicsSectionOpen } from "./graphics/main";
import { html, toCamelCase } from "./util";
import { DATA_BG } from "./data/images.json";
import { ePageTag, ePages } from "./types";

const
    PAGE_ELS: { [key in ePages]: HTMLElement } = {
        [ePages.Main]: EL_BODY,
        [ePages.Contact]: EL_PAGE_CONTACT,
        [ePages.Experience]: EL_PAGE_EXPERIENCE,
        [ePages.Topic]: EL_PAGE_TOPIC,
        [ePages.Project]: EL_PAGE_PROJECT
    },
    TOPIC_PAGES_CONTENT: HTMLElement[] = [],
    TOPIC_PAGES_IMAGES: { el: HTMLDivElement, url: string }[][] = [];

export const
    EL_TOPIC_BUTTONS: HTMLButtonElement[] = [];

let
    currentOpenPage: ePages | null = null,
    currentOpenTopic: number = -1,
    transitionDelayTimeout: number = -1,
    transitionDelayToTimeout: number = -1,
    transitionDurationTimeout: number = -1,
    // When user is linked direct to project page, back button should open main page
    initialLoadOnProject: boolean = false;

export function initPages() {

    // Topic pages
    PAGE_DATA.forEach((topic, ti) => {
        // Add topic button
        const [EL_TOPIC, EL_TOPIC_BUTTON] = html`
            <div class="main__section">
                <#button
                    class="main__section-button"
                    onclick="${ openPage.bind(null, ePages.Topic, ti, -1, false) }"
                >
                    ${ topic.label }
                </button>
            </div>
        `;
        EL_MAIN.appendChild(EL_TOPIC);
        EL_TOPIC_BUTTONS.push(EL_TOPIC_BUTTON as HTMLButtonElement);

        const
            PROJECT_BLOCKS = topic.items.map((project, pi) => html`
                <div class="block-layout__slot">
                    <button
                        class="block-layout__item"
                        onclick="${ openPage.bind(null, ePages.Project, ti, pi, false) }"
                    >
                        <div></div>
                        <#div
                            class="block-layout__item-image"
                            style="--bg-color: ${ DATA_BG[toCamelCase(project.title)] || COLOR_BG_L }"
                        ></div>
                        <h3 class="
                            block-layout__item-label
                            ${
                                project.title
                                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                                    .match(/[^ ]+/g)!
                                    .sort((a, b) => b.length - a.length)
                                    [0].length > 8
                                ? 'block-layout__item-label--sm'
                                : ''
                            }
                        ">
                            ${ project.title.replace(/([a-z])([A-Z])/g, '$1&ZeroWidthSpace;$2') }
                        </h3>
                    </button>
                </div>
            `),
            TOPIC_PAGE = html`
                <div>
                    <div class="block-layout">
                        ${ PROJECT_BLOCKS }
                    </div>
                    <button
                        class="page__close"
                        onclick="${ openPage.bind(null, ePages.Main, -1, -1, false) }"
                    ></button>
                </div>
            `;

        TOPIC_PAGES_CONTENT.push(TOPIC_PAGE[0]);
        TOPIC_PAGES_IMAGES.push(
            PROJECT_BLOCKS.map((b, bi) => ({
                el: b[1] as HTMLDivElement,
                url: `url(assets/${ toCamelCase(topic.items[bi].title) }.sm.png)`
            }))
        );
    });

    // Nav pages
    EL_HEADER_NAV_LINKS_EXPERIENCE.onclick = () => openPage(ePages.Experience);
    EL_HEADER_NAV_LINKS_CONTACT.onclick = () => openPage(ePages.Contact);

    // Close buttons
    EL_PAGE_CLOSES.forEach(el => el.onclick = () => openPage(ePages.Main));
    EL_PROJECT_CLOSE.onclick = () => openPage(ePages.Topic, currentOpenTopic);
}


//
// Convert URL hash to page, then open
//

export function openPageFromUrl() {
    const HASH = window.location.hash
        .toLowerCase()
        .replace('#', '');

    let
        page = parseInt((Object.entries(ROUTES).find(r => r[1].toLowerCase() === HASH) || ['-1'])[0]),
        topic = -1,
        project = -1;

    if (page === -1) {
        page = ePages.Topic;
        topic = PAGE_DATA.findIndex(t => toCamelCase(t.label) === HASH);

        if (topic === -1) {
            page = ePages.Project;
            topic = PAGE_DATA.findIndex(t => t.items.some(p => toCamelCase(p.title) === HASH));
            project = topic > -1 ? PAGE_DATA[topic].items.findIndex(p => toCamelCase(p.title) === HASH) : -1;

            if (project === -1) {
                page = ePages.Main;
                topic = -1;
            } else {
                initialLoadOnProject = true;
            }
        }
    }

    openPage(page, topic, project, true);
}


//
// Open page, or sub page
//

function openPage(page: ePages, topicIndex: number = -1, projectIndex: number = -1, isInitial: boolean = false) {
    switch (page) {
        case ePages.Main:
            toggleGraphicsSectionOpen(false, currentOpenTopic);
            transitionPage(page);
            setUrl(ROUTES[page]!, isInitial);
        break;

        case ePages.Experience:
        case ePages.Contact:
            toggleGraphicsSectionOpen(true);
            transitionPage(page);
            setUrl(ROUTES[page]!, isInitial);
        break;

        case ePages.Topic:
            if (initialLoadOnProject) {
                initialLoadOnProject = false;
                openPage(ePages.Main, -1, -1, isInitial);
                return;
            } else {
                EL_PAGE_TOPIC.innerHTML = '';
                EL_PAGE_TOPIC.appendChild(TOPIC_PAGES_CONTENT[topicIndex]);
                currentOpenTopic = topicIndex;
                
                // Lazy load images
                TOPIC_PAGES_IMAGES[topicIndex].forEach(img => img.el.style.setProperty('--bg-url', img.url));

                toggleGraphicsSectionOpen(true, topicIndex);
                transitionPage(page, currentOpenPage === ePages.Main ? DURATION_PAGE_OPEN_DELAY : 0);
                setUrl(PAGE_DATA[topicIndex].label, isInitial);
            }
        break;

        case ePages.Project:
            const PROJECT = PAGE_DATA[topicIndex].items[projectIndex];

            EL_PROJECT_TITLE.innerHTML = PROJECT.title;
            EL_PROJECT_DESC.innerHTML = PROJECT.desc
                .map(d => `<p class="project__desc-item">${ d }</p>`)
                .join('\n');
            EL_PROJECT_IMAGE.style.setProperty('--bg-url', `url(assets/${ toCamelCase(PROJECT.title) }.md.png)`);
            // EL_PROJECT_IMAGE.style.setProperty('--bg-color', DATA_BG[toCamelCase(PROJECT.title)] || COLOR_BG_L);
            currentOpenTopic = topicIndex;

            if (PROJECT.linkLive) {
                EL_PROJECT_LINK_LIVE.href = PROJECT.linkLive || '#';
                EL_PROJECT_LINK_LIVE.classList.remove(CLASS_PROJECT_LINK_MISSING);
            } else {
                EL_PROJECT_LINK_LIVE.classList.add(CLASS_PROJECT_LINK_MISSING);
            }

            if (PROJECT.linkCode) {
                EL_PROJECT_LINK_CODE.href = PROJECT.linkCode || '#';
                EL_PROJECT_LINK_CODE.classList.remove(CLASS_PROJECT_LINK_MISSING);
            } else {
                EL_PROJECT_LINK_CODE.classList.add(CLASS_PROJECT_LINK_MISSING);
            }

            EL_PROJECT_TAGS.innerHTML = (PROJECT.tags || [])
                .map(t => `<span class="project__tags-tag project__tags-tag--${ t }">${ ePageTag[t] }</span>`)
                .join('');

            toggleGraphicsSectionOpen(true, topicIndex);
            transitionPage(page, 0, currentOpenPage == ePages.Topic ? DURATION_PAGE_OPEN_DELAY : 0);
            setUrl(PROJECT.title, isInitial);
        break;
    }

    currentOpenPage = page;
}


//
// Handle animation classes and timing for page transitions
//

function transitionPage(pageTo: ePages, delay: number = 0, delayTo: number = 0) {
    // Reset all pages
    clearTimeout(transitionDelayTimeout);
    clearTimeout(transitionDelayToTimeout);
    clearTimeout(transitionDurationTimeout);
    Object
        .values(PAGE_ELS)
        .forEach(p => {
            p.classList.add(CLASS_PAGE_CLOSING, CLASS_PAGE_INACTIVE);
            p.classList.remove(CLASS_PAGE_SUB_OPENING);
        });

    const
        PAGE_FROM = currentOpenPage,
        EL_TO = PAGE_ELS[pageTo],
        EL_FROM = PAGE_FROM === null ? null : PAGE_ELS[PAGE_FROM],
        TO_SUB_PAGE = PAGE_FROM === ePages.Topic && pageTo === ePages.Project,
        FROM_SUB_PAGE = PAGE_FROM === ePages.Project && pageTo === ePages.Topic;

    // Initial page load
    if (!EL_FROM) {
        EL_TO.classList.remove(CLASS_PAGE_CLOSING, CLASS_PAGE_INACTIVE);
    }

    // Transition between pages
    else {
        EL_FROM.classList.remove(CLASS_PAGE_INACTIVE, CLASS_PAGE_CLOSING);
        if (FROM_SUB_PAGE) {
            EL_TO.classList.remove(CLASS_PAGE_CLOSING);
            EL_TO.classList.add(CLASS_PAGE_SUB_OPENING);
        }

        // Transition order
        //   set currentPageOpen
        //   initial delay
        //   fromPage closing animation
        //   toPage opening delay
        //   toPage remove inactive
        //   toPage opening animation
        //   fromPage add inactive
        EL_TO.classList.remove(CLASS_PAGE_INACTIVE);
        transitionDelayTimeout = setTimeout(() => {
            EL_FROM.classList.add(
                TO_SUB_PAGE
                    ? CLASS_PAGE_SUB_OPENING
                    : CLASS_PAGE_CLOSING
            );
            transitionDelayToTimeout = setTimeout(() => {
                EL_TO.classList.remove(CLASS_PAGE_CLOSING, CLASS_PAGE_SUB_OPENING);
            }, Math.max(delayTo, 100));
            transitionDurationTimeout = setTimeout(() => {
                EL_FROM.classList.add(CLASS_PAGE_INACTIVE);
            }, DURATION_PAGE_OPEN);
        }, delay);
    }

    currentOpenPage = pageTo;
}


//
// Set url hash and page title
//

function setUrl(title: string, isInitial: boolean) {
    const HREF = window.location.href.replace(/(#.*)?$/, title ? '#' + toCamelCase(title) : '');
    document.title = document.title.replace(/( \| .*)?$/, title ? ' | ' + title : '');
    if (!isInitial && HREF != window.location.href) {
        window.history.pushState({}, '', new URL(HREF));
    }
}