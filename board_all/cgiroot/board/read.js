/*
쿼리 스트링 파싱을 가장 먼저 한다.
*/
let fs = require( "fs" );
let queryString = {};

let mt = require( "mime-types" );
if( process.env[ "QUERY_STRING" ] ){
    process.env[ "QUERY_STRING" ].split( '&' ).forEach( field =>{
        queryString[ field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," ") );
    });
}
let outputImg = '';
/* 게시물 조회 */
let articles = JSON.parse( fs.readFileSync("articles.json").toString() );
let curr_article = articles[ parseInt( queryString["idx"] ) ];
let currPage = parseInt( queryString["page"] ) 
let makeList = ''
let keyword = queryString[ "keyword" ];
for( let i = 0; i < curr_article.comment.length; i+=1 ){
    makeList += `<li class="comment_items">
        <span class="user_nick">${curr_article.comment[i].writer}</span>
        <div class="con">
            <p class="txt">${curr_article.comment[i].body}</p>
            <span class="date">${curr_article.written}</span>
        </div>
    </li>`    
}


// let pager=parseInt(queryString["idx"]/10);

if( (curr_article["attach"].indexOf(".png") !== -1) || (curr_article["attach"].indexOf(".jpg") !== -1 )){
    outputImg = `<img src='drawImg.js?idx=${queryString["idx"]}' alt='첨부파일이미지'/>`
}

let content =`${`<!Doctype html>
<html>
<head>
<title>게시물 상세 화면</title>
<meta charset='utf-8'>
<link rel="stylesheet" href="/css/index.css">
</head>
<body class="read_wrap">
<div class="wrap">
<div class="tit">
<h1><span class="cateMark" style="width:90px;">${curr_article["category"] ? "[" + curr_article["category"] + "]" : ""}</span><span class="tit01">${curr_article["subject"]}</span></h1>
<a href="/board/list.js?page=${currPage}&keyword=${keyword}" class="btn_back_list">목록으로</a>
</div>
<table>
<tr>
    <th>작성자</th>
    <td class="user_name">${curr_article["nickname"]}</td>
    <th>작성일시</th>
    <td class="time">${curr_article["written"]}</td>
</tr>
<tr>
<th>본문</th>
<td colspan="3">${curr_article["content"]}</td>
</tr>`
+
( curr_article["attach"] ?
`<tr>
<th>첨부파일</th>
<td colspan="3"><a href="download.js?idx=${queryString["idx"]}">${curr_article["attach"]}</a></td>
</tr>`
: "" )
+
`</table>`+
outputImg
+
`<div class="comment_board">
<ul class="comment_list">` +
makeList}</ul>
<form action="/board/comment.js?idx=${queryString["idx"]}" method="post" class="input_comment">
<label for="input_nick">작성자</label>
<input type="text" name="writer" id="input_nick">
<textarea type="text" name="comment" class="comment" placeholder="댓글을 남겨보세요."></textarea>
<button type="submit" class="upload">등록</button>
</form>
</div>

</div>
<script>
let cateMark=document.querySelector('.cateMark');
if(cateMark.innerHTML===""){
    cateMark.style.width='0px';
}
</script>
</body>
</html>`;

content=Buffer.from(content);
console.log("Content-Type: "+mt.lookup());
// text/plain 일반 텍스트 mime type
console.log("Content-Length: "+content.length);
console.log("");
process.stdout.write(content);


