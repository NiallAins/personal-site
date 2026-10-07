import { tTopicData, ePageTag } from "../scripts/types";

export const PROJECT_DATA: tTopicData[] = [
    {
        "title": "Sites",
        "projects": [
            {
                "title": "Johnny Cigarette",
                "year": 2022,
                "desc": [
                    "JohnnyCigarette.ie is a portfolio website made for the Irish animator known as Johnny Cigerette.",
                    "I choose a simple and minimalistic design for this project, to keep the focus on the art being showcased",
                    "The project is built as a static site with VueJS. Content is pulled from a JSON file that is maintained and updated by the artist. I also created a video component which can generate a YouTube or Vimeo player when video urls are detected in the JSON.",
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
                    "Clever Keys is an interactive education website, created to accompany the Clever Keys childrens' music books.",
                    "I deisgned this site to align with the colours and style of the books' covers - as designed by their author Kayleigh Hennessy.",
                    "The site is made using VueJS, with PHP in the backend. The site contains an integrated Stripe storefront, animated sections based on pages from the book, and an interactive piano to play along with lessons. I designed the piano component to accept a JSON format allowing it to play any melody with accompaning lyrics.",
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
                    "PaperWon was a proof of concept site create to explore educational resources and tools to help Irish Leaving Cert maths students.",
                    "I created this project at the height of the pandemic, when schools were turning to online learning. I wanted to create learning tools targeted at visual and tactile learners, which could communicate abstract ideas though animation and interactive geometry components.",
                    "The site and its component are built with VueJS, and pull data and questions from real state examination paper and curricula"
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
                    "As a showcase for my digital projects, the design was based on an idea of a small world build of large pixels. The bulky nature of the pixels is contrasted with fluid animations to giving life to the otherwise inanimate blocks.",
                    "I built the visuals of this site were built using HTML Canvas, running a repurposed isometic graphics engine I had created for a previous project. Further animations are acheived using a mixture of JavaSCript and SCSS transitions. Bash scripts are used to keep design variables in-sync across Canvas, Typescript, and SCSS files - as well as to simplify development and deployment.",
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
                "title": "Every Chord",
                "year": 2020,
                "desc": [
                    "Every Chord is an app for exploring musical chords, and chord voicings, for string instruments. Chords can either be generated from a scale, or input as text - a heuristics algothim will then find the best fingerings available based on the specific instrument and tuning system provided.",
                    "The app also allows chords sheets to be bookmarked and printed off as education resources.",
                    "This project slowly evolved from several other algorthims and visualisations I had created while studing chords and music theory in genreal. I was also able to use my other project <b><i>TinyTone</i></b> to create WebAudio tones for playing each chord in the app. The codebase remains a frankenstein mash up of these pieces, but stumbles along for now.",
                ],
                "linkLive": "https://niallains.github.io/every-chord/",
                "linkCode": "https://github.com/NiallAins/every-chord",
                "tags": [
                    ePageTag.Javascipt,
                    ePageTag.WebAudio
                ]
            },
            {
                "title": "TinWhistler",
                "year": 2023,
                "desc": [
                    "TinWhistler is an app that translate standard ABC music notation into whistle and flute specific notation.",
                    "I designed this app to help both beginner music students, and music teacher who need to create printable classroom resoruces",
                    "The app can translate any tune notated in the ABC standard, and transpose for any key of whistle or flute"
                ],
                "linkLive": "https://niallains.github.io/tin-whistler",
                "linkCode": "https://github.com/NiallAins/tin-whistler",
                "tags": [
                    ePageTag.Javascipt
                ]   
            },
            {
                "title": "Tiny Painter",
                "year": 2019,
                "desc": [
                    "Tiny Painter is a tiny app for tiny paintings.",
                    "I made this little app over two days as part of a coding challenge to &quot;Create an app no larger than 100px &times; 50px&quot;",
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
                "title": "Name This Colour",
                "year": 2019,
                "desc": [
                    "Name This Colour is a visualisation of the RGB colour cube, showing a point for each of 1500 named colours",
                    "The app allows you to search for an RGB, HEX, or colour names within the cube and then find their closest matching colours"
                ],
                "linkLive": "https://niallains.github.io/NameThisColour/",
                "linkCode": "https://github.com/NiallAins/NameThisColour",
                "tags": [
                    ePageTag.Javascipt
                ]
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