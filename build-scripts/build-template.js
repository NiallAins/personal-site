const
    FS = require('node:fs/promises'),
    util = require('../scripts/util-js.js');

const
    PATH_DIST       = 'dist',
    PATH_FROM_HEAD  = 'templates/_head.html',
    PATH_FROM_INDEX = 'templates/index.html',
    PATH_FROM_APP   = 'templates/app.html',
    PATH_FROM_PROJS = 'data/projects.json.ts',
    PATH_TO_INDEX   = PATH_DIST + '/index.html',
    PATH_TO_APP     = PATH_DIST + '/{{ title }}/index.html';

const
    KEEP_DIR = ['assets'];

async function buildTemplates() {
    // Get template files and project data
    const
        HEAD_HTML  = await FS.readFile(PATH_FROM_HEAD,  'utf8', (_, data) => data),
        INDEX_HTML = await FS.readFile(PATH_FROM_INDEX, 'utf8', (_, data) => data),
        APP_HTML   = await FS.readFile(PATH_FROM_APP,   'utf8', (_, data) => data),
        PROJS_TS   = await FS.readFile(PATH_FROM_PROJS, 'utf8', (_, data) => data);

    // Create index.html
    FS.writeFile(
        PATH_TO_INDEX,
        INDEX_HTML
            .replace('{{ head }}', HEAD_HTML)
            .replace('{{ title }}', ''),
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
        .parse(
            PROJS_TS
                .replace(/import .*/, '')
                .replace(/export .* =/, '')
                .replace(/ePageTag.*/g, '')
                .replace(/,[\s\n]*\]/g, ']')
                .replace(/];/g, ']')
        )
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
                    APP_HTML
                        .replace('{{ head }}', HEAD_HTML)
                        .replace('{{ title }}', '| ' + p.title)
                        .replace('{{ url }}', p.linkLive),
                    'utf8',
                    () => {}
                ));
        });
}

buildTemplates();