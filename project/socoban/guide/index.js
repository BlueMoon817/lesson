/*
  소코반 게임의 스테이지 3개를 만들어오세요.
  한 스테이지씩 진행.
  현재 스테이지를 초기화하고 처음으로 되돌아가서 다시 도전하는 기능.
*/
let inner=document.querySelector('.inner');
let maxWidth=inner.clientWidth;
let maxHeight=inner.clientHeight;
let cat=document.querySelector('.cat');
let catTop=cat.offsetTop;
let catLeft=cat.offsetLeft;
let blockLeftArr,blockTopArr, wallLeftArr, wallTopArr,block,goal,goal1,goal2,goal3,goal4,goal5,goal6,goal7,wall1,wall2,wall3,wall4,wall6,wall7,wall8,wall9,wall10,wall11,wall12,block1,block2,block3,block4,block5,block6,block7,count=0;
let btnReplay=document.querySelector('.replay');
let nextStage=document.querySelector('.next_stage');
let blockLeft1,blockLeft2,blockLeft3,blockLeft4,blockLeft5,blockLeft6,blockLeft7;
let blockTop1,blockTop2,blockTop3,blockTop4,blockTop5,blockTop6,blockTop7;
let isMovingB=false,isMovingT=false,isMovingR=false,isMovingL=false;
let wall1_x,wall1_y,wall2_x,wall2_y,wall3_x,wall3_y,wall4_x, wall4_y,wall5_x,wall5_y,wall_x,wall6_y,wall7_x,wall7_y,wall8_x,wall8_y,wall9_x,wall9_y,wall10_x,wall10_y,wall11_x,wall11_y,wall12_x,wall12_y;
// 초기화 함수
function init(catLeftP,catTopP,blockLeft_P1,blockLeft_P2,blockLeft_P3,blockLeft_P4,blockLeft_P5,blockLeft_P6,blockLeft_P7,blockTop_P1,blockTop_P2,blockTop_P3,blockTop_P4,blockTop_P5,blockTop_P6,blockTop_P7){
  let blockLeftGroup=[blockLeft_P1,blockLeft_P2,blockLeft_P3,blockLeft_P4,blockLeft_P5,blockLeft_P6,blockLeft_P7];
  let blockTopGroup=[blockTop_P1,blockTop_P2,blockTop_P3,blockTop_P4,blockTop_P5,blockTop_P6,blockTop_P7];
  cat.style.left=catLeftP;
  cat.style.top=catTopP;
  catLeft=parseInt(cat.style.left.replace('px',''));
  catTop=parseInt(cat.style.top.replace('px',''));
  for(let i=0;i<block.length;i+=1){
    if(block[i]!==undefined){
      block[i].classList.remove('is_active');
      block[i].style.left=blockLeftGroup[i];
      block[i].style.top=blockTopGroup[i];
      blockLeftArr[i]=parseInt(block[i].style.left.replace('px',''));
      blockTopArr[i]=parseInt(block[i].style.top.replace('px',''));
    }
  }
}
function leftOnce(){
  cat.style.left=(catLeft-50)+'px';
  catLeft=parseInt(cat.style.left.replace('px',''));
}
function rightOnce(){
  cat.style.left=(catLeft+50)+'px';
  catLeft=parseInt(cat.style.left.replace('px',''));
}
function topOnce(){
  cat.style.top=(catTop-50)+'px';
  catTop=parseInt(cat.style.top.replace('px',''));
}
function bottomOnce(){
  cat.style.top=(catTop+50)+'px';
  catTop=parseInt(cat.style.top.replace('px',''));
}
function nextStageFunc(stage,set,grade){
  for(let i=0;i<block.length;i+=1){
    if(block[i]!==undefined){
      if(!(block[i].classList.contains('is_active'))===false){
        count+=1;
        if(count=set){
          nextStage.classList.add('is_active');
          nextStage.setAttribute('href',stage,grade);
          count=0;
        }
      }else{
        nextStage.setAttribute('href','#');
        nextStage.classList.remove('is_active');
        if(count>0){
          count-=1;
        }
      }
    }
    
  }
}
