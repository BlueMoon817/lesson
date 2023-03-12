let fs=require("fs");
let queryString={}
if(process.env["QUERY_STRING"]){
    process.env["QUERY_STRING"].split('&').forEach(field =>{
        queryString[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
    });
}

let articles = JSON.parse(fs.readFileSync("articles.json").toString());
process.stdin.on('data',function(buf){
    buf=buf.toString();
    let payload={};
    buf.split('&').forEach(str=>{
        payload[str.split("=")[0]]=decodeURIComponent(str.split("=")[1].replace(/\+/g," "));
    })
    articles[queryString["idx"]].comment.push({writer:payload["writer"],body:payload["comment"],dt:new Date()});
    articles=fs.writeFileSync("articles.json",Buffer.from(JSON.stringify(articles)));
    
    let content = Buffer.from(`<!Doctype html>
    <html>
    <head>
    <script>
        location.href="/board/read.js?idx=${queryString.idx}"  
    </script>
    </head>
    </html>`);
    console.log("Content-Type: text/html");
    // text/plain 일반 텍스트 mime type
    console.log("Content-Length: "+content.length);
    console.log("");
    process.stdout.write(content);   
    
    process.exit();
});


//subject=...&nickname=...&category=...&content=...    &로 구분하여 데이터가 들어온다.












