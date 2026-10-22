const
    FS = require('node:fs/promises'),
    util = require('../scripts/util-js.js'),
    { BASE_PROD, BASE_DEV } = require('./base-urls.js');

const
    IS_PROD         = process.argv[2] === 'prod',
    PATH_DIST       = 'dist',
    PATH_FROM_HEAD  = 'templates/_head.html',
    PATH_FROM_INDEX = 'templates/index.html',
    PATH_FROM_APP   = 'templates/app.html',
    PATH_FROM_PROJS = 'data/projects.ts',
    PATH_TO_INDEX   = PATH_DIST + '/index.html',
    PATH_TO_APP     = PATH_DIST + '/{{ title }}/index.html';

async function buildTemplates() {
    // Get template files and project data
    let
        headHtml  = await FS.readFile(PATH_FROM_HEAD,  'utf8', (_, data) => data),
        appHtml   = await FS.readFile(PATH_FROM_APP,   'utf8', (_, data) => data),
        indexHtml = await FS.readFile(PATH_FROM_INDEX, 'utf8', (_, data) => data);
        projects  = await FS.readFile(PATH_FROM_PROJS, 'utf8', (_, data) => data);

    headHtml = headHtml
        .replace('{{ base }}', IS_PROD ? BASE_PROD : BASE_DEV);
    appHtml = appHtml
        .replace(/ *{{ head }}/, headHtml);
    indexHtml = indexHtml
        .replace(/ *{{ head }}/, headHtml)
        .replace('{{ title }}', '');
    projects = projects
        .replace(/import .*/, '')
        .replace(/export .* =/, '')
        .replace(/ePageTag.*/g, '')
        .replace(/,[\s\n]*\]/g, ']')
        .replace(/];/g, ']');

    // Create index.html
    FS.writeFile(
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
        .filter(p => parseInt(p.year) > 0)
        .forEach(p => {
            const
                TITLE_KEBAB = util.toKebabCase(p.title),
                PATH = PATH_TO_APP.replace('{{ title }}', TITLE_KEBAB);
            FS
                .mkdir(
                    PATH.replace(/\/[^\/]*$/, ''),
                    { recursive: true }
                )
                .then(() => FS.writeFile(
                    PATH,
                    appHtml
                        .replace('{{ title }}', '| ' + p.title)
                        .replace('{{ title-kebab }}', TITLE_KEBAB)
                        .replace('{{ url }}', p.linkLive),
                    'utf8',
                    () => {}
                ));
        });
}

buildTemplates();