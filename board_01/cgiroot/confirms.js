let fs = require("fs");


//로그아웃 처리를 완료한 뒤 적절한 응답을 보내준다.
let html = `<!Doctype html><html><head><meta charset='utf-8'><title>회원탈퇴</title></head>
<body>
<script> let answer= window.confirm('회원탈퇴를 하시겠습니까?'); 
if(answer===true){
    location.href="/outmembers.js"    
}else{
    location.href="/board/list.js?page=0;"    
}
</script>
</body></html>`;

let content = Buffer.from(html);
console.log("Content-Type: text/html");
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);   
process.exit();