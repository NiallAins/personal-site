const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        main: "./scripts/main.ts"
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "script.js"
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                loader: "ts-loader"
            }
        ]
    }
}