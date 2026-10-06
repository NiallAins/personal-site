//
// Util functions in js, so they can be re-used in node build scripts
//

export function toKebabCase(text) {
    return text
        .replace(/[^a-z ]/gi, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .replace(/ +/g, '-');
}