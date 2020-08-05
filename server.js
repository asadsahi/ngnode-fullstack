// This allows to set cookies on server
// Only cookie used in this app is culture cookie
const fs = require('fs'),
  path = require('path'),
  http = require('http'),
  https = require('https'),
  cors = require('cors'),
  _ = require('lodash'),
  helmet = require('helmet'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  compression = require('compression'),
  express = require('express'),
  resolve = (file) => path.resolve(__dirname, file),
  app = express(),
  isDev = process.env.NODE_ENV === 'development',
  isProd = !isDev;

global.appConfig = _.merge({}, require('./server/config.json'), require('./server/config.prod.json'), { isDev, isProd });
global.errorHandler = require('./server/features/core').errorHandler;

app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.json({ limit: '0.5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Should be placed before express.static
// compression will only be applicable when in production, during dev its angular-cli serving static files
app.use(compression());

const db = require('./server/db/models');
db.sequelize.sync().then((res) => {
  // API Routes
  require('./server/index')(app);
  app.get('*.*', express.static(path.join(__dirname, '.', 'dist')));
  app.get('*', (req, res) => {
    const htmlFile = fs.readFileSync(resolve(isDev ? './src/index.html' : './dist/index.html'));
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlFile);
  });

  const PORT = process.env.PORT || 5050;

  const httpServer = http.createServer(app);
  httpServer.listen(PORT, () => {
    log(PORT);
  });
});

function log(port) {
  console.log(`Env: ${isDev ? 'Dev' : 'Prod'}`);
  console.log(`http://localhost:${port}`);
}
