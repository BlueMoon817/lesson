// 변경된 정보로 재생성하는 페이지
let fs = require( "fs" );
let postData = {};
let cookies={}
let memberInfos=JSON.parse(fs.readFileSync("members.json").toString());

process.stdin.on('data',function(buf){
    if(process.env["Content-Type"] == "application/x-www-form-urlencoded"){
        buf=buf.toString();
        buf.split('&').forEach(field =>{
            postData[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
        });
    } 

if(process.env["Cookie"]){
    if(process.env["Cookie"].split('&')){
        process.env["Cookie"].split('&').forEach(field =>{
            cookies[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
        });
    }
}
// 지울 객체 인덱스 구하기.
let idx,saveId='';
let session = fs.readFileSync("./sessions/"+cookies["sess_id"]).toString();
let loggedId = session.split("=")[1];
for(let i=0;i<memberInfos.length;i+=1){
        if(memberInfos[i].id===loggedId){
            idx=i;
            break;
        }
}
// 지우기전에 변경되지 않는 아이디 정보 저장
saveId=memberInfos[idx]["id"];
// 변경된 객체 지우기
memberInfos.splice(idx,1);
// 재생성
let memberInfo = {
    id:saveId,
    nickname:postData["nickname"],
    password:postData["password"],
    email:postData["email"]
};
memberInfos.unshift(memberInfo);
memberInfos=fs.writeFileSync("members.json",Buffer.from(JSON.stringify(memberInfos)))

let html = `<!Doctype html><html><head><meta charset='utf-8'><title>회원정보 수정완료</title></head><body>
<script>
alert("회원정보 수정이 완료되었습니다."); 
location.href="board/list.js?page=0"
</script>
</body></html>`;

let content = Buffer.from(html);
console.log("Content-Type: text/html");
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);   
process.exit();
});