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

export function log(text, color = 'CW') {
    const COLORS = {
        CR: '\x1b[0;31m',
        CG: '\x1b[0;32m',
        CB: '\x1b[0;36m',
        CW: '\x1b[0m'
    };

    console.log(`${ COLORS[color] }> ${ text }${ COLORS.CW }`);
}