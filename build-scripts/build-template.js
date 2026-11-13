import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { log, toKebabCase } from './util.js';
import { BASE_PROD, BASE_DEV } from './base-urls.js';

const
    IS_PROD         = process.argv[2] === 'prod',
    PATH_DIST       = 'dist',
    PATH_FROM_HEAD  = 'templates/_head.html',
    PATH_FROM_INDEX = 'templates/index.html',
    PATH_FROM_APP   = 'templates/app.html',
    PATH_FROM_PROJS = 'data/projects.ts',
    PATH_TO_INDEX   = PATH_DIST + '/index.html',
    PATH_TO_APP     = PATH_DIST + '/{{ title }}/index.html';

log(`Generating ${ IS_PROD ? 'production ' : ''}templates`);

async function buildTemplates() {
    // Get template files and project data
    let
        headHtml  = await readFile(PATH_FROM_HEAD,  'utf8', (_, data) => data),
        appHtml   = await readFile(PATH_FROM_APP,   'utf8', (_, data) => data),
        indexHtml = await readFile(PATH_FROM_INDEX, 'utf8', (_, data) => data),
        projects  = await readFile(PATH_FROM_PROJS, 'utf8', (_, data) => data);

    headHtml = headHtml
        .replace('{{ base }}', IS_PROD ? BASE_PROD : BASE_DEV);
    appHtml = appHtml
        .replace(/ *{{ head }}/, headHtml);
    indexHtml = indexHtml
        .replace(/ *{{ head }}/, headHtml)
        .replace('{{ title }}', '');
    projects = projects
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

    // Parse project data, then create project iframe files
    JSON
        .parse(projects)
        .map(topic => topic.projects)
        .flat()
        .filter(p => parseInt(p.year) > 0 && !p.linkDirect)
        .forEach(p => {
            const
                TITLE_KEBAB = toKebabCase(p.title),
                PATH = PATH_TO_APP.replace('{{ title }}', TITLE_KEBAB);
            mkdir(
                    PATH.replace(/\/[^\/]*$/, ''),
                    { recursive: true }
                )
                .then(() => writeFile(
                    PATH,
                    appHtml
                        .replace('{{ title }}', p.title + ' |')
                        .replace('{{ title-kebab }}', TITLE_KEBAB)
                        .replace('{{ url }}', p.linkLive),
                    'utf8',
                    () => {}
                ));
        });
}

buildTemplates();