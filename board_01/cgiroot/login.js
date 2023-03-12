let fs = require( "fs" );
let queryString = {};
let postData = {};

if( process.env[ "QUERY_STRING" ] ){
    process.env[ "QUERY_STRING" ].split( '&' ).forEach( field =>{
        queryString[ field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," ") );
    });
}
process.stdin.on('data',function(buf){
    if(process.env["Content-Type"] == "application/x-www-form-urlencoded"){
        buf=buf.toString();
        buf.split('&').forEach(field =>{
            postData[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
    });
    
} 
//로그인처리
//내가 갖고 있는 모든 회원정보를 다 가져와서
let members=JSON.parse(fs.readFileSync("members.json").toString());
let theMember="";
// 입력으로 들어온 아이디 id, password를 조회
for(let i=0; i<members.length; i+=1){
  if(members[i].id==postData["id"] && members[i].password ==postData["password"]){
    theMember=members[i];
    break;
  }    
}

let html = `<!Doctype html><html><head><meta charset='utf-8'><title>로그인결과</title></head><body>`;
if(theMember){
    //세션 생성
    let sess_id = Math.random().toString()+Math.random().toString()+Math.random().toString();
    // 세션 저장
    fs.writeFileSync("./sessions/"+sess_id,Buffer.from("login_id="+theMember["id"]))
    // 이 브라우저에게 쿠키를 구워준다.
    // 쿠키의 로그인 된 아이디를 표시 -> list.js로 같이 보낸다.
    console.log("Set-Cookie: sess_id="+sess_id);
    html+= `<script>alert('로그인 성공!!'); location.href='board/list.js';</script>`
}else{
    html +=`<script>alert('아이디나 비밀번호가 틀렸습니다. 다시 시도해주세요.'); location.href='login.html'</script>`
}

html+=`</body></html>`


//로그인처리를 완료한 뒤 적절한 응답을 보내준다.
let content = Buffer.from(html);
console.log("Content-Type: text/html");
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);   
process.exit();
});