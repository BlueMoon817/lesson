let mysql2=require("mysql2");
let pool = mysql2.createPool({
	host: "localhost",
	user: "PRACTICE01",
  password: "123123",
	database: "PRACTICE01"
});

// pool.query("SELECT * FROM ACCOUNT", function(err, dbres){
//   // if(err) console.log("오류발생",err);
//   // console.log(dbres);
//   for (let i=0; i<dbres.length; i+=1){
//     console.log(`${dbres[i].dt}: ${dbres[i].price} (${dbres[i].reason})`);
//   }
// });

//쿼리문에 데이터가 들어가는 경우
// pool.query("INSERT INTO ACCOUNT SET TYPE=?, DT=?, PRICE=?,REASON=?",['수입', '2023-04-04 09:00:00', '250000', '당근마켓 중고거래'], function(err, dbres){
//   if(err) console.log("오류발생",err);
//   console.log(dbres);
// });

//검색
pool.query("SELECT * FROM ACCOUNT WHERE type=? ORDER BY dt DESC", ['수입'], function(err, dbres){
  for (let i=0; i<dbres.length; i+=1){
    console.log(`${dbres[i].dt}: ${dbres[i].price} (${dbres[i].reason})`);
  }
});