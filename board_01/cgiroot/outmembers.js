let fs = require("fs");
let postData = {};
let cookies={}
let memberInfos=JSON.parse(fs.readFileSync("members.json").toString());


    if(process.env["Cookie"]){
        if(process.env["Cookie"].split('&')){
            process.env["Cookie"].split('&').forEach(field =>{
                cookies[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
            });
        }
    }
    let idx='';
    let session = fs.readFileSync("./sessions/"+cookies["sess_id"]).toString();
    let loggedId = session.split("=")[1];
    for(let i=0;i<memberInfos.length;i+=1){
        if(memberInfos[i].id===loggedId){
            idx=i;
            break;
        }
    }
memberInfos.splice(idx,1);
fs.unlinkSync("./sessions/"+cookies["sess_id"])
memberInfos=fs.writeFileSync("members.json",Buffer.from(JSON.stringify(memberInfos)))
//로그아웃 처리를 완료한 뒤 적절한 응답을 보내준다.
let html = `<!Doctype html><html><head><meta charset='utf-8'><title>회원탈퇴결과</title></head>
<body><script>alert('회원탈퇴 되었습니다.'); location.href="board/list.js"</script></body></html>`;
let content = Buffer.from(html);
console.log("Content-Type: text/html");
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);   
process.exit();