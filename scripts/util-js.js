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

export function log(text, color = 'b', newLineBefore = 1, newLineAfter = 0) {
    const COLORS = {
        r: '\x1b[0;31m',
        g: '\x1b[0;32m',
        b: '\x1b[0;36m',
        w: '\x1b[0m'
    };

    // Node logging
    if (process) {
        if (newLineBefore) {
            process.stdout.write('\n'.repeat(newLineBefore));
        }
        process.stdout.write(`${ COLORS[color] }${ newLineBefore ? '>' : ''} ${ text }${ COLORS.w }`);
        if (newLineAfter) {
            process.stdout.write('\n'.repeat(newLineAfter));
        }
    }
    
    // Standrad console logging
    else {
        if (newLineBefore > 1) {
            console.log('\n'.repeat(newLineBefore - 1));
        }
        console.log(`${ COLORS[color] }> ${ text }${ COLORS.w }`);
        if (newLineAfter) {
            console.log('\n'.repeat(newLineAfter));
        }
    }
}