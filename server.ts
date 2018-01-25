import * as xhr2 from 'xhr2';
xhr2.prototype._restrictedHeaders = {};

import 'reflect-metadata';
import 'zone.js/dist/zone-node';

const _ = require('lodash'),
  domino = require('domino'),
  fs = require('fs'),
  path = require('path'),
  globby = require('globby'),
  helmet = require('helmet'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  compress = require('compression'),
  session = require('express-session'),
  { ngExpressEngine } = require('@nguniversal/express-engine'),
  { REQUEST, RESPONSE } = require('@nguniversal/express-engine/tokens'),
  { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader'),
  isDev = process.argv.indexOf('--env.dev') > -1,
  disableSSR = process.argv.indexOf('--disable-ssr') > -1,
  indexPage = disableSSR ? './src/index.html' : '../dist/index',
  express = require('express'),
  app = express(),
  { enableProdMode } = require('@angular/core'),
  PORT = process.env.PORT || 4000;
// This allows to set cookies on server
// Only cookie used in this app is culture cookie


// const styleFiles = files.filter(file => file.startsWith('styles'));
// const hashStyle = styleFiles[0].split('.')[1];
// const style = fs.readFileSync(path.join(__dirname, '.', 'dist-server', `styles.${hashStyle}.bundle.css`)).toString();// Global configuration based on environment
global['appConfig'] = isDev ? require('./server/config.dev.json') : require('./server/config.prod.json');
global['appConfig'] = _.merge(global['appConfig'], { isDev: isDev });
global['errorHandler'] = require('./server/features/core').errorHandler;

app.use(helmet())
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
app.use(compress({
  filter: (req, res) => {
    return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
  },
  level: 9
}));

if (!disableSSR) {
  const template = fs.readFileSync(path.join(__dirname, '.', 'dist', 'index.html')).toString(),
    win = domino.createWindow(template);
  global['window'] = win;
  Object.defineProperty(win.document.body.style, 'transform', {
    value: () => {
      return {
        enumerable: true,
        configurable: true
      };
    },
  });
  global['document'] = win.document;
  global['CSS'] = null;
  // global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
  global['Prism'] = null;

  enableProdMode();

  const files = fs.readdirSync(`${process.cwd()}/dist-server`);
  const mainFiles = files.filter(file => file.startsWith('main'));
  const hash = mainFiles[0].split('.')[1];
  const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.${hash}.bundle`);
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
  apiRoutes();

  app.get('*.*', express.static(path.join(__dirname, '.', 'dist')));

  app.get('*', (req, res) => {
    global['navigator'] = req['headers']['user-agent'];
    const http = req.headers['x-forwarded-proto'] === undefined ? 'http' : req.headers['x-forwarded-proto'];

    // tslint:disable-next-line:no-console
    console.time(`GET: ${req.originalUrl}`);
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
          useValue: (`${http}://${req.headers.host}`)
        }
      ]
    });
    // tslint:disable-next-line:no-console
    console.timeEnd(`GET: ${req.originalUrl}`);
  });
});

function apiRoutes() {
  globby([__dirname + '/server/features/*/**/*.policy.js']).then(policies => {
    policies.forEach(policyPath => {
      require(path.resolve(policyPath)).invokeRolesPolicies();
    });
  });

  // ========= Public routes
  // App public routes
  require('./server/features/app/app.routes')(app);
  // Content public routes
  require('./server/features/content/content-public.routes')(app);
  // ========= Secure routes
  // User's feature, this incldues auth middleware as well
  require('./server/features/users')(app);
  // Content public routes
  require('./server/features/content/content.routes')(app);

  // get all registered routes of express
  // app._router.stack.forEach((r: any) => {
  //   if (r.route && r.route.path) {
  //     console.log(r.route.path)
  //   }
  // });

  app.listen(PORT, () => {
    console.log(`Env: ${isDev ? 'Dev' : 'Prod'}`);
    console.log(`SSR Enabled: ${!disableSSR}`);
    console.log(`listening on http://localhost:${PORT}`);
  });

}
