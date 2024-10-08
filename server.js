const express = require("express");
const cors = require("cors");
const router = require("./router/router");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const https = require('https');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

mongoose.connect(
   "mongodb+srv://marcofresolone1998:mHioP4NSMJ17E41l@cluster0.veiap.mongodb.net/Fantastica?retryWrites=true&w=majority&appName=Cluster0"
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Errore di connessione a mongo: "));
db.once("open", function () {
  console.log("Connessione a mongo effettuata");
});

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

app.use(process.env.SERVICE_BASEPATH, router);

const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '/etc/nginx/mycert.key')),
  cert: fs.readFileSync(path.join(__dirname, '/etc/nginx/mycert.crt')),
}, app);

sslServer.listen(process.env.SERVICE_PORT, () =>
  console.log(
    "sslServer inizializzata, in ascolto sulla porta: " + process.env.SERVICE_PORT
  )
);
