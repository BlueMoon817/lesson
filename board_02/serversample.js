let http = require("http");
let https = require("https");

let server = http.createServer(function(req, res) {
  // 웹브라우저의 요청에서 필요한 정보 얻기
  console.log( "웹브라우저로부터 request가 수신되었음" );
  console.log( `User-Agent: ${req.getHeader('user-agent')}` );
  console.log( `Method: ${req.method}` );
  console.log( `URL: ${req.path}` );
  let buf = Buffer.alloc(0);
  req.on("data", function(chunk) {buf = Buffer.concat([buf, chunk]);});
  req.on("end", function() {
    // POST body 는 여기서 처리
    // ...
  });

  // 응답하기
  res.writeHead(응답코드, {헤더});
  res.end(문자열 or Buffer객체);
});
server.listen(포트번호);