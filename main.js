const mariadb = require("mariadb");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const CreateTuples = require("./CreateTuples");
const ReadTuples = require("./ReadTuples");
const UpdateTuples = require("./UpdateTuples");
const DeleteTuples = require("./DeleteTuples");

const app = express();
const port = 443; //HTTPS포트

app.use(bodyParser.urlencoded({extended: true}));

const tables = {};
tables["member"] = ["id", "password", "class", "email", "name", "phone_number"];
tables["board"] = ["board_id", "board_class", "title", "content", "time", "id"];

//body에 id, password, class, email, name, phone_number을 담아 post
//curl -d "id=special2&password=backend&class=0&email=a@gmail.com&name=15name&phone_number=01012341234" -X POST "localhost:443/member"
app.post("/member", (req, res) =>
{
    let id = req.body["id"];
    let selectTuple = {};
    // id가 비어있는지 체크
    if(!id || id.length === 0)
    {
        res.send("There is no id");
        return;
    }
    selectTuple["id"] = id;

    let tuple = req.body;
    // 필수 정보 사항이 있는지 체크(password)
    if(!tuple.password || tuple.password.length === 0)
    {
        res.send("There is no password");
        return;
    }
    // 이미 있는 id인지 체크
    // 미구현
    let readTuple;
    ReadTuples.read("member", selectTuple)
    .then((result)=>
    {
        readTuple = result;
        if(readTuple.length > 0)
        {
            res.send("This id is already exist");
            return;
        }
        return;
    })
    .then(()=>
    {
        // 서버에서만 권한을 정회원 이상으로 줄 수 있다고 가정함
        // 원격으로는 준회원이 한계
        // (준, 정회원, 관리자(임원))(2, 1, 0)
        tuple.class = 2;
        // 비밀번호 해쉬
        tuple.password = crypto.createHash("sha256").update(tuple.password).digest("base64");
        //테스트
        console.log(tuple);
        CreateTuples.create("member", tuple);

        res.send("Member Post complete");
        return;
    });

    
});

app.listen(port, () => console.log(`DB API Routing start..`));