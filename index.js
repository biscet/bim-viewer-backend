import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import oauth from "./src/routes/oauth";
import oss from "./src/routes/oss";
import modelderivative from "./src/routes/modelderivative";
import { port, originURL } from "./src/utils/config";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use("/api/forge/oauth", oauth);

app.use("/api/forge/oss", oss);

app.use("/api/forge/modelderivative", modelderivative);

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
