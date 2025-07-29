const express = require("express");
const { PORT } = require("./config");
const {
  post_GetToken,
  get_GetUserInfo,
  post_GetRequestUri,
} = require("./esignetService");
const { generateDpopKeyPair } = require("./utils");
const cache = require("./cacheClient");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Mock Relying Party REST APIs!!");
});

app.get("/dpopJKT", async (req, res) => {
  const { clientId, state } = req.query;
  if (!state || !clientId)
    return res.status(400).send({ message: "Missing state or clientId" });
  const cached = await cache.get(`keypair:${clientId}:${state}`);
  if (cached) {
    return res
      .status(400)
      .send({ message: "Duplicate State." });
  }
  const { publicKey, privateKey, jwk, dpop_jkt } = await generateDpopKeyPair();
  await cache.set(
    `keypair:${clientId}:${state}`,
    JSON.stringify({ publicKey, privateKey, jwk })
  );
  res.json({ dpop_jkt });
});

app.get("/requestUri/:clientId", async (req, res) => {
  try {
    res.send(
      await post_GetRequestUri(req.params.clientId, req.query.ui_locales, req.query.state),
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to get requestUri" });
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
