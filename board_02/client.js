let http = require("http");
let https = require("https");
let cheerio = require("cheerio");
let req = https.request("https://www.weather.go.kr/w/wnuri-fct2021/main/current-weather.do?code=4128717000&unit=m%2Fs&aws=N",{
    headers:{
        "Accept": `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
        // "Accept-Encoding": `gzip, deflate, br`,
        "Host": `www.weather.go.kr`,
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36`,
        "Accept-Language":`ko-KR,ko;q=0.9`,
        "Referer": `https://www.google.com/`,
        "Connection": `keep-alive`
    }
}, function(res){
    let buf = Buffer.alloc(0);
    res.on("data",function(chunk){
        buf=Buffer.concat([buf,chunk]);
    });
    res.on("end", function(){
       let html=cheerio.load(buf.toString()); 
       process.stdout.write(Buffer.from(`현재 날씨는 ${html("span.wic.DB00").text()}, 기온은 ${html("span.tmp").text()}\n`))
    });
});

req.end();
