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
  resolve = file => path.resolve(__dirname, file),
  { ngExpressEngine } = require('@nguniversal/express-engine'),
  { REQUEST, RESPONSE } = require('@nguniversal/express-engine'),
  { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader'),
  app = express(),
  { enableProdMode } = require('@angular/core'),
  isDev = process.env.NODE_ENV === 'development',
  isProd = !isDev,
  ssrEnabled = process.argv.indexOf('--enable-ssr') > -1,
  PORT = process.env.PORT || 3000;

global.appConfig = _.merge({}, require('./server/config.json'), require('./server/config.prod.json'), { isDev, isProd });
global.errorHandler = require('./server/features/core').errorHandler;

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
  const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(resolve('./dist-server/main.bundle'));
  app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }));
  app.set('view engine', 'html');
  app.set('views', 'src');
}

const db = require('./server/db/models');
db.sequelize.sync().then(res => {
  // API Routes
  require('./server/index')(app);
  app.get('*.*', express.static(path.join(__dirname, '.', 'dist')));
  app.get('*', (req, res) => {

    if (ssrEnabled) {
      res.render('../dist/index', {
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
    } else {
      const htmlFile = fs.readFileSync(resolve(isDev ? './src/index.html' : './dist/index.html'));
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlFile);
    }
  });

  app.listen(PORT, () => {
    console.log(`Env: ${isDev ? 'Dev' : 'Prod'}`);
    console.log(`SSR Enabled: ${ssrEnabled}`);
    console.log(`listening on http://localhost:${PORT}`);
  });
});


