//기본페이지
let fs = require( "fs" );
let queryString = {};
let postData = {};
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
nickname=memberInfos[idx].nickname;

//입력받기
let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>글 작성 화면</title>
    <link rel="stylesheet" href="/css/index.css">
</head>
<body class="write_wrap">
    <form action="board/write.js" method="post" enctype="multipart/form-data">
        <fieldset>
            <div class="info">
                <div class="user">
                    <label for="input_nick">${nickname}</label>
                    <input type="text" name="nickname" value=${nickname} id="input_nick" style="display:none;"/>
                </div>
                <div class="cate">
                    <span class="cate_filter">말머리</span>
                    <select name="category" class="category">
                        <option value=""> ==선택하세요==</option>
                        <option value="잡담">잡담</option>
                        <option value="질문">질문</option>
                        <option value="고민상담">고민상담</option>
                        <option value="공유">공유</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
            </div>
            
        <div class="tit">
            <label for="input_subject">제목</label>
            <input type="text" name="subject" id="input_subject">
        </div>
        
        
        <div class="contents">
            <label for="input_text">본문</label>
            <textarea type="text" name="content" id="input_text"></textarea>
        </div>
        <div class="file_area">
            <label for="input_file">첨부파일</label>
            <input type="file" name="attach" id="input_file">
        </div>
        <div class="btn_area">
            <a href="/board/list.js?page=0" class="backToList">목록으로</a>
            <button type="submit" class="btn_update">등록하기</button>
        </div>
        </fieldset>
    </form>
   
</body>
</html>`;

let content = Buffer.from(html);
console.log("Content-Type: text/html");
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);   
process.exit();