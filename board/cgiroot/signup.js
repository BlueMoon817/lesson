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
// user정보 객체 생성
let memberInfo = {
    id:postData["id"],
    nickname:postData["nickname"],
    password:postData["password"],
    email:postData["email"]
};
let memberInfos = JSON.parse(fs.readFileSync("members.json").toString());
let html='';

// 이미 존재하는 아이디 처리 및 안내
for(let i=0; i<memberInfos.length;i+=1){
    if(memberInfos[i].id===postData["id"] || memberInfos[i].nickname===postData["nickname"]){
        html = `<!Doctype html><html><head><meta charset='utf-8'><title>이미존재하는 아이디</title></head><body>
        <script>alert("이미 존재하는 아이디, 닉네임입니다. 다시 입력해주세요.") location.href='/signup.html'</script>
        </body></html>`;
        let content = Buffer.from(html);
        console.log("Content-Type: text/html");
        console.log("Content-Length: "+content.length);
        console.log("");
        process.stdout.write(content);   
        process.exit();
    }
}
// 존재하지 않는 아이디일 때 데이터에 추가.
memberInfos.unshift(memberInfo);
memberInfos=fs.writeFileSync("members.json",Buffer.from(JSON.stringify(memberInfos)))
html = `<!Doctype html>
<html>
<head>
<meta charset='utf-8'>
<title>가입완료</title>
</head>
<body>
<script>alert("회원가입이 완료되었습니다. 로그인 후 이용 바랍니다."); location.href='login.html'</script>
</body>
</html>`;
//로그인처리를 완료한 뒤 적절한 응답을 보내준다.
let content = Buffer.from(html);
console.log("Content-Type: text/html");
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);   
process.exit();
});