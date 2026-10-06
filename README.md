# Personal Site - niall.design

This project is my personal portfolio web site.\
It is curently running live at [niall.design](http://nialldesign.dev) or [niallains.github.io/personal-site/dist](`http://niallains.github.io/personal-site/dist`).


## Development


### Set up

[Install Git](https://git-scm.com/install/)\
[Install Node and NVM](https://www.nvmnode.com/guide/installation.html)

Download code and install dev packages using Node v22:
```bash
  git clone https://github.com/NiallAins/personal-site.git;
  cd personal-site;
  nvm use 22;
  npm ci;
```

### Start development

```bash
npm run dev
```
This will auto-convert `_vars.scss` to `consts.scss.ts`, build scripts, styles, and template files to `./dist`, then repeat on file change.

Open `./dist/index.html` in browser to see changes running.\
VSCode extension "Live Server" can be used to auto-refresh browser on file change.


### Add a project

- Add project details to `scripts/projects.json.ts`
- Add project image to `dist/images` as `project-title-kebab-case.png`
- Run `npm run prep-images` to update production image sizes


### Push changes

Commit and push all changes to non-production branch in GitHub:
```bash
  npm run push "Commit message"
```


### Deploy

```bash
  npm run push-reploy "Commit message"
```
This will push all changes to non-production branch, then copy branch `main` to `prod`, build scripts and templates in production mode, then push to Git where changes will be reflected on GitHub Pages site.


### Change base URL

The base URLs for both development and production are set in `./build-scripts/build-template.js`.
