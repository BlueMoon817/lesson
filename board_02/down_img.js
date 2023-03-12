let fs=require("fs");
let queryString={};
let mt = require("mime-types");
if(process.env["QUERY_STRING"]){
    process.env["QUERY_STRING"].split('&').forEach(field =>{
        queryString[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
    });
}
let imgList = JSON.parse(fs.readFileSync("img.json").toString());

let content=fs.readFileSync("img/"+imgList["url"]);
// 파일을 출력이 아닌 저장을 하게 하는 처리
console.log(`Content-Disposition: attachment; filename=${imgList["url"]}`);
// 파일 타입은 알수 없음
console.log("Content-Type: "+mt.lookup());
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);

