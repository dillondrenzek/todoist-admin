import express from "express";
import loadEnv from "./env";

const env = loadEnv();
const app = express();

const port = env.APP_PORT; // default port to listen

// start the Express server
app.listen(port, () => {
  console.log(
    [
      "******************************",
      "       Server started",
      "",
      `   http://localhost:${port}`,
      "*******************************",
    ].join("\n")
  );
});
