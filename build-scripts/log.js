const
    util = require('../scripts/util-js.js'),
    TEXT = process.argv[2],
    [LINE_BEFORE, LINE_AFTER] =
        String(process.argv[3] || '')
            .split('')
            .map(l => parseInt(l)),
    COLOR = process.argv[4];

util.log(TEXT, COLOR, LINE_BEFORE, LINE_AFTER);
   