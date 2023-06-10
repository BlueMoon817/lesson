const loginPage=document.querySelector('#page_login_content');
const signUpPage=document.querySelector('#page_signup_content');
const listPage=document.querySelector('#page_list');
const listViewPage=document.querySelector('#page_list_content');
const writePage=document.querySelector('#page_write');
const replyPage=document.querySelector('#page_reply');
const currListNum=document.querySelector('.board_guide');
const listWrap = document.querySelector('#board_list');
const pagination=document.querySelector('.pagination');
let currUser='';
// page 배열
const pageArr=document.querySelectorAll("section>div");
// page on/off Func
const hide=function(){
  pageArr.forEach(item=>{
    item.style.display="none";
  });
}
const pageList = function(page){

  let goList = axios({ 
    method:"POST",
    url: "http://localhost:3000/pageList",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: { pageNum: page }
  });
  goList.then(function(res){
    console.log(res.data)
    console.log(res.data[0].length)
    // 등록된 글이 없을 때 처리
    if(res.data[0].length===0) {
      currListNum.style.display="block";
      return;
    }else{ currListNum.style.display="none"; }
    // 목록 렌더링
    let insertList="", btnInsert="";
    for( let i=0;i<res.data[0].length; i+=1 ){
      insertList+=`<tr class="list_items">
      <td class="list_cate">${res.data[0][i].category}</td>
      <td><button type="button" class="list_subject">${res.data[0][i].subject}</button></td>
      <td class="list_writer">${res.data[0][i].nickname}</td>
      <td class="list_date">${res.data[0][i].date}</td>
      <td class="list_count">${res.data[0][i].hit}</td>
      </tr>`
    }
    btnInsert=`<button type="button" class="page_prev" onclick="prev()">&nbsp;<<&nbsp;</button>`
    for(let btn=res.data[1].firstPage;btn<=res.data[1].lastPage;btn+=1){
      if(btn===res.data[1].currPage){
        btnInsert+=`<button type="button" class="btn_page is_act" onclick="pageList(${btn})">${btn}</button>`;
      }else{
        btnInsert+=`<button type="button" class="btn_page" onclick="pageList(${btn})">${btn}</button>`;
      }
    }
    btnInsert+=`<button type="button" class="page_next" onclick="next()">&nbsp;>>&nbsp;</button>`
    listWrap.innerHTML=insertList;
    pagination.innerHTML=btnInsert;
    hide();
    listPage.style.display='block';
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
      currUser=document.querySelectorAll('.curruser');
      hide();
      listPage.style.display='block';
      currUser.forEach(function(item){
        item.innerHTML=res.data.user;
      });
      alert("로그인 성공!");
      return pageList(1);
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
const backLogin = function(){
  let backpagelogin = axios.get("http://localhost:3000/backLogin");
  backpagelogin.then(function(res){
    if(res){
      hide();
      loginPage.style.display='block';
    }
  })
}
const pageWrite = function(){
  let goWrite = axios.get("http://localhost:3000/pageWrite");
  goWrite.then(function(res){
    if(res){
      hide();
      writePage.style.display='block';
    }
  })
}
const prev = function(btn){
  console.log(btn);
}
const next = function(btn){
  console.log(btn);
}

const pageReply = function(){
  let replyList = axios.get("http://localhost:3000/pageReply");
  replyList.then(function(res){
    if(res){
      hide();
      replyPage.style.display='block';
    }
  })
}
const boardList=document.querySelector('#board_list');

const updateList = function(){
  let listCate=writePage.querySelector('.data_cate');
  let subject=writePage.querySelector('#input_subject');
  let content=writePage.querySelector('.input_content');
  let updatePage = axios.get("http://localhost:3000/checkUser");
  updatePage.then(function(res){
    if(res.data==='ok'){
      console.log("등록후에 체크완료");
      let user = document.querySelector('.curruser').innerHTML
      let upload= axios({
        method:"POST",
        url:"http://localhost:3000/pageUpdate",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          category: listCate.value,
          subject: subject.value,
          content: content.value,
          writer: user
       }
      })
      upload.then(function(res){
        console.log(res.data)
        if(res.data==="complete"){
          pageList(1);
        }
      });
    }else{
      alert("잘못된 접근입니다.")
    }
  })
  
}
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






