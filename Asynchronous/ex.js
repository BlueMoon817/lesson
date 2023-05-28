let fs = require("fs/promises");
let p = fs.readFile("./txt1.txt");
console.log("Promise 객체가 만들어진 직후", p); //pending
// setTimeout(function(){
//   console.log("Promise 객체가 만들어지고 2초가 지난 후", p);
// },2000);

// p.then(function(buf){
//   console.log('파일내용을 다 읽어왔음');
// })
// .catch(function(err){
//   console.log('파일내용을 다 읽어오는데 실패했음');
// })



/* 비동기 콜백방식 */
fs.readFile('./logo.jpg',function(buf, err){
  console.log('파일내용을 다 읽어왔음')
});


/** 동기방식 */
let buf = fs.readFileSync("./logo.jpg");
console.log("파일내용을 다 읽어왔음");