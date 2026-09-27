import { tTopicData, ePageTag } from "../types";

export const PROJECT_DATA: tTopicData[] = [
    {
        "title": "Sites",
        "projects": [
            {
                "title": "Johnny Cigarette",
                "year": 2022,
                "desc": [
                    "JohnnyCigarette.ie is a small portfolio website made for the Irish animator known as Johnny Cigerette.",
                    "The design was kept simple and minimalistic so as not to distract from the art it is showcasing.",
                    "It is a static site made with VueJS, with content pulled from a JSON file which can is maintained and updated by the artist. The site features a video component which can generate a YouTube or Vimeo player when video urls are detected in the JSON.",
                ],
                "linkLive": "https://johnnycigarette.ie/",
                "linkCode": "https://github.com/NiallAins/Johnny-Cigarette",
                "tags": [
                    ePageTag.VueJS
                ]
            },
            {
                "title": "Clever Keys",
                "year": 2021,
                "desc": [
                    "Clever Keys is an interactive education website, created to accompany the Clever Keys childrens' music books. The site was designed to match the colours and style of the books' covers as designed by their author Kayleigh Hennessy.",
                    "The site contains an integrated Stripe storefront, animated sections based on pages from the book, and an interactive piano to play along with lessons.",
                    "The site is made using VueJS, with PHP in the backend to support the Stripe and email contact forms. The piano component supports a JSON input format which allows it o play any melody with accompaning lyrics.",
                ],
                "linkLive": "https://niallains.github.io/cleverkeys-demo/dist",
                "linkCode": "https://github.com/NiallAins/cleverkeys-demo",
                "tags": [
                    ePageTag.VueJS,
                    ePageTag.Stripe,
                    ePageTag.PHP
                ]
            },
            {
                "title": "PaperWon",
                "year": 2020,
                "desc": [
                    "PaperWon was a proof of concept site created at the height of the pandemic to explore educational resources and tools for Irish Leaving cert maths studies.",
                    "The site is targeted at visual and tactile learners - equation animations and interactive geometry components allow students to solve and understand and real state examination questions taken from past exam papers.",
                    "The site is built using VueJS with many small custom interacive components.",
                ],
                "linkLive": "https://niallains.github.io/PaperWon/dist/",
                "linkCode": "https://github.com/niallAins/PaperWon/tree/master",
                "tags": [
                    ePageTag.VueJS,
                    ePageTag.Canvas
                ]
            },
            {
                "title": "NiallDesign.Dev",
                "year": 2026,
                "desc": [
                    "This very site!",
                    "As a showcase for my digital projects, the design was based on an idea of a small world build of large pixels. The bulky nature of the pixels is contrasted with fluid animations to give life to these otherwise inanimate blocks.",
                    "The visuals of this site were built using HTML Canvas, running a repurposed isometic graphics engine I created for a previous project. Further animations are acheived using a mixture of JavaSCript and SCSS transitions. Bash scripts are used to keep design variables in-sync across Canvas, Typescript, and SCSS files - as well as to simplify development and deployment.",
                ],
                "linkCode": "https://github.com/NiallAins/personal-site",
                "tags": [
                    ePageTag.Typescript,
                    ePageTag.Canvas,
                    ePageTag.NodeJS,
                    ePageTag.Bash
                ]
            },
        ]
    },
    {
        "title": "Music / Visuals",
        "projects": [
            {
                "title": "TinyTone",
                "year": 2025,
                "desc": [
                    "TinyTone is a web app and small library built on JavaScript's Web Audio API. The app allows you to create audio tones by combining audio textures, envelopes, and effects, then export them to use in your projects along with a library to control them",
                    "I created TinyTone so I could have a dynamic audio library to create effects for other projects - as well as an excuse to dive into modular synths and audio production.",
                    "The app has a complex node-and-plug interface implemented in HTML Canvas, as well as several custom range input component to allow user input across multiple effects modules."
                ],
                "linkLive": "https://niallains.github.io/tinytone",
                "linkCode": "https://github.com/niallains/tinytone",
                "tags": [
                    ePageTag.Typescript,
                    ePageTag.Canvas,
                    ePageTag.WebAudio
                ]
            },
            {
                "title": "Musical scale generator",
                "year": 2025,
                "desc": [
                    "I created this Musical Scale Generator to visually explain how musical scales are derived. The app allows you to change the inital parameters of the standard western scale to show how this creates new scales.",
                    "This app contains a custom circular range inputs, and a playable piano which changes layout to match whatever scales you create.",
                ],
                "linkLive": "https://niallains.github.io/generate-scales/",
                "linkCode": "https://github.com/NiallAins/generate-scales",
                "tags": [
                    ePageTag.Javascipt,
                    ePageTag.Canvas,
                    ePageTag.WebAudio
                ]
            },
            {
                "title": "Carnegie Hall chart",
                "year": 2026,
                "desc": [
                    "The Carnegie Hall chart was created in 1941 by E.J. Quimby. As the original only exists online in very low quality, difficult to read images - I decided to recreate it in vector form.",
                    "I kept the orignal layout of the chart, while adding some additional information and redesigning elements to improve readability. As it is built as a HTML page, one functional improvement is the ability to copy values directly form the chart",
                    "The chart is designed to be printed out as an A2 wall chart, but can also be viewed online as a vector graphic, or downloaded as a PNG"
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": [
                    ePageTag.Javascipt
                ]
            },
            {
                "title": "Every Guitar Chord Voiced",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "TinWhistler",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Tiny Painter",
                "year": 2019,
                "desc": [
                    "Tiny Painter is a tiny app for tiny paintings.",
                    "I made this little app over two days as part of a coding challenge to \"Create an app no larger than 100px &times; 50px\"",
                    "It allows you to change colours and brush sizes, and save, copy, and download your masterpieces."
                ],
                "linkLive": "https://codepen.io/niallains/full/LYPzbVv",
                "linkCode": "https://codepen.io/niallains/pen/LYPzbVv",
                "tags": [
                    ePageTag.Javascipt,
                    ePageTag.Canvas
                ]
            },
            {
                "title": "Tartan Generator",
                "year": 2022,
                "desc": [
                    "My Tartan Generator generates genuine tartan cloth patterns using CSS backgrounds.",
                    "It can also use a string as a random number seed, allowing it to create a unique tartan for any name.",
                    "Created for St. Andrew's day."
                ],
                "linkLive": "https://codepen.io/niallains/full/ExEOmdJ",
                "linkCode": "https://codepen.io/niallains/pen/ExEOmdJ",
                "tags": [
                    ePageTag.Javascipt
                ]
            },
            {
                "title": "Name That Colour",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            }
        ]
    },
    {
        "title": "Maths / Space",
        "projects": [
            {
                "title": "The Big Number Namer",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "One Googol Visualised",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Venn Diagram Generator",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": [],
                "hide": true
            },
            {
                "title": "How Daylight Hours Work",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "How Tides Work",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "The Universal Unit Converter",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Every Body in the Solar System",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Irish Voting Charts",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
        ]
    },
    {
        "title": "Games",
        "projects": [
            {
                "title": "Mage Hand",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Buck N Sons",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "CrossCreator",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Little Iso World",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "The Gibberish Poem Generator",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Agent RegX",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": [],
                "hide": true
            },
            {
                "title": "Marathon: The Game",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": [],
                "hide": true
            },
            {
                "title": "Glade",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": [],
                "hide": true
            }
        ]
    },
    {
        "title": "Sport",
        "projects": [
            {
                "title": "Snooker Score UI",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Strava Heatmap",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Your Strava: Graphed",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Tour Strava: Poster",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Run Plan Generator",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Running Pace Calculator",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "English Football Chart",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            }
        ]
    },
    {
        "title": "Dev",
        "projects": [
            {
                "title": "Z-Buffer Visualised",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Camera Colour Picker",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Region Caching Visualised",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Quaternions Visualised",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Extended Range Inputs",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Angle Calcs Visualised",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Color Library",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Colour Spaces Visualised",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": []
            },
            {
                "title": "Extended SASS Themes",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": [],
                "hide": true
            },
            {
                "title": "Gridiron",
                "year": 2020,
                "desc": [
                    "",
                ],
                "linkLive": "",
                "linkCode": "",
                "tags": [],
                "hide": true
            }
        ]
    }
];