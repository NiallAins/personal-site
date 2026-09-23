import {
    CLASS_TRANSITION_CLOSED, CLASS_TRANSITION_CLOSING, CLASS_TRANSITION_SUB_OPENING,
    DURATION_PAGE_OPEN,
    COLOR_BG_L,
    EL_BODY, EL_HEADER_NAV_LINKS_CONTACT, EL_HEADER_NAV_LINKS_EXPERIENCE, EL_MAIN,
    EL_PAGES_CLOSE,
    EL_PAGES_CONTACT, EL_PAGES_EXPERIENCE, EL_PAGES_PROJECT, EL_PROJECT_CLOSE, EL_PROJECT_DESC,
    EL_PROJECT_IMAGE, EL_PROJECT_LINK_CODE, EL_PROJECT_LINK_LIVE,
    EL_PROJECT_TAGS, EL_PROJECT_TITLE, EL_PAGES_TOPIC,
    ROUTES
} from "./consts";
import { PAGE_DATA } from "./data/pages.json";
import { toggleSectionOpen as toggleGraphicsSectionOpen } from "./graphics/main";
import { html, toCamelCase } from "./util";
import { DATA_BG } from "./data/images.json";
import { ePageTag, ePages } from "./types";

const
    PAGE_ELS: { [key in ePages]: HTMLElement } = {
        [ePages.Main]: EL_BODY,
        [ePages.Contact]: EL_PAGES_CONTACT,
        [ePages.Experience]: EL_PAGES_EXPERIENCE,
        [ePages.Topic]: EL_PAGES_TOPIC,
        [ePages.Project]: EL_PAGES_PROJECT
    },
    TOPIC_PAGES_CONTENT: HTMLElement[] = [],
    TOPIC_PAGES_IMAGES: { el: HTMLDivElement, url: string }[][] = [];

export const
    EL_TOPIC_BUTTONS: HTMLButtonElement[] = [];

let
    currentOpenPage: ePages | null = null,
    currentOpenTopic: number = -1,
    transitionDelayTimeout: number = -1,
    transitionDurationTimeout: number = -1,
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
                                    .match(/[^ ]+/g)!
                                    .sort((a, b) => b.length - a.length)
                                    [0].length > 8
                                ? 'block-layout__item-label--sm'
                                : ''
                            }
                        ">
                            ${ project.title }
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
                        class="pages__close"
                        onclick="${ openPage.bind(null, ePages.Main, -1, -1, false) }"
                    >
                        <span class="pages__close-caret"></span>
                    </button>
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
    EL_PAGES_CLOSE.forEach(el => el.onclick = () => openPage(ePages.Main));
    EL_PROJECT_CLOSE.onclick = () => openPage(ePages.Topic, currentOpenTopic);
}

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

function openPage(page: ePages, topicIndex: number = -1, projectIndex: number = -1, isInital: boolean = false) {
    if (page === ePages.Main) {
        toggleGraphicsSectionOpen(true);
        transitionPage(page);
        setUrl(ROUTES[page]!);
    }

    else if (page === ePages.Experience || page === ePages.Contact) {
        toggleGraphicsSectionOpen(false);
        transitionPage(page);
        setUrl(ROUTES[page]!);
    }

    else if (page === ePages.Topic) {
        if (initialLoadOnProject) {
            initialLoadOnProject = false;
            openPage(ePages.Main);
            return;
        } else {
            const TOPIC = PAGE_DATA[topicIndex];

            EL_PAGES_TOPIC.innerHTML = '';
            EL_PAGES_TOPIC.appendChild(TOPIC_PAGES_CONTENT[topicIndex]);
            
            // Lazy load images
            TOPIC_PAGES_IMAGES[topicIndex].forEach(img => img.el.style.setProperty('--bg-url', img.url));
            
            currentOpenTopic = topicIndex;

            toggleGraphicsSectionOpen(false);
            transitionPage(page);
            setUrl(TOPIC.label);
        }
    }

    else if (page === ePages.Project) {
        const PROJECT = PAGE_DATA[topicIndex].items[projectIndex];

        EL_PROJECT_TITLE.innerHTML = PROJECT.title;
        EL_PROJECT_DESC.innerHTML = PROJECT.desc;
        EL_PROJECT_IMAGE.src = `assets/${ toCamelCase(PROJECT.title) }.sm.png`;
        EL_PROJECT_LINK_LIVE.href = PROJECT.linkCode || '#';
        EL_PROJECT_LINK_CODE.href = PROJECT.linkLive || '#';
        EL_PROJECT_TAGS.innerHTML = (PROJECT.tags || [])
            .map(t => `<span class="project__tags-tag project__tags-tag--${ t }">${ ePageTag[t] }</span>`)
            .join('');

        toggleGraphicsSectionOpen(false);
        transitionPage(page);
        setUrl(PROJECT.title);
    }

    currentOpenPage = page;
}

function transitionPage(pageTo: ePages, delay: number = 0, duration: number = DURATION_PAGE_OPEN) {
    clearTimeout(transitionDelayTimeout);
    clearTimeout(transitionDurationTimeout);
    Object
        .values(PAGE_ELS)
        .forEach(p => {
            p.classList.add(CLASS_TRANSITION_CLOSING, CLASS_TRANSITION_CLOSED);
            p.classList.remove(CLASS_TRANSITION_SUB_OPENING);
        });

    const
        PAGE_FROM = currentOpenPage,
        EL_TO = PAGE_ELS[pageTo],
        EL_FROM = PAGE_FROM ? PAGE_ELS[PAGE_FROM] : null;

    if (!EL_FROM) {
        EL_TO.classList.remove(CLASS_TRANSITION_CLOSING, CLASS_TRANSITION_CLOSED);
        if (pageTo === ePages.Project) {
            PAGE_ELS[ePages.Project].classList.add(CLASS_TRANSITION_SUB_OPENING);
        }
    }

    else {
        transitionDelayTimeout = setTimeout(() => {
            EL_FROM.classList.remove(CLASS_TRANSITION_CLOSED);
            EL_TO.classList.remove(CLASS_TRANSITION_CLOSED);
            if (pageTo === ePages.Project && PAGE_FROM === ePages.Topic) {
                EL_FROM.classList.remove(CLASS_TRANSITION_CLOSING);
                EL_FROM.classList.add(CLASS_TRANSITION_SUB_OPENING);
            }
            window.requestAnimationFrame(() => EL_TO.classList.remove(CLASS_TRANSITION_CLOSING, CLASS_TRANSITION_SUB_OPENING));
            transitionDurationTimeout = setTimeout(() => {
                EL_FROM.classList.add(CLASS_TRANSITION_CLOSED);
            }, duration);
        }, delay);
    }

    currentOpenPage = pageTo;
}

function setUrl(title: string) {
    const HREF = window.location.href.replace(/(#.*)?$/, title ? '#' + toCamelCase(title) : '');
    document.title = document.title.replace(/( \| .*)?$/, title ? ' | ' + title : '');
    if (HREF != window.location.href) {
        window.history.pushState({}, '', new URL(HREF));
    }
}