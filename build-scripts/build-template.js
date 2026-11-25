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
    PATH_TO_APPBAR_PAGE   = PATH_DIST + '/{{ title }}/index.html',
    PATH_TO_APPBAR_SCRIPT = PATH_DIST + '/{{ title }}/script.js';

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

    // Page headers
    headHtml = headHtml
        .replace('{{ base }}', BASE_URL)
        .replace('{{ analyticsTag }}', IS_PROD ? 'env-prod' : 'env-dev')
        .replaceAll('{{ email }}', BASE_MAIL);

    // Index page
    indexHtml = indexHtml
        .replace(/ *{{ head }}/, headHtml)
        .replace(/{{ desc = (.*?) }}/, '$1')
        .replace('{{ title }}', '')
        .replace('{{ cv }}', cvHtml)
        .replaceAll('{{ email }}', BASE_MAIL)
        .replaceAll(
            '{{ emailDisplay }}',
            BASE_MAIL
                .replace('niall', 'niall&ZeroWidthSpace;')
                .replace('@', '&ZeroWidthSpace;@')
        );

    writeFile(
        PATH_TO_INDEX,
        indexHtml,
        'utf8',
        () => {}
    );
      
    // Project app pages
    appbarHtml = appbarHtml
        .replace(/ *{{ head }}/, headHtml);

    // Get project details
    let projects = await readFile(PATH_FROM_PROJS, 'utf8', (_, data) => data);
    projects = projects
        .replace(/\n\s*\/\/.*/g, '')
        .replace(/import .*/, '')
        .replace(/export .* =/, '')
        .replace(/ePageTag.*/g, '')
        .replace(/,[\s\n]*\]/g, ']')
        .replace(/];/g, ']');

    const PROJECTS_JSON = JSON.parse(projects);

    const SITEMAP = [
        BASE_URL,
        BASE_URL + '#experience',
        BASE_URL + '#contact'
    ];

    // Parse project data, then create project iframe files,
    // or appbar import script for external apps
    PROJECTS_JSON
        .map(topic => {
            SITEMAP.push(BASE_URL + '#' + toKebabCase(topic.title));
            return topic.projects;
        })
        .flat()
        .filter(p => parseInt(p.year) > 0)
        .forEach(p => {
            const
                TITLE_KEBAB = toKebabCase(p.title),
                PATH = (p.externalLink ? PATH_TO_APPBAR_SCRIPT : PATH_TO_APPBAR_PAGE)
                    .replace('{{ title }}', TITLE_KEBAB);

            SITEMAP.push(BASE_URL + '#' + TITLE_KEBAB);
            if (!p.externalLink) {
                SITEMAP.push(BASE_URL + TITLE_KEBAB);
            } else if (p.linkLive.includes(BASE_DOMAIN)) {
                SITEMAP.push(p.linkLive);
            }

            mkdir(
                    PATH.replace(/\/[^\/]*$/, ''),
                    { recursive: true }
                )
                .then(() => writeFile(
                    PATH,
                    p.externalLink
                        ? generateAppBarStandalone(appbarHtml, appbarCss, appbarJs, p, TITLE_KEBAB)
                        : generateAppBarPage(appbarHtml, p, TITLE_KEBAB),
                    'utf8',
                    () => {}
                ));
        });

    // Generate sitemap
    writeFile(
        PATH_TO_SITEMAP,
        SITEMAP.join('\n'),
        'utf8',
        () => {}
    );
}

function generateAppBarPage(html, p, title) {
    return html
        .replace('{{ title }}', p.title + ' |')
        .replace('{{ title-kebab }}', title)
        .replace(
            /{{ desc = (.*?) }}/,
            p.desc[0]
                .replace(/<.*?>/g, '')
                .replace(/&#x2014;/g, '-')
        )
        .replace(/{{ barClassLight \? ([^:]*?) }}/, p.appbar?.light ? '$1' : '')
        .replace(/{{ barClassLight \? (.*?) : (.*?) }}/, p.appbar?.light ? '$1' : '$2')
        .replace(/{{ barClassMinimal \? ([^:]*?) }}/, p.appbar?.minimal ? '$1' : '')
        .replace(/{{ barClassMinimal \? (.*?) : (.*?) }}/, p.appbar?.minimal ? '$1' : '$2')
        .replace(
            /{{ barColor \? (.*?) }}/,
            (_, g0) => p.appbar?.color
                ? g0.replace('barColor', p.appbar.color)
                : ''
        )
        .replace('{{ aboutTitle }}', p.title)
        .replace(
            '{{ aboutDesc }}',
            p.desc
                .map(d => `<p> ${ d } </p>`)
                .join('\n')
        )
        .replace(/{{ base }}/g, BASE_URL)
        .replace('{{ url }}', p.linkLive);
}

function generateAppBarStandalone(html, css, js, p, title) {
    html = generateAppBarPage(html, p, title)
        .match(/<header[\s\S]*<\/header>/m)[0];
    
    return `
        const APPBAR_STYLE = document.createElement('style');
        APPBAR_STYLE.innerHTML = \`${ css }\`;
        document.head.appendChild(STYLE);

        const APPBAR_TEMPLATE = document.createElement('div');
        APPBAR_TEMPLATE.innerHTML = \`${ html }\`;
        document.body.prepend(TEMPLATE);

        ${ js }
    `
        .replace(/\n\s*/g, '');
}

buildTemplates();