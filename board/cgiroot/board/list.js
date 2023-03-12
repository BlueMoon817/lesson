let fs = require("fs");
let queryString={}
let cookies={}
let pagerLength=5;
let memberInfos=JSON.parse(fs.readFileSync("members.json").toString());
if(process.env["QUERY_STRING"]){
    if(process.env["QUERY_STRING"].split('&')){
        process.env["QUERY_STRING"].split('&').forEach(field =>{
            queryString[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
    });
    }
}

//쿠키 파싱

if(process.env["Cookie"]){
    if(process.env["Cookie"].split('&')){
        process.env["Cookie"].split('&').forEach(field =>{
            cookies[field.split("=")[0]] = decodeURIComponent(field.split("=")[1].replace(/\+/g," "));
        });
    }
}

if(!queryString.page){
    queryString.page=0;
}
if(!queryString.idx){
    queryString.page=parseInt(queryString["page"]);
}else{
    queryString.page=parseInt(queryString.idx/10);
}
// 따옴표제거.
let articles = JSON.parse(fs.readFileSync("articles.json").toString());
let pageNum=parseInt(queryString.page);
let currPage=pageNum;
let keyword=queryString["keyword"];
let trArr=[],con="",searchArr=[];
let lastLength,btnCase="";
// fs.readFileSync("articles.json").toString()  //==> "[{},{},{}...]" 문자열 상태

if(keyword!==''&&keyword!==" "&&keyword!==undefined){
    for(let i=0; i<articles.length;i+=1){
        if((articles[i].subject.indexOf(keyword)!==-1)||
        (articles[i].content.indexOf(keyword)!==-1)){
            searchArr.push([articles[i],articles.length-(i)]);
        }
    }
    lastLength=(searchArr.length-1)%10;
    // searchArr 배열이 다차원배열이므로 같은 변수로 처리할 수 없음.
    for(let i=0; i<searchArr.length;i+=1){
        con+=`<tr>
            <td class="cate_order">${searchArr[i][1]}</td>
            <td class="cate_subject"><a href="/board/read.js?idx=${i}&keyword=${keyword?keyword:""}&page=${pageNum}">${searchArr[i][0].category?"["+searchArr[i][0].category+"]":""} ${searchArr[i][0].subject}</a>${articles[i].attach?"(첨)":""}</td>
            <td class="cate_writter">${searchArr[i][0].nickname}</td>
            <td class="cate_date">${searchArr[i][0].written}</td>
            <td class="cate_in">${searchArr[i][0].hitcount}</td>
            </tr>`
        if(i===9 || (i!==0&&i%10===9)||(i-(searchArr.length-1-lastLength)===lastLength)){   
            trArr.push(con);
            con='';
        }
    }
}else{
    for(let i=0; i<articles.length;i+=1){
        lastLength=(articles.length-1)%10;
        con+=`<tr>
        <td class="cate_order">${articles.length-(i)}</td>
        <td class="cate_subject"><a href="/board/read.js?idx=${i}&keyword=${keyword?keyword:""}&page=${pageNum}">${articles[i].category?"["+articles[i].category+"]":""} ${articles[i].subject}</a>${articles[i].attach?"(첨)":""}</td>
        <td class="cate_writter">${articles[i].nickname}</td>
        <td class="cate_date">${articles[i].written}</td>
        <td class="cate_in">${articles[i].hitcount}</td>
        </tr>`
        if((i==9)||(i!==0&&i%10===9) || (i-(articles.length-1-lastLength)===lastLength)){
            trArr.push(con);
            con=''; 
        }
    }
}

// endPager는 실제 페이저 끝번호
let content='',pagerBtn="";
let endPager=trArr.length;
// 처음, 마지막, 이전, 다음 버튼 실행함수.
let num=function(idx,what){
    // 처음으로 -> 인덱스 0
    if(what=='start'){ pageNum=0;}
    // 이전
    else if(what=='prev'){
        // 인덱스가 4 이상 
        if(idx>4){
            // 인덱스가 페이저 그룹의 첫번째 페이저일때
            if(idx%pagerLength===0){ pageNum=idx-pagerLength; }
            // 인덱스가 페이저 그룹의 첫번째 페이저가 아닐때
            else if(idx%pagerLength!==0) { pageNum=parseInt(idx-(idx%pagerLength)-pagerLength); }
        // 인덱스가 4이하이면 페이지인덱스는 0
        }else if(idx<=4){ pageNum=0; }
    }
    // 다음 버튼-> 클릭하면 다음 페이저그룹의 첫번째 페이지로 이동.
    else if(what=='next'){
        if(idx%pagerLength===0){
            if(idx/pagerLength===parseInt((endPager-1)/pagerLength)){
                pageNum=idx;
            }else if(idx/pagerLength<parseInt((endPager-1)/pagerLength)){
                pageNum=idx+pagerLength;
            }
        }else if(idx%pagerLength!==0){
            if((idx-(idx%pagerLength))/pagerLength===parseInt((endPager-1)/pagerLength)){
                pageNum=idx;
                
            }else if((idx-(idx%pagerLength))/pagerLength<parseInt((endPager-1)/pagerLength)){
                pageNum=(idx-(idx%pagerLength))+pagerLength;
            }
        }
    }else if(what=='last'){
        if(trArr.length>5){
            pageNum=endPager-1;
            
        }else if(trArr.length<=5){
            pageNum=(trArr.length%5)-1;
        }
    }
    return pageNum;
}
// 페이저그룹 렌더링
let buttonGroup=function(idx){
    if(idx>4){
        if(idx%pagerLength===0){
            pageNum=idx;
        }
        else if(idx%pagerLength!==0) {
            pageNum=parseInt(idx-(idx%pagerLength)); 
        }
    }else if(idx<=4){
        pageNum=0;
    }
    pagerBtn=`<div class="pager_group">`
    for(let i=0;i<pagerLength;i+=1){
        if(pageNum+i<endPager){
            pagerBtn+=`<a href="/board/list.js?page=${pageNum+i}&keyword=${keyword?keyword:""}" class="pager" style="color:#2d2d2d";>${pageNum+i+1}</a>`
        }
    }
    pagerBtn+=`</div>`
    return pagerBtn;
}
//로그인 여부에 따라 회원의 닉네임 표시
let btnHtml="<a href='/login.html'>로그인</a>"
let nickname = "비회원"

if(cookies["sess_id"] && fs.existsSync("./sessions/"+cookies["sess_id"])){
    let session = fs.readFileSync("./sessions/"+cookies["sess_id"]).toString();
    let loggedId = session.split("=")[1];
    let members=JSON.parse(fs.readFileSync("members.json").toString());
    let [theMember] = memberInfos.filter(member =>{
       return member.id===loggedId 
    });
    nickname = theMember["nickname"];
    btnHtml = "<a href='/logout.js'>로그아웃 하기</a>"
}


let render=(idx)=>{
    buttonGroup(idx);
    content = `<!Doctype html>
<html>
    <head>
        <title>게시물 목록 화면</title>
        <meta charset='utf-8'>
        <link rel="stylesheet" href="/css/index.css">
    </head>
    <body class="list_wrap">
        <div class="wrap">
            <span>${nickname}님, 환영합니다! ${btnHtml}</span>`
            if(nickname!=="비회원"){
               content+=`<form action="/editInfo.js" method="post">
                <button>내정보수정</button>
                </form>`
            }
            content+=`<div class="tit">
                <h1>게시물 목록 화면</h1>
                <div class="util_box">
                <form class="key_search" action="/board/list.js" method="GET">
                    <legend class="blind">검색</legend>
                    <input type="text" name="keyword" id="input_keyword">
                    <button type="submit" class="search_ico"></button>
                </form>`
                if(searchArr.length>1){
                    content+=`<a href="list.js?page=0" class="btn_write is_active">전체목록으로</a>` 
                }
                if(nickname==="비회원"){
                    content+=`<a href="/login.html" class="btn_write is_active">글 쓰기</a>`
                }else if(nickname!=="비회원"){
                    content+=`<a href="/writeform.js" class="btn_write is_active">글 쓰기</a>`
                }
                content+=`</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>글번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일시</th>
                        <th>조회수</th>
                    </tr>
                </thead>
            <tbody>`; 
// 리스트목록에 게시물이 없을 경우.
if(!articles.length>0){
    content+=`<span class="no_result">게시물이 없습니다. 글을 작성해주세요.</span>`
}else{
    content+=trArr[idx];
}
content+=`</tbody>
</table>
<div class="pagination">
    <div class="prev_group">
        <a href="/board/list.js?page=${num(idx,'start')}&keyword=${keyword?keyword:""}" class="first_pager" >[처음으로]</a>
        <a href="/board/list.js?page=${num(idx,'prev')}&keyword=${keyword?keyword:""}" class="prev" >[이전]</a>
    </div>`
content+=pagerBtn;
content+=   `<div class="next_group">
                <a href="/board/list.js?page=${num(idx,'next')}&keyword=${keyword?keyword:""}" class="next" >[다음]</a>
                <a href="/board/list.js?page=${num(idx,'last')}&keyword=${keyword?keyword:""}" class="last_pager" >[마지막페이지로]</a>
            </div>
        </div>
        </div>
        <script>
            let btnSearch=document.querySelector('.search_ico');
            let submitAct=document.querySelector('.key_search');
            let pagerMark=document.querySelectorAll('.pager');
            if(pagerMark[${currPage%5}]!==undefined){
                pagerMark[${currPage%5}].style.color='#f00';
                let txt = pagerMark[${currPage%5}].innerHTML;
                pagerMark[${currPage%5}].innerHTML='['+txt+']'
            }
        </script> 
    </body>       
</html>
`
content=Buffer.from(content);
}
render(pageNum===endPager-1?currPage:pageNum);
console.log("Content-Type: text/html");
// text/plain 일반 텍스트 mime type
console.log("Content-Length: "+content.length);
console.log("");


process.stdout.write(content);

