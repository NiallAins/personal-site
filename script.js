//
// Page set up
//
const
  CAN = document.getElementById('CAN_SEA'),
  CTX = CAN.getContext('2d'),
  CAN_SKY = document.getElementById('CAN_SKY'),
  CTX_SKY = CAN_SKY.getContext('2d'),
  CAN_W = Math.min(window.innerWidth, 2000),
  CAN_H = Math.min(window.innerHeight, 1250),
  CAN_SKY_H = window.innerHeight * 0.75,
  ISO_SCALE = 16;
CAN.width = CAN_W;
CAN.height = CAN_H;
CTX.miterLimit = 1;
CTX.font = "4px 'Neuton'";
CTX.textAlign = 'center';
CTX.textBaseline = 'middle';
CAN_SKY.width = CAN_W;
CAN_SKY.height = CAN_SKY_H;

let
  splashes = [],
  noise = null,
  paused = false;

const
  LABELS = ['Visuals', ' Apps', 'Sites', 'Games', 'Tools']
    .map((text, ti) => {
      const PT = ptFromScreen(
        (CAN_W * (ti % 2 ? 0.65 : 0.35)) - (text.length * ISO_SCALE * 2),
        (CAN_H * 1.425) + (CAN_H * 0.5 * ti)
      );
      return text
        .split('')
        .map((letter, li) => ({
          text: letter,
          hover: 0,
          can0: null,
          can1: null,
          x: PT[0],
          y: PT[1] - (li * 2)
        }));
    })
    .flat(),
  LABEL_ELS = Array.from(
    document.querySelectorAll('.main__topic')
  );
LABEL_ELS.forEach((el, i) => {
  el.style.left = (CAN_W * (i % 2 ? 0.65 : 0.325)) + 'px';
  const LENS = [0, 7, 12, 17, 22, 27];
  el.onmouseenter = () => {
    for (let j = LENS[i]; j < LENS[i + 1]; j++) {
      LABELS[j].hover = 0.1;
    }
  }
  el.onmouseleave = () => {
    for (let j = LENS[i]; j < LENS[i + 1]; j++) {
      LABELS[j].hover = 0;
    }
  }
  el.onclick = () => openPage(i);
});


function drawLabels() {
  const
    CW = 74,
    CH = 48;
  LABELS.forEach(l => {
    const
      [CN0, CX0] = createCanvas(CW, CH),
      [CN1, CX1] = createCanvas(CW, CH);
    CX0.fillStyle = '#0008';
    CX1.fillStyle = '#fff';
    CX0.filter = 'blur(4px)';
    [CX0, CX1].forEach(C => {
      C.translate(CW * 0.45, CW * 0.3);
      C.scale(1.25 * ISO_SCALE, 0.75 * ISO_SCALE);
      C.rotate(-0.7616);
      C.font = "4px 'Neuton'";
      C.textAlign = 'center';
      C.textBaseline = 'middle';
      C.fillText(l.text, 0, 0);
    });
    l.can0 = CN0;
    l.can1 = CN1;
  });
}

function createCanvas(w, h) {
  const
    CN = document.createElement('canvas'),
    CX = CN.getContext('2d');
  CN.width = w;
  CN.height = h;
  return [CN, CX];
}

//
// Color
//
const
  TERRAIN_SEA = [0.5, [174, 53, 40, 0.5 ]];
  TERRAIN = [
    [0.0, [ 18,  70,  20]],
    [0.3, [ 62,  82,  35]],
    [1.0, [106,  80,  35]]
  ];

//
// Init animation
//
function init() {
  noise = new Noise();
  drawSky();
  createPages();

  new FontFace(
    "Neuton",
    "url(https://fonts.gstatic.com/s/neuton/v24/UMBTrPtMoH62xUZCz4g6.woff2)"
  )
    .load()
    .then(f => {
      document.fonts.add(f);
      drawLabels();
      animate();

      // openPage(0);
    });
}

//
// Pages
//
function createPages() {
  document
    .getElementById('sections')
    .innerHTML =
      [
        [
          {
            title: 'The Complete Football League chart',
            desc: `
              An interactive chart showing every English football club and their progression through the national league system since the start of the premier league.
              <br/>
              Created as an experiement in visualising large quantities of data over many dimensions.
            `,
            img:  'footballChart.png',
            demo: 'niallains.github.io/footballChart',
            code: 'github.io/niallains/footballChart'
          },
          {
            title: 'The Complete Football League chart',
            desc: `
              An interactive chart showing every English football club and their progression through the national league system since the start of the premier league.
              <br/>
              Created as an experiement in visualising large quantities of data over many dimensions.
            `,
            img:  'footballChart.png',
            demo: 'niallains.github.io/footballChart',
            code: 'github.io/niallains/footballChart'
          },
          {
            title: 'The Complete Football League chart',
            desc: `
              An interactive chart showing every English football club and their progression through the national league system since the start of the premier league.
              <br/>
              Created as an experiement in visualising large quantities of data over many dimensions.
            `,
            img:  'footballChart.png',
            demo: 'niallains.github.io/footballChart',
            code: 'github.io/niallains/footballChart'
          }
        ]
      ].reduce((htmS, sec) => htmS +
        `<section class="section"> ${
          sec.reduce((htmP, proj) => htmP +
            `<div class="section__item">
              <div class="section__item-image-container">
                <img
                  class="section__item-image"
                  src="./images/${ proj.img }"
                  alt='screenshot from the project "${ proj.title }"'
                />
              </div>
              <div class="section__item-text">
                <h3 class="section__item-text-title">
                  ${ proj.title }
                </h3>
                <p class="section__item-text-lede">
                  ${ proj.desc }
                </p>
                <div class="section__item-text-link-container">
                  <a
                    href="${ proj.demo }"
                    class="section__item-text-link"
                  >
                    Open
                  </a>
                  <a
                    href="${ proj.code }"
                    class="section__item-text-link"
                  >
                    Source code
                  </a>
                </div>
              </div>
            </div>`,
            ''
          )
        } </section>`,
        ''
      );
}
function openPage(i) {
  paused = true;
  document.body.style.overflow = 'hidden';
  document.getElementById('sections')
    .children[i]
    .classList
    .add('section--open'); 
}
function closePage(i) {
  paused = false;
  document.body.style.overflow = 'auto';
  document.getElementById('sections')
    .children[i]
    .classList
    .remove('section--open');
}


//
// Animation loop
//
let asd = 0;
function animate(t = 0, dT = 1) {
  if (!paused) {
    drawSea(t, dT);
  }
  t = (t + (0.00075 * dT)) % 1;
  asd += 0;
  requestFrameScaled(animate.bind(null, t));
}

function requestFrameScaled(cb, fps = 33.33) {
  const
    T = +new Date(),
    DT = Math.min(T - (window.prevFrameTime || T), 1000);
  window.prevFrameTime = T;
  window.requestAnimationFrame(() => cb(DT / fps));
};

//
// Sky
//
function drawSky() {
  for (let i = 0; i < 50; i++) {
    const
      C = `hsl(${Math.floor(Math.random() * 360)}deg, 100%, 90%)`,
      X = Math.random() * CAN_W,
      Y = Math.random() * CAN_SKY_H;
    CTX_SKY.fillStyle = C;
    CTX_SKY.save();
      CTX_SKY.translate(X, Y);
      CTX_SKY.rotate(0.785);
      const W = 1 + (Math.random() * 2);
      CTX_SKY.fillRect(0, 0, W, W);
    CTX_SKY.restore();
  }
}

//
// Terrain color
//
function getTerrainColor(z, isSea) {
  let c, alpha = 1;
  if (isSea) {
    c = TERRAIN_SEA[1];
    alpha = c[3] * (z < 0.2 ? z / 0.2 : 1);
  } else {
    z = Math.min(1, Math.max(0, (z + 3) / 8));
    const
      CI = TERRAIN.findIndex(c => z <= c[0]),
      C0 = TERRAIN[CI - 1],
      C1 = TERRAIN[CI],
      R = 1 - ((C1[0] - z) / (C1[0] - C0[0]));
    c = C0[1].map((h, i) => h + ((C1[1][i] - h) * R));
  }
  
  return [0, 8, 12]
    .map(h => `hsl(${c[0]} ${c[1]}% ${c[2] - h}% / ${alpha})`);
}

//
// Map screen to iso grid
//
function ptFromScreen(x, y) {
  x *= -0.5;
  y *= 0.5;

  let
    wx = y - (x * 0.5),
    wy = x + wx;
  x = wx;
  y = wy;
  
  x /= ISO_SCALE;
  y /= ISO_SCALE;

  x = Math.floor(x);
  y = Math.floor(y);

  return [x, y];
}

function ptToScreen(x, y) {
  x *= ISO_SCALE;
  y *= ISO_SCALE;

  x = y - x,
  y = y - x * 0.5;

  x /= -0.5;
  y /= 0.5;

  return [x, y - window.scrollY];
}

//
// Events
//
CAN_SEA.onmousemove = e => {
  if (!splashes.find(c => Math.abs(e.clientY - c.y) + Math.abs(e.clientX - c.x) < ISO_SCALE * 2)) {
    splashes.push({
      p: 0,
      t: 0,
      s: true,
      x: e.clientX,
      y: e.clientY
    });
  }
};

//
// Render the current frame
//
function drawSea(t, dT) {
  CTX.clearRect(0, 0, CAN_W, CAN_H);
  
  // Draw isometic
  CTX.save();
    CTX.translate(asd, window.scrollY * -1);
    let offsetRow = false;
    LABEL_ELS.forEach(el => el.style.pointerEvents = 'none');
    LABELS.forEach(l => l.hover && l.hover < 1 ? l.hover += 0.2 * dT : null)
    for (
      let y = Math.max(CAN_H * 0.75, window.scrollY - (ISO_SCALE * 6));
      y < CAN_H + window.scrollY + (ISO_SCALE * 10);
      y += ISO_SCALE
    ) {
      const ROW = Math.floor(y / ISO_SCALE) - 80;
      if (ROW >= 0 && ROW < 150 && ROW % 30  === 0) {
        const
          SY = y - window.scrollY,
          DY = SY < 500 ? Math.pow((1 - ((SY - 200) / 300)) * 10.5, 2) : 0,
          Y = y + DY - (ISO_SCALE * 10),
          I = ROW / 30;
        if (DY < 180) {
          LABEL_ELS[I].style.pointerEvents = 'all';
          LABEL_ELS[I].style.top = (Y - 462) + 'px';
        }
      }

      offsetRow = !offsetRow;
      for (let x = -asd; x < CAN_W  + (ISO_SCALE * 4) - asd; x += ISO_SCALE * 4) {
        const
          ISO_PT = ptFromScreen(
            x + (offsetRow ? ISO_SCALE * 2 : 0),
            y
          ),
          SCR_PT = ptToScreen(ISO_PT[0], ISO_PT[1]);
        
        drawTerrainIso(
          t,
          ISO_PT[0], ISO_PT[1],
          SCR_PT[0], SCR_PT[1]
        );
      }
    }
    splashes.forEach(c => {
      c.p += dT * 0.25;
      if (c.s) {
        c.t += dT * 150;
        if (c.t > 1000) {
          c.s = false;
        }
      } else {
        c.t /= 1 + (0.05 * dT);
        if (c.t < 5) {
          splashes.splice(splashes.indexOf(c), 1);
        }
      }
    });
  CTX.restore();
}

function getLandZ(x, y) {
  y += window.scrollY;
  if (y < CAN_H || y > CAN_H * 3.6) {
    return -5;
  }
  const
    PHASE_X = CAN_W / 28,
    PHASE_Y = CAN_H * 0.5,
    PHASE_Z = -10;
    PERIOD_X = CAN_W / 6,
    PERIOD_Y = CAN_H / 6,
    AMP = 14;
  return (
    PHASE_Z +
    (
      AMP *
      Math.sin((x + PHASE_X) / PERIOD_X) *
      Math.sin((y + PHASE_Y) / PERIOD_Y)
    ) +
    noise.get(x / 32, y / 32)
  );
}

function getSeaZ(t, x, y, sx, sy) {
  // return 0;
  // Wave
  let z = Math.cos((y + (x * 0.25) + (t * 200)) * 0.125);
  
  // Splashes
  splashes.forEach(c => {
    // Distance
    const DIST =
      Math.pow(sx - c.x, 2) +
      Math.pow(sy - c.y, 2);
    if (DIST < 90000) {
      // Period
      let cz =
        Math.cos((DIST / 15000) - c.p + 3.14) *
      // Time fade
        c.t * 0.0002 *
      // Distance fade
        ((90000 - DIST) / 90000);

      z += cz;
    }
  });

  return z + (noise.get(x, y) * 0.15);
}

//
// Draw isometic terrain blocks for one x, y point
//
function drawTerrainIso(t, x, y, sx, sy) {
  const
    LAND_Z = getLandZ(sx, sy),
    SEA_Z = getSeaZ(t, x, y, sx, sy),
    MIN_Z = -3,
    FADE_Z = sy < 450 ? Math.pow((1 - ((sy - 170) / 280)) * 1.9, 2) : 0;

  if (LAND_Z > MIN_Z) {
    drawIso(
      CTX,
      x, y,
      MIN_Z - FADE_Z, LAND_Z - FADE_Z,
      getTerrainColor(LAND_Z, false)
    );
  }
  if (
    SEA_Z >= LAND_Z &&
    sy > 0 &&
    sy < window.innerHeight + ISO_SCALE * 4
  ) {
    const LABEL = LABELS.find(l => l.x === x && l.y === y);
    drawIso(
      CTX,
      x, y,
      Math.max(LAND_Z, SEA_Z - 2) - FADE_Z, SEA_Z - FADE_Z,
      getTerrainColor(SEA_Z - LAND_Z, true),
      LABEL
    );
  }
}

//
// Draw a single isometic block
//
function drawIso(CTX, x, y, z0, z, color, letter) {
  const H = Math.max(0, (z - z0) * 2);
  CTX.save();
    CTX.scale(-ISO_SCALE, ISO_SCALE);
    CTX.translate(
      (x * -2) + (y * 2),
      x + y + (z * -2)
    );
    CTX.beginPath();
      CTX.moveTo(0, 0);
      CTX.lineTo(-2, -1);
      CTX.lineTo(0, -2);
      CTX.lineTo(2, -1);
    CTX.fillStyle = color[0];
    CTX.fill();
    CTX.beginPath();
      CTX.moveTo(0, H);
      CTX.lineTo(-2, H - 1);
      CTX.lineTo(-2, -1);
      CTX.lineTo(0, 0);
    CTX.fillStyle = color[1]
    CTX.fill();
    CTX.beginPath();
      CTX.moveTo(0, 0);
      CTX.lineTo(0, H);
      CTX.lineTo(2.125, H - 1);
      CTX.lineTo(2.125, -1);
    CTX.fillStyle = color[2];
    CTX.fill();

    if (letter) {
      CTX.scale(1 / -ISO_SCALE, 1 /  ISO_SCALE);
      CTX.drawImage(
        letter.can0,
        2.25 * -ISO_SCALE,
        -3.5 * ISO_SCALE
      );
      CTX.drawImage(
        letter.can1,
        -2 * ISO_SCALE,
        (-5 - (letter.hover ? 2 * Math.min(letter.hover, 1) : 0)) * ISO_SCALE
      );
    }
  CTX.restore();
}

//
// Generates a perlin noise function
//
class Noise {
  _width;
  _height;
  _gradients = {};
  _memory = {};
  
  constructor(width = 10, height = 5) {
    this._width = width;
    this._height = height * 1.438;
  }
  
  get(x, y = 0) {
    x /= this._width;
    y /= this._width;
    let
      xf = Math.floor(x),
      yf = Math.floor(y),
      tl = this._dotProd(x, y, xf, yf),
      tr = this._dotProd(x, y, xf + 1, yf),
      bl = this._dotProd(x, y, xf, yf + 1),
      br = this._dotProd(x, y, xf + 1, yf + 1),
      xt = this._interp(x - xf, tl, tr),
      xb = this._interp(x - xf, bl, br),
      v = this._interp(y - yf, xt, xb);
    return this._height * v;
  }
  
  _randVect() {
      let theta = Math.random() * 2 * Math.PI;
      return {x: Math.cos(theta), y: Math.sin(theta)};
  }
  _dotProd(x, y, vx, vy) {
    let
      g_vect,
      d_vect = { x: x - vx, y: y - vy };
    if (this._gradients[[vx,vy]]){
      g_vect = this._gradients[[vx,vy]];
    } else {
      g_vect = this._randVect();
      this._gradients[[vx, vy]] = g_vect;
    }
    return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
  }
  _smootherStep(x) {
    return 6*x**5 - 15*x**4 + 10*x**3;
  }
  _interp(x, a, b) {
    return a + this._smootherStep(x) * (b - a);
  }
}

init();