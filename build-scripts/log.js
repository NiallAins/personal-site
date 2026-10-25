const
    util = require('../scripts/util-js.js');
    TEXT = process.argv[2];
    COLOR = process.argv[3];
    INLINE = !!process.argv[4];

util.log(TEXT, COLOR, INLINE);
   