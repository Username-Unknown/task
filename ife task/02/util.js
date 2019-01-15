function $(selector) {
    return document.querySelector(selector);
}

function addEvent(element,eve, callback) {
    // your implement
    element.addEventListener(eve,callback)
}
function setClass(element, newClassName) {
    // your implement

    element.className=newClassName;

}
function addClass(element, newClassName) {
    // your implement
    var tem=element.className;
    console.log(tem);
    tem+=' '+newClassName
    //element.className=tem;
    element.className+=' '+newClassName;

}
function removeClass(element, oldClassName) {
    // your implement
    var tem=element.className.replace(oldClassName,"").trim();//replace是返回新字符串
    element.className=tem;
}

function parseTime(timegap){
    var res={};
    res.d=Math.floor((timegap)/1000/60/60/24);//获取剩余天数
    res.h=Math.floor((timegap)/1000/60/60%24);//获取剩余小时
    res.m=Math.floor((timegap)/1000/60%60);//获取剩余分钟
    res.s=Math.floor((timegap)/1000%60);//获取剩余秒数
    return res;
}

function getTime(){
    var base=Date.parse("2019/01/11")
    var cur=Date.now();
}

function Ajax(url,option = {method:'get'}){
    var ajax=new XMLHttpRequest();
    // var data=
    // if(option.method.toUpperCase()=='GET')
    //     url+=
    console.log(url)
    ajax.open(option.method,url,true);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
     　　　
       　　}
     }

    ajax.send();

}