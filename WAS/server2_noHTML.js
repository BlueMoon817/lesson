let express = require("express");
let server = express(); // express는 함수인데 메서드가 있음
let fs=require("fs");
let cookieParser = require("cookie-parser");
let cookieSession = require("cookie-session");
let multer = require("multer");
let upload = multer( {dest:"./uploads"} );
/* 스태틱 미들웨어 */
server.use(express.static('./docroot'))

/* urlencoded 미들웨어 */
server.use( express.urlencoded({extended:true}) );



/* req에 cookie를 파싱해주는 미들웨어 */
server.use(cookieParser()); // 호출만 하면.. 알아서 파싱해줌

/* 쿠키 기반의 세션을 처리해주는 미들웨어 */
server.use(cookieSession({
  name:'session',
  //세션 암호화를 위한 키
  // keys: [/*secret key*/],
  keys: ["my_secret_key"],
  
  //Cookie Option 세션 암호화를 할 키 
  maxAge: 24 * 60 * 60 * 1000 // 24hour
}))



/* 로그 미들웨어 */

server.use(function(req,res,next){
    console.log(`${req.method} ${req.url}`)
    next();
});



// 하고 싶은 작업들...


// 게시판 목록화면
server.get("/list",function(req, res, next){
    //입력값 검증
    if(!req.query.page) req.query.page = 1;
    
    // 게시물 목록 불러오기
  let articles=JSON.parse(fs.readFileSync("articles.json").toString());
    // 템플릿을 렌더링(=스태틱HTML에 다이내믹 데이터를 박아넣는 동작 = HTML을 조립하는 과정)해서 응답한다.
    res.render("list.ejs",{
    //템블릿에 박아넣을 데이터...
    "articles":articles,
		sample1:"문유라"
    });
});


/* 게시물 작성 처리 미들웨어 */
// server.get('/write', function(req,res,next){
//     req.query
// });
server.post('/write', function(req,res,next){
 //HTTP Request Body를 파싱해주는 미들웨어(urlencoded)가 만들어줘야 사용 가능
 let articles = JSON.parse(fs.readFileSync("./articles.json").toString());
 articles.unshift({writer:req.body.writer, subject:req.body.subject, content:req.body.content, writtenAt:new Date(), hitcount:0});
 fs.writeFileSync('./articles.json', Buffer.from(JSON.stringify(articles)))
// 게시물로 돌아가기
// res.status(301) // 다른페이지로 가라고 응답 및 url을 정해줌 (리다이렉트)
res.redirect("/list");

});

/* 쿠키 테스트 */
server.get("/cookie1",function(req,res,next){
  //쿠키를 굽는다.
  res.set("Set-Cookie", "test=문유라"); //test=문유라 는 쿠키 변수이다. 문제는 쿠키가 여러개일 때..!(쇼핑몰의 장바구니, 찜하기 등등의 여러 쿠키가 필요할 경우..)
  // res.cookie("쿠키변수이름","쿠키변수값");  //cookie-parser사용시
});

server.get("/cookies2", function(req,res,next){
  //쿠키를 읽는다.
  req.get("Cookie"); // 쿠키가 여러개 일 때 "test=문유라;cart=...." 이렇게 전달오기 때문에 다시 파싱해주어야 하는 문제가 있다.
  // req.cookie.쿠키변수이름;   //cookie-parser사용시

});


