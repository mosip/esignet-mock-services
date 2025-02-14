const express = require("express");
const { PORT } = require("./config");
const { post_GetToken, get_GetUserInfo } = require("./esignetService");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Mock Relying Party REST APIs!!");
});

//Token Request Handler
app.post("/fetchUserInfo", async (req, res) => {
  try {
    const tokenResponse = await post_GetToken(req.body);
    res.send(await get_GetUserInfo(tokenResponse.access_token));
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

app.get("/callback", async (req, res) => {
  try {
    const query = {
      code:req.query.code,
      client_id: "419258",
      redirect_uri: "http://localhost:3000/callback",
      grant_type:"authorization_code"
    } 
      res.send(await post_GetToken(query))
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});
//PORT ENVIRONMENT VARIABLE
const port = PORT;
app.listen(port, () => console.log(`Listening on port ${port}..`));
