let http = require("http");
let https = require("https");
let cheerio = require("cheerio");
let net = require("net");
let fs=require("fs");
let req = https.request("https://www.pongdang.com/goods/catalog?page=1&searchMode=catalog&category=c0002&per=40&sorting=sale&filter_display=lattice",{
    headers:{
        "Accept": `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
        // "Accept-Encoding": `gzip, deflate, br`,
        "Host": `www.pongdang.com`,
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36`,
        "Accept-Language":`o-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7`,
        "Referer": `https://www.pongdang.com/`,
        "Connection": `keep-alive`
    }
}, function(res){
    let buf = Buffer.alloc(0);
    res.on("data",function(chunk){
        buf=Buffer.concat([buf,chunk]);
    });
    res.on("end", function(){
        
    //    let html=cheerio.load(buf.toString()); 
       fs.writeFileSync('/board_02',buf.toString())
    //    process.stdout.write(html)
    });
});
req.end();
