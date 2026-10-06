const path = require('path');

module.exports = [
    {
        entry: {
            main: './scripts/main.ts',
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
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
        }
    },
    {
        entry: {
            main: './scripts/app.ts',
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
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
        }
    }
];