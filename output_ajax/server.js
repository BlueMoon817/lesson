let express = require("express");
let mysql2=require('mysql2');
let server = express();
let pool = mysql2.createPool({
  host:"localhost",
  user: "board",
  password:"123123",
  database:"board"
})
server.use(express.static("./statics"));
// post를 파싱해주는 미들웨어
server.use(express.urlencoded({extended:true}));
server.use(express.json()); //json 형식의 post payload를 파싱하는 미들웨어
// view engine 을 ejs엔진으로 셋팅
server.set("view engine", "ejs");
// 파일 경로
server.set("views", "./templates");
// post를 전달받는 미들웨어
server.post("/login", function(req,res,next){
  let result;
  pool.query("SELECT * FROM USER",function(err, dbres){
    if(err) console.log("오류발생",err);
    for(let i=0; i<dbres.length; i+=1){
      if(req.body.id===dbres[i].id && req.body.pw===dbres[i].password){
        result={state:'success', user:dbres[i].nickname};
      }
    }
    if(result===undefined){
      console.log("실행시점")
      result={state:'fail'};
    }
  res.send(result);
  });

});

server.get("/pagesignup", function(req,res,next){
  res.send(true);
});
server.get("/backLogin", function(req,res,next){
  res.send(true);
});
server.get("/pageWrite", function(req,res,next){
  res.send(true);
});
server.get("/pageList", function(req,res,next){
  res.send(true);
});

server.post("/makeid",function(req,res,next){
  let checkId;
  pool.query("SELECT * FROM USER", function(err, dbres){
    if(err) console.log("오류발생",err);
    for(let i = 0; i<dbres.length; i+=1){
      if(req.body.id2===dbres[i].id || req.body.nickname === dbres[i].nick || req.body.email === dbres[i].email){
        checkId='exist';
      }
    }
  });
  if(checkId!=='exist'){
    pool.query("INSERT INTO USER SET id=?,password=?,nickname=?,email=?",[req.body.id2, req.body.pw2, req.body.nick, req.body.email],function(err, dbres){
      if(err) console.log("오류발생",err);
      checkId='ok'
      console.log("table에 등록완료");
      pool.query("SELECT * FROM USER", function(err, dbres){
      for(let z=0; z<dbres.length;z+=1){
        console.log(`${dbres[z].seq} / ${dbres[z].id} / ${dbres[z].password} / ${dbres[z].nickname} / ${dbres[z].email}`);
      }
      });
      res.send(checkId);
    });
  }else{
    res.send(checkId);
  }
});
server.use(function(req,res,next){
  res.render("board",{});
});
server.listen(3000, function(){
  console.log("웹서버가 3000번 포트에 준비됨");
});