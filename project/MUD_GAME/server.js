let board = [];
let width = 35;
let height = 35;
class Stack {
    constructor() {
        this._arr = [];
    }
    push( data ) {
        this._arr.push( data );
    }
    pop() {
        return this._arr.pop();
    }
    length() {
        return this._arr.length;
    }
    peak() {
        return this._arr[this._arr.length-1];
    }
}
let map='', maze = [], subMap2='', roadIdx=[];
let createMaze=()=>{
  // 2) 모든 셀을 “방문하지 않음” 상태로 만든다.
  for(let y = 0; y < height; y += 1){
    board.push( [] );
    for(let x = 0; x < width; x += 1){
      board[y].push({visit: false, x, y} );
      }
  }
let s = new Stack();
// 3) 랜덤한 x,y좌표가 모두 홀수이면서 최외각이 아닌 셀을 랜덤으로 하나 선택하고, 그 셀을 “방문함” 상태로 만든다.
let posX, posY, base;
while(1){
  posX = Math.floor( Math.random() * width );
  posY = Math.floor( Math.random() * width );
  if( (posX % 2 === 1) && (posY % 2 === 1) && (posX >= 1) && (posX < width-1) && (posY >= 1) && (posY < width-1) ){
    board[posY][posX].visit = true;
    // 4) 그 셀을 스택(stack)에 넣는다.
    s.push( board[posY][posX] );
    break;
  }else{
    continue;
  }
}
let roadArr=[];
// 5) 스택에 데이터가 아무것도 없을때까지 반복
//5-1) 스택에서 셀을 하나 꺼낸다. 그 셀을 "기준 셀"이라 한다.
while(s.length()){
  base = s.pop();
  posX = base.x;
  posY = base.y;
  //5-2) 기준 셀로부터 상,하,좌,우중 [이동 가능한 방향]을 모두 나열한다.
  //[이동 가능한 방향]이란, 한 방향으로 첫번째칸과 두번째칸이 둘 다 a)“방문안함” 상태이고 b)미로의 최외곽선이 아닌 경우, 그 방향은 이동 가능한 방향이다.
  if( ( posX-2 > 0 ) && 
      ( board[posY][posX-1].visit === false ) && 
      ( board[posY][posX-2].visit === false ) ){
      roadArr.push('left');
  }
  if( ( posY-2 > 0 ) && 
      ( board[posY-1][(posX)].visit === false ) && 
      ( board[posY-2][posX].visit === false ) ){
      roadArr.push('top');
  }
  if( (posX+2 < width-1 ) && 
      ( board[posY][posX+1].visit === false ) && 
      ( board[posY][posX+2].visit === false ) ){
      roadArr.push('right');
  }
  if( (posY+2 < width-1 ) && 
      (board[posY+1][posX].visit === false) && 
      (board[posY+2][posX].visit === false) ){
      roadArr.push('bottom');
  }
  //5-3) 만일 [이동 가능한 방향]이 하나도 없으면 5번으로 돌아간다.
  if(roadArr.length===0){
    continue;
  }
  //5-4) 이동 가능한 방향중 한 방향을 무작위로 선택한다.
  let ran = Math.floor((Math.random() * roadArr.length));     
  //5-5) 선택된 방향으로 인접한 첫번째칸과 두번째칸을 “방문함” 상태로 만들고,
  if( roadArr[ran] === 'left' ){
    board[posY][posX-2].visit = true;
    board[posY][posX-1].visit = true;
    //5-6) 기준 셀을 스택에 넣고,
    s.push( board[posY][posX] );
    //5-7) 선택된 방향에 인접한 두번째칸을 스택에 넣고 5번으로 돌아간다.
    s.push( board[posY][posX-2] );
  }else if( roadArr[ran] === 'top' ){
    board[posY-2][posX].visit = true;
    board[posY-1][posX].visit = true;
    //5-6) 기준 셀을 스택에 넣고,
    s.push( board[posY][posX] );
    //5-7) 선택된 방향에 인접한 두번째칸을 스택에 넣고 5번으로 돌아간다.
    s.push( board[posY-2][posX] );
  }else if( roadArr[ran] === 'right' ){
    board[posY][posX+2].visit = true;
    board[posY][posX+1].visit = true;
    //5-6) 기준 셀을 스택에 넣고,
    s.push( board[posY][posX] );
    //5-7) 선택된 방향에 인접한 두번째칸을 스택에 넣고 5번으로 돌아간다.
    s.push( board[posY][posX+2] );
  }else if( roadArr[ran] === 'bottom' ){
    board[posY+2][posX].visit = true;
    board[posY+1][posX].visit = true;
    //5-6) 기준 셀을 스택에 넣고,
    s.push( board[posY][posX] );
    //5-7) 선택된 방향에 인접한 두번째칸을 스택에 넣고 5번으로 돌아간다.
    s.push( board[posY+2][posX] );
  }
    roadArr=[];
    // 5번으로 돌아가기
    continue; 
  }
}
// 미로 알고리즘만 실행하기
createMaze();
let count=0,ranPos,userX,userY;
// 출구 랜덤으로 만들기
let outDoor=[];
for( let y = 0; y < width; y += 1 ){
  for(let x=0; x < height; x+=1){
    // 벽이면서, 모서리에 생기지 않을 조건
    if(board[y][x].visit===false){
      if(((y===0&&x>0&&x<width)&&board[y+1][x].visit===true)||
      ((x===0&&y>0&&y<height)&&board[y][x+1].visit===true)||
      ((x===35&&y!==0)&&board[y][x-1].visit===true)||
      ((y===34&&x!==35&&x!==36)&&board[y-1][x].visit===true)){
        outDoor.push({x,y});
      }
    }
  }
}
// 출구 조건
let random =Math.floor(Math.random()*outDoor.length);
board[outDoor[random].y][outDoor[random].x].visit=true;
board[outDoor[random].y][outDoor[random].x].output='출구';

// 보물, 함정
let treasure =['shield','nothing','potion','power','potion','shield','nothing'];
let trap =['flare','nothing','hack','mine','nothing'];
let treasureArr=[],trapArr=[],posArr=[],digArr=[],wallArr=[], setR, setE;

// 이벤트 설치 함수
let setEventFunc=function(arr,num,what){
  for(let i=0;i<num;i+=1){
    // 좌표랜덤
    setR=Math.floor(Math.random()*posArr.length);
    //이벤트내용 랜덤으로 정하기
    setE=Math.floor(Math.random()*arr.length);
    //이벤트 배열에 정보 객체로 푸시
    arr.push({effectX:posArr[setR].x,effectY:posArr[setR].y,what:what[setE],setCount:0});
    //이벤트 좌표 표시
    board[posArr[setR].y][posArr[setR].x].what=true;
    //해당 좌표 설치 가능한 좌표에서 삭제(설치되었으므로)
    posArr.splice(setR,1);
  }
}

let setEffect=function(){
  // 벽 배열 만들기
  for( let y = 0; y < width; y += 1 ){
    for(let x=0; x < height; x+=1){
      if(board[y][x].visit === false && !(board[y][x].output==='출구')){
        wallArr.push({x,y});
        board[y][x].dig=false;
      }
    }
  }
  // 뚫리는 벽 셋팅
  for(let i=0; i<25;i+=1){
    setR=Math.floor(Math.random()*wallArr.length);
    board[wallArr[setR].y][wallArr[setR].x].dig=true;
    digArr.push({effectY:wallArr[setR].y,effectX:wallArr[setR].x,setCount:0})
    wallArr.splice(setR,1);
  }
  // 함정설정 된 곳 제외하고 설정 가능한 좌표 배열 만들기
  for( let y = 0; y < width; y += 1 ){
    for(let x=0; x < height; x+=1){
      if(!(board[y][x].output==='출구')&&(board[y][x].dig!==true)){
        posArr.push({x,y});
      }
    }
  }
  // 보물 설치 30개
  setEventFunc(treasureArr,30,treasure);
  // 함정 설치 20개
  setEventFunc(trapArr,20,trap);
}

// 플레이어 랜덤 배치 좌표구하기
let posR=function(){
  roadIdx=[];
  for( let y = 0; y < width; y += 1 ){
    for(let x=0; x < height; x+=1){
      if( board[y][x].visit === true && !(board[y][x].output==='출구') && !(board[y][x].treasure===true) && !(board[y][x].trap===true)){
        roadIdx.push({x,y});
      }
    }
  }
  ranPos = Math.floor(Math.random()*roadIdx.length);
  userY=roadIdx[ranPos].y;
  userX=roadIdx[ranPos].x;
}

// 초기 맵 출력
let draw=()=>{
  for( let y = 0; y < width; y += 1 ){
    maze.push([]);
    for(let x=0; x < height; x+=1){
      if(board[y][x].visit === true && board[y][x].output==='출구'){
        // 출구만들기
        maze[y][x]='&';
      }else if( board[y][x].visit === true && !(board[y][x].output==='출구') && !(y===userY && x===userX) && isNaN(parseInt(maze[y][x]))){
        // 길 만들기
        maze[y][x]='.';
      }else if(board[y][x].visit === false){
        // 벽 만들기
        maze[y][x]='#';
      }else if(y===userY && x===userX && board[y][x].visit === true){
        maze[y][x]=`${count}`;
      }
    }
    map+=maze[y].toString().replace(/,/g,'')+`\n`;
  }
  map=Buffer.from(map);
}
let up = Buffer.from('w');   //북
let down = Buffer.from('s'); //남
let right = Buffer.from('d');//동
let left = Buffer.from('a'); //서
let attackN = Buffer.from('tw');// 북쪽 공격
let attackS = Buffer.from('ts');// 남쪽 공격
let attackD = Buffer.from('td');// 동쪽 공격
let attackA = Buffer.from('ta');// 서쪽 공격
let road = '.',door = '&', wall = '#', player='@';
let net=require("net");
let players=[],subMap = [], multi=[];
setEffect();
let server = net.createServer(function(socket){
  //플레이어 입장하면 배치실행
  posR();
  draw();
  console.log(treasureArr,trapArr,digArr);
  // 맵 출력
  console.log(map.toString());
  players.push(socket);
  socket.userX=userX;
  socket.userY=userY;
  socket.mark=count;
  socket.hp=100;
  socket.damage=10;
  socket.shield=1;
  for(let q=0;q<players.length;q+=1){
    players[q].write(`플레이어${count} 이/가 입장하였습니다. 현재 총 ${players.length}명이 게임에 참여중\n`);
  }
  console.log(`플레이어${count} 이/가 입장하였습니다. 현재 총 ${players.length}명이 게임에 참여중`);
  socket.write(`[조작하는 방법]
              이동방향 - 동:d, 서:a, 남:s, 북:w 
              공격 - tw(북쪽 공격), ta(서쪽공격), td(동쪽공격), ts(남쪽공격) 
              - 길을 다니면 랜덤으로 보물이나, 함정에 걸림. 
              - 벽을 때리면 랜덤으로 보물이나 함정이나 벽이 뚫리는 이벤트가 있음.
              - 플레이어끼리 서로 공격 가능. 
              그럼..화이팅!!\n`);
  //길을 지날 때 이벤트 발견하는 함수(이동 명령시 실행)
  let roadEvent=function(userY,userX){
    for(let s=0;s<treasureArr.length;s+=1){
      if(userY === treasureArr[s].effectY && userX===treasureArr[s].effectX){
        if(treasureArr[s].what==='shield'){
          socket.shield+=2;
          socket.write(`앗! 방어구를 주웠다!! 방어력 2 상승!! 현재 방어력 : ${socket.shield}\n`);
          treasureArr.splice(s,1);
        }else if(treasureArr[s].what==='potion'){
          socket.hp+=20;
          socket.write(`앗! 체력포션을 주웠다!! 체력 20 상승!! 현재 체력 : ${socket.hp}\n`);
          treasureArr.splice(s,1);
        }else if(treasureArr[s].what==='nothing'){
          socket.write(`뭔가 있는것 같은데..?.....아..아무것도 없네..헛것이..\n`);
        }else if(treasureArr[s].what==='power'){
          socket.damage+=15;
          socket.write(`무기를 주웠다!! 공격력 15 상승!! 현재 공격력: ${socket.damage}\n`);
          treasureArr.splice(s,1);    
        }
      }
    }
    for(let s=0;s<trapArr.length;s+=1){
      if(userY===trapArr[s].effectY && userX===trapArr[s].effectX){
        if(trapArr[s]==='flare'){
          socket.hp-=(30-socket.shield);
          socket.write(`으악!! 불꽃이 떨어진다!! 데미지 -${30-socket.shield} 현재 체력 : ${socket.hp}\n`);
          trapArr.splice(s,1);      
        }else if(trapArr[s].what==='nothing'){
          socket.write(`으악??? 아... 아무것도 아니네... 머쓱..\n`);
        }else if(trapArr[s].what==='hack'){
          socket.hp-=(40-socket.shield);
          socket.write(`퍼어어어어어엉ㅇㅇㅇ!!! ...핵을 맞았다...^^* 데미지 -${40-socket.shield} 현재 체력 : ${socket.hp}\n`);
          trapArr.splice(s,1);
        }else if(trapArr[s].what==='mine'){
          socket.hp-=(15-socket.shield);
          socket.write(`퍼어어엉...지뢰를 밟았다.. 데미지 -${15-socket.shield} 현재 체력 : ${socket.hp}\n`);
          trapArr.splice(s,1);      
        }
      }
      if(socket.hp<=0){
        socket.write(`현재 체력 : ${socket.hp} 체력이 다 닳아서 죽었습니다..ㅠㅠ 안녕히..\n`);
      }
    }
  }
  // 벽에 있는 이벤트 함수(공격 명령 했을 때 실행)
  let wallEvent=function(userY,userX){
    for(let s=0;s<treasureArr.length;s+=1){
      if(userY === treasureArr[s].effectY && userX===treasureArr[s].effectX){
        if(treasureArr[s].what==='shield'){
          treasureArr[s].setCount+=1;
          if(treasureArr[s].setCount===1){
            socket.write(`뭔가 있는거 같은데..??? 한번 더 때려보자!!\n`);
          }else if(treasureArr[s].setCount===2){
            socket.shield+=4;
            socket.write(`방패를 얻었다!! 방어력 +4  현재 방어력 : ${socket.shield}\n `);
            treasureArr[s].setCount=0;
          }
        }else if(treasureArr[s].what==='potion'){
          treasureArr[s].setCount+=1;
          if(treasureArr[s].setCount===1){
            socket.write(`뭔가 있는거 같은데..??? 한번 더 때려보자!!\n`);
          }else if(treasureArr[s].setCount===2){
            socket.hp+=35;
            socket.write(`체력포션을 얻었다!! 체력 35 상승!! 현재 체력 : ${socket.hp}\n`);
            treasureArr[s].setCount=0;
          }
        }else if(treasureArr[s].what==='nothing'){
          treasureArr[s].setCount+=1;
          if(treasureArr[s].setCount===1){
            socket.write(`뭔가 있는거 같은데..??? 한번 더 때려보자!!\n`);
          }else if(treasureArr[s].setCount===2){
            socket.write(`없네... 쩝..\n`);
            treasureArr[s].setCount=0;
          }
        }else if(treasureArr[s].what==='power'){
          treasureArr[s].setCount+=1;
          if(treasureArr[s].setCount===1){
            socket.write(`뭔가 있는거 같은데..??? 한번 더 때려보자!!\n`);
         }else if(treasureArr[s].setCount===2){
            socket.damage+=22;
            socket.write(`무기를 주웠다!! 공격력 22 상승!! 현재 공격력 : ${socket.damage}\n`);
            treasureArr[s].setCount=0;
          }      
        }
      }
    }
    for(let s=0;s<trapArr.length;s+=1){
      if(userY===trapArr[s].effectY && userX===trapArr[s].effectX){
        if(trapArr[s].what==='flare'){
          trapArr[s].setCount+=1;
          if(trapArr[s].setCount===1){
            socket.write(`뭔가 있는거 같은데..??? 한번 더 때려보자!!\n`);
          }else if(trapArr[s].setCount===2){
            socket.hp-=(20-socket.shield);
            socket.write(`불기둥이 솟는다!! 데미지 -${20-socket.shield} 현재 체력 : ${socket.hp}\n`);
            trapArr[s].setCount=0;
          }  
        }else if(trapArr[s].what==='nothing'){
          trapArr[s].setCount+=1;
          if(trapArr[s].setCount===1){
            socket.write(`뭔가 있는거 같은데..??? 한번 더 때려보자!!\n`);
          }else if(trapArr[s].setCount===2){
            socket.write(`으악??? 아... 아무것도 아니네... 머쓱..\n`);
            trapArr[s].setCount=0;
          } 
        }else if(trapArr[s].what==='hack'){
          trapArr[s].setCount+=1;
          if(trapArr[s].setCount===1){
            socket.write(`뭔가 있는거 같은데..??? 한번 더 때려보자!!\n`);
          }else if(trapArr[s].setCount===2){
            socket.hp-=(40-socket.shield);
            socket.write(`퍼어어어어어엉ㅇㅇㅇ!!! ...핵이 터졌다....^^* 데미지 -${40-socket.shield} 현재 체력 : ${socket.hp}\n`);
            trapArr[s].setCount=0;
          } 
        }else if(trapArr[s].what==='mine'){
          trapArr[s].setCount+=1;
          if(trapArr[s].setCount===1){
            socket.write(`뭔가 있는거 같은데..??? 한번 더 때려보자!!\n`);
          }else if(trapArr[s].setCount===2){
            socket.hp-=(15-socket.shield);
            socket.write(`퍼어어엉...지뢰를 터뜨렸다.... 데미지 -${15-socket.shield} 현재 체력 : ${socket.hp}\n`);
            trapArr[s].setCount=0;
          } 
        }
      }
      if(socket.hp<=0){
        socket.write(`현재 체력 : ${socket.hp} 체력이 다 닳아서 죽었습니다..ㅠㅠ 안녕히..\n`);
      }
    }
    for(let s=0;s<digArr.length;s+=1){
      if(userY===digArr[s].effectY && userX===digArr[s].effectX){
        digArr[s].setCount+=1;
        if(digArr[s].setCount===1){
          socket.write(`벽이 약해 보이는데..?? 한번 더 쳐볼까??\n`);
        }else if(digArr[s].setCount===2){
          socket.write(`오?!! 벽이 뚫렸다!!!\n`);
          maze[userY][userX]=road;
          map[userY*36+userX]=Buffer.from(road);
          digArr.splice(s,1);
          digArr[s].setCount=0;
        }  
      }
    }
  }
  //7x7 맵 출력 알고리즘
  let outputFunc=function(me){
    for(let i=0; i<=6; i+=1){
      // 가장 끝부분(모서리)
      if(userY <= 3 && userX <= 3){
        subMap[i] = maze[i].slice(0, 7);
      }else if(userY > 31 && userX > 31){
        subMap[i] = maze[(height-1)-(6-i)].slice(width-7, width+1);
      }else if(userY <= 3 && userX > 31){
        subMap[i] = maze[i].slice(width-7, width+1);
      }else if(userY > 31 && userX <= 3){
        subMap[i] = maze[(height-1)-(6-i)].slice(0, 7);
      }
      //가장자리 
      else if(userY > 3 && userX <= 3 && userY <= 31){
        subMap[i] = maze[userY+(-3+i)].slice(0,7);
      }
      else if(userY <= 3 && userX > 3 && userX <= 31){
        subMap[i] = maze[i].slice(userX-3, userX+4);
      }
      else if(userY > 31 && userX <= 31 && userX > 3){
        subMap[i] = maze[(height-1)-(6-i)].slice(userX-3, userX+4);
      }
      else if(userY <= 31 && userX > 31 && userY > 3){
        subMap[i] = maze[userY+(-3+i)].slice(width-7, width+1);
      }
      //중앙
      else if(userY > 3 && userX > 3 && userY <= 31 && userX <= 31){
        subMap[i] = maze[userY+(-3+i)].slice(userX-3, userX+4);
      }
      // 조립
      subMap2+=subMap[i].toString().replace(/,/g,'').replace(me,'@')+`\n`;
    }
      subMap2=Buffer.from(subMap2).toString();
  }

  let multiOutput= function(arr,idx){
    subMap2 = '';
    userX=arr[idx].userX;
    userY=arr[idx].userY;
    outputFunc(arr[idx].mark);
    arr[idx].write(subMap2);
  }
  
  let outputMap=function(){
    subMap2 = '';
    userX=socket.userX;
    userY=socket.userY;
    outputFunc(socket.mark);
    socket.write(subMap2);
    for(let w=0;w<players.length;w+=1){
      if(players[w].mark!==socket.mark&&subMap2.indexOf(players[w].mark)!==-1){
        multiOutput(players,w);
        multi.push(players[w]);
      }
    }
    for(let t=0;t<multi.length;t+=1){
      if(multi[t].mark!==socket.mark&&subMap2.indexOf(multi[t].mark)===-1){
        multiOutput(multi,t);
        multi.splice(t,1);
      }
    }
  }
  outputMap();
  socket.on("data", function(buf){
      userX=socket.userX;
      userY=socket.userY;
      if(buf.indexOf(up) !== -1 && 
      ((buf.indexOf(Buffer.from([10]))!==-1&&buf.length===2)||(buf.indexOf(Buffer.from([13]))!==-1&&buf.length===3))
      ){
        if((maze[userY-1][userX] === road) && userY-1 > 0){
          if(userY <= 35) { map[(userY *36) +userX] = 46 }
          maze[userY][userX] = road;
          maze[userY-1][userX] = socket.mark;
          map[((userY-1)*36)+userX] = Buffer.from([socket.mark]).toString();
          socket.userX=userX;
          socket.userY=userY-1;
          roadEvent(socket.userY,socket.userX);
          outputMap();
          console.log(socket.userX,socket.userY);
        }else if(maze[userY-1][userX] === door){
          map[((userY)*36)+userX]=46;
          maze[userY][userX]=road;
          socket.write(`미로 클리어~!! 곧 퇴장됩니다!!\n`);
        }
      }else if(buf.indexOf(down) !== -1 && 
      ((buf.indexOf(Buffer.from([10]))!==-1&&buf.length===2)||(buf.indexOf(Buffer.from([13]))!==-1&&buf.length===3))
      ){
        if((maze[userY+1][userX] === road) && userY+1 <= 34){
          if(userY >= 1) { map[(userY * 36) + userX] = 46 }
          maze[userY][userX] = road;
          maze[userY+1][userX] = socket.mark;
          map[((userY+1)*36)+userX] = Buffer.from([socket.mark]).toString();
          socket.userX=userX;
          socket.userY=userY+1;
          roadEvent(socket.userY,socket.userX);
          outputMap();
          console.log(socket.userX,socket.userY);
        }else if(maze[userY+1][userX] === door){
          map[((userY)*36)+userX]=46;
          maze[userY][userX]=road;
          socket.write(`미로 클리어~!! 곧 퇴장됩니다!!\n`);
        }
      }else if(buf.indexOf(right) !== -1 && 
      ((buf.indexOf(Buffer.from([10]))!==-1&&buf.length===2)||(buf.indexOf(Buffer.from([13]))!==-1&&buf.length===3))
      ){
        if((maze[userY][userX + 1] === road) && userX + 1 <= 34){
          if(userX >= 1) { map[(userY * 36) + userX] = 46 }
          maze[userY][userX] = road;
          maze[userY][userX+1] = socket.mark;
          map[(userY * 36) + userX+1] = Buffer.from([socket.mark]).toString();
          socket.userX=userX+1;
          socket.userY=userY;
          roadEvent(socket.userY,socket.userX);
          outputMap(); 
          console.log(socket.userX,socket.userY);
        }else if(maze[userY][userX+1] === door){
          map[(userY*36)+userX]=46;
          maze[userY][userX]=road;
          socket.write(`미로 클리어~!! 곧 퇴장됩니다!!\n`);
        }
      }else if((buf.indexOf(left) !== -1 && 
      ((buf.indexOf(Buffer.from([10]))!==-1&&buf.length===2)||(buf.indexOf(Buffer.from([13]))!==-1&&buf.length===3)))
      ){
        if((maze[userY][userX-1] === road)&& userX-1 >= 1){
          if(userX <= 35) { map[(userY * 36) + userX] = 46 }
          maze[userY][userX] = road;
          maze[userY][userX-1] = socket.mark;
          map[(userY*36)+userX-1] = Buffer.from([socket.mark]).toString();
          socket.userX=userX-1;
          socket.userY=userY;
          roadEvent(socket.userY,socket.userX);
          outputMap();
          console.log(socket.userX,socket.userY);
        }else if(maze[userY][userX-1] === door){
          map[(userY*36)+userX]=46;
          maze[userY][userX]=road;
          socket.write(`미로 클리어~!! 곧 퇴장됩니다!!\n`);
        }
      }else if((buf.indexOf(attackN) !== -1 && 
      ((buf.indexOf(Buffer.from([10]))!==-1&&buf.length===3)||(buf.indexOf(Buffer.from([13]))!==-1&&buf.length===4)))
      ){
        if(maze[socket.userY-1][socket.userX] === wall ){
          wallEvent(socket.userY-1,socket.userX);
        }else{
          for(let r=0;r<players.length;r+=1){
            if(players[r].mark!==socket.mark&& players[r].userX===userX&&players[r].userY===userY-1){
              socket.write(`플레이어${players[r].mark}을 공격했다!! 데미지 ${socket.damage-players[r].shield}을/를 주었다\n`);
              players[r].write(`플레이어${socket.mark}에게 공격당했다!! 데미지 ${-10+players[r].shield} 남은체력: ${players[r].hp-=(socket.damage-players[r].shield)}!!\n`);
              if(players[r].hp<=0){
                players[r].write(`현재 체력 : ${socket.hp} 체력이 다 닳아서 죽었습니다..ㅠㅠ 안녕히..\n`);
              }
            }
            
          }
        }
      }else if((buf.indexOf(attackS) !== -1 && 
      ((buf.indexOf(Buffer.from([10]))!==-1&&buf.length===3)||(buf.indexOf(Buffer.from([13]))!==-1&&buf.length===4)))
      ){
        if(maze[socket.userY+1][socket.userX] === wall ){
          wallEvent(socket.userY+1,socket.userX);
        }else{
          for(let r=0;r<players.length;r+=1){
            if(players[r].mark!==socket.mark&& players[r].userX===userX&&players[r].userY===userY+1){
              socket.write(`플레이어${players[r].mark}을 공격했다!! 데미지 ${socket.damage-players[r].shield}을/를 주었다\n`);
              players[r].write(`플레이어${socket.mark}에게 공격당했다!! 데미지 ${-10+players[r].shield} 남은체력: ${players[r].hp-=(socket.damage-players[r].shield)}!!\n`);
              if(players[r].hp<=0){
                players[r].write(`현재 체력 : ${socket.hp} 체력이 다 닳아서 죽었습니다..ㅠㅠ 안녕히..\n`);
              }
            }
          }
        }
      }else if((buf.indexOf(attackA) !== -1 && 
      ((buf.indexOf(Buffer.from([10]))!==-1&&buf.length===3)||(buf.indexOf(Buffer.from([13]))!==-1&&buf.length===4)))
      ){
        
        if(maze[socket.userY][socket.userX-1] === wall ){
          wallEvent(socket.userY,socket.userX-1);
        }else{
          for(let r=0;r<players.length;r+=1){
            if(players[r].mark!==socket.mark&& players[r].userX===userX-1&&players[r].userY===userY){
              socket.write(`플레이어${players[r].mark}을 공격했다!! 데미지 ${socket.damage-players[r].shield}을/를 주었다\n`);
              players[r].write(`플레이어${socket.mark}에게 공격당했다!! 데미지 ${-10+players[r].shield} 남은체력: ${players[r].hp-=(socket.damage-players[r].shield)}!!\n`);
              if(players[r].hp<=0){
                players[r].write(`현재 체력 : ${socket.hp} 체력이 다 닳아서 죽었습니다..ㅠㅠ 안녕히..\n`);
              }
            }            
          }
        }
      }else if((buf.indexOf(attackD) !== -1 && 
      ((buf.indexOf(Buffer.from([10]))!==-1&&buf.length===3)||(buf.indexOf(Buffer.from([13]))!==-1&&buf.length===4)))
      ){
        if(maze[socket.userY][socket.userX+1] === wall ){
          wallEvent(socket.userY,socket.userX+1);
        }else{
          for(let r=0;r<players.length;r+=1){
            if(players[r].mark!==socket.mark&& players[r].userX===userX+1&&players[r].userY===userY){
              socket.write(`플레이어${players[r].mark}을 공격했다!! 데미지 ${socket.damage-players[r].shield}을/를 주었다\n`);
              players[r].write(`플레이어${socket.mark}에게 공격당했다!! 데미지 ${-10+players[r].shield} 남은체력: ${players[r].hp-=(socket.damage-players[r].shield)}!!\n`);
              if(players[r].hp<=0){
                players[r].write(`현재 체력 : ${socket.hp} 체력이 다 닳아서 죽었습니다..ㅠㅠ 안녕히..\n`);
              }
            }            
          }
        }
      }
  });
  count+=1
  //상대방으로부터 채팅메시지가 수신되면 콘솔에 출력한다.
  socket.on("data", function(buf){
    process.stdout.write(buf);
    let idx;
    if(buf.indexOf(`미로를 탈출하였습니다~!`)!==-1){
      idx = players.indexOf(socket);
      for(let q=0;q<players.length;q+=1){
        if(idx!==q){
          players[idx].write(`${players[idx].mark}번 플레이어가 미로를 탈출하였습니다~! 남은 인원 ${players.length-1}명\n`);
        }
      }
      console.log(`${players[idx].mark}번 플레이어가 미로를 탈출하였습니다~! 남은 인원 ${players.length-1}명`);
    }else if(buf.indexOf(`bye..`)!==-1){
      idx = players.indexOf(socket);
      for(let q=0;q<players.length;q+=1){
        if(idx!==q){
          players[idx].write(`${players[idx].mark}번 플레이어가 죽었습니다!! 남은 인원 ${players.length-1}명\n`);
        }
      }
      console.log(`${players[idx].mark}번 플레이어가 죽었습니다!! 남은 인원 ${players.length-1}명`);
    }
    
  });
  // 상대방과 연결이 끊어졌을 때의 처리
  socket.on("error",function(){
    let idx = players.indexOf(socket);
    if(idx!==-1){
      map[(userY*36)+userX]=46;
      maze[userY][userX]=road;
      for(let q=0;q<players.length;q+=1){
        players[q].write(`${players[idx].mark}번 플레이어가 나갔습니다. 현재 총 ${players.length}명이 게임에 참여중\n`);
      }
      console.log(`${players[idx].mark}번 플레이어가 나갔습니다. 현재 총 ${players.length}명이 게임에 참여중`);
      players.splice(idx, 1);
    }
  });
  socket.on("close",function(){
    let idx = players.indexOf(socket);
    if(idx!==-1){
      map[(userY*36)+userX]=46;
      maze[userY][userX]=road;
      for(let q=0;q<players.length;q+=1){
        players[q].write(`${players[idx].mark}번 플레이어가 나갔습니다. 현재 총 ${players.length}명이 게임에 참여중\n`);
      }
      console.log(`${players[idx].mark}번 플레이어가 나갔습니다. 현재 총 ${players.length}명이 게임에 참여중`);
      players.splice(idx, 1);
    } 
  });
});

// 사용할 서버의 포트번호 선언
server.listen(8080);
console.log("연결 대기중");