import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { log, toKebabCase } from './util.js';
import { BASE_PROD, BASE_DEV, BASE_MAIL } from './base-urls.js';

const
    IS_PROD          = process.argv[2] === 'prod',
    BASE_URL         = IS_PROD ? BASE_PROD : BASE_DEV,
    BASE_DOMAIN      = BASE_URL.replace(/^.*?\/\//, '').replace(/\/.*/, ''),
    PATH_DIST        = 'dist',
    PATH_TO_SITEMAP  = PATH_DIST + '/sitemap.txt',
    PATH_FROM_PROJS  = 'data/projects.ts',
    PATH_FROM_HEAD   = 'templates/_head.html',
    PATH_FROM_CV     = 'templates/_cv.html',
    PATH_FROM_INDEX  = 'templates/index.html',
    PATH_TO_INDEX    = PATH_DIST + '/index.html',
    PATH_FROM_APPBAR_HTML = 'templates/appbar.html',
    PATH_FROM_APPBAR_CSS  = 'dist/appbar-style.css',
    PATH_FROM_APPBAR_JS   = 'dist/appbar-script.js',
    PATH_TO_APPBAR_PAGE   = PATH_DIST + '/{{ titleKebab }}/index.html',
    PATH_TO_APPBAR_SCRIPT = PATH_DIST + '/{{ titleKebab }}/script.js';

log(`Generating ${ IS_PROD ? 'production ' : ''}templates`);

async function buildTemplates() {
    // Get template files
    let
        headHtml   = await readFile(PATH_FROM_HEAD,        'utf8', (_, data) => data),
        cvHtml     = await readFile(PATH_FROM_CV,          'utf8', (_, data) => data),
        indexHtml  = await readFile(PATH_FROM_INDEX,       'utf8', (_, data) => data),
        appbarHtml = await readFile(PATH_FROM_APPBAR_HTML, 'utf8', (_, data) => data),
        appbarCss  = await readFile(PATH_FROM_APPBAR_CSS,  'utf8', (_, data) => data),
        appbarJs   = await readFile(PATH_FROM_APPBAR_JS,   'utf8', (_, data) => data);

    // Assemble html partials
    indexHtml = interpolate(indexHtml, { headHtml, cvHtml });
    appbarHtml = interpolate(appbarHtml, { headHtml });

    // Define template variables
    const TEMPLATE_VARS = {
        title: '',
        desc: '',
        base: BASE_URL,
        isProd: IS_PROD,
        email: BASE_MAIL,
        emailDisplay:  BASE_MAIL
            .replace('niall', 'niall&ZeroWidthSpace;')
            .replace('@', '&ZeroWidthSpace;@')
    };

    // Index page
    writeFile(
        PATH_TO_INDEX,
        interpolate(indexHtml, TEMPLATE_VARS),
        'utf8',
        () => {}
    );

    // Extract project data JSON from ts file
    const
        PROJECTS_TS = await readFile(PATH_FROM_PROJS, 'utf8', (_, data) => data),
        PROJECTS_JSON = JSON.parse(
            PROJECTS_TS
                .replace(/\n\s*\/\/.*/g, '')
                .replace(/import .*/, '')
                .replace(/export .* =/, '')
                .replace(/ePageTag.*/g, '')
                .replace(/,[\s\n]*\]/g, ']')
                .replace(/];/g, ']')
        );

    // Add index/# pages to sitemap
    const SITEMAP = [
        BASE_URL,
        BASE_URL + '#experience',
        BASE_URL + '#contact',
        ...PROJECTS_JSON.map(topic => BASE_URL + '#' + toKebabCase(topic.title))
    ];

    // Create project pages - or standalone appbar import script for non-iframe hosted projects
    const APPBAR_STANDALONE_JS = `
        const APPBAR_STYLE = document.createElement('style');
        APPBAR_STYLE.innerHTML = \`${ appbarCss }\`;
        document.head.appendChild(APPBAR_STYLE);

        const APPBAR_TEMPLATE = document.createElement('div');
        APPBAR_TEMPLATE.innerHTML = \`{{ appbarHtml }}\`;
        document.body.prepend(APPBAR_TEMPLATE);

        ${ appbarJs }
    `;
    PROJECTS_JSON
        .map(topic => topic.projects)
        .flat()
        .forEach(p => {
            const
                TITLE_KEBAB = toKebabCase(p.title),
                PATH = interpolate(
                    p.externalLink ? PATH_TO_APPBAR_SCRIPT : PATH_TO_APPBAR_PAGE,
                    { titleKebab: TITLE_KEBAB }
                );

            // Add page to sitemap
            SITEMAP.push(BASE_URL + '#' + TITLE_KEBAB);
            if (p.linkLive) {
                if (!p.externalLink) {
                    SITEMAP.push(BASE_URL + TITLE_KEBAB);
                } else if (p.linkLive.includes(BASE_DOMAIN)) {
                    SITEMAP.push(p.linkLive);
                }
            }

            mkdir(
                    PATH.replace(/\/[^\/]*$/, ''),
                    { recursive: true }
                )
                .then(() => {
                    const APPBAR_HTML = interpolate(
                        appbarHtml,
                        {
                            ...TEMPLATE_VARS,
                            title: p.title,
                            titleKebab: TITLE_KEBAB,
                            desc: p.desc[0]
                                .replace(/<.*?>/g, '')
                                .replace(/&#x2014;/g, '-'),
                            barClassLight: p.appbar?.light,
                            barClassMinimal: p.appbar?.minimal,
                            barColor: p.appbar?.color,
                            descArr: p.desc,
                            url: p.linkLive
                        }
                    );
                    return writeFile(
                        PATH,
                        p.externalLink
                            ? interpolate(
                                APPBAR_STANDALONE_JS,
                                { appbarHtml: APPBAR_HTML.match(/<header[\s\S]*<\/header>/m)[0] }
                            )
                            : APPBAR_HTML,
                        'utf8',
                        () => {}
                    )
                });
        });

    // Generate sitemap
    writeFile(
        PATH_TO_SITEMAP,
        SITEMAP.join('\n'),
        'utf8',
        () => {}
    );
}

function interpolate(html, vars) {
    const DECLARATIONS = Object
        .entries(vars)
        .map(([ key, value ]) => `let ${ key }=${ JSON.stringify(value) };`)
        .join('');
    return html.replace(
        /{{(.*?)}}/g,
        (m, g1) => {
            try {
                return eval(DECLARATIONS + g1);
            } catch (e) {
                return m;
            }
        }
    );
}

buildTemplates();