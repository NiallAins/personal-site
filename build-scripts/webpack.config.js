import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));

export default [
    // Main site
    {
        entry: {
            main: './scripts/main.ts',
        },
        output: {
            path: path.resolve(DIR, '../dist'),
            filename: "script.js"
        },
        resolve: {
            extensions: ['.js', '.ts']
        },
        module: {
            rules: [
                {
                    loader: "ts-loader"
                }
            ]
        },
        stats: 'errors-only'
    },

    // Project app pages
    {
        entry: {
            main: './scripts/app.ts',
        },
        output: {
            path: path.resolve(DIR, '../dist'),
            filename: "app-script.js"
        },
        resolve: {
            extensions: ['.js', '.ts']
        },
        module: {
            rules: [
                {
                    loader: "ts-loader"
                }
            ]
        },
        stats: 'errors-only'
    }
];