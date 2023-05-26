let express = require("express");
let server = express();
let net=require('net');
let fs=require('fs');
let cookieParser= require('cookie-parser');
let cookieSession= require('cookie-session');
let multer = require('multer');

/* 스태틱 미들웨어 */
server.use(express.static('./docroot'))

/* 로그 미들웨어 */

server.use(function(req,res,next){
    console.log(`${req.method} ${req.url}`)
    next();
});


server.use(function(req,res,next){
    if(req.url==='web1-1.html')
        res.send(fs.readFileSync("ceo.html").toString()); // 응답을 주거나
    else 
    next(); // 다음 미들웨어로 넘기거나.
});



/* 404 미들웨어 */
server.use(function(req,res,next){
    res.status(404);
})

server.listen(8080, function() {
  console.log( "WAS 가 3000번 포트에 준비되었음." );
});