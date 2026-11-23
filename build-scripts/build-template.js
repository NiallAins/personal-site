import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { log, toKebabCase } from './util.js';
import { BASE_PROD, BASE_DEV, BASE_MAIL } from './base-urls.js';

const
    IS_PROD         = process.argv[2] === 'prod',
    BASE_URL        = IS_PROD ? BASE_PROD : BASE_DEV,
    PATH_DIST       = 'dist',
    PATH_FROM_HEAD  = 'templates/_head.html',
    PATH_FROM_CV    = 'templates/_cv.html',
    PATH_FROM_INDEX = 'templates/index.html',
    PATH_FROM_APP   = 'templates/app.html',
    PATH_FROM_PROJS = 'data/projects.ts',
    PATH_TO_INDEX   = PATH_DIST + '/index.html',
    PATH_TO_APP     = PATH_DIST + '/{{ title }}/index.html',
    PATH_TO_SITEMAP = PATH_DIST + '/sitemap.txt';

log(`Generating ${ IS_PROD ? 'production ' : ''}templates`);

async function buildTemplates() {
    // Get template files
    let
        headHtml  = await readFile(PATH_FROM_HEAD,  'utf8', (_, data) => data),
        appHtml   = await readFile(PATH_FROM_APP,   'utf8', (_, data) => data),
        cvHtml    = await readFile(PATH_FROM_CV,    'utf8', (_, data) => data),
        indexHtml = await readFile(PATH_FROM_INDEX, 'utf8', (_, data) => data);

    headHtml = headHtml
        .replace('{{ base }}', BASE_URL)
        .replace('{{ analyticsTag }}', IS_PROD ? 'env-prod' : 'env-dev')
        .replaceAll('{{ email }}', BASE_MAIL);

    appHtml = appHtml
        .replace(/ *{{ head }}/, headHtml);

    indexHtml = indexHtml
        .replace(/ *{{ head }}/, headHtml)
        .replace(/{{ description = (.*?) }}/, '$1')
        .replace('{{ title }}', '')
        .replace('{{ cv }}', cvHtml)
        .replaceAll('{{ email }}', BASE_MAIL)
        .replaceAll(
            '{{ emailDisplay }}',
            BASE_MAIL
                .replace('niall', 'niall&ZeroWidthSpace;')
                .replace('@', '&ZeroWidthSpace;@')
        );

    // Get project details
    let projectsJson = await readFile(PATH_FROM_PROJS, 'utf8', (_, data) => data);

    projectsJson = projectsJson
        .replace(/\n\s*\/\/.*/g, '')
        .replace(/import .*/, '')
        .replace(/export .* =/, '')
        .replace(/ePageTag.*/g, '')
        .replace(/,[\s\n]*\]/g, ']')
        .replace(/];/g, ']');

    // Create index.html
    writeFile(
        PATH_TO_INDEX,
        indexHtml,
        'utf8',
        () => {}
    );

    const SITEMAP = [
        '',
        '#experience',
        '#contact'
    ];

    // Parse project data, then create project iframe files
    JSON
        .parse(projectsJson)
        .map(topic => {
            SITEMAP.push('#' + toKebabCase(topic.title));
            return topic.projects;
        })
        .flat()
        .filter(p => parseInt(p.year) > 0 && !p.externalLink)
        .forEach(p => {
            const
                TITLE_KEBAB = toKebabCase(p.title),
                PATH = PATH_TO_APP.replace('{{ title }}', TITLE_KEBAB);

            SITEMAP.push(TITLE_KEBAB);

            mkdir(
                    PATH.replace(/\/[^\/]*$/, ''),
                    { recursive: true }
                )
                .then(() => writeFile(
                    PATH,
                    appHtml
                        .replace('{{ title }}', p.title + ' |')
                        .replace('{{ title-kebab }}', TITLE_KEBAB)
                        .replace(/{{ description .*? }}/, p.desc[0])
                        .replace('{{ url }}', p.linkLive),
                    'utf8',
                    () => {}
                ));
        });

    // Generate sitemap
    writeFile(
        PATH_TO_SITEMAP,
        SITEMAP
            .map(p => BASE_URL + p)
            .join('\n'),
        'utf8',
        () => {}
    );
}

buildTemplates();