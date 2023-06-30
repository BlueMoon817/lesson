let express = require("express");
let mysql2=require('mysql2');
let server = express();
let session= require("cookie-session");
let pool = mysql2.createPool({
  host:"localhost",
  user: "board",
  password:"123123",
  database:"board"
});
server.use(session({
  name: 'session',
  keys: ['sckey'],
  // Cookie Options
  maxAge: 2 * 60 * 60 * 1000 // 2hours
}));
/* 로그 미들웨어 */

server.use(function(req,res,next){
    console.log(`${req.method} ${req.url}`)
    next();
});


server.use(express.static("./statics"));
// post를 파싱해주는 미들웨어
server.use(express.urlencoded({extended:true}));
server.use(express.json()); //json 형식의 post payload를 파싱하는 미들웨어
// view engine 을 ejs엔진으로 셋팅
// server.set("view engine", "html");
// 파일 경로
// server.set("views", "./templates");
// post를 전달받는 미들웨어

server.post("/login", function(req,res,next){
  let result;
  // 로그인 아이디 패스워드 체크 및 세션 등록
  pool.query("SELECT * FROM USER",function(err, dbres){
    if(err) console.log("오류발생",err);
    for(let i=0; i<dbres.length; i+=1){
      if(req.body.id===dbres[i].id && req.body.pw===dbres[i].password){
        req.session.id = dbres[i].id;
        req.session.num = Math.random().toString()+Math.random().toString()+Math.random().toString();
        req.session.nickname=dbres[i].nickname;
        pool.query("INSERT INTO session SET randomkey=?, nickname=?, id=?",[req.session.num, dbres[i].nickname, req.session.id],function(err, db){
          if(err) console.log("오류발생",err);
        });
        result={state:'success', user:dbres[i].nickname};
      }
    }
    if(result===undefined){
      console.log("실행시점")
      result={state:'fail'};
    }
    res.send(result);
  });
});
server.get("/pagesignup", function(req,res,next){
  res.send(true);
});
server.get("/logout", function(req,res,next){
  //세션 데이터 삭제
  pool.query("DELETE FROM session WHERE id=?, randomkey=?", [req.session.id ,req.session.num],function(err, session){
    if(err) console.log("에러");
      console.log("세션이 삭제되었음.");
      console.log(req.session);
      //세션 파괴 
      req.session = null;
      console.log(req.session);
      res.send(true);
  });
});
server.get("/checkUser",function(req,res,next){
  pool.query("SELECT * FROM session",function(err, dbres){
    let state={};
    state.pageNum=req.body.pageNum;
    if(err) console.log("오류발생",err);
    for(let i=0; i<dbres.length; i+=1){
      if(req.session.id===dbres[i].id && req.session.num===dbres[i].randomkey){
        console.log("로그인 상태입니다.");
        state.state='in';
        state.user=dbres[i].id;
      }
    }
    if(state===undefined){
      state.state='out';
      console.log("미로그인 상태입니다.")
    }
    res.send(state);
  });
});
server.post("/pageUpdate",function(req,res,next){
  pool.query("SELECT * FROM user", function(err, dbres){
    let state, user;
    for(let i=0; i<dbres.length; i+=1){
      if(req.session.id===dbres[i].id){
        user=dbres[i].id;
        break;
      }
    }
    pool.query("INSERT INTO RECORD SET subject=?,date=NOW(),category=?,writer=?,content=?,count=?",[req.body.subject,req.body.category, user ,req.body.content,0], function(err,db){
        if(err) console.log("오류발생",err);
        console.log("등록되었습니다.");
        state='complete';
       res.send(state);  
    });
  }); 
});
server.post("/editPage",function(req,res,next){
  pool.query("SELECT * FROM RECORD", function(err, dbres){
    let state;
    let stateMent=`UPDATE RECORD SET subject=?, content=? WHERE seq=${req.body.listNum}`
    pool.query(stateMent,[req.body.subject,req.body.content], function(err,db){
        if(err) console.log("오류발생",err);
        console.log("등록되었습니다.");
        state='complete';
       res.send(state);  
    });
  }); 
});
server.post("/moveEdit", function(req,res,next){
  pool.query("SELECT * FROM RECORD WHERE seq=?",[req.body.listNum], function(err,dbres){
    if(err) console.log("오류발생",err);
    let content;
    if(req.session.id===dbres[0].writer){
      content={
        content: dbres[0].content,
        category:dbres[0].category,
        subject: dbres[0].subject
      }
    }else{
      content='false';
    }
    console.log(content);
    res.send(content);
  });
 
});
server.post("/pageList", function(req,res,next){
  let getPageNum=parseInt(req.body.pageNum);
  let userState;
  
  req.session.id? userState=req.session.id : userState=null;

  pool.query("SELECT * FROM RECORD", function (err, dbres){
    if(err) console.log("오류발생",err);
    
    
    
    let firstPageNum, lastPageNum,dataArr=[],articles=[],pageInfo={},restPageCount=0,restListCount=0,dataCount=10,startIndex=0,lastListNum = dbres.length, lastIndex=dbres.length-1
    if(lastListNum%10!==0) {
      restListCount=lastListNum%10;
      restPageCount=1;
    }
    let prev,next;
    // 총 페이지 수
    let pageCountAll = parseInt(lastListNum/10)+restPageCount;
    // 첫번째 버튼 구하는 변수
    let firstCalc = getPageNum - (getPageNum%5-1);
    // 첫번째 버튼 숫자, 마지막 버튼 숫자 구하는 조건문
    if(getPageNum<=5){
      firstPageNum = 1;
      prev=1;
      next=6;
      if(pageCountAll>5){
        lastPageNum = 5;
      }else if(pageCountAll<=5){
        lastPageNum=pageCountAll;
        next=lastPageNum;
      }
    }else if( getPageNum > 5){
      firstPageNum=firstCalc;
      if(getPageNum===6){
        prev=1;
      }
      if(firstPageNum+4>=pageCountAll){
        lastPageNum=pageCountAll;
        next=lastPageNum;
      }
      prev=firstPageNum-5
      console.log(prev, next);
    }
 
    
    // 게시물 시작 인덱스
    if(getPageNum===1){
      startIndex=0;
    }else if(getPageNum===pageCountAll && getPageNum>1){
      startIndex=((getPageNum - 1) * 10);
    }else if(getPageNum!==pageCountAll && getPageNum>1){
      startIndex=(getPageNum * 10)-10;
    }
    
    
    // 출력할 데이터 개수
    if(startIndex+10>dbres.length){
      dataCount=restListCount;
    }
    // 시작인덱스, 개수변수 필요
    let queryTxt=`SELECT * FROM RECORD ORDER BY seq DESC LIMIT ${dataCount} OFFSET ${startIndex}`;
    pool.query(queryTxt, function(err, pages){
      if(err) console.log("오류발생",err);
      for(let i=0;i<pages.length;i+=1){
        articles.push({
          number: pages[i].seq,
          category: pages[i].category,
          nickname: pages[i].writer,
          hit: pages[i].count,
          date: pages[i].date,
          subject: pages[i].subject
        });
      }
      pageInfo = {
        user: userState,
        firstPage: firstPageNum,
        lastPage: lastPageNum, // 출력할 마지막 페이지번호
        currPage: getPageNum,
        dataCount,
        startIndex,
        lastIndex,
        endPage: pageCountAll,
        nextMove:next,
        prevMove:prev,
      }
      dataArr=[articles, pageInfo];

      res.send(dataArr);
    });
  });
});
server.post("/detailPage", function(req,res,next){
  let listSeq=parseInt(req.body.listNum);
  pool.query("SELECT * FROM RECORD WHERE seq=?",[listSeq], function (err, dbres){
    if(err) console.log("오류발생",err);
    let pageInfo={
      viewSub: dbres[0].subject,
      viewNick: dbres[0].writer,
      viewDate: dbres[0].date,
      viewCount: dbres[0].count + 1,
      viewContent: dbres[0].content,
    }
    let user=req.session.id;
    pool.query("SELECT * FROM RECORD WHERE seq=?",[listSeq], function(err,data){
      if(err) console.log("오류발생",err);
      if(user===dbres[0].writer){
        pageInfo.user='collect';
        console.log("done");
      }
      res.send(pageInfo);
    });
  });
});
server.post("/commentUpdate", function(req,res,next){
  let listSeq=parseInt(req.body.listNum);
  pool.query("INSERT INTO comment SET writer=?, date=NOW(), content=?, list=?", [req.session.id, req.body.commCont, listSeq], function (err, dbres){
    if(err) console.log("오류발생",err);
    console.log("코멘트 등록 완료");
    res.send("ok");
  });
});
server.post("/commentRender", function(req,res,next){
  let listSeq=parseInt(req.body.listNum);
  pool.query("SELECT * FROM comment WHERE list=?",[listSeq], function (err, dbres){
    if(err) console.log("오류발생",err);
    let commentArr=[];
    for(let i=0; i<dbres.length; i+=1){
      commentArr.push({writer:dbres[i].writer, date:dbres[i].date, content:dbres[i].content});
    }
    res.send(commentArr);
  });
});
server.get("/pageReply", function(req,res,next){
  
});

server.post("/makeid",function(req,res,next){
  let checkId;
  pool.query("SELECT * FROM USER", function(err, dbres){
    if(err) console.log("오류발생",err);
    for(let i = 0; i<dbres.length; i+=1){
      if(req.body.id2===dbres[i].id || req.body.nickname === dbres[i].nick || req.body.email === dbres[i].email){
        checkId='exist';
      }
    }
  });
  if(checkId!=='exist'){
    pool.query("INSERT INTO USER SET id=?,password=?,nickname=?,email=?",[req.body.id2, req.body.pw2, req.body.nick, req.body.email],function(err, dbres){
      if(err) console.log("오류발생",err);
      checkId='ok'
      console.log("table에 등록완료");
      pool.query("SELECT * FROM USER", function(err, dbres){
      for(let z=0; z<dbres.length;z+=1){
        console.log(`${dbres[z].seq} / ${dbres[z].id} / ${dbres[z].password} / ${dbres[z].nickname} / ${dbres[z].email}`);
      }
      });
      res.send(checkId);
    });
  }else{
    res.send(checkId);
  }
});
server.use(function(req,res,next){
  res.redirect("/board.html");
});
server.listen(3000, function(){
  console.log("웹서버가 3000번 포트에 준비됨");
});