let express = require("express");
let server = express();
let fs=require("fs");
//로그 미들웨어 (응답을 아예 안함)
server.use(function(req,res,next){
    console.log(`${req.method} ${req.url}`)
    next();
});
// index.html을 응답하는 미들웨어
server.use(function(req,res,next){
    console.log("요청이 들어옴");
    console.log(req.url);
    console.log(req.protocol);
    console.log(req.method);
    console.log(req.ip);
    console.log(req.get("User-Agent"));
    console.log(`${req.method} ${req.url}`)
    // 미들웨어
    if(req.url==='/' || req.url==='index.html')
        res.send(fs.readFileSync("./index.html").toString()); // 응답을 주거나
    else 
        next(); // 다음 미들웨어로 넘기거나.
});

//hello.html을 응답하는 미들웨어
server.use(function(req,res,next){
    if(req.url==='/hello.html')
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello 페이지</title>
</head>
<body>
    <h1>익스프레스로 만들어본 두번째 페이지 입니다.</h1>
</body>
</html>`); // 응답을 주거나
    else
        next();
});



//404 미들웨어
server.use(function(req,res,next){
res.status(404)
res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
   페이지를 찾을 수 없습니다.
</body>
</html>`)
});


server.listen(3000, function() {
  console.log( "WAS 가 3000번 포트에 준비되었음." );
});




