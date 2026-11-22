import { eAnalyticsEvent, eBoatEnd, tBoatAttempt } from "./types";
import { toKebabCase } from "./util-common";

declare const umami: {
    track(): void;
    track(payload: object): void;
    track(event_name: string, data?: object): void;
    track(callback: (props: object) => object): void;

    identify(data: object): void;
    identify(unique_id: string, data?: object): void;

    captureException(error: unknown, options?: object): void;
}


//
// External pages
//

export function trackProjectExternalPage(title: string) {
    const TITLE_KEBAB = toKebabCase(title);
    umami.track((props: object) => ({
        ...props,
        title: title + ' | External Project',
        url: '/' + TITLE_KEBAB
    }));
}

export function trackProjectCodePage(title: string) {
    const TITLE_KEBAB = toKebabCase(title);
    umami.track((props: object) => ({
        ...props,
        title: title + ' | External Code',
        url: '/' + TITLE_KEBAB + '#code'
    }));
}


//
// Boat
//

const BOAT_TRACKER: tBoatAttempt = {
    attempt: 0,
    started: false,
    flips: 0,
    rolls: 0,
    cublets: 0,
    end: eBoatEnd.Timeout
};

export function trackBoatStarted() {
    BOAT_TRACKER.started = true;
}

export function trackBoatFlip(isRoll: boolean) {
    isRoll ? BOAT_TRACKER.rolls += 1 : BOAT_TRACKER.flips += 1
}

export function trackBoatCublet() {
    BOAT_TRACKER.cublets += 1;
}

export function trackBoatEnd(end: eBoatEnd) {
    BOAT_TRACKER.attempt += 1;
    BOAT_TRACKER.end = end;

    umami.track(eAnalyticsEvent.BoatAttempt, BOAT_TRACKER);

    BOAT_TRACKER.flips = 0;
    BOAT_TRACKER.rolls = 0;
    BOAT_TRACKER.cublets = 0;

}