
//예제 1
let example = async function(){
  let p = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve();
    },5000);
  });
  await p; // 프로미스 객체가 resolve될 때까지 기다린다.
  console.log('5초 후에 실행')
}
example();

//예제2


// let mysql = require("mysql2/promise");
// let fs = require("fs/promises");

// (async function(){
//   let buf = await fs.readFile("./txt.txt");
//   console.log("파일 읽기 끝남..", buf.length);
// })();



function fn1(){
  return 5;
}
async function fn2(){
  return 5;
}

let r1=fn1(); 
let r2=fn2(); 

console.log(r1); //원시타입 데이터 5
console.log(r2); // Promise { 5 }
