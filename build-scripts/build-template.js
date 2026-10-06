const
    FS = require('node:fs/promises'),
    util = require('../scripts/util-js.js');

const
    IS_PROD         = process.argv[2] === 'prod',
    BASE_PROD       = 'https://niallains.github.io/personal-site/dist/',
    BASE_DEV        = 'http://localhost:5500/dist/',
    PATH_DIST       = 'dist',
    PATH_FROM_HEAD  = 'templates/_head.html',
    PATH_FROM_INDEX = 'templates/index.html',
    PATH_FROM_APP   = 'templates/app.html',
    PATH_FROM_PROJS = 'data/projects.json.ts',
    PATH_TO_INDEX   = PATH_DIST + '/index.html',
    PATH_TO_APP     = PATH_DIST + '/{{ title }}/index.html';

// Before creating project folders, all other folders are removed, excluding KEEP_DIRs
const
    KEEP_DIR = ['assets'];

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

    // Remove all project folders
    const
        DIR = await FS.readdir(PATH_DIST, { withFileTypes: true }),
        DIR_NAMES = DIR
            .filter(f => f.isDirectory() && !KEEP_DIR.includes(f.name))
            .map(f => f.name);

    for (let i = 0; i < DIR_NAMES.length; i++) {
        await FS.rm(
            PATH_DIST + '/' + DIR_NAMES[i],
            { recursive:true }
        );
    }

    // Parse project data, then create project iframe files
    JSON
        .parse(projects)
        .map(topic => topic.projects)
        .flat()
        .filter(p => !p.hide && p.linkLive)
        .forEach(p => {
            const PATH = PATH_TO_APP.replace('{{ title }}', util.toKebabCase(p.title));
            FS
                .mkdir(
                    PATH.replace(/\/[^\/]*$/, ''),
                    { recursive: true }
                )
                .then(() => FS.writeFile(
                    PATH,
                    appHtml
                        .replace('{{ title }}', '| ' + p.title)
                        .replace('{{ url }}', p.linkLive),
                    'utf8',
                    () => {}
                ));
        });
}

buildTemplates();