# Node and Angular fullstack Single Page Application with Relational databases as backend

- [**N**ode.js](https://nodejs.org)
- [**S**equelize](http://docs.sequelizejs.com/) : Supports (MySql, MSSql, Postgres, Sqlite) databases
- [**A**ngular](https://angular.io)
- [**E**xpress.js](http://expressjs.com)
- [Angular CLI](https://cli.angular.io)

## Start dev

Without SSR

- `npm run dev` OR `yarn dev`

With SSR

1. Build client and server in watch mode
   - `npm run build:ssr` OR `yarn build:ssr`
2. Serve with SSR
   - `npm run serve:ssr` OR `yarn serve:ssr`

## Start prod

Without SSR

1. Build client and server
   - `npm run build:prod` OR `yarn build:prod`
2. Serve without SSR
   - `npm run serve:prod` OR `yarn serve:prod`

With SSR

1. Build client and server
   - `npm run build:prod` OR `yarn build:prod`
2. Serve with SSR
   - `npm run serve:prod:ssr` OR `yarn serve:prod:ssr`

## Unit tests using [Jest](https://facebook.github.io/jest/).

Run test

- `npm test` OR `yarn test`

## End-to-end tests using [Testcafe](https://devexpress.github.io/testcafe/).

1. Start application
   - `npm run deve2e` OR `yarn deve2e`
2. Run live e2e tests
   - `npm run e2e` OR `yarn e2e`

## Deploy using Circle CI

1. intall heroku cli from https://devcenter.heroku.com/articles/heroku-cli
2. From heroku account settings (https://dashboard.heroku.com/account) page copy API key
3. Paste this key in circle CI Account Settings > Heroku API Key section
4. Circle CI > Project > Projectname > Settings > Continuous deployment > Heroku Deployment > Step 2: Associate a Heroku SSH key with your account
5. Setup local repository with heroku:
   login to heroku:
   heroku git:remote -a ngnode-fullstack
   If you get error described here:
   https://discuss.circleci.com/t/heroku-deployment-from-circle-ci-failing/11117/2 do force git push
   git push heroku master -f
6. Start deployment

## Deploy image to container

1. heroku container:login
2. docker-compose up
3. docker tag image-id registry.heroku.com/ngnode-fullstack/web
4. docker push registry.heroku.com/ngnode-fullstack/web
5. heroku container:release web -a ngnode-fullstack

## Enable SSL

1. Put this configuration in angular.json file under serve section:

```
 "ssl": true,
 "sslKey": "ssl/server.key",
 "sslCert": "ssl/server.crt"
```

2. Create ssl key and certificate:
   ssl/generate.sh using bash,
   This will generate key and crt files.

3. Install crt file in Windows trusted root certificates or equivalent in mac and linux
