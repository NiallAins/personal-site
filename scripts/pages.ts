import { PAGE_DATA } from "./data-page";
import { togglePause as toggleGraphicsPause } from "./graphics/graphics";

export function createPages() {
    document
        .getElementById('sections')!
        .innerHTML = PAGE_DATA
            .reduce((htmS, sec) => htmS +
                `<section class="section">
                    ${ sec.reduce((htmP, proj) => htmP +
                        `<div class="section__item">
                            <div class="section__item-image-container">
                                <img
                                    class="section__item-image"
                                    src="./images/${ proj.img }"
                                    alt='screenshot from the project "${ proj.title }"'
                                />
                            </div>
                            <h3 class="section__item-text-title">
                                ${ proj.title }
                            </h3>
                        </div>
                    `, '') }
                </section>
            `, '');
}

export function openPage(i: number) {
    toggleGraphicsPause();
    
    document.body.style.overflow = 'hidden';
    document.getElementById('sections')!
        .children[i]
        .classList
        .add('section--open'); 
}

export function closePage(i: number) {
    toggleGraphicsPause();

    document.body.style.overflow = 'auto';
    document.getElementById('sections')!
        .children[i]
        .classList
        .remove('section--open');
}