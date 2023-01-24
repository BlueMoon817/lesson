//net 모듈 필요
let net = require("net");
// 커넥트를 하고 상대방이 어셉트를 해서 소켓이 만들어지면 연결시켜준다.
// 내 컴퓨터를 말하는 127.0.0.1
let socket = net.createConnection(8080, "127.0.0.1", function(){
  console.log("게임에 접속하였습니다.");
  //사람이 키보드에서 입력을 하면 소켓으로 채팅 메시지를 보낸다.
  process.stdin.on("data", function(buf){
    socket.write(buf);
  });
  
  //상대방으로부터 채팅메시지가 수신되면 콘솔에 출력한다.
  socket.on("data", function(buf){
    if(buf.indexOf(Buffer.from(`미로 클리어~!! 곧 퇴장됩니다!!\n`))!==-1){
      process.stdout.write(buf);
      socket.write(`미로를 탈출하였습니다~!`);
      process.exit(socket);
    }else if(buf.indexOf(Buffer.from(`체력이 다 닳아서 죽었습니다..ㅠㅠ 안녕히..\n`))!==-1){
      process.stdout.write(buf);
      socket.write(`bye..`);
      process.exit(socket);
    }else{
      process.stdout.write(buf);
    }
  });

});

