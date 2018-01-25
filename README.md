# Node and Angular fullstack SPA

* [**N**ode.js](https://nodejs.org)
* [**S**equelize](http://docs.sequelizejs.com/) : Supports (MySql, MSSql, Postgres, Sqlite) databases
* [**A**ngular](https://angular.io)
* [**E**xpress.js](http://expressjs.com)
* [Angular CLI](https://cli.angular.io)
* [Bootstrap](http://www.getbootstrap.com)

## Deploy (Heroku)
1. Go to Heroku and create a new app
2. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line)
3. `heroku login`
    * First time only (heroku git:remote -a ngnode-fullstack)
4. `clone this repo and cd ngnode-fullstack/`
5. npm run build:prod
6. npm run deploy:heroku
7. `Troubleshooting deployed app:`
`heroku logs -t --app ngnode-fullstack`
--`-t means tail, will take all the logs`
## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `ng serve`.

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
