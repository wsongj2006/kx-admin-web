export function formatDate (dateValue, fmt) {
  let date = new Date(dateValue)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}

export function getStartOfToday() {
    var date = new Date();
    var datetimeType = "";
    datetimeType+= date.getFullYear();   //年
    datetimeType+= "-" + getMonth(date); //月
    datetimeType += "-" + getDay(date);   //日
    datetimeType+= " 00";   //时
    datetimeType+= ":00";      //分
    datetimeType+= ":00";      //分
    return datetimeType;
}

export function getStartOfThisMonth() {
    var date = new Date();
    var datetimeType = "";
    datetimeType+= date.getFullYear();   //年
    datetimeType+= "-" + getMonth(date); //月
    datetimeType += "-01";   //日
    datetimeType+= " 00";   //时
    datetimeType+= ":00";      //分
    datetimeType+= ":00";      //分
    return datetimeType;
}

export function getStartOfThisYear() {
    var date = new Date();
    var datetimeType = "";
    datetimeType+= date.getFullYear();   //年
    datetimeType+= "-01"; //月
    datetimeType += "-01";   //日
    datetimeType+= " 00";   //时
    datetimeType+= ":00";      //分
    datetimeType+= ":00";      //分
    return datetimeType;
}

export function getNowOfToday() {
    var date = new Date();
    var datetimeType = "";
    datetimeType+= date.getFullYear();   //年
    datetimeType+= "-" + getMonth(date); //月
    datetimeType += "-" + getDay(date);   //日
    datetimeType+= " " + getHours(date);   //时
    datetimeType+= ":" + getMinutes(date);     //分
    datetimeType+= ":" + getSeconds(date);      //分
    return datetimeType;
}


export function formateDateFromLong(longTypeDate){
    var datetimeType = "";
    var date = new Date();
    date.setTime(longTypeDate);
    datetimeType+= date.getFullYear();   //年
    datetimeType+= "-" + getMonth(date); //月
    datetimeType += "-" + getDay(date);   //日
    datetimeType+= " " + getHours(date);   //时
    datetimeType+= ":" + getMinutes(date);      //分
    datetimeType+= ":" + getSeconds(date);      //分
    return datetimeType;
}
//返回 01-12 的月份值
function getMonth(date){
    var month = "";
    month = date.getMonth() + 1; //getMonth()得到的月份是0-11
    if(month<10){
        month = "0" + month;
    }
    return month;
}
//返回01-30的日期
function getDay(date){
    var day = "";
    day = date.getDate();
    if(day<10){
        day = "0" + day;
    }
    return day;
}
//返回小时
function getHours(date){
    var hours = "";
    hours = date.getHours();
    if(hours<10){
        hours = "0" + hours;
    }
    return hours;
}
//返回分
function getMinutes(date){
    var minute = "";
    minute = date.getMinutes();
    if(minute<10){
        minute = "0" + minute;
    }
    return minute;
}
//返回秒
function getSeconds(date){
    var second = "";
    second = date.getSeconds();
    if(second<10){
        second = "0" + second;
    }
    return second;
}
