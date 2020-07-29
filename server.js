// This allows to set cookies on server
// Only cookie used in this app is culture cookie
const xhr2 = require("xhr2");
xhr2.prototype._restrictedHeaders = {};
require("reflect-metadata");
require("zone.js/dist/zone-node");
const fs = require("fs"),
  path = require("path"),
  http = require("http"),
  https = require("https"),
  _ = require("lodash"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  compression = require("compression"),
  express = require("express"),
  resolve = (file) => path.resolve(__dirname, file),
  //   { ngExpressEngine } = require("@nguniversal/express-engine"),
  //   { REQUEST, RESPONSE } = require("@nguniversal/express-engine/tokens"),
  //   { provideModuleMap } = require("@nguniversal/module-map-ngfactory-loader"),
  app = express(),
  { enableProdMode } = require("@angular/core"),
  isDev = process.env.NODE_ENV === "development",
  isProd = !isDev,
  ssrEnabled = process.argv.indexOf("--enable-ssr") > -1;

global.appConfig = _.merge(
  {},
  require("./server/config.json"),
  require("./server/config.prod.json"),
  { isDev, isProd }
);
global.errorHandler = require("./server/features/core").errorHandler;

app.use(helmet());
app.disable("x-powered-by");
app.use(cookieParser());
app.use(bodyParser.json({ limit: "0.5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Should be placed before express.static
// compression will only be applicable when in production, during dev its angular-cli serving static files
app.use(compression());

if (ssrEnabled) {
  // const template = fs.readFileSync(path.join(__dirname, '.', 'dist', 'index.html')).toString();
  //   enableProdMode();
  //   const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(resolve(
  //     "./dist-server/main"
  //   ));
  //   app.engine(
  //     "html",
  //     ngExpressEngine({
  //       bootstrap: AppServerModuleNgFactory,
  //       providers: [provideModuleMap(LAZY_MODULE_MAP)],
  //     })
  //   );
  //   app.set("view engine", "html");
  //   app.set("views", "src");
}

const db = require("./server/db/models");
db.sequelize.sync().then((res) => {
  // API Routes
  require("./server/index")(app);
  app.get("*.*", express.static(path.join(__dirname, ".", "dist", "client")));
  app.get("*", (req, res) => {
    if (ssrEnabled) {
      res.render("../dist/index", {
        req: req,
        res: res,
        providers: [
          {
            provide: REQUEST,
            useValue: req,
          },
          {
            provide: RESPONSE,
            useValue: res,
          },
          {
            provide: "ORIGIN_URL",
            useValue: `http://${req.headers.host}`,
          },
        ],
      });
    } else {
      const htmlFile = fs.readFileSync(
        resolve(isDev ? "./src/index.html" : "./dist/client/index.html")
      );
      res.setHeader("Content-Type", "text/html");
      res.send(htmlFile);
    }
  });

  const useSSL = appConfig.useSSL;
  const PORT = process.env.PORT || 5050;

  if (useSSL) {
    const privateKey = fs.readFileSync("ssl/server.key", "utf8"),
      certificate = fs.readFileSync("ssl/server.crt", "utf8"),
      credentials = { key: privateKey, cert: certificate },
      httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT, () => {
      log(useSSL, PORT);
    });
  } else {
    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
      log(useSSL, PORT);
    });
  }
});

function log(sslEnabled, port) {
  console.log(`Env: ${isDev ? "Dev" : "Prod"}`);
  console.log(`SSR Enabled: ${ssrEnabled}`);
  console.log(`SSL Enabled: ${sslEnabled}`);
  console.log(`http://localhost:${port}`);
}
