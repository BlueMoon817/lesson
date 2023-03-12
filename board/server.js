let net = require("net");
let cp = require( "child_process" );
let fs = require("fs");
let mt = require("mime-types");
let server = net.createServer(function(socket){
  
    /*
      ** 웹브라우저가 접속을 해왔다.
    */
    // console.log("웹브라우저가 접속했음");
    /*
      ** 웹브라우저로부터 데이터 수신
    */
    socket.buf=Buffer.alloc(0);
    socket.on("data",function(buf){
      console.log(buf.toString());
      // process.stdout.write(buf); 
      // process.exit();
      socket.buf= Buffer.concat([socket.buf,buf]);
      chkData(socket);
    });    
   
    
    socket.on("error",function(){
       console.log("웹 브라우저와의 연결이 종료되었음.") 
    });
    socket.on("close",function(){
       console.log("웹 브라우저와의 연결이 종료되었음.") 
    });
});
let chkData=(socket)=>{
    //웹브라우저가 웹서버에 보내온 요청 데이터가 완전한지 \r\n\r\n 을 찾아서 확인해본다..
    let idx = socket.buf.indexOf(Buffer.from(`\r\n\r\n`));
    // \r\n\r\n 이 없으면 수신된 데이터가 완전하지 않으므로 리턴
    if(idx===-1){return}
    
    // 수신된 버퍼의 0번데이터부터 + \r\n\r\n 을 변수에 담는다. 
    let bufData = socket.buf.subarray(0,idx+4);
    socket.buf=socket.buf.subarray(idx+4);
    // 완전해진 버퍼를 구분하여 출력하는 작업을 한다.
    let lines = bufData.toString().split("\r\n");
    /*
    lines=[
    "REQUEST",
    "HEADER",
    "HEADER",
    "HEADER",
    ""
    ]
    */
    // Request 부분 파싱(parsing)
    let method = lines[0].split(" ")[0];
    let resource = lines[0].split(" ")[1];
    let version = lines[0].split(" ")[2];
    // resource에 쿼리스트링이 있을 수 있으므로 쪼개두어야 한다.
    // 요청받은 리소스에 쿼리스트링이 포함되어있는지 확인하기
    let queryString="";
    if(resource.indexOf("?")!==-1){
      queryString=resource.split("?")[1] // data
      console.log(queryString)
      resource=resource.split("?")[0]; // 파일이름
    }
          
    // Header 부분 파싱
    let headers = {};
    for( let i=1 ; ; i+=1 ){
        if(lines[i]=="") break;
        headers[ lines[i].split(": ")[0] ] = lines[i].split(": ")[1];
    }
    let req_payload=null;
    // Payload가 존재하는 경우, 수신버퍼에 모든 Payload가 수신됐는지 확인한다.
    if(method!=="GET" && headers["Content-Length"]){
      //아직 하나의 요청이 온전하게 다 수신되지 않았다.
      if(socket.buf.length<parseInt(headers["Content-Length"])){
        //잘라냈던 수신버퍼를 원복해두고
        socket.buf=Buffer.concat([bufData, socket.buf]);
        //HTTP 처리를 중단한다.
        return;
      }else{ //하나의 요청이 온전할 경우
        req_payload=socket.buf.subarray(0,parseInt(headers["Content-Length"]));
        socket.buf=socket.buf.subarray(parseInt(headers["Content-Length"]));
      }
    }
    
    
    console.log("=======================================");
    console.log(method, resource);
    console.log("=======================================");
        
    // 웹브라우저에게 줘도 되는 파일들만 모아둔 폴더
    let DOCUMENT_ROOT = "./docroot";
    let CGI_ROOT = "./cgiroot";
          
    // 파일이 아니라 폴더에 대한 요청을 받았을 때 기본 파일명을 붙여준다.
    if(resource[resource.length-1]=="/"){
      resource+="board/list.js";
    }
    //웹브라우저가 요청해온 리소스가 존재하는지 확인
    if(fs.existsSync(DOCUMENT_ROOT+resource)){
      //확장자에 따라서 MIME 타입을 결정 -> 파일확장자 종류가 너무 많기 때문에 분기하기보단 만들어져있는 모듈을 이용하기
      // if(resource.indexOf(".html")!==-1) mimeType = "text/html"
      let mimeType="";
      mimeType = mt.lookup(DOCUMENT_ROOT+resource);
      
      //파일의 내용을 읽어서 웹브라우저에게 응답한다.
      let payload = fs.readFileSync(DOCUMENT_ROOT+resource);
      socket.write(Buffer.from("HTTP/1.1 200 OKAY\r\n"));
      socket.write(Buffer.from("Content-Type: "+mimeType+"\r\n"));
      socket.write(Buffer.from("Content-Length: "+payload.length+"\r\n"));
      socket.write(Buffer.from("\r\n"));
      socket.write(payload);
      console.log(DOCUMENT_ROOT+resource+"파일을 정상적으로 응답하였음.");
    }else 
    if(fs.existsSync(CGI_ROOT+resource)){ // 도큐먼트 폴더에는 없지만 CGI폴더에는 있는 경우, CGI 프로그램을 실행해서 CGI 프로그램이 출력한 내용을 웹브라우저에게응답으로 보내준다.
    try{ // CGI오류시 멈추지 않도록 예외처리.
      let payload;
      if(req_payload){ 
        payload=cp.execSync("node "+CGI_ROOT+resource, {
          env:{
            ...headers,
            "QUERY_STRING": queryString,
            // node js의 위치
            "PATH": process.env["PATH"]
          },
          input: req_payload
        });
      }else{
        //페이로드가 없을 때, 그러나 headers엔 여러정보가 있으므로 전체를 보내준다.
        payload=cp.execSync("node "+CGI_ROOT+resource, {
          env:{
            ...headers,
            "QUERY_STRING": queryString,
            // node js의 위치
            "PATH": process.env["PATH"]
          }
        });
      }
      socket.write(Buffer.from("HTTP/1.1 200 OKAY\r\n"));
      socket.write(payload);
    }catch(e){
      let payload = Buffer.from(`<!Doctype html><html><head><title>Internal Server Error</title><meta charset='utf-8'></head><body><h1>프로그램 실행중 오류발생!</h1><textarea style="width:100%">${e}</textarea></body></html>`);
      socket.write(Buffer.from("HTTP/1.1 500 Internal Server Error\r\n"));
      socket.write(Buffer.from("Content-Type: text/html\r\n"));
      socket.write(Buffer.from("Content-Length: "+payload.length+"\r\n"));
      socket.write(Buffer.from("\r\n"));
      socket.write(payload);
      console.log("파일이 존재하지 않으므로 404 응답을 전송했음.");
    }
    }else{
      //파일이 존재하지 않는다는 응답(404)을 보내준다.
      let payload = Buffer.from("<!Doctype html><html><head><title>File is Not Found</title><meta charset='utf-8'></head><body><h1>요청한 파일을 찾을 수없습니다.</h1><strong>URL을 다시 확인하세요.</strong></body></html>");
      socket.write(Buffer.from("HTTP/1.1 404 NOT FOUND\r\n"));
      socket.write(Buffer.from("Content-Type: text/html\r\n"));
      socket.write(Buffer.from("Content-Length: "+payload.length+"\r\n"));
      socket.write(Buffer.from("\r\n"));
      socket.write(payload);
      console.log("파일이 존재하지 않으므로 404 응답을 전송했음.");
    }
  }


server.listen(129);
