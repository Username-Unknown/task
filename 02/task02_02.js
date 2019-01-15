var timer;
addEvent($('button'),'click',function(){
    timer=setInterval(timeToGo,1000)
})

function timeToGo(){
    var datestring=$('input').value.replace("-","\/");
    var base=Date.parse(datestring)
    var cur=Date.now();
    var timegap=base-cur;
    if(timegap <=0 ){
        console.log('时间到');
        clearInterval(timer);
        $("#show").textContent='时间到'
        return null;
    }
    var res=parseTime(timegap);
    $("#show").textContent=res.d+"日"+res.h+"时"+res.m+'分'+res.s+"秒"
}