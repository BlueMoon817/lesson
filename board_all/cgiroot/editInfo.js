// 정보수정페이지
let fs = require( "fs" );
let queryString = {};
let cookies={};
let memberInfos=JSON.parse(fs.readFileSync("members.json").toString());

if( process.env[ "QUERY_STRING" ] ){
    process.env[ "QUERY_STRING" ].split( '&' ).forEach( field =>{
        queryString[ field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," ") );
    });
}

//쿠키 파싱
if(process.env["Cookie"]){
    if(process.env["Cookie"].split('&')){
        process.env["Cookie"].split('&').forEach(field =>{
            cookies[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
        });
    }
}

let nickname='',idx='';
if(cookies["sess_id"] && fs.existsSync("./sessions/"+cookies["sess_id"])){
    let session = fs.readFileSync("./sessions/"+cookies["sess_id"]).toString();
    let loggedId = session.split("=")[1];
    for(let i=0;i<memberInfos.length;i+=1){
        if(memberInfos[i].id===loggedId){
            idx=i;
            break;
        }
    }
}
let currUser=memberInfos[idx]

    let html=`<!Doctype html>
    <html>
    <head>
    <meta charset='utf-8'>
    <title>회원정보수정</title>
    </head>
    <body>
        <form action="changeInfo.js" method="post">
        <div class="newId_area">
            <label for="new_pw">아이디</label>
            <input type="text" name="id" id="new_pw" value=${currUser["id"]} disabled>
        </div>
        <div class="newPw_area">
            <label for="new_pw">비밀번호</label>
            <input type="text" name="password" id="new_pw" value=${currUser["password"]}>
        </div>
        <div class="name_area">
            <label for="user_name">닉네임</label>
            <input type="text" name="nickname" id="user_name" value=${currUser["nickname"]}>
        </div>
        <div class="name_area">
            <label for="user_email">이메일</label>
            <input type="email" name="email" id="user_email" value=${currUser["email"]}>
        </div>
        <button class="btn_edit">수정완료</button>
       
    </form>
    <form action="confirms.js" method="post">
        <button class="btn_out">회원탈퇴</button>
    </form>
    </body>
    </html>`
    let content = Buffer.from(html);
    console.log("Content-Type: text/html");
    console.log("Content-Length: "+content.length);
    console.log("");
    process.stdout.write(content);   
    process.exit();
    