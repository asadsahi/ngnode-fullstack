// This allows to set cookies on server
// Only cookie used in this app is culture cookie
const xhr2 = require('xhr2');
xhr2.prototype._restrictedHeaders = {};
require('reflect-metadata');
require('zone.js/dist/zone-node');
const fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  helmet = require('helmet'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  compression = require('compression'),
  express = require('express'),
  session = require('express-session'),
  { ngExpressEngine } = require('@nguniversal/express-engine'),
  { REQUEST, RESPONSE } = require('@nguniversal/express-engine/tokens'),
  { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader'),
  app = express(),
  { enableProdMode } = require('@angular/core'),
  ssrEnabled = process.argv.indexOf('--enable-ssr') > -1,
  indexPage = ssrEnabled ? '../dist/index' : './src/index.html',
  isDev = process.env.NODE_ENV === 'development',
  PORT = process.env.PORT || 4000;

global['appConfig'] = isDev ? require('./src/api/config.dev.json') : require('./src/api/config.prod.json');
global['appConfig'] = _.merge(global['appConfig'], { isDev: isDev });
global['errorHandler'] = require('./src/api/features/core').errorHandler;

app.use(helmet());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.json({ limit: '0.5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
const expiryDate = new Date(Date.now() + 20 * 60 * 1000); // 20 minute
app.use(session({
  secret: global['appConfig'].Security.SESSION_SECRET,
  resave: false,
  httpOnly: true,
  saveUninitialized: true,
  expires: expiryDate
}));
// Should be placed before express.static
// compression will only be applicable when in production, during dev its angular-cli serving static files
app.use(compression());

if (ssrEnabled) {
  // const template = fs.readFileSync(path.join(__dirname, '.', 'dist', 'index.html')).toString();
  enableProdMode();
  const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.bundle`);
  app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }));
  app.set('view engine', 'html');
  app.set('views', 'src');
}

const db = require('./src/api/db/models');
db.sequelize.sync().then(res => {
  // API Routes
  require('./src/api')(app);
  app.get('*.*', express.static(path.join(__dirname, '.', 'dist')));
  app.get('*', (req, res) => {
    res.render(indexPage, {
      req: req,
      res: res,
      providers: [
        {
          provide: REQUEST, useValue: (req)
        },
        {
          provide: RESPONSE, useValue: (res)
        },
        {
          provide: 'ORIGIN_URL',
          useValue: (`http://${req.headers.host}`)
        }
      ]
    });
  });

  app.listen(PORT, () => {
    console.log(`Env: ${isDev ? 'Dev' : 'Prod'}`);
    console.log(`SSR Enabled: ${ssrEnabled}`);
    console.log(`listening on http://localhost:${PORT}`);
  });
});


