let https = require("https");
let cheerio = require("cheerio");
let fs=require("fs");
let imgArr = [];
    let req = https.request('https://www.pongdang.com/goods/search_list?page=1&searchMode=catalog&category=c0002&per=40&sorting=sale&filter_display=lattice&auto=1',{
        headers:{
            "Accept": `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
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
            let html;
            let doc = buf.toString();
            for(z=0; ; z+=1){
                if(doc.indexOf("item_img_area")!==-1){
                    html=cheerio.load(doc);
                    imgArr.push(html(".item_img_area>a>img").attr('src'))
                    doc= doc.substring(doc.indexOf("/data/goods")+100,doc.length);
                }else {
                    break;
                };
            }
            for(let i=0; i<imgArr.length; i+=1){
            let downImg = https.request(`https://www.pongdang.com${imgArr[i]}`,
            {
                headers:{
                    "Accept": `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
                    "Host": `www.pongdang.com`,
                    "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36`,
                    "Accept-Language":`o-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7`,
                    "Referer": `https://www.pongdang.com/`,
                    "Connection": `keep-alive`
                }
            },
            function(res){
                let buf2=Buffer.alloc(0);
                res.on("data",function(chunk2){
                    buf2=Buffer.concat([buf2,chunk2]);
                });
                res.on("end", function(){
                    fs.writeFileSync(`img/${i}.jpg`,buf2)
                });
            })
            downImg.end();
        }        
    });
});
req.end();