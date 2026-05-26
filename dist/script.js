/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/consts.ts"
/*!***************************!*\
  !*** ./scripts/consts.ts ***!
  \***************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.TARGET_FPS = exports.SPLASH_FADE_TIME = exports.SPLASH_FADE_DIST = exports.SPLASH_MAX_DIST = exports.TERRAIN = exports.TERRAIN_SEA = exports.ISO_SCALE = exports.SKY_HEIGHT_RATIO = exports.LABEL_LETTER_SHADOW = exports.LABEL_LETTER_HEIGHT = exports.LABEL_LETTER_WIDTH = exports.SECTION_LABELS = exports.EL_SECTION_LABELS = exports.ANI_SHORT = exports.COLOR_TEXT_SHADOW = exports.COLOR_TEXT_D = exports.FONT_TITLE_SRC = exports.FONT_TITLE = exports.PAGE_HEIGHT = exports.PAGE_WIDTH = exports.PAGE_HEIGHT_MAX = exports.PAGE_WIDTH_MAX = void 0;\nconst util_1 = __webpack_require__(/*! ./util */ \"./scripts/util.ts\");\n//\n// Page dimensions\n//\nexports.PAGE_WIDTH_MAX = 2000, exports.PAGE_HEIGHT_MAX = 1250, exports.PAGE_WIDTH = Math.min(window.innerWidth, exports.PAGE_WIDTH_MAX), exports.PAGE_HEIGHT = Math.min(window.innerHeight, exports.PAGE_HEIGHT_MAX);\n//\n// Styles\n//\nexports.FONT_TITLE = (0, util_1.getCssVar)('f-fam-title'), exports.FONT_TITLE_SRC = (0, util_1.getCssVar)('f-fam-title-src'), exports.COLOR_TEXT_D = (0, util_1.getCssVar)('c-text-l'), exports.COLOR_TEXT_SHADOW = (0, util_1.getCssVar)('c-text-shadow'), exports.ANI_SHORT = parseInt((0, util_1.getCssVar)('ani-sh'));\n//\n// Labels\n//\nexports.EL_SECTION_LABELS = (0, util_1.getEls)('.main__topic-button'), exports.SECTION_LABELS = [\n    'Visuals',\n    ' Apps',\n    'Sites',\n    'Games',\n    'Tools'\n], exports.LABEL_LETTER_WIDTH = 74, exports.LABEL_LETTER_HEIGHT = 48, exports.LABEL_LETTER_SHADOW = 4;\n//\n// Graphics\n//\nexports.SKY_HEIGHT_RATIO = 0.75, exports.ISO_SCALE = 16, exports.TERRAIN_SEA = [0.5, [174, 53, 40, 0.5]], exports.TERRAIN = [\n    [0.0, [18, 70, 20]],\n    [0.3, [62, 82, 35]],\n    [1.0, [106, 80, 15]]\n], exports.SPLASH_MAX_DIST = 90000, exports.SPLASH_FADE_DIST = exports.SPLASH_MAX_DIST / 6, exports.SPLASH_FADE_TIME = 0.0002, exports.TARGET_FPS = 33.33;\n\n\n//# sourceURL=webpack://personalsite/./scripts/consts.ts?\n}");

/***/ },

/***/ "./scripts/graphics/Canvas.ts"
/*!************************************!*\
  !*** ./scripts/graphics/Canvas.ts ***!
  \************************************/
(__unused_webpack_module, exports) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Canvas = void 0;\nclass Canvas {\n    constructor(id, width, height) {\n        this.CAN = id\n            ? document.getElementById(id)\n            : document.createElement('canvas');\n        this.CTX = this.CAN.getContext('2d');\n        this.CAN.width = width;\n        this.CAN.height = height;\n        this.CTX.miterLimit = 1;\n        this.CTX.textAlign = 'center';\n        this.CTX.textBaseline = 'middle';\n    }\n}\nexports.Canvas = Canvas;\n\n\n//# sourceURL=webpack://personalsite/./scripts/graphics/Canvas.ts?\n}");

/***/ },

/***/ "./scripts/graphics/LabelLetter.ts"
/*!*****************************************!*\
  !*** ./scripts/graphics/LabelLetter.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LabelLetter = void 0;\nconst consts_1 = __webpack_require__(/*! ../consts */ \"./scripts/consts.ts\");\nconst Canvas_1 = __webpack_require__(/*! ./Canvas */ \"./scripts/graphics/Canvas.ts\");\nconst graphics_1 = __webpack_require__(/*! ./graphics */ \"./scripts/graphics/graphics.ts\");\nclass LabelLetter {\n    constructor(x, y, letter) {\n        this.hover = 0;\n        this.X = x;\n        this.Y = y;\n        this.LETTER = letter;\n        const CAN_FG = new Canvas_1.Canvas('', consts_1.LABEL_LETTER_WIDTH, consts_1.LABEL_LETTER_HEIGHT), CAN_BG = new Canvas_1.Canvas('', consts_1.LABEL_LETTER_WIDTH, consts_1.LABEL_LETTER_HEIGHT);\n        this.CTX_FG = CAN_FG.CTX;\n        this.CTX_BG = CAN_BG.CTX;\n        this.CAN_FG = CAN_FG.CAN;\n        this.CAN_BG = CAN_BG.CAN;\n    }\n    static generateFromLabelEl(el, index) {\n        const TEXT = consts_1.SECTION_LABELS[index], PT = (0, graphics_1.ptFromScreen)((consts_1.PAGE_WIDTH * (index % 2 ? 0.65 : 0.35)) - (TEXT.length * consts_1.ISO_SCALE * 2), (consts_1.PAGE_HEIGHT * 1.425) + (consts_1.PAGE_HEIGHT * 0.5 * index));\n        el.style.left = (consts_1.PAGE_WIDTH * (index % 2 ? 0.65 : 0.325)) + 'px';\n        el.onclick = () => (0, graphics_1.toggleSectionOpen)();\n        return TEXT\n            .split('')\n            .map((letter, li) => {\n            const LETTER = new LabelLetter(PT[0], PT[1] - (li * 2), letter);\n            el.addEventListener('mouseenter', () => LETTER.hover = 0.1);\n            el.addEventListener('mouseleave', () => LETTER.hover = 0);\n            return LETTER;\n        });\n    }\n    draw() {\n        this.CTX_FG.fillStyle = consts_1.COLOR_TEXT_D;\n        this.CTX_BG.fillStyle = consts_1.COLOR_TEXT_SHADOW;\n        this.CTX_BG.filter = `blur(${consts_1.LABEL_LETTER_SHADOW}px)`;\n        [this.CTX_FG, this.CTX_BG].forEach(c => {\n            c.translate(consts_1.LABEL_LETTER_WIDTH * 0.5, consts_1.LABEL_LETTER_HEIGHT * 0.45);\n            c.scale(1.25 * consts_1.ISO_SCALE, 0.75 * consts_1.ISO_SCALE);\n            c.rotate(-0.7616);\n            c.font = `500 4px \"${consts_1.FONT_TITLE}\"`;\n            c.textAlign = 'center';\n            c.textBaseline = 'middle';\n            c.fillText(this.LETTER, 0, 0);\n        });\n    }\n}\nexports.LabelLetter = LabelLetter;\n\n\n//# sourceURL=webpack://personalsite/./scripts/graphics/LabelLetter.ts?\n}");

/***/ },

/***/ "./scripts/graphics/Noise.ts"
/*!***********************************!*\
  !*** ./scripts/graphics/Noise.ts ***!
  \***********************************/
(__unused_webpack_module, exports) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Noise = void 0;\n//\n// Generates a perlin noise function\n//\nclass Noise {\n    constructor(width = 10, height = 5) {\n        this._gradients = {};\n        this._width = width;\n        this._height = height * 1.438;\n    }\n    get(x, y = 0) {\n        x /= this._width;\n        y /= this._width;\n        let xf = Math.floor(x), yf = Math.floor(y), tl = this._dotProd(x, y, xf, yf), tr = this._dotProd(x, y, xf + 1, yf), bl = this._dotProd(x, y, xf, yf + 1), br = this._dotProd(x, y, xf + 1, yf + 1), xt = this._interp(x - xf, tl, tr), xb = this._interp(x - xf, bl, br), v = this._interp(y - yf, xt, xb);\n        return this._height * v;\n    }\n    _randVect() {\n        let theta = Math.random() * 2 * Math.PI;\n        return {\n            x: Math.cos(theta),\n            y: Math.sin(theta)\n        };\n    }\n    _dotProd(x, y, vx, vy) {\n        let g_vect, d_vect = { x: x - vx, y: y - vy };\n        if (this._gradients[[vx, vy].join()]) {\n            g_vect = this._gradients[[vx, vy].join()];\n        }\n        else {\n            g_vect = this._randVect();\n            this._gradients[[vx, vy].join()] = g_vect;\n        }\n        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;\n    }\n    _smootherStep(x) {\n        return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;\n    }\n    _interp(x, a, b) {\n        return a + this._smootherStep(x) * (b - a);\n    }\n}\nexports.Noise = Noise;\n\n\n//# sourceURL=webpack://personalsite/./scripts/graphics/Noise.ts?\n}");

/***/ },

/***/ "./scripts/graphics/Splash.ts"
/*!************************************!*\
  !*** ./scripts/graphics/Splash.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Splash = void 0;\nconst consts_1 = __webpack_require__(/*! ../consts */ \"./scripts/consts.ts\");\nclass Splash {\n    constructor(x, y) {\n        this.x = 0;\n        this.y = 0;\n        this.age = 0;\n        this.fading = false;\n        this.period = 0;\n        this.x = x;\n        this.y = y;\n    }\n    static createSplash(x, y) {\n        if (!Splash.splashes.find(s => Math.abs(y - s.y) + Math.abs(x - s.x) < consts_1.ISO_SCALE * 2)) {\n            Splash.splashes.push(new Splash(x, y));\n        }\n    }\n    getZ(x, y) {\n        const DIST = Math.pow(x - this.x, 2) +\n            Math.pow(y - this.y, 2);\n        return DIST < consts_1.SPLASH_MAX_DIST\n            ? Math.cos((DIST / consts_1.SPLASH_FADE_DIST) - this.period + 3.14) *\n                // Time fade\n                this.age * consts_1.SPLASH_FADE_TIME *\n                // Distance fade\n                ((consts_1.SPLASH_MAX_DIST - DIST) / consts_1.SPLASH_MAX_DIST)\n            : 0;\n    }\n    step(dT) {\n        this.period += dT * 0.25;\n        if (!this.fading) {\n            this.age += dT * 150;\n            if (this.age > 1000) {\n                this.fading = true;\n            }\n        }\n        else {\n            this.age /= 1 + (0.05 * dT);\n            if (this.age < 5) {\n                Splash.splashes.splice(Splash.splashes.indexOf(this), 1);\n            }\n        }\n    }\n}\nexports.Splash = Splash;\nSplash.splashes = [];\n\n\n//# sourceURL=webpack://personalsite/./scripts/graphics/Splash.ts?\n}");

/***/ },

/***/ "./scripts/graphics/graphics.ts"
/*!**************************************!*\
  !*** ./scripts/graphics/graphics.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\n//\n// Animation\n//\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.togglePause = togglePause;\nexports.toggleSectionOpen = toggleSectionOpen;\nexports.init = init;\nexports.ptFromScreen = ptFromScreen;\nconst Canvas_1 = __webpack_require__(/*! ./Canvas */ \"./scripts/graphics/Canvas.ts\");\nconst Noise_1 = __webpack_require__(/*! ./Noise */ \"./scripts/graphics/Noise.ts\");\nconst Splash_1 = __webpack_require__(/*! ./Splash */ \"./scripts/graphics/Splash.ts\");\nconst consts_1 = __webpack_require__(/*! ../consts */ \"./scripts/consts.ts\");\nconst util_1 = __webpack_require__(/*! ../util */ \"./scripts/util.ts\");\nconst LabelLetter_1 = __webpack_require__(/*! ./LabelLetter */ \"./scripts/graphics/LabelLetter.ts\");\n//\n// Readonly properties\n//\nconst NOISE = new Noise_1.Noise(), CAN_SKY = new Canvas_1.Canvas('CAN_SKY', consts_1.PAGE_WIDTH, consts_1.PAGE_HEIGHT * consts_1.SKY_HEIGHT_RATIO), CAN_SEA = new Canvas_1.Canvas('CAN_SEA', consts_1.PAGE_WIDTH, consts_1.PAGE_HEIGHT), LABELS = consts_1.EL_SECTION_LABELS\n    .map((el, i) => LabelLetter_1.LabelLetter.generateFromLabelEl(el, i))\n    .flat(), ANI_SHORT_PER_FRAME = 1 / (0, util_1.msToFrames)(consts_1.ANI_SHORT);\n//\n// State\n//\nlet sectionOpen = false, transFade = 0, paused = false;\nfunction togglePause() {\n    paused = !paused;\n}\nfunction toggleSectionOpen() {\n    sectionOpen = !sectionOpen;\n}\n//\n// Init\n//\nfunction init() {\n    CAN_SEA.CAN.onmousemove = e => Splash_1.Splash.createSplash(e.clientX, e.clientY);\n    renderSky(CAN_SKY.CTX);\n    LABELS.forEach(l => l.draw());\n    animate();\n}\n//\n// Animation loop\n//\nfunction animate(t = 0, dT = 1) {\n    if (!paused) {\n        renderTerrain(CAN_SEA.CTX, t, dT);\n        t = (t + (0.00075 * dT)) % 1;\n    }\n    if (sectionOpen && transFade < 1) {\n        if (transFade === 0) {\n            CAN_SEA.CAN.classList.add('canvas__sea--lower');\n        }\n        transFade += ANI_SHORT_PER_FRAME * dT;\n    }\n    else if (!sectionOpen && transFade > 0) {\n        if (transFade === 1) {\n            CAN_SEA.CAN.classList.remove('canvas__sea--lower');\n        }\n        transFade -= ANI_SHORT_PER_FRAME * dT;\n    }\n    transFade = Math.max(0, Math.min(1, transFade));\n    (0, util_1.requestFrameScaled)(animate.bind(null, t));\n}\n//\n// Terrain color\n//\nfunction getTerrainColor(z, isSea) {\n    let c, alpha = 1;\n    if (isSea) {\n        c = consts_1.TERRAIN_SEA[1];\n        alpha = c[3] * (z < 0.2 ? z / 0.2 : 1);\n    }\n    else {\n        z = Math.min(1, Math.max(0, (z + 3) / 8));\n        const CI = consts_1.TERRAIN.findIndex(c => z <= c[0]), C0 = consts_1.TERRAIN[CI - 1], C1 = consts_1.TERRAIN[CI], R = 1 - ((C1[0] - z) / (C1[0] - C0[0]));\n        c = C0[1].map((h, i) => h + ((C1[1][i] - h) * R));\n    }\n    return [0, 8, 12]\n        .map(h => `hsl(${c[0]} ${c[1]}% ${c[2] - h}% / ${alpha})`);\n}\n//\n// Co-ordinate look-ups\n//\nfunction ptFromScreen(x, y) {\n    x *= -0.5;\n    y *= 0.5;\n    let wx = y - (x * 0.5), wy = x + wx;\n    x = wx;\n    y = wy;\n    x /= consts_1.ISO_SCALE;\n    y /= consts_1.ISO_SCALE;\n    x = Math.floor(x);\n    y = Math.floor(y);\n    return [x, y];\n}\nfunction ptToScreen(x, y) {\n    x *= consts_1.ISO_SCALE;\n    y *= consts_1.ISO_SCALE;\n    x = y - x,\n        y = y - x * 0.5;\n    x /= -0.5;\n    y /= 0.5;\n    return [x, y - window.scrollY];\n}\nfunction getLandZ(can, x, y) {\n    y += window.scrollY;\n    if (x > can.width ||\n        y < can.height ||\n        y > can.height * 3.6) {\n        return -5;\n    }\n    const PHASE_X = can.width / 28, PHASE_Y = can.height * 0.55, PHASE_Z = -3, PERIOD_X = can.width / 6, PERIOD_Y = can.height / 6, AMP = 5;\n    return (PHASE_Z +\n        (AMP *\n            Math.sin((x + PHASE_X) / PERIOD_X) *\n            Math.sin((y + PHASE_Y) / PERIOD_Y)) +\n        (NOISE.get(x / 32, y / 32) * 0.25));\n}\nfunction getSeaZ(t, x, y, sx, sy) {\n    return (\n    // Ebb\n    Math.cos((y + (x * 0.25) + (t * 200)) * 0.125) +\n        // Splash waves\n        Splash_1.Splash.splashes.reduce((sum, s) => sum + s.getZ(sx, sy), 0) +\n        // Noise\n        (NOISE.get(x, y) * 0.15));\n}\n//\n// Runder functions\n//\nfunction renderSky(c) {\n    for (let i = 0; i < 50; i++) {\n        const X = Math.random() * c.canvas.width, Y = Math.random() * c.canvas.height;\n        c.fillStyle = `hsl(${Math.floor(Math.random() * 360)}deg, 100%, 90%)`;\n        c.save();\n        c.translate(X, Y);\n        c.rotate(0.785);\n        const W = 1 + (Math.random() * 2);\n        c.fillRect(0, 0, W, W);\n        c.restore();\n    }\n}\nfunction renderTerrain(c, t, dT) {\n    c.clearRect(0, 0, c.canvas.width, c.canvas.height);\n    // Draw isometic\n    c.save();\n    c.translate(0, window.scrollY * -1);\n    let offsetRow = false;\n    consts_1.EL_SECTION_LABELS.forEach(el => el.style.pointerEvents = 'none');\n    LABELS.forEach(l => l.hover && l.hover < 1 ? l.hover += 0.2 * dT : null);\n    const MAX_Y = (c.canvas.height * (transFade === 1 ? 0.4 : 1)) + window.scrollY + (consts_1.ISO_SCALE * 10);\n    for (let y = Math.max(c.canvas.height * 0.75, window.scrollY - (consts_1.ISO_SCALE * 6)); y < MAX_Y; y += consts_1.ISO_SCALE) {\n        const ROW = Math.floor(y / consts_1.ISO_SCALE) - 80;\n        if (ROW >= 0 && ROW < 150 && ROW % 30 === 0) {\n            const SY = y - window.scrollY, DY = SY < 500 ? Math.pow((1 - ((SY - 200) / 300)) * 10.5, 2) : 0, Y = y + DY - (consts_1.ISO_SCALE * 10), I = ROW / 30;\n            if (DY < 180) {\n                consts_1.EL_SECTION_LABELS[I].style.pointerEvents = 'all';\n                consts_1.EL_SECTION_LABELS[I].style.top = (Y - 945) + 'px';\n            }\n        }\n        offsetRow = !offsetRow;\n        for (let x = 0; x < c.canvas.width + (consts_1.ISO_SCALE * 4); x += consts_1.ISO_SCALE * 4) {\n            const ISO_PT = ptFromScreen(x + (offsetRow ? consts_1.ISO_SCALE * 2 : 0), y), SCR_PT = ptToScreen(ISO_PT[0], ISO_PT[1]);\n            renderTerrainIso(c, t, ISO_PT[0], ISO_PT[1], SCR_PT[0], SCR_PT[1]);\n        }\n    }\n    Splash_1.Splash.splashes.forEach(s => s.step(dT));\n    c.restore();\n}\n// Draw isometic terrain blocks for one x, y point\nfunction renderTerrainIso(c, t, x, y, sx, sy) {\n    const LAND_Z = getLandZ(CAN_SEA.CAN, sx, sy), SEA_Z = getSeaZ(t, x, y, sx, sy), MIN_Z = -3, FADE_Z = sy < 450 ? Math.pow((1 - ((sy - 170) / 280)) * 1.9, 2) : 0;\n    // Render land\n    if (LAND_Z > MIN_Z) {\n        renderIso(c, x, y, MIN_Z - FADE_Z, LAND_Z - FADE_Z, getTerrainColor(LAND_Z, false));\n    }\n    // Render sea\n    if (SEA_Z >= LAND_Z &&\n        sy > 0 &&\n        sy < window.innerHeight + consts_1.ISO_SCALE * 4) {\n        const LABEL = LABELS.find(l => l.X === x && l.Y === y);\n        renderIso(c, x, y, Math.max(LAND_Z, SEA_Z - 2) - FADE_Z, SEA_Z - FADE_Z, getTerrainColor(SEA_Z - LAND_Z, true), LABEL);\n    }\n}\n// Draw a single isometic block\nfunction renderIso(c, x, y, z0, z, color, letter) {\n    const H = Math.max(0, (z - z0) * 2);\n    c.save();\n    c.scale(-consts_1.ISO_SCALE, consts_1.ISO_SCALE);\n    c.translate((x * -2) + (y * 2), x + y + (z * -2));\n    c.beginPath();\n    c.moveTo(0, 0);\n    c.lineTo(-2, -1);\n    c.lineTo(0, -2);\n    c.lineTo(2, -1);\n    c.fillStyle = color[0];\n    c.fill();\n    c.beginPath();\n    c.moveTo(0, H);\n    c.lineTo(-2, H - 1);\n    c.lineTo(-2, -1);\n    c.lineTo(0, 0);\n    c.fillStyle = color[1];\n    c.fill();\n    c.beginPath();\n    c.moveTo(0, 0);\n    c.lineTo(0, H);\n    c.lineTo(2.125, H - 1);\n    c.lineTo(2.125, -1);\n    c.fillStyle = color[2];\n    c.fill();\n    if (letter) {\n        c.scale(1 / -consts_1.ISO_SCALE, 1 / consts_1.ISO_SCALE);\n        c.globalAlpha = Math.max(0, 1 - transFade);\n        // Shdaow\n        c.drawImage(letter.CAN_BG, 2.25 * -consts_1.ISO_SCALE, -3.5 * consts_1.ISO_SCALE);\n        // Letter\n        c.drawImage(letter.CAN_FG, -2 * consts_1.ISO_SCALE, (-5 - (letter.hover ? 2 * Math.min(letter.hover, 1) : 0)) * consts_1.ISO_SCALE);\n    }\n    c.restore();\n}\n\n\n//# sourceURL=webpack://personalsite/./scripts/graphics/graphics.ts?\n}");

/***/ },

/***/ "./scripts/main.ts"
/*!*************************!*\
  !*** ./scripts/main.ts ***!
  \*************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst util_1 = __webpack_require__(/*! ./util */ \"./scripts/util.ts\");\nconst graphics_1 = __webpack_require__(/*! ./graphics/graphics */ \"./scripts/graphics/graphics.ts\");\nconst pages_1 = __webpack_require__(/*! ./pages */ \"./scripts/pages.ts\");\nconst consts_1 = __webpack_require__(/*! ./consts */ \"./scripts/consts.ts\");\nasync function init() {\n    (0, pages_1.createPages)();\n    await (0, util_1.loadFont)(consts_1.FONT_TITLE, consts_1.FONT_TITLE_SRC);\n    (0, graphics_1.init)();\n}\ninit();\n\n\n//# sourceURL=webpack://personalsite/./scripts/main.ts?\n}");

/***/ },

/***/ "./scripts/pageData.ts"
/*!*****************************!*\
  !*** ./scripts/pageData.ts ***!
  \*****************************/
(__unused_webpack_module, exports) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PAGE_DATA = void 0;\nexports.PAGE_DATA = [\n    [\n        {\n            \"title\": \"The Complete Football League chart\",\n            \"desc\": `\r\n                An interactive chart showing every English football club and their progression through the national league system since the start of the premier league.\r\n                <br/>\r\n                Created as an experiement in visualising large quantities of data over many dimensions.\r\n            `,\n            \"img\": \"footballChart.png\",\n            \"demo\": \"niallains.github.io/footballChart\",\n            \"code\": \"github.io/niallains/footballChart\"\n        },\n        {\n            \"title\": \"The Complete Football League chart\",\n            \"desc\": `\r\n                An interactive chart showing every English football club and their progression through the national league system since the start of the premier league.\r\n                <br/>\r\n                Created as an experiement in visualising large quantities of data over many dimensions.\r\n            `,\n            \"img\": \"footballChart.png\",\n            \"demo\": \"niallains.github.io/footballChart\",\n            \"code\": \"github.io/niallains/footballChart\"\n        },\n        {\n            \"title\": \"The Complete Football League chart\",\n            \"desc\": `\r\n                An interactive chart showing every English football club and their progression through the national league system since the start of the premier league.\r\n                <br/>\r\n                Created as an experiement in visualising large quantities of data over many dimensions.\r\n            `,\n            \"img\": \"footballChart.png\",\n            \"demo\": \"niallains.github.io/footballChart\",\n            \"code\": \"github.io/niallains/footballChart\"\n        }\n    ]\n];\n\n\n//# sourceURL=webpack://personalsite/./scripts/pageData.ts?\n}");

/***/ },

/***/ "./scripts/pages.ts"
/*!**************************!*\
  !*** ./scripts/pages.ts ***!
  \**************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.createPages = createPages;\nexports.openPage = openPage;\nexports.closePage = closePage;\nconst pageData_1 = __webpack_require__(/*! ./pageData */ \"./scripts/pageData.ts\");\nconst graphics_1 = __webpack_require__(/*! ./graphics/graphics */ \"./scripts/graphics/graphics.ts\");\nfunction createPages() {\n    document\n        .getElementById('sections')\n        .innerHTML = pageData_1.PAGE_DATA\n        .reduce((htmS, sec) => htmS +\n        `<section class=\"section\">\r\n                    ${sec.reduce((htmP, proj) => htmP +\n            `<div class=\"section__item\">\r\n                            <div class=\"section__item-image-container\">\r\n                                <img\r\n                                    class=\"section__item-image\"\r\n                                    src=\"./images/${proj.img}\"\r\n                                    alt='screenshot from the project \"${proj.title}\"'\r\n                                />\r\n                            </div>\r\n                            <div class=\"section__item-text\">\r\n                                <h3 class=\"section__item-text-title\">\r\n                                    ${proj.title}\r\n                                </h3>\r\n                                <p class=\"section__item-text-lede\">\r\n                                    ${proj.desc}\r\n                                </p>\r\n                                <div class=\"section__item-text-link-container\">\r\n                                <a\r\n                                    href=\"${proj.demo}\"\r\n                                    class=\"section__item-text-link\"\r\n                                >\r\n                                    Open\r\n                                </a>\r\n                                <a\r\n                                    href=\"${proj.code}\"\r\n                                    class=\"section__item-text-link\"\r\n                                >\r\n                                    Source code\r\n                                </a>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    `, '')}\r\n                </section>\r\n            `, '');\n}\nfunction openPage(i) {\n    (0, graphics_1.togglePause)();\n    document.body.style.overflow = 'hidden';\n    document.getElementById('sections')\n        .children[i]\n        .classList\n        .add('section--open');\n}\nfunction closePage(i) {\n    (0, graphics_1.togglePause)();\n    document.body.style.overflow = 'auto';\n    document.getElementById('sections')\n        .children[i]\n        .classList\n        .remove('section--open');\n}\n\n\n//# sourceURL=webpack://personalsite/./scripts/pages.ts?\n}");

/***/ },

/***/ "./scripts/util.ts"
/*!*************************!*\
  !*** ./scripts/util.ts ***!
  \*************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.requestFrameScaled = requestFrameScaled;\nexports.msToFrames = msToFrames;\nexports.getCssVar = getCssVar;\nexports.getEl = getEl;\nexports.getEls = getEls;\nexports.loadFont = loadFont;\nconst consts_1 = __webpack_require__(/*! ./consts */ \"./scripts/consts.ts\");\nfunction requestFrameScaled(cb, fps = consts_1.TARGET_FPS) {\n    const T = +new Date(), DT = Math.min(T - (window.prevFrameTime || T), 1000);\n    window.prevFrameTime = T;\n    window.requestAnimationFrame(() => cb(DT / fps));\n}\n;\nfunction msToFrames(ms) {\n    return (ms / 1000) * consts_1.TARGET_FPS;\n}\nfunction getCssVar(varName) {\n    return getComputedStyle(document.body).getPropertyValue('--' + varName);\n}\nfunction getEl(query) {\n    return document.querySelectorAll(query);\n}\nfunction getEls(query) {\n    return Array.from(document.querySelectorAll(query));\n}\nasync function loadFont(name, src) {\n    const F = await new FontFace(name, src).load();\n    document.fonts.add(F);\n    console.log('loaded');\n    return;\n}\n\n\n//# sourceURL=webpack://personalsite/./scripts/util.ts?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./scripts/main.ts");
/******/ 	
/******/ })()
;