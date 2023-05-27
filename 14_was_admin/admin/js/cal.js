let dateToday = new Date();
let tbodyR=document.querySelector('.tbodyR');
let yearR=document.querySelector('.txt_year');
let monthR=document.querySelector('.txt_mon');
let dateYear = dateToday.getFullYear();
let numPeople=0, dayCount=1,currMonth=dateToday.getMonth(), monthLength;

yearR.innerHTML=`${dateYear}년`;
monthR.innerHTML=`${currMonth+1}월`;


if(currMonth+1===(1 || 3 || 5 || 7 || 8 || 10 || 12)){
  monthLength=31;
}else if((currMonth===2)){
  if((dateYear % 4)===0 && (dateYear % 100)===0){
    monthLength=29;
  }else{   
    monthLength=28;
  }
}else{
  monthLength=30;
}

let htmlR = '';
for(let i=0;i<monthLength; i+=1){
  htmlR+=`
  <tr>
  <th class="txt_date">날짜<th>
  <td><span class="text-red f-16 text-bold">${dayCount}</span></td>
  </tr>
  <tr>
  <th class="text-white" height="30">오전</th>
	<td>`
		htmlR+=`${numPeople}명`
    if(numPeople===120){
      htmlR+=`<button class="btn-sm bg-default round" type="button">마감</button>`;
    }else if(numPeople>=119){
      htmlR+=`<button class="btn-sm bg-red round" type="button">예약닫기</button>`;
    }else{
      htmlR+=`<button class="btn-sm round" type="button">예약열기</button>`;
    }
	htmlR+=`</td>
  </tr>
  <tr>
  <th class="text-white" height="30">오후</th>
  <td>`
		htmlR+=`${numPeople}명`
    if(numPeople===120){
      htmlR+=`<button class="btn-sm bg-default round" type="button">마감</button>`;
    }else if(numPeople>=119){
      htmlR+=`<button class="btn-sm bg-red round" type="button">예약닫기</button>`;
    }else{
      htmlR+=`<button class="btn-sm round" type="button">예약열기</button>`;
    }
	htmlR+=`</td>
	</tr>
  `
  if(dayCount===monthLength){
    dayCount=1;
  }else{
    dayCount+=1;
  }
}




tbodyR.innerHTML=htmlR;