import { CLASS_PAGE_CLOSING, CLASS_PAGE_INACTIVE, DURATION_SH, TOKEN_PREVIOUS_VISIT, TOKEN_PREVIOUS_VISIT_SET } from "./consts";

declare const TITLE_KEBAB: string;

const
    EL_BODY = document.body,
    EL_LINK = document.getElementById('app_headerLink') as HTMLAnchorElement,
    EL_CLOSE = document.getElementById('app_headerClose') as HTMLButtonElement,
    HAS_BACK = window.sessionStorage.getItem(TOKEN_PREVIOUS_VISIT) === TOKEN_PREVIOUS_VISIT_SET;

EL_LINK.innerText = HAS_BACK ? 'Back to projects' : 'More projects';
EL_LINK.href = HAS_BACK ? './#' + TITLE_KEBAB : '.';

EL_CLOSE.onclick = () => {
    if (EL_BODY.classList.contains(CLASS_PAGE_CLOSING)) {
        EL_BODY.classList.remove(CLASS_PAGE_INACTIVE)
        setTimeout(() => EL_BODY.classList.remove(CLASS_PAGE_CLOSING));
    } else {
        EL_BODY.classList.add(CLASS_PAGE_CLOSING);
        setTimeout(
            () => EL_BODY.classList.add(CLASS_PAGE_INACTIVE),
            DURATION_SH
        );
    }
}