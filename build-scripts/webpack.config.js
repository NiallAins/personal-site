const path = require('path');

module.exports = {
    entry: {
        main: './scripts/main.ts',
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "script.js"
    },
    resolve: {
        extensions: ['.js', '.ts', '.json']
    },
    module: {
        rules: [
            {
                loader: "ts-loader"
            }
        ]
    }
};