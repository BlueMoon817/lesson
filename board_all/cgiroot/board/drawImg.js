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


let content=fs.readFileSync("upload/"+article["path"]);

// 파일 타입은 알수 없음
console.log("Content-Type: "+mt.lookup());
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);

