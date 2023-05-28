let express = require("express");
let server = express();

server.use(express.static("./statics"));
// post를 파싱해주는 미들웨어
server.use(express.urlencoded({extended:true}));
server.use(express.json()); //json 형식의 post payload를 파싱하는 미들웨어

// post를 전달받는 미들웨어
server.post("/calc", function(req,res,next){
  let obj = {result:parseInt(req.body.a) + parseInt(req.body.b)}
  // 화면에 그릴 것이 아니라 js 변수에 꽂을 데이터이므로 html 형식일 필요가 없다.
  res.send(JSON.stringify(obj));
});


server.listen(3000, function(){
  console.log("웹서버가 3000번 포트에 준비됨");
});