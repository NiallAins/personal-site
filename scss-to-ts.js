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
            REM = parseInt(CSS_VARS.find(v => v.name === 'f-size-base').value);

        const JS_VARS = CSS_VARS
            .map(v => {
                const
                    NAME = v.name
                        .replace(/-/g, '_')
                        .replace(/^f/, 'FONT')
                        .replace(/^cl/, 'CLASS')
                        .replace(/^c/, 'COLOR')
                        .toUpperCase();
                    VALUE_NUM = parseFloat(v.value),
                    VALUE = isNaN(VALUE_NUM)
                        ? `'${ v.value.replace(/"^(.*)$"/, '$1') }'`
                        : v.value.indexOf('rem') > -1
                        ? VALUE_NUM * REM
                        : VALUE_NUM;
                return {
                    name: NAME,
                    value: VALUE
                };
            });

        FS.writeFile(
            PATH_TO_TS,
                '/* Generated from styles/_vars.scss */\n\n' +
                'export const\n' +
                JS_VARS
                    .map(v => `    ${ v.name }: ${ typeof v.value } = ${ v.value }`)
                    .join(',\n') +
                ';',
            'utf8',
            () => {}
        );
    }
);