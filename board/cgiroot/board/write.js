let fs=require("fs");
let mt = require("mime-types");
let queryString={}
let postData={}
let cookies={}
let memberInfos=JSON.parse(fs.readFileSync("members.json").toString());
if(process.env["QUERY_STRING"]){
    process.env["QUERY_STRING"].split('&').forEach(field =>{
        queryString[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
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
// 이벤트는 모든 코드가 파싱 후에 실행됨
process.stdin.on('data',function(buf){
    if(process.env["Content-Type"] == "application/x-www-form-urlencoded"){
        buf=buf.toString();
        buf.split('&').forEach(field =>{
            postData[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
        });
    }
    else if(process.env["Content-Type"].indexOf("multipart/form-data")!==-1){
        // 첨부파일의 컨텐츠가 텍스트만 있는 것이 아니므로 문자열로 처리할 수 없다. 
        // -> 캐릭터셋에 대응하는 숫자로 처리해야함.
        // -> 버퍼처리를 해둔다.
        // 멀티파트 형식으로 주어진 페이로드를 쪼개기 위해 바운더리를 먼저 얻어놓는다.
        let boundary= Buffer.from("--"+process.env["Content-Type"].split("boundary=")[1]);
        // 표준입력으로 전달된 페이로드를 따라가면서 바운더리를 기준으로 각가의 파트를 구분해낸다.
        let parts=[],start=0,end;
        while(1){
            start=buf.indexOf(boundary,start)+boundary.length+2;
            end = buf.indexOf(boundary,start);
            if(end===-1){
                break;
            }else{
                parts.push(buf.subarray(start,end));
            }
        }
        //각각의 파트를 순회하면서 줄바꿈기호(\r\n)이 2번 연속으로 등장하는 자리를 찾아서, 헤더와 내용을 분리한다.
        for(let i=0; i<parts.length;i+=1){
            let pos = parts[i].indexOf(Buffer.from("\r\n\r\n"));                
            //파트의 헤더 (문자열임)
            let bufHeaders=parts[i].subarray(0,pos);
            let headers={};
            bufHeaders.toString().split("\r\n").forEach(line=>{
                headers[line.split(": ")[0]] = decodeURIComponent(line.split(": ")[1].replace(/\+/g," "));
                if(headers[line.split(": ")[0]].indexOf(";")!==-1){
                    let options={};
                    let strOptions = headers[line.split(": ")[0]].split("; ");
                    for(let p=1; p<strOptions.length; p+=1){
                        options[strOptions[p].split("=")[0]]= strOptions[p].split("=")[1].replace(/\"/g,"");
                        
                    } 
                    headers[line.split(": ")[0]]={
                        value:strOptions[0],
                        ...options
                    };
                }
            });
            //파트의 본문
            let bufContent= parts[i].subarray(pos+4,parts[i].length-2);
            // 이파트가 첨부파일이 아니면 
            if(!headers["Content-Disposition"].filename){
                postData[headers["Content-Disposition"].name] = bufContent.toString();
            }
            // 이 파트가 첨부파일이면
            else{
                // 용량이 1MB가 넘으면
                if(bufContent.length>1000000){
                    let html=Buffer.from("<!Doctype html><html><head><meta charset='utf-8'><title>오류</title></head><body><strong>파일의 용량이 1MB를 초과하였습니다.</strong><a href='/board/list.js?page=0'>목록으로</a></body></html>");
                    console.log("Content-Type: text/html");
                    // text/plain 일반 텍스트 mime type
                    console.log("Content-Length: "+html.length);
                    console.log("");
                    process.stdout.write(html);
                    process.exit();
                }else{
                    // 파일이름이 겹치지 않게 저장하기 위해서 무작위 파일이름을 생성
                    let fname=Math.random();
                    // 첨부파일을 저장한다.
                    fs.writeFileSync("upload/"+fname, bufContent);
                    postData[headers["Content-Disposition"].name] = headers["Content-Disposition"].filename;
                    postData["path"]=fname;
                }
            }
        }
    }
    

    // 게시물 객체 생성
    let article = {
        subject:postData["subject"],
        nickname,
        category:postData["category"],
        content:postData["content"],
        attach:postData["attach"],
        path:postData["path"],
        written:new Date(),
        hitcount: 0,
        comment:[],
    };
    //기존에 저장되어있던 게시물들을 읽어온다.
    // "[]"  문자열 상태 -> JSON.parse() 로 따옴표를 없애고 [](array)이 된다.
    let articles = JSON.parse(fs.readFileSync("articles.json").toString());
    //새 게시물 추가
    articles.unshift(article);

    //게시물이 추가된 상태로 저장을 다시한다.
    //배열을 버퍼객체로 바꾸는 방법은 없으므로, 문자열로 바꾼다. JSON.stringify(articles)
    //문자열이 된 것을 버퍼객체로 변환하여 저장한다.
    articles=fs.writeFileSync("articles.json",Buffer.from(JSON.stringify(articles)))
    
    // 작성완료를 한 뒤 리스트화면으로 전환
    let content = Buffer.from(`<!Doctype html>
    <html>
    <head>
    <meta charset='utf-8'>
    <link rel="stylesheet" href="/css/index.css">
    <script>
        location.href="/board/list.js?page=0"
    </script>
    </head>
    </html>`);
    console.log("Content-Type: "+mt.lookup());
    console.log("Content-Length: "+content.length);
    console.log("");
    process.stdout.write(content);   
    process.exit();
});




