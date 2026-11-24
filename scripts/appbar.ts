import {
    CLASS_PAGE_CLOSING, CLASS_PAGE_INACTIVE, CLASS_PAGE_SUB_OPENING,
    DURATION_SH,
    TOKEN_PREVIOUS_VISIT, TOKEN_PREVIOUS_VISIT_SET
} from "./consts";


//
// Set back link
//

const
    EL_LINK = document.getElementById('app_headerLink') as HTMLAnchorElement,
    HAS_BACK = window.sessionStorage.getItem(TOKEN_PREVIOUS_VISIT) === TOKEN_PREVIOUS_VISIT_SET;

EL_LINK.innerText = HAS_BACK ? 'Back to projects' : 'More projects';
if (HAS_BACK) {
    EL_LINK.href = '.';
}


//
// About button
//

let timeoutAbout = -1;
const
    EL_ABOUT_BUTTON = document.getElementById('app_headerAboutButton') as HTMLButtonElement,
    EL_ABOUT_SCRIM = document.getElementById('app_headerAboutScrim') as HTMLDivElement,
    EL_ABOUT = document.getElementById('app_headerAbout') as HTMLElement;

function toggleAbout(close = false) {
    clearTimeout(timeoutAbout);
    if (!EL_ABOUT.classList.contains(CLASS_PAGE_SUB_OPENING)) {
        if (close) {
            return;
        }
        EL_ABOUT.classList.remove(CLASS_PAGE_INACTIVE);
        timeoutAbout = setTimeout(() => EL_ABOUT.classList.add(CLASS_PAGE_SUB_OPENING));
    } else {
        EL_ABOUT.classList.remove(CLASS_PAGE_SUB_OPENING);
        timeoutAbout = setTimeout(
            () => EL_ABOUT.classList.add(CLASS_PAGE_INACTIVE),
            DURATION_SH
        );
    }
}

EL_ABOUT_BUTTON.classList.add(CLASS_PAGE_INACTIVE);
EL_ABOUT_BUTTON.onclick = () => toggleAbout();
EL_ABOUT_SCRIM.onclick = () => toggleAbout(true);


//
// Close button
//

let timeoutClose = -1;
const 
    EL_BODY = document.body,
    EL_CLOSE = document.getElementById('app_headerClose') as HTMLButtonElement;

function toggleClose() {
    toggleAbout(true);
    clearTimeout(timeoutClose);
    if (EL_BODY.classList.contains(CLASS_PAGE_CLOSING)) {
        EL_BODY.classList.remove(CLASS_PAGE_INACTIVE)
        timeoutClose = setTimeout(() => EL_BODY.classList.remove(CLASS_PAGE_CLOSING));
    } else {
        EL_BODY.classList.add(CLASS_PAGE_CLOSING);
        timeoutClose = setTimeout(
            () => EL_BODY.classList.add(CLASS_PAGE_INACTIVE),
            DURATION_SH
        );
    }
}

EL_CLOSE.onclick = () => toggleClose();