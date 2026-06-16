# Personal Site - niall.design

This project is my personal portfolio web site.\
It is curently running live at [niall.design](http://niall.design) or [niallains.github.io/personal-site/dist](`http://niallains.github.io/personal-site/dist`).



## Development


### Set up

[Install Node](https://nodejs.org/en/download)

Download code and install dev packages:
```bash
  git clone https://github.com/NiallAins/personal-site.git;
  cd personal-site;
  npm ci;
```


### Start development

Auto convert `_vars.scss` to `consts.scss.ts`, build scripts and styles to `./dist`, then repeat on file change:
```bash
npm run dev
```

Open `./dist/index.html` in browser to see changes running.\
VSCode extension "Live Server" can be used to auto-refresh browser on file change.

### Add a project

- Add project details to `scripts/pages.json.ts`
- Add project image to `dist/images` as `project-label-camel-case.png`


### Push changes

Commit and push all changes to non-production branch in GitHub:
```bash
  npm run push "Commit message"
```


### Deploy

Copy branch `main` to `prod`, build scripts in production mode, then push to Git where changes will be reflected on GitHub Pages site:
```bash
  npm run deploy
```

Commit and push all changes to `main` branch, before running `deploy`:
```bash
  npm run deploy "Commit message"
```
