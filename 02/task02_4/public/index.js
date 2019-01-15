
var timer;
function gethint(){
  Ajax('http://localhost:8081/')
}

addEvent($('ul'),'click',function(){
  var li = document.querySelectorAll('li');
  var key;
  for (key of li){
    if(event.target==key)
      console.log(key.textContent)
  }
})

addEvent($('input'),'input',function(){
  if($('input').value==''){
    $('ul').innerHTML='';
    return
  }
  if(timer)
    clearTimeout(timer)
  timer= setTimeout(gethint, 1000);
})