// 1) width, height가 둘 다 홀수인 2차원 배열을 준비한다.
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
let map = [], maze = [];
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
    //6) (x=1,y=0) 좌표를 방문함 상태로 만들고 입구로 사용한다. 
    board[0][1].visit = true;
    board[0][1].input = '입구'
    //(x=width-2, y=height-1) 좌표를 방문함 상태로 만들고 출구로 사용한다.
    board[width-1][width-2].visit = true;
    board[width-1][width-2].output = '출구';
    let cell = Buffer.alloc(1);
    let draw=()=>{
        for( let y = 0; y < width; y += 1 ){
            maze.push([]);
            for(let x=0; x < height; x+=1){
                maze[y].push( [cell] );
                if( board[y][x].visit === true ){
                    board[y][x].player === false;
                    if( board[y][x].output === '출구' ){
                        maze[y][x]=Buffer.from( '&' );
                    }else if( board[y][x].input === '입구' ){
                        maze[y][x] = Buffer.from( '&' );
                    }else if( y === 1 && x === 1 ){
                        maze[1][1] = Buffer.from( '@' );
                    }else{
                        maze[y][x] = Buffer.from( '.' );
                    }
                }
                else if(board[y][x].visit === false){
                    maze[y][x] = Buffer.from('#');
                }
            }
            // 정규표현식 모든 , 를 찾아서 공백으로 바꾸기
            // map표시 (엔터처리 필요) 36바이트 (\n 추가로인한)
            map+=`${maze[y].toString().replace(/,/g,Buffer.from(''))}\n`;
        }
        map=Buffer.from(map);
    }
    draw();
}

// 첫 미로 생성
createMaze();

// 입력받을 명령어들
let end = Buffer.from([235, 129, 157]).toString();   // 끝
let up = Buffer.from([235, 182, 129]).toString();    // 북
let down = Buffer.from([235, 130, 168]).toString();  // 남
let right = Buffer.from([235, 143, 153]).toString(); // 동
let left = Buffer.from([236, 132, 156]).toString();  // 서
// 요소들
let player = Buffer.from([64]).toString();
let road = Buffer.from([46]).toString();
let door = Buffer.from([38]).toString();
let playerX = 1, playerY = 1, subMap2 = '', currPos, subMap = [];
// let wall = Buffer.from([35]).toString();
// 전체맵 출력 process.stdout.write(map.toString())
//보여질 맵 7x7 출력 함수
let outputMap=function(){
    currPos = map.indexOf(player);
    playerY = Math.floor(currPos/36);
    playerX = currPos-(playerY*36);
    // 초기화
    subMap2 = '';
    for(let i =- 3; i <= 3; i += 1){
        // 가장 끝부분(모서리)
        if(playerY <= 3 && playerX <= 3){
            subMap[i+3] = Buffer.from(map.subarray((i+3)*36 , (i+3)*36+7));
        }else if(playerY > 31 && playerX > 31){
            subMap[i+3] = Buffer.from(map.subarray((height+(i-3))*36+(width-7), (height+(i-3))*36+width));
        }else if(playerY <= 3 && playerX > 31){
            subMap[i+3] = Buffer.from(map.subarray((i+3)*36+(width-7), (i+3)*36+width));
        }else if(playerY > 31 && playerX <= 3){
          subMap[i+3] = Buffer.from(map.subarray((height+(i-4))*36, (height+(i-4))*36+7));
        }
        //가장자리 
        else if(playerY > 3 && playerX <= 3 && playerY <= 31){
            subMap[i+3] = Buffer.from(map.subarray(((i+playerY)*36),((i+playerY)*36)+7));
        }
        else if(playerY <= 3 && playerX > 3 && playerX <= 31){
            subMap[i+3] = Buffer.from(map.subarray(((i+3)*36+playerX-3),((i+3)*36)+playerX+4));
        }
        else if(playerY > 31 && playerX <= 31 && playerX > 3){
            subMap[i+3] = Buffer.from(map.subarray((height+(i-3))*36+playerX-3, (height+(i-3))*36+playerX+4));
        }
        else if(playerY <= 31 && playerX > 31 && playerY > 3){
            subMap[i+3] = Buffer.from(map.subarray((playerY+i)*36+(width-7), (playerY+i)*36+width));
        }
        // //중앙
        else if(playerY > 3 && playerX > 3 && playerY <= 31 && playerX <= 31){
            subMap[i+3] = Buffer.from(map.subarray(((i+playerY)*36+playerX-3),((i+playerY)*36)+playerX+4));
        }
        // 조립
        subMap2 += Buffer.from(subMap[i+3].toString().replace( /,/g ,Buffer.from('')) + `\n`);
    }
    //출력
    console.log(subMap2.toString().trim());
    // console.log(subMap2.length)
}
outputMap();
let fs = require('fs');
process.stdin.on('data',function(buf){
    if((buf.indexOf(Buffer.from(end)) !== -1) && (buf.indexOf(Buffer.from([10])) !== -1) && (buf.length === 5)){
        process.exit();
    }else if((buf.indexOf(Buffer.from('load')) !== -1) && (buf.indexOf(Buffer.from([10])) !== -1) && (buf.length === 6)){
        map = fs.readFileSync( './save1.txt' );
        outputMap();
    }else if((buf.indexOf(Buffer.from('save')) !== -1) && (buf.indexOf(Buffer.from([10])) !== -1) && (buf.length === 6)){
        fs.writeFileSync('./save1.txt', map);
    }else if(((buf.indexOf(Buffer.from(up)) !== -1) ||
            (buf.indexOf(Buffer.from(down)) !== -1) ||
            (buf.indexOf(Buffer.from(right)) !== -1) ||
            (buf.indexOf(Buffer.from(left)) !== -1)) && 
            ((buf.indexOf(Buffer.from([10])) !== -1) && 
            (buf.length === 5))){
        if(buf.indexOf(Buffer.from(up)) !== -1){
            if((Buffer.from(maze[playerY-1][playerX]).toString() === road) && playerY-1 > 0){
                if(playerY <= 35){ map[(playerY *36) +playerX] = 46 }
                maze[playerY][playerX] = road;
                maze[playerY-1][playerX] = player;
                map[((playerY-1)*36)+playerX] = 64
            }
        }else if(buf.indexOf(Buffer.from(down)) !== -1){
            if((Buffer.from(maze[playerY+1][playerX]).toString() === road) && playerY+1 <= 34){
                if(playerY >= 1){ map[(playerY * 36) + playerX] = 46 }
                maze[playerY][playerX] = road;
                maze[playerY+1][playerX] = player;
                map[((playerY+1)*36)+playerX] = 64
            }else if((Buffer.from(maze[playerY+1][playerX]).toString() === door) && playerY+1 <= 35){
                process.stdout.write(Buffer.from('Clear'));
                process.exit();
            }
        }else if(buf.indexOf(Buffer.from(right)) !== -1){
            if((Buffer.from(maze[playerY][playerX + 1]).toString() === road) && playerX + 1 <= 34){
                if(playerX >= 1){ map[(playerY * 36) + playerX] = 46 }
                maze[playerY][playerX+1] = player;
                maze[playerY][playerX] = road;
                map[(playerY * 36) + playerX+1] = 64
            }
        }else if((buf.indexOf(Buffer.from(left)) !== -1)){
            if((Buffer.from(maze[playerY][playerX-1]).toString() === road) && playerX-1 >= 1){
                if(playerX <= 35){ map[(playerY * 36) + playerX] = 46 }
                maze[playerY][playerX] = road;
                maze[playerY][playerX-1] = player;
                map[(playerY*36)+playerX-1] = 64;
            }
        }
        outputMap();
    }
    console.log(playerX,playerY)
});


