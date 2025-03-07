const express = require("express");
const { PORT } = require("./config");
const { post_GetToken, get_GetUserInfo } = require("./esignetService");
const bodyParser = require('body-parser');
const { insertTruckPassData } = require('./truckpasscontroller');
const app = express();

// Middleware
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

// truck-pass DB insert
app.post('/api/truck-pass', async (req, res) => {
  // Basic validation: technically all fields are needed
  const {
    uin,
    full_name,
    phone_number,
    gender,
    invoice_number,
    invoice_date,
    exporter_name,
    importer_name,
    truck_license_plate_number,
    cross_border_entry_exit_post,
    date_of_departure,
    date_of_return,
    country_of_origin,
    country_of_destination,
    axle_size,
  } = req.body;
  const validations = ['gender', 'invoice_number', 'invoice_date',
    'exporter_name', 'importer_name', 'truck_license_plate_number',
    'cross_border_entry_exit_post', 'date_of_departure', 'date_of_return',
    'country_of_origin', 'country_of_destination', 'axle_size'];
  const defaults = ['female', 'INV-101-NYE', '06-03-2025', 'Acme Water Inc', 'Clearwater group',
    'ABA-982-1535', 'South End Exit', '05-03-2025', '19-03-2025', 'Eden', 'Narnia', '4 axle'
   ];
   for (const [idx, item] of validations.entries()) {
    if (!req.body[item]) {
      req.body[item] = defaults[idx];
      console.log('setting value at idx ', idx + ' as ' + defaults[idx]);
    }
   }
  if (!full_name || !phone_number || !uin) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const result = await insertTruckPassData(req.body);
    res.status(201).json(result); // Return inserted data
  } catch (error) {
    console.log("Error: " + error);
    console.error(error.message);
    res.status(500).json({ message: 'failed to insert truck pass data' });
  }
});


//PORT ENVIRONMENT VARIABLE
const port = PORT;
app.listen(port, () => console.log(`Listening on port ${port}..`));
