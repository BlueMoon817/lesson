const loginPage=document.querySelector('#page_login_content');
const signUpPage=document.querySelector('#page_signup_content');
const listPage=document.querySelector('#page_list');
const listViewPage=document.querySelector('#page_list_content');
const writePage=document.querySelector('#page_write');
const replyPage=document.querySelector('#page_reply');
let currUser='';
// page 배열
const pageArr=document.querySelectorAll("section>div");
// page on/off Func
const hide=function(){
  pageArr.forEach(item=>{
    item.style.display="none";
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
    console.log(typeof res.data)
    if(res.data.state === 'success'){
      alert("로그인 성공!");
      hide();
      listPage.style.display='block';
      currUser=document.querySelectorAll('.curruser');
      currUser.forEach(function(item){
        item.innerHTML=res.data.user;
        });
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
const pageList = function(){
  let goList = axios.get("http://localhost:3000/pageList");
  goList.then(function(res){
    if(res){
      hide();
      listPage.style.display='block';
    }
  })
}
const pageReply = function(){
  let goList = axios.get("http://localhost:3000/pageReply");
  goList.then(function(res){
    if(res){
      hide();
      replyPage.style.display='block';
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
      console.log(res.data)
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






