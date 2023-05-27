let express = require("express");
let server = express();
let net=require('net');
let fs=require('fs');
let cookieParser= require('cookie-parser');
let cookieSession= require('cookie-session');
let multer = require('multer');


/* 로그 미들웨어 */

server.use(function(req,res,next){
    console.log(`${req.method} ${req.url}`)
    next();
});


// server.use(function(req,res,next){
//     if(req.url==='/docroot/index.html')
//         res.send(fs.readFileSync("reserv.json").toString()); // 응답을 주거나
//     else if(req.url==='/admin/index.html'){
//         res.send(fs.readFileSync("reserv.json").toString());
//     }else 
//     next(); // 다음 미들웨어로 넘기거나.
// });



/* 404 미들웨어 */
server.use(function(req,res,next){
    res.status(404);
})

server.listen(8080, function() {
  console.log( "WAS 가 3000번 포트에 준비되었음." );
});