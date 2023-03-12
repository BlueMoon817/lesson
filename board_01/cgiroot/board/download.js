let fs=require("fs");
let queryString={};
let mt = require("mime-types");
if(process.env["QUERY_STRING"]){
    process.env["QUERY_STRING"].split('&').forEach(field =>{
        queryString[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
    });
}
let articles = JSON.parse(fs.readFileSync("articles.json").toString());
let article=articles[queryString["idx"]];
//첨부파일이 없는 게시물인데 첨부파일 다운로드를 시도하는 경우
if(!article["attach"]){
    let html=Buffer.from("<!Doctype html><html><head><meta charset='utf-8'><title>오류</title></head><body><h1>요청하신 파일을 찾을 수 없습니다.</h1></body></html>");
    console.log("Content-Type: text/html");
    // text/plain 일반 텍스트 mime type
    console.log("Content-Length: "+html.length);
    console.log("");
    process.stdout.write(html);
    process.exit();
}


let content=fs.readFileSync("upload/"+article["path"]);
// 파일을 출력이 아닌 저장을 하게 하는 처리
console.log(`Content-Disposition: attachment; filename=${article["attach"]}`);
// 파일 타입은 알수 없음
console.log("Content-Type: "+mt.lookup());
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);

