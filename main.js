const express = require("express");
const bodyParser = require("body-parser");

const router = require("./router");

const app = express();
const port = 443; //HTTPS포트

app.use(bodyParser.urlencoded({extended: true}));

app.use("/", router);

app.listen(port, () => console.log(`kweb server running..`));