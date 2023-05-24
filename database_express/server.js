let express=require('express');
let mysql2=require('mysql2');
let pool = mysql2.createPool({
  host:"localhost",
  user: "PRACTICE02",
  password:"123123",
  database:"TODOS"
})
let server = express();
// 미들웨어
//statics 폴더
server.use(express.static("./statics"));
//post 요청이 올수 있으므로 (첨부파일은 제외한다고 가정) extended 의미 확인필요
server.use(express.urlencoded({extended:false}));

// view engine 을 ejs엔진으로 셋팅
server.set("view engine", "ejs");
// 파일 경로
server.set("views", "./templates");

//form에서 들어오는 입력 받기
server.post("/create", function(req,res,next){
  pool.query("INSERT INTO TODOS SET job=?, description=?, done='n', register=NOW(), deadline=?, color=?",[req.body.job, req.body.extra, req.body.deadline, req.body.color], function(err,dbres){
    //err 처리필요
    // 정상처리
    res.redirect("/");
  });
});
server.post("/done", function(req, res, next){
  if(req.body["is_done_"+req.body.seq] == "done"){
    pool.query("UPDATE todos SET done='y' WHERE seq=?", [req.body.seq],function(err,dbres){
      res.redirect("/");
    })
  }
  else{
    res.redirect("/");
  }
});
server.use(function(req, res, next){
  let keyword = req.query.keyword;
  if(!keyword) keyword='';
  
  pool.query("SELECT * FROM TODOS WHERE DONE='N' AND (JOB LIKE ? OR DESCRIPTION LIKE ?) ORDER BY DEADLINE ASC", ["%"+keyword+"%","%"+keyword+"%"], function(err, dbres){
    res.render("list", {
      todos: dbres,
      keyword
    });
  });
});




server.listen(3000, function(){
  console.log("WAS가 준비되었음");
});