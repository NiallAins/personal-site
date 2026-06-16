concurrently \
    "onchange \"./scripts/**/*.ts\"  -e \"./scripts/consts.scss.ts\" -- npm run build-script"\
    "onchange \"./styles/**/*.scss\" -e \"./styles/_vars.scss\"      -- npm run build-style"\
    "onchange \"./styles/_vars.scss\"                                -- npm run build";