import express from "express";
import cors from "cors";
import { staticFilesDirectory } from "./constants/static-files-directory";
import * as Routes from "./routes";
import path from "path";
import * as dotenvFlow from "dotenv-flow";

const app = express();

dotenvFlow.config({
  silent: true,
});

app.disable("x-powered-by");

const router = express.Router();
const port = process.env.PORT || "34567";
const urlBase = process.env.APP_URL_BASE || "";

/** middleware */
app.use(express.json({ limit: "10mb" }));

/**
 * allow cors for all routes
 * http://expressjs.com/en/resources/middleware/cors.html
 */
app.use(cors());

/** routes */
app.use(`/${urlBase}`, Routes.routes());

/** instantiate router */
app.use("/", router);
app.use(
  `/${urlBase}/public`,
  express.static(path.join(__dirname, `/${staticFilesDirectory}`))
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`service listening at http://localhost:${port}/`);
  console.log("\n");

  console.log(
    `health check via http://localhost:${port}/${process.env.API_VERSION}/healt-check`
  );
});
