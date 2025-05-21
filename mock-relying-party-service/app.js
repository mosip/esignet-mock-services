const express = require("express");
const { PORT } = require("./config");
const {
  post_GetToken,
  get_GetUserInfo,
  post_GetRequestUri,
} = require("./esignetService");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Mock Relying Party REST APIs!!");
});

app.get("/requestUri/:clientId", async (req, res) => {
  if (!req.query.ui_locales) {
    res
      .status(400)
      .send({ error_message: "ui_locales not provided as query parameter" });
    return;
  }
  try {
    res.send(
      await post_GetRequestUri(req.params.clientId, req.query.ui_locales),
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//Token Request Handler
app.post("/fetchUserInfo", async (req, res) => {
  try {
    const tokenResponse = await post_GetToken(req.body);
    res.send(await get_GetUserInfo(tokenResponse.access_token));
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//PORT ENVIRONMENT VARIABLE
const port = PORT;
app.listen(port, () => console.log(`Listening on port ${port}..`));
