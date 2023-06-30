const loginPage=document.querySelector('#page_login_content');
const signUpPage=document.querySelector('#page_signup_content');
const listPage=document.querySelector('#page_list');
const listViewPage=document.querySelector('#page_list_content');
const listViewBtn=listViewPage.querySelector('.btn_group');
const writePage=document.querySelector('#page_write');
const editPage=document.querySelector('#page_edit');
const editBtn=document.querySelector('#page_edit .btn_group');
const replyPage=document.querySelector('#page_reply');
const currListNum=document.querySelector('.board_guide');
const listWrap = document.querySelector('#board_list');
const pagination=document.querySelector('.pagination');
const commentList=document.querySelector('.comment_list');
const commContainer = commentList.querySelector('tbody');
const boardList=document.querySelector('#board_list');
const detailHeader= document.querySelector('.con_header');
const detailContent=document.querySelector('.con_body p');
let currUser=document.querySelectorAll('.curruser');
const writer=document.querySelector('#page_list_content .comm_writer');
let login=document.querySelector('.login');
let subject=editPage.querySelector('#edit_subject');
let content=editPage.querySelector('.summernote');
let cateVal=editPage.querySelector('.cate_val');
// page 배열
const pageArr=document.querySelectorAll("section>div");
// page on/off Func
const hide=function(){
  pageArr.forEach(item=>{
    item.style.display="none";
  });
}
// 리스트 출력 함수
const listRender=function(res){
  // 등록된 글이 없을 때 처리
  if(!res.data[0].length) {
    currListNum.style.display="block";
    return;
  } else { 
    currListNum.style.display="none";
  } 
  // 받은데이터 리스트 렌더링
  let insertList="", btnInsert="";
  for( let i=0;i<res.data[0].length; i+=1 ){
    insertList+=`<tr class="list_items">
    <td class="list_cate">${res.data[0][i].category}</td>
    <td><button type="button" class="list_subject" onclick="detailPage(${res.data[0][i].number})">${res.data[0][i].subject}</button></td>
    <td class="list_writer">${res.data[0][i].nickname}</td>
    <td class="list_date">${res.data[0][i].date}</td>
    <td class="list_count">${res.data[0][i].hit}</td>
    </tr>`
  }
  // 버튼 렌더링 
  btnInsert=`<a href="#page=${res.data[1].prevMove}" class="page_prev" onclick="pageList(${res.data[1].prevMove})">&nbsp;<<&nbsp;</button>`;
    
  for(let btn=res.data[1].firstPage;btn<=res.data[1].lastPage;btn+=1){
    if(btn===res.data[1].currPage){
      btnInsert+=`<a href="#page=${btn}" class="btn_page is_act" onclick="pageList(${btn})">${btn}</a>`;
    }else{
      btnInsert+=`<a href="#page=${btn}" class="btn_page" onclick="pageList(${btn})">${btn}</a>`;
    }
  }
  btnInsert+=`<a href="#page=${res.data[1].nextMove}" class="page_next" onclick="pageList(${res.data[1].nextMove})">&nbsp;>>&nbsp;</a>`;   
  // html에 출력시키기
  if(res.data[1].user!==null){
    currUser.forEach(function(item){
      item.innerHTML=`${res.data[1].user}님 반갑습니다.`;
    });
    login.innerHTML="로그아웃";
  }else{
    currUser.forEach(function(item){
      item.innerHTML="미로그인 상태입니다.";
    });
    login.innerHTML="로그인";
  }
  listWrap.innerHTML=insertList;
  pagination.innerHTML=btnInsert;
  hide();
  listPage.style.display='block';
}


// 페이지 체크 & 리스트 출력 함수 호출
const checkState= function(){
  detailContent.value='';
  let targetURL = window.location.href;
  let pageHash = targetURL.split('#')[1]?targetURL.split('#')[1]:undefined;
  let pageNum = pageHash? pageHash.split('=')[1] : undefined
  if(pageNum===undefined){
    pageNum=1;
  }
  pageList(pageNum);
}

// 페이지 접속시(처음접속 or 새로고침등) 로그인, 페이지 확인하여 리스트 출력.
window.addEventListener('load',function(e){
  checkState();
});

// 게시판 리스트 및 페이지네이션 출력 함수
const pageList = function(pageNum){
  let goList = axios({ 
    method:"POST",
    url: `http://localhost:3000/pageList#page=${pageNum}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {pageNum}
  });
  goList.then(function(res){
    console.log(res.data)
    listRender(res);
  });
}
//상세페이지 출력
const detailPage = function(listNum){
  let detail = axios({ 
    method:"POST",
    url: `http://localhost:3000/detailPage`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {listNum}
  });
  detail.then(function(res){
    if(res.data.user==='collect'){
      listViewBtn.innerHTML=`
      <button class="btn_list" onclick="checkState()">목록으로</button>
      <button class="btn_edit" onclick="moveEditPage(${listNum})">수정하기</button>`
    }else {
      listViewBtn.innerHTML=`
      <button class="btn_list" onclick="checkState()">목록으로</button>
      <button class="btn_reply" onclick="pageReply(${listNum})">답글작성</button>`
    }
    let html=`
    <div class="view_subject">${res.data.viewSub}</div>
      <ul class="info_group">
        <li class="view_nick">${res.data.viewNick}</li>
        <li>글번호 <span class="view_listNum">${listNum}</span></li>
        <li class="view_date">${res.data.viewDate}</li>
        <li class="view_count">조회 <span class="view_num">${res.data.viewCount}</span></li> 
      </ul>`;
    detailContent.innerHTML = res.data.viewContent;
    detailHeader.innerHTML = html;
    commentRender(listNum);
    hide();
    listViewPage.style.display='block';
  });
}
//코멘트 렌더링
const commentRender= function(listNum){
  let detail = axios({ 
    method:"POST",
    url: `http://localhost:3000/commentRender`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {listNum}
  });
  detail.then(function(res){
    let html='';
    console.log(res.data)
    for(let i = 0; i<res.data.length; i+=1){
      html+=`<tr class="list_items"><td class="list_id">${res.data[i].writer}</td><td class="list_con">${res.data[i].content}</td><td class="list_date">${res.data[i].date}</td><td class="list_reply"><button type="button" class="btn_reply" onclick="moveReplyPage(${listNum})">대댓글</button></td></tr>`;
    }
    commContainer.innerHTML=html;
  });
}
//코멘트 등록
const commentUpdate= function(){
  let commCont=document.querySelector('#input_comment');
  let detailListNum=document.querySelector('.view_listNum');
  let detail = axios({ 
    method:"POST",
    url: `http://localhost:3000/commentUpdate`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {
     commCont: commCont.value,
     listNum:  detailListNum.innerHTML
    }
  });
  detail.then(function(res){
    if(res.data==='ok'){
      commentRender(parseInt(detailListNum.innerHTML));
      commCont.value='';
    }else{
      alert("세션이 만료되었습니다. 다시 작성해주세요.")
    }
  });
}
// login Func
const loginFunc = function(){
  let pw1=document.querySelector('input[name="password1"]').value;
  let id1=document.querySelector('input[name="id1"]').value;
  let login = axios({
    method:'POST',
    url:'http://localhost:3000/login',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data:{
      id:id1,
      pw:pw1,
    },
  })
  login.then(function(res){
    if(res.data.state === 'success'){
      currUser.forEach(function(item){
        item.innerHTML=res.data.user;
      });
      writer.innerHTML=res.data.user;
      hide();
      listPage.style.display='block';
      alert("로그인 성공!");
      return checkState();
    }else{
      alert("해당 아이디는 존재하지 않거나 비밀번호가 틀렸습니다.");
    }
  });
}

// 회원가입 페이지로 이동
const signUpFunc = function(){
  let msignup = axios.get("http://localhost:3000/pagesignup");
  msignup.then(function(res){
    if(res){
      hide();
      signUpPage.style.display='block';
    }
  })
}
// 로그아웃 및 로그인화면으로 이동.
const checkUser = function(){
  let checkLogin = axios.get("http://localhost:3000/checkUser");
  checkLogin.then(function(res){
    if(res.data.state==="in"){
      logout();       
    }else{
      hide();
      loginPage.style.display="block";
    }
  })
}
// 로그아웃
const logout=function(){
  let viewLogin = axios.get("http://localhost:3000/logout");
  viewLogin.then(function(res){
    if(res.data){
      alert("로그아웃 되었습니다.");
      checkState();
    }
  })
}

// 로그인 여부 체크하여 글쓰기 페이지 이동
const pageWrite = function(){
  let goWrite = axios.get("http://localhost:3000/checkUser");
  goWrite.then(function(res){
    if(res.data.state==="in"){
      hide();
      writePage.style.display='block';
    }else{
      alert("로그인 해주세요.");
      hide();
      loginPage.style.display="block";
    }
  })
}

// 답글쓰기 페이지 (로그인 확인여부 필요)
const pageReply = function(){
  let replyList = axios.get("http://localhost:3000/pageReply");
  replyList.then(function(res){
    if(res){
      hide();
      replyPage.style.display='block';
    }
  })
}

// 게시물 등록
const updateList = function(){
  let listCate=writePage.querySelector('.data_cate');
  let subject=writePage.querySelector('#input_subject');
  let content=writePage.querySelector('.input_content');
  let updatePage=axios({
    method:'POST',
    url:"http://localhost:3000/pageUpdate",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      },
    data: {
      category: listCate.value,
      subject: subject.value,
      content: content.value,
    }
  });
  updatePage.then(function(res){
    if(res.data==="complete"){
      alert("작성하신 글이 등록되었습니다.");
      pageList(1);
    }else{
      alert("잘못된 접근입니다.");
    }
  });
}
const moveEditPage= function(listNum){

  let moveEdit=axios({
    method: "POST",
    url: "http://localhost:3000/moveEdit",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      },
    data: {
      listNum
    }
  });
  moveEdit.then(function(res){
    if(res.data!=='false'){
      console.log("in")
      console.log(res.data)
      subject.value=res.data.subject;
      let note = document.querySelector('#page_edit .note-editable')
      note.innerHTML=res.data.content
      cateVal.innerHTML=res.data.category;
      editBtn.innerHTML=`
      <button type="button" class="btn_cancel" onclick="checkState()">취소</button>
      <button type="button" class="btn_update" onclick="edit(${listNum})">등록</button>`
      hide();
      editPage.style.display="block";
    }
  });
}
const edit = function(listNum){
  subject=editPage.querySelector('#edit_subject');
  content=editPage.querySelector('.edit_content');
  let editWrite=axios({
    method:'POST',
    url:"http://localhost:3000/editPage",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      },
    data: {
      subject: subject.value,
      content: content.value,
      listNum
    }
  });
  editWrite.then(function(res){
    if(res.data==='complete'){
      detailPage(listNum);
    }else{
      alert("수정을 완료하지 못했습니다. 재시도 해주세요.")
    }
  });
}
// 아이디 등록.
const makeIdFunc = function(){
  let pw2=document.querySelector('input[name="password2"]').value;
  let pw3=document.querySelector('input[name="password3"]').value;
  let id2=document.querySelector('input[name="id2"]').value;
  let nick=document.querySelector('input[name="nickname"]').value;
  let email=document.querySelector('input[name="email"]').value;
  let pwPass,idPass,emailPass,nickPass;
  // 비번 조건 확인
  if(pw2===pw3 && pw2.length>7 && pw2.length<17){
    pwPass=true;
  }
  // 아이디 조건 확인
  if(id2.length>3 && id2.length<17) {
    idPass=true;
  }
  if(nick.length>2 && nick.length<11) {
    nickPass=true;
  }
  if(email.indexOf('@')!==-1) {
    emailPass=true;
  }
  
  // 비번 && 아이디 조건 충족시 가입 진행
  if(pwPass && idPass && nickPass && emailPass){
    let makeId = axios({
      method:'post',
      url:'http://localhost:3000/makeid',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        id2:id2,
        pw2:pw2,
        nick,
        email
      },
    });
    makeId.then(function(res){
      if(res.data ==="ok"){
        alert("회원가입이 완료되었습니다. 다시 로그인 해주세요");
        hide();
        loginPage.style.display='block';

      }else if(res.data ==="exist"){
        alert("이미 존재하는 아이디입니다.");
      }
    });
  }else{
    alert("만들 수 없는 아이디 입니다. 정보를 다시 확인해주세요.");
  }
}

// 검색
const searchKeyword = function(){
  let keyword = document.querySelector('#input_keyword').value;
  let searchReq = axios({
    method:'POST',
    url:'http://localhost:3000/pageList',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data:{keyword}
  })
  searchReq.then(function(res){
    listRender(res);
  });
  
}




