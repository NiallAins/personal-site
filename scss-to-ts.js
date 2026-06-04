const
    { parse } = require('path'),
    FS = require('fs'),
    SASS = require('sass');

const
    PATH_FROM   = './styles/_vars.scss',
    PATH_TO_CSS = './styles/vars-css.scss',
    PATH_TO_TS  = './scripts/consts-css.ts';

FS.readFile(
    PATH_FROM, 'utf8',
    (_, data) => {
        const SASS_VARS = data
            .match(/[\n^]\$[^\-].*/g)
            .map(v => v.match(/[\n^]\$([^-][^:]+)/i)[1]);

        const
            CSS = SASS
                .compileString(
                    `
                        @use 'vars' as *;

                        :root {
                            ${
                                SASS_VARS.reduce(
                                    (str, v) => str + `--${ v }: #{ $${ v } };\n`,
                                    ''
                                )
                            }
                        }
                    `,
                    { loadPaths: ['./styles'] }
                )
                .css,
            CSS_VARS = CSS
                .match(/--[^:]*:\s*[^;]*;/g)
                .map(v => ({
                    name: v.match(/--([^:]*)/)[1],
                    value: v.match(/:\s*([^;]*)/)[1]
                })),
            REM = parseInt(CSS_VARS.find(v => v.name === 'f-size-base')?.value) || 16;

        const JS_VARS = CSS_VARS
            .map(v => {
                const
                    NAME = v.name
                        .replace(/-/g, '_')
                        .replace(/^f/, 'FONT')
                        .replace(/^cl/, 'CLASS')
                        .replace(/^c/, 'COLOR')
                        .replace(/^w/, 'WIDTH')
                        .toUpperCase();
                    [VALUE, TYPE] = convertValue(v.value, REM);
                return {
                    name: NAME,
                    value: VALUE,
                    type: TYPE
                };
            });

        FS.writeFile(
            PATH_TO_TS,
                '/* Generated from styles/_vars.scss */\n\n' +
                'export const\n' +
                JS_VARS
                    .map(v => `    ${ v.name }: ${ v.type } = ${ v.value }`)
                    .join(',\n') +
                ';',
            'utf8',
            () => {}
        );
    }
);

function convertValue(value, rem) {
    if (value.indexOf(',') > -1 & !value.match(/^[a-z0-9_-]+\(/i)) {
        const VALUES = value
            .split(',')
            .map(v => convertValue(v));

        return [
            `[${
                VALUES
                    .map(v => v[0])
                    .join(', ')
            }]`,
            `[${
                VALUES
                    .map(v => v[1])
                    .join(', ')
            }]`,
        ];
    }

    const
        VALUE_NUM = parseFloat(value),
        VALUE_SUFFIX = value.match(/[a-z%]*$/)[0],
        VALUE = isNaN(VALUE_NUM)
            ? `'${ value.replace(/"^(.*)$"/, '$1') }'`
            : VALUE_SUFFIX === 'rem'
            ? VALUE_NUM * rem
            : VALUE_SUFFIX === '%' || VALUE_SUFFIX === 'vh' || VALUE_SUFFIX === 'vw'
            ? VALUE_NUM / 100
            : VALUE_NUM;
    
    return [VALUE, typeof VALUE];
}