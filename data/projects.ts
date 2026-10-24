import { tTopicData, ePageTag, ePages } from "../scripts/types";

export const PROJECT_DATA: tTopicData[] = [
    {
        "title": "Sites",
        "projects": [
            {
                "title": "Johnny Cigarette",
                "year": 2022,
                "desc": [
                    "JohnnyCigarette.ie is a portfolio website made for the Irish animator known as Johnny Cigerette.",
                    "I went with a simple and minimalistic design for this project, to keep the focus on the art on show.",
                    "The project is built as a static site with VueJS. Content is pulled from a JSON file that is maintained and updated by the artist. I also created a video component which can generate a YouTube or Vimeo player when video urls are detected in the JSON.",
                ],
                "linkLive": "https://johnnycigarette.ie",
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
                    "I deisgned this site to align with the colours and style of the books' covers &#x2014; as designed by their author Kayleigh Hennessy.",
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
                "linkLive": "https://niallains.github.io/PaperWon/dist",
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
                    "As a showcase for my digital projects, the design was based on an idea of a small world built of large pixels. The bulky nature of the pixels is contrasted with fluid animations to giving life to the otherwise inanimate blocks.",
                    "I built the visuals of this site were built using HTML Canvas, running a repurposed isometic graphics engine I had created for a previous project. Further animations are acheived using a mixture of JavaSCript and SCSS transitions. Bash scripts are used to keep design variables in-sync across Canvas, Typescript, and SCSS files &#x2014; as well as to simplify development and deployment.",
                ],
                "linkCode": "https://github.com/NiallAins/personal-site",
                "tags": [
                    ePageTag.Typescript,
                    ePageTag.Canvas,
                    ePageTag.NodeJS,
                    ePageTag.Bash
                ]
            }
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
                    "I created TinyTone so I could have a dynamic audio library to create effects for other projects &#x2014; as well as an excuse to dive into modular synths and audio production.",
                    "The app has a complex node-and-plug interface implemented in HTML Canvas, as well as several custom range input component to allow user input across multiple effects modules."
                ],
                "linkLive": "https://niallains.github.io/tinytone",
                "linkCode": "https://github.com/niallains/tinytone",
                "tags": [
                    ePageTag.Javascipt,
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
                "linkLive": "https://niallains.github.io/generate-scales",
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
                    "The Carnegie Hall chart was created in 1941 by E.J. Quimby. As the original only exists online in very low quality, difficult to read images &#x2014; I decided to recreate it in vector form.",
                    "I kept the orignal layout of the chart, while adding some additional information and redesigning elements to improve readability. As it is built as a HTML page, one functional improvement is the ability to copy values directly form the chart",
                    "The chart is designed to be printed out as an A2 wall chart, but can also be viewed online as a vector graphic, or downloaded as a PNG"
                ],
                "linkLive": "https://niallains.github.io/carnegie-hall-chart",
                "linkCode": "https://github.com/NiallAins/carnegie-hall-chart",
                "tags": [
                    ePageTag.Javascipt
                ]
            },
            {
                "title": "Every Chord",
                "year": 2023,
                "desc": [
                    "Every Chord is an app for exploring musical chords, and chord voicings, for string instruments. Chords can either be generated from a scale, or input as text &#x2014; a heuristics algothim will then find the best fingerings available based on the specific instrument and tuning system provided.",
                    "The app also allows chords sheets to be bookmarked and printed off as education resources.",
                    "This project slowly evolved from several other algorthims and visualisations I had created while studing chords and music theory in genreal. I was also able to use my other project <b><i>TinyTone</i></b> to create WebAudio tones for playing each chord in the app. The codebase remains a frankenstein mash up of these pieces, but stumbles along for now."
                ],
                "linkLive": "https://niallains.github.io/every-chord",
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
                "linkLive": "https://niallains.github.io/tiny-painter",
                "linkCode": "https://github.com/NiallAins/tiny-painter",
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
                "linkLive": "https://niallains.github.io/tartan-generator",
                "linkCode": "https://github.com/NiallAins/tartan-generator",
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
                "linkLive": "https://niallains.github.io/NameThisColour",
                "linkCode": "https://github.com/NiallAins/NameThisColour",
                "tags": [
                    ePageTag.Javascipt,
                    ePageTag.Canvas
                ]
            }
        ]
    },
    {
        "title": "Maths / Space",
        "projects": [
            {
                "title": "The Big Number Namer",
                "year": 2025,
                "desc": [
                    "Have a big number? Need to name it? Oh boy are you in luck.",
                    "This app will generate the correct mathamatical name for every number from 0&nbsp;(<em>Zero!</em>) to 12,345&times;10<sup>67,890</sup>&nbsp;(<em>one sepnonagintiquinticenti-duovigintimilillion, two hundred and thirty four sexnonagintiquinticenti-duovigintimilillion, five hundred quinnonagintiquinticenti-duovigintimilillion googol!</em>)... and beyond."
                ],
                "linkLive": "https://niallains.github.io/big-number-namer",
                "linkCode": "https://github.com/NiallAins/big-number-namer",
                "tags": [
                    ePageTag.Javascipt
                ]
            },
            {
                "title": "One Googol Animated",
                "year": 2025,
                "desc": [
                    "One Googol Animated in an interactive animation of stacking blocks &#x2014; from 1 to 10<sup>100</sup>.",
                    "This app contains possibly the largest ranged slider input <em>on the internet</em> &#x2014; allowing you to smoothly slide between 100 orders of magnitude. 10<sup>20</sup> times more options than particles in the universe.",
                    "This project lead in to my next &#x2014; The Big Number Namer."
                ],
                "linkLive": "https://niallains.github.io/one-googol-animated",
                "linkCode": "https://github.com/NiallAins/one-googol-animated",
                "tags": [
                    ePageTag.Javascipt,
                    ePageTag.Canvas
                ]
            },
            {
                "title": "Daylight Cycles Animated",
                "year": 2021,
                "desc": [
                    "Daylight Cycles is an interactive animation demonstrating the astronomy behind changing daylight hours"
                ],
                "linkLive": "https://niallains.github.io/daylight-cycles-animated",
                "linkCode": "https://github.com/NiallAins/daylight-cycles-animated",
                "tags": [
                    ePageTag.Canvas,
                    ePageTag.Javascipt
                ]
            },
            {
                "title": "How Tides Work",
                "year": 2020,
                "desc": [
                    "This interactive animation shows how the sun, the earth, and the moon interact to moves the tides throughout the year",
                    "The animation is based on real data from Irish tides for the year 2020"
                ],
                "linkLive": "https://niallains.github.io/how-tides-work",
                "linkCode": "https://github.com/NiallAins/how-tides-work",
                "tags": [
                    ePageTag.Canvas,
                    ePageTag.Javascipt
                ]
            },
            {
                "title": "The Universal Unit Converter",
                "year": 2025,
                "desc": [
                    "A litre is equal to one cubic millimeter - but how many litres are in an A4 sheet of paper, or a fortnight? The Universal Unit Converter attempts to answer these ago old questions, with the ability to convert between almost 500 unit types",
                    "Built as the frontend to a large spreadsheet of interesting units I had been curating, this app finally allowed me to start introducing terms such as Gigadessertspoons, and Megafoolscap into casual conversation."
                ],
                "linkLive": "https://niallains.github.io/universal-unit-converter",
                "linkCode": "https://github.com/NiallAins/universal-unit-converter",
                "tags": [
                    ePageTag.Typescript
                ]
            },
            {
                "title": "Every Body in the Solar System",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Voting Charts",
                "year": 2024,
                "desc": [
                    "I created these charts during the 2024 Irish MEP elections, in an attempt to visualise how the Single Transferable Voting system in Ireland works",
                    "The charts display each candidates, along with their approximate political alignment - then shows how the votes of each eliminated candiate are distribued"
                ],
                "linkLive": "https://niallains.github.io/mep-election-charts",
                "linkCode": "https://github.com/NiallAins/mep-election-charts",
                "tags": [
                    ePageTag.Canvas,
                    ePageTag.Javascipt
                ]
            }
        ]
    },
    {
        "title": "Games",
        "projects": [
            {
                "title": "Mage Hand",
                "year": 2019,
                "desc": [
                    "Mage Hand is a Dungeons & Dragons character app that can track your equipment, stats, and characer details. The app uses the DnD5e API to pull data for every weapon and object in the game, as well as supporting custom objects",
                    "The app is built with VueJS and is designed to be downloaded as a local webapp. It supports localstorage and data caching to allow offline usage."
                ],
                "linkLive": "https://niallains.github.io/MageHand/dist",
                "linkCode": "https://github.com/NiallAins/MageHand",
                "tags": [
                    ePageTag.VueJS
                ]
            },
            {
                "title": "Buck N Sons",
                "year": 2016,
                "desc": [
                    "Buck N Sons is a retro-style aracade game created for the band Buck N Sons to be released alongside their first album.",
                    "The visual style of the game is based on the music video for their track Pancake Paradise, which also supplies the soundtrack",
                    "This was my first proect after graduating - I created the game engine from scratch, as well as drawing all the pixel art assets. I worked with the band to record voices and sound effects, and was finally able to showcase the game for the first time at the album launch party in Dublin"
                ],
                "linkLive": "https://niallains.github.io/BuckNSons",
                "linkCode": "https://github.com/NiallAins/BuckNSons",
                "tags": [
                    ePageTag.Javascipt,
                    ePageTag.Canvas,
                    ePageTag.WebAudio
                ]
            },
            {
                "title": "CrossCreator",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Little Iso World",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "The Gibberish Poet",
                "year": 2025,
                "desc": [
                    "A Gibberish poet writes poems in Gibberish... or are they?",
                    "I created this as an experiment with randomness and Zipfian distribution. The app generates random words - but in a cadence and distribution that matches natural language. This gives the illusion that the poems are undstandable if you were to just study them for long enough.",
                    "The words of each poem are all pronounceable, allowing you to read each poem aloud, feeling the impact of rhythim and punctuation devoid of any literal meaning",
                    "Each poem is generated with a seed that can be used to recreate or share."
                ],
                "linkLive": "https://niallains.github.io/gibberish-poet",
                "linkCode": "https://github.com/NiallAins/gibberish-poet",
                "tags": [
                    ePageTag.Javascipt
                ]
            }
        ]
    },
    {
        "title": "Sport",
        "projects": [
            {
                "title": "Every World Cup Performance",
                "year": 2026,
                "desc": [
                    "I created this chart during the 2026 FIFA World Cup to try and show the world cup journies of every nation - from qualifiers to finals.",
                    "This chart is one in a series I have created that attempt to display large amount of dense information is an consumable and interesting way.",
                    "One element that I felt was important to include in this chart, was data on the many journies of nations that have never made it to a finals."
                ],
                "linkLive": "https://niallains.github.io/every-world-cup",
                "linkCode": "https://github.com/NiallAins/every-world-cup",
                "tags": [
                    ePageTag.Javascipt
                ]
            },
            {
                "title": "Strava Heatmap",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Snooker Score UI",
                "year": 2026,
                "desc": [
                    "My dream job would be to create television score tracking UIs for various sports boradcasts",
                    "To manifest this reality, I created this snooker scoring UI while watching the World Snooker Championships",
                    "This visual attempts to communicate the most captivating aspect of snooker - the race to, and the manipulation of, the elusive line of Snookers Required."
                ],
                "linkLive": "https://niallains.github.io/snooker-score-ui",
                "linkCode": "https://github.com/NiallAins/snooker-score-ui",
                "tags": [
                    ePageTag.Javascipt
                ]
            },
            {
                "title": "Strava Heatmap",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Your Strava: Graphed",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Your Strava: Poster",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Run Plan Generator",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Running Pace Calculator",
                "year": 2020,
                "desc": [
                    "An app for calculating running distances, times, and paces - in both metres and miles.",
                    "I built this for my own use, as every other pace calculator on the internet is shite.",
                    "The app is designed to have maximum funtionality, with minimum elements."
                ],
                "linkLive": "https://niallains.github.io/running-pace-calculator",
                "linkCode": "https://github.com/NiallAins/running-pace-calculator",
                "tags": [
                    ePageTag.Typescript
                ]
            },
            {
                "title": "English Football Chart",
                "year": 2024,
                "desc": [
                    "This chart shows the relative movement of the 172 clubs who have taken part in the 5 national English football leagues, since the establishment of the Premier League in 1992 / 93",
                    "Clubs are coloured according to their ranking at the end of that first season, to show how ranking has shuffled throughout the years, and any club can be highlighted to show its paths more clearly",
                    "This chart is one in a series I have created that attempt to display large amount of dense information is an consumable and interesting way. This is definitly on the more... maximalist side of data vis."
                ],
                "linkLive": "https://niallains.github.io/english-club-football-chart",
                "linkCode": "https://github.com/NiallAins/english-club-football-chart",
                "tags": [
                    ePageTag.Javascipt,
                    ePageTag.Canvas
                ]
            }
        ]
    },
    {
        "title": "Dev",
        "projects": [
            {
                "title": "Z-Buffer Visualised",
                "year": 2025,
                "desc": [
                    "An interacitve visualisation of how a z-buffering algorithim works in 3d graphics.",
                    "When a triangle is rendered in 3d space, the z-position of eeach pixel needs to be calculated.",
                    "I created this visualisation when learning about 3d graphics and building a basic 3d engine from first principles.",
                ],
                "linkLive": "https://niallains.github.io/z-buffer-visualised",
                "linkCode": "https://github.com/NiallAins/z-buffer-visualised",
                "tags": [
                    ePageTag.Javascipt,
                    ePageTag.Canvas
                ]
            },
            {
                "title": "Camera Colour Picker",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Region Caching Visualised",
                "year": 2025,
                "desc": [
                    "An interactive visualisation of how a view region caching algorithim works.",
                    "Region caching can pre-load background images, or game levels, based on the current view position.",
                    "I created this visualisation when trying to implement my own algorithim for another project.",
                ],
                "linkLive": "https://niallains.github.io/view-region-caching",
                "linkCode": "https://github.com/NiallAins/view-region-caching",
                "tags": [
                    ePageTag.Javascipt,
                    ePageTag.Canvas
                ]
            },
            {
                "title": "Quaternions Visualised",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Extended Range Inputs",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Angle Calcs Visualised",
                "year": 2024,
                "desc": [
                    "An small visualisation of how angles are measured",
                    "I have been stuck on so many projects when it comes to measuring relative angles beween lines. So I create a function which calculates every available angle between two given lines - and this visualisation tool to help you understand what angle you are actually looking for."
                ],
                "linkLive": "https://niallains.github.io/angle-functions-visualised",
                "linkCode": "https://github.com/NiallAins/angle-functions-visualised",
                "tags": [
                    ePageTag.Canvas,
                    ePageTag.Javascipt
                ]
            },
            {
                "title": "Colour Library",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Colour Space Compare",
                "year": 0,
                "desc": [
                    "Every colour on a screen exisits in a 3D space, and so many gamuts to choose from!",
                    "I decided to make this small app after the introduction of the CSS color() function, and updated support for HD, printing, and non-sRGB spaces.",
                    "The app allows you to select four spaces, visualsied as 3D cubes, and allows you to move around to see the relative movements across spaces."
                ],
                "linkLive": "https://niallains.github.io/color-space-compare",
                "linkCode": "https://github.com/NiallAins/color-space-compare",
                "tags": [
                    ePageTag.Canvas,
                    ePageTag.Javascipt
                ]
            }
        ]
    },
    {
        "title": "",
        "hide": true,
        "projects": [
            {
                "title": "Venn Diagram Generator",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Agent RegX",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Marathon: The Game",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Glade",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Extended SASS Themes",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            },
            {
                "title": "Gridiron",
                "year": 0,
                "desc": [
                    "",
                ],
                "linkLive": "https://niallains.github.io/",
                "linkCode": "https://github.com/NiallAins/",
                "tags": []
            }
        ]
    }
];