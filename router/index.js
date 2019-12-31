const express = require("express");
const router = express.Router();

const indexCtrl = require("./index.ctrl");

//body에 id, password, class, email, name, phone_number을 담아 post
//curl -d "id=special2&password=backend&class=0&email=a@gmail.com&name=15name&phone_number=01012341234" -X POST "localhost:443/signup"
router.post("/signup", indexCtrl.signUp);

module.exports = router;