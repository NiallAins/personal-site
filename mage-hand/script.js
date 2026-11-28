
        const APPBAR_STYLE = document.createElement('style');
        APPBAR_STYLE.innerHTML = `@import url("https://fonts.googleapis.com/css2?family=Neuton:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");
body {
  margin: 0 auto;
}

.appbar {
  --c-bg: #111128;
  --c-fg: #ffffff;
  height: 3.5rem;
  transition: height 500ms;
}
.appbar.page--closing {
  height: 0;
}
.appbar--light {
  --c-bg: #eeeeee;
  --c-fg: #111128;
}
.appbar__body {
  overflow: hidden;
}
.appbar__container {
  position: fixed;
  inset: 0 0 auto 0;
}
.appbar__header {
  position: relative;
  z-index: 100;
  height: 2rem;
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--c-bg);
  transition: margin-top 500ms;
}
.appbar__header-icon {
  width: 2rem;
  height: 2rem;
  opacity: 0.625;
  color: var(--c-fg);
}
.appbar__header-link:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 0.5rem;
}
.appbar__header-link {
  padding: 0 0 0.625rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: box-shadow 500ms, translate 500ms;
}
.appbar__header-link:active {
  translate: 0 0.5rem;
}
.appbar__header-link {
  box-shadow: inset 0 0 0 0 currentColor;
}
.appbar__header-link:hover, .appbar__header-link:focus-visible, a:hover > .appbar__header-link, a:focus-visible > .appbar__header-link, button:hover > .appbar__header-link, button:focus-visible > .appbar__header-link {
  box-shadow: inset 0 -0.25rem 0 0 currentColor;
}
.appbar__header-link:active {
  translate: 0 0.25rem;
}
.appbar__header-link {
  font-size: 1.125rem;
  font-family: Neuton, Georgia, serif;
  color: var(--c-fg);
  text-decoration: none;
  translate: 0 0.25rem;
}
.appbar__header-link:hover:not(:active) {
  translate: 0 0;
}
.appbar__header-link:focus-visible {
  outline-offset: 0.25rem;
}
.appbar__header-close:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 0.5rem;
}
.appbar__header-close {
  position: absolute;
  z-index: 110;
  right: 1rem;
  top: 0.75rem;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 100%;
  margin-left: auto;
  margin-right: 0.75rem;
  background-color: var(--c-bg);
  cursor: pointer;
  transition: opacity 500ms, rotate 500ms;
}
.appbar__header-close:focus-visible {
  outline-offset: 0.25rem;
}
.appbar__header-close:hover {
  opacity: 1;
}
.appbar__header-close::after {
  content: "";
  position: absolute;
  inset: 0.625rem;
  display: inline-block;
  border: solid var(--c-fg);
  rotate: 45deg;
  translate: 0 0.125rem;
  border-width: 2px 0 0 2px;
}
.appbar__header-about {
  opacity: 0;
  transition: opacity 500ms;
  pointer-events: none;
}
.appbar__header-about.page--sub-opening {
  opacity: 1;
  pointer-events: all;
}
.appbar__header-about-scrim {
  position: fixed;
  inset: 0;
  z-index: 80;
}
.appbar__header-about-scrim::after {
  content: "";
  position: fixed;
  inset: 3.5rem 0 0 0;
  background-color: rgba(0, 0, 0, 0.4);
}
.appbar__header-about-content {
  font-size: 1.125rem;
  font-weight: 400;
  font-family: Roboto, Helvetica, san-serif;
  color: #ffffff;
  line-height: 1.5;
  font-size: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 30rem;
  padding: 1.5rem;
  padding-top: 3.5rem;
  border-bottom-right-radius: 0.25rem;
  color: var(--c-fg);
  background-color: var(--c-bg);
  translate: 0 -100%;
  transition: translate 500ms;
}
.appbar__header-about-content > * {
  margin: 0;
}
.appbar__header-about-content-title {
  font-size: 1.75rem;
  font-weight: 500;
  letter-spacing: 1px;
  font-family: Neuton, Georgia, serif;
  color: #ffffff;
  color: var(--c-fg);
}
.appbar__header-about.page--inactive .appbar__header-about-content {
  display: none;
}
.appbar__header-about.page--sub-opening .appbar__header-about-content {
  translate: 0 0;
}
.appbar--minimal .appbar__header-about, .appbar--minimal .appbar__header-link--about, .appbar--minimal .appbar__header-close {
  display: none;
}
.appbar--light .appbar__header-icon {
  opacity: 1;
}
.appbar--light .appbar__header-link:focus-visible, .appbar--light .appbar__header-close:focus-visible {
  outline-color: #111128;
}
.appbar.page--closing .appbar__header {
  margin-top: -3.5rem;
  pointer-events: none;
}
.appbar.page--inactive .appbar__header {
  display: none;
}
.appbar.page--closing .appbar__header-close {
  rotate: -180deg;
}
.appbar.page--closing .appbar__header-close:not(:hover) {
  opacity: 0.25;
}
.appbar.page--closing .appbar__header-close:focus-visible {
  opacity: 1;
  outline-color: #111128;
}
.appbar__frame {
  width: 100vw;
  height: calc(100svh - 3.5rem);
  padding: 0;
  border: none;
  margin: 0;
  transition: height 500ms;
}
.appbar.page--closing + .appbar__frame {
  height: 100svh;
}
`;
        document.head.appendChild(APPBAR_STYLE);

        const APPBAR_TEMPLATE = document.createElement('div');
        APPBAR_TEMPLATE.innerHTML = `<header
        id="appbar"
        class="appbar appbar--minimal"
        style="--c-bg:#111111"
    >
        <div class="appbar__container">
            <div class="appbar__header">
                <a
                    href="."
                    aria-label="nialldesign.dev"
                >
                    <img
                        src="https://nialldesign.dev/icons/favicon-mono-light.svg"
                        class="appbar__header-icon"
                        alt="niall-design-dev icon"
                        width="32"
                        height="32"
                    />
                </a>
                <button
                    id="appbar_headerAboutButton"
                    class="appbar__header-link appbar__header-link--about"
                >
                    About
                </button>
                <a
                    id="appbar_headerLink"
                    class="appbar__header-link"
                    href="https://nialldesign.dev/#mage-hand"
                ></a>
            </div>
            <div
                id="appbar_headerAbout"
                class="appbar__header-about"
            >
                <div class="appbar__header-about-content">
                    <h1 class="appbar__header-about-content-title">
                        Mage Hand
                    </h1>
                    <p> Mage Hand is a Dungeons & Dragons character app that can track your equipment, stats, and character details. The app uses the DnD5e API to pull data for every weapon and object in the game, as well as supporting custom objects. </p>
<p> The app is built with VueJs and is designed to be downloaded as a local webapp. It supports local storage and data caching to allow offline usage. </p>
                </div>
                <div
                    id="appbar_headerAboutScrim"
                    class="appbar__header-about-scrim"
                ></div>
            </div>
            <button
                id="appbar_headerClose"
                class="appbar__header-close"
                aria-label="toggle more projects bar"
            ></button>
        </div>
    </header>`;
        document.body.prepend(APPBAR_TEMPLATE);

        (()=>{"use strict";var e,t,a,o,r,s,c;if(function(e){e[e.Main=0]="Main",e[e.Contact=1]="Contact",e[e.Experience=2]="Experience",e[e.Topic=3]="Topic",e[e.Project=4]="Project"}(e||(e={})),function(e){e[e.Typescript=0]="Typescript",e[e.Canvas=1]="Canvas",e[e.Bash=2]="Bash",e[e.VueJs=3]="VueJs",e[e.Javascipt=4]="Javascipt",e[e.NodeJS=5]="NodeJS",e[e.PHP=6]="PHP",e[e.WebAudio=7]="WebAudio",e[e.CameraAPI=8]="CameraAPI",e[e.StripeAPI=9]="StripeAPI",e[e.StravaAPI=10]="StravaAPI",e[e.UmamiAPI=11]="UmamiAPI"}(t||(t={})),function(e){e[e.Linear=0]="Linear",e[e.Ease=1]="Ease",e[e.EaseIn=2]="EaseIn",e[e.EaseOut=3]="EaseOut",e[e.Elastic=4]="Elastic",e[e._ElasticIn=5]="_ElasticIn"}(a||(a={})),function(e){e[e.BackwardReverseLoop=-4]="BackwardReverseLoop",e[e.BackwardReverse=-3]="BackwardReverse",e[e.BackwardLoop=-2]="BackwardLoop",e[e.Backward=-1]="Backward",e[e.Paused=0]="Paused",e[e.Forward=1]="Forward",e[e.ForwardLoop=2]="ForwardLoop",e[e.ForwardReverse=3]="ForwardReverse",e[e.ForwardReverseLoop=4]="ForwardReverseLoop"}(o||(o={})),function(e){e.ArrowUp="up",e.ArrowDown="down",e.ArrowLeft="left",e.ArrowRight="right",e.Space="space"}(r||(r={})),function(e){e.BoatAttempt="boat-attempt"}(s||(s={})),function(e){e.Crash="crash",e.Timeout="timeout",e.BlurTimeout="blur-timeout",e.TouchCrash="mobile-crash",e.TouchLand="mobile-land",e.Win="win"}(c||(c={})),"undefined"!=typeof process&&process.argv[2]){const e=process.argv[2],[t,a]=String(process.argv[3]||"").split("").map(e=>parseInt(e));!function(e,t="b",a=1,o=0){const r={r:"[0;31m",g:"[0;32m",b:"[0;36m",w:"[0m"},s=r[t]||r.w;"undefined"==typeof process?(a>1&&console.log("\n".repeat(a-1)),console.log(`${s}> ${e}${r.w}`),o&&console.log("\n".repeat(o))):(a&&process.stdout.write("\n".repeat(a)),process.stdout.write(`${s}${a?">":""} ${e}${r.w}`),o&&process.stdout.write("\n".repeat(o)))}(e,process.argv[4],t,a)}function n(e){return document.querySelector(e)}const i="page--inactive",p="page--closing",d="page--sub-opening";e.Main,e.Contact,e.Experience,n("#page_main"),n("#topics"),n("#header_navLinksExperience"),n("#header_navLinksContact"),n("#header_navMore"),Array.from(document.querySelectorAll(".page__close")),n("#page_experience"),n("#page_contact"),n("#page_topic"),n("#page_project"),n("#project_close"),n("#project_title"),n("#project_tags"),n("#project_desc"),n("#project_image"),n("#project_linkLive"),n("#project_linkCode"),n("#boat"),window.devicePixelRatio,Math.PI;const u=document.getElementById("appbar_headerLink"),l="true"===window.sessionStorage.getItem("hasPreviousVisit");u.innerText=l?"Back to projects":"More projects",l||(u.href=u.href.replace(/#.*/,""));let m=-1;const w=document.getElementById("appbar_headerAboutButton"),g=document.getElementById("appbar_headerAboutScrim"),v=document.getElementById("appbar_headerAbout");function L(e=!1){if(clearTimeout(m),v.classList.contains(d))v.classList.remove(d),m=setTimeout(()=>v.classList.add(i),500);else{if(e)return;v.classList.remove(i),m=setTimeout(()=>v.classList.add(d))}}w.classList.add(i),w.onclick=()=>L(),g.onclick=()=>L(!0);let _=-1;const f=document.getElementById("appbar");document.getElementById("appbar_headerClose").onclick=()=>(L(!0),clearTimeout(_),void(f.classList.contains(p)?(f.classList.remove(i),_=setTimeout(()=>f.classList.remove(p))):(f.classList.add(p),_=setTimeout(()=>f.classList.add(i),500))))})();
    