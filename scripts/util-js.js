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

export function log(text, color = 'b', inline = false) {
    const COLORS = {
        r: '\x1b[0;31m',
        g: '\x1b[0;32m',
        b: '\x1b[0;36m',
        w: '\x1b[0m'
    };

    // Inline log in node
    if (inline) {
        if (text[0] === '~') {
            process.stdout.write('\n');
        }
        process.stdout.write(`${ COLORS[color] }> ${ text.replace(/~/g, '') }${ COLORS.w }`);
    }

    // Standard console log
    else {
        console.log(
            ...text
                .split('~')
                .map(t => t ? `${ COLORS[color] }> ${ t }${ COLORS.w }` : '\n'),
            ' '
        );
    }
}