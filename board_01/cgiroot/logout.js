let fs = require("fs");
let cookies={}
//쿠키 파싱

if(process.env["Cookie"]){
    if(process.env["Cookie"].split('&')){
        process.env["Cookie"].split('&').forEach(field =>{
            cookies[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
        });
    }
}
if(cookies["sess_id"] && fs.existsSync("./sessions/"+cookies["sess_id"])){
  fs.unlinkSync("./sessions/"+cookies["sess_id"])
}

//로그아웃 처리를 완료한 뒤 적절한 응답을 보내준다.
let html = `<!Doctype html><html><head><meta charset='utf-8'><title>로그인결과</title></head>
<body><script>alert('로그아웃 되었습니다.'); location.href="board/list.js"</script></body></html>`;
let content = Buffer.from(html);
// 쿠키 완전히 삭제
console.log("Set-Cookie: sess_id=delete; max-age=0")
console.log("Content-Type: text/html");
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);   
process.exit();