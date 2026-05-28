import { CLASS_BODY_PAGE_OPEN, CLASS_PAGE_OPEN, EL_BODY, EL_LABEL_BUTTONS, EL_PAGE_CONTAINER } from "./consts";
import { PAGE_DATA } from "./data-pages";
import { toggleSectionOpen as toggleGraphicsSectionOpen } from "./graphics/main";

const EL_PAGES: HTMLDivElement[] = [];

export function createPages() {
    PAGE_DATA.forEach((page, pi) => {
        const EL_PAGE = document.createElement('div');
        EL_PAGE.classList.add('pages__page');
        EL_PAGE.innerHTML = page.reduce((htm, proj) => htm +
            `<div class="pages__page-item">
                <div class="pages__page-item-image-container">
                    <img
                        class="pages__page-item-image"
                        src="./images/${ proj.img }"
                        alt='screenshot from the project "${ proj.title }"'
                    />
                </div>
                <h3 class="pages__page-item-text-title">
                    ${ proj.title }
                </h3>
            </div>
        `, '');
        EL_PAGES.push(EL_PAGE);
        EL_PAGE_CONTAINER.appendChild(EL_PAGE);
        EL_LABEL_BUTTONS[pi].onclick = () => openPage(pi);
    });
}

export function openPage(index: number) {
    toggleGraphicsSectionOpen();
    EL_BODY.classList.add(CLASS_BODY_PAGE_OPEN);
    EL_PAGES[index].classList.add(CLASS_PAGE_OPEN);
}

export function closePage() {
    toggleGraphicsSectionOpen();
    EL_BODY.classList.remove(CLASS_BODY_PAGE_OPEN);
    EL_PAGES.forEach(p => p.classList.remove(CLASS_PAGE_OPEN));
}