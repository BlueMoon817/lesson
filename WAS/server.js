let express = require("express");
let server = express(); // express는 함수인데 메서드가 있음
let fs=require("fs");

/* 스태틱 미들웨어 */
server.use(express.static('./docroot'))

/* urlencoded 미들웨어 */
server.use( express.urlencoded({extended:true}) );



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
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게시판 목록</title>
</head>
<body>
    <h1>익스프레스로 만들어본 게시판의 목록 (${req.query.page}) 화면입니다.</h1>
    <table>
        <tr>
            <th>#</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일시</th>
            <th>조회수</th>
        </tr>`;
    for(let i=0; i<articles.length; i+=1){
        html +=`
            <tr>
                <td>${articles.length-i}</td>
                <td>${articles[i].subject}</td>
                <td>${articles[i].writer}</td>
                <td>${articles[i].writtenAt}</td>
                <td>${articles[i].hitcount}</td>
            </tr>
        `
    }
    if(articles.length===0){
        html+=`
            <tr>
                <td colspan="5" style="text-align:center">게시물이 없습니다.</td>
            </tr>
        `
    }
    html+=`
    </table>
    <a href="write.html">글쓰기</a>
</body>
</html>    
    `
    
res.send(html);
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
 req.body.writer
 req.body.subject
 req.body.content
});


/* 404 미들웨어 */
server.use(function(req,res,next){
    res.status(404);
});

server.listen(3000, function() {
  console.log( "WAS 가 3000번 포트에 준비되었음." );
});