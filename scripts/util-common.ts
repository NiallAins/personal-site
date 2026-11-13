//
// Util functions common to both runtime and build scripts
//

declare const process: undefined | { stdout: { write: (str: string) => void }, argv: string[] };


// Standard conversion for project names
export function toKebabCase(text: string): string {
    return text
        .replace(/[^a-z ]/gi, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .replace(/ +/g, '-');
}

// Node and browser logging
export function log(text: string, color: string = 'b', newLineBefore = 1, newLineAfter = 0) {
    const
        COLORS = {
            r: '\x1b[0;31m',
            g: '\x1b[0;32m',
            b: '\x1b[0;36m',
            w: '\x1b[0m'
        },
        COLOR = COLORS[color as keyof typeof COLORS] || COLORS.w;

    // Standard console logging
    if (typeof process === 'undefined') {
        if (newLineBefore > 1) {
            console.log('\n'.repeat(newLineBefore - 1));
        }
        console.log(`${ COLOR }> ${ text }${ COLORS.w }`);
        if (newLineAfter) {
            console.log('\n'.repeat(newLineAfter));
        }
    }
    
    // Node logging
    else {
        if (newLineBefore) {
            process.stdout.write('\n'.repeat(newLineBefore));
        }
        process.stdout.write(`${ COLOR }${ newLineBefore ? '>' : ''} ${ text }${ COLORS.w }`);
        if (newLineAfter) {
            process.stdout.write('\n'.repeat(newLineAfter));
        }
    }
}

// Auto run log if module called directly from node with arguments
if (typeof process !== 'undefined' && process.argv[2]) {
    const
        TEXT = process.argv[2],
        [LINE_BEFORE, LINE_AFTER] =
            String(process.argv[3] || '')
                .split('')
                .map(l => parseInt(l)),
        COLOR = process.argv[4];

    log(TEXT, COLOR, LINE_BEFORE, LINE_AFTER);
}