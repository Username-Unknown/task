
function $(selector) {
    return document.querySelector(selector);
}

function addEvent(element,eve, callback) {
    // your implement
    element.addEventListener(eve,callback)
}

function addClass(element, newClassName) {
    // your implement
    var tem=element.className;
    var forTest=tem.split(' ');
    var reg=/^on$/;
    var flag=forTest.some(function(element){
        return reg.test(element);
    })
    if(flag){
        return;
    }
    tem+=' '+newClassName
    //element.className=tem;
    element.className+=' '+newClassName;
}
function removeClass(element, oldClassName) {
    // your implement
    if(!element){
        return;
    }
    var tem=element.className.split(" ").filter(function(element){
        return !(element==oldClassName)
    })
    element.className=tem.toString();
}
function classContain(element,tarClassName){//检测class是否包含tarClassName
     return element.className.split(" ").some(function(element){
        return (element==tarClassName)
    })
}

function findObjWithName(arr,name){

    for(var project of arr){  
        if(project['name'] == name){
            return project;
        }
    }
}

function findObjReturnIndex(arr,name){

    var length=arr.length;
    for(var i=0;i<length;i++){  
        if(arr[i]['name'] == name){
            return i;
        }
    }
    return null;
}

function findObjByDateReturnIndex(arr,name){
    // console.log(name);
    var length=arr.length;
    for(var i=0;i<length;i++){  
        if(arr[i]['name'] == name){
            return i;
        }
    }
    return -1;
}

function build(){
    buildtop();
}
function rebuild(){
    $('#container').innerHTML='';
    build();
}
function toggleFirst(element){
    if(sceondOpen==true){
        clearFirst(element);
    }else{
        buildsecond(currentFirst['value'],element);
    }
    sceondOpen=!sceondOpen;
}
function clearFirst(element){
    var title=element.firstElementChild;
    element.innerHTML='';
    element.appendChild(title);
}
function countTask(second){//统计二级对象的任务数量
    return second['value'].length;
}
function conutAllTask(first){//统计一级对象的任务数量
    //遍历
    var res=0;
    for(let key of first['value']){
        res+=countTask(key);
    }
    return res;
}
function buildtop(){ 
    for(let project of datawork){
            let li=document.createElement("li");
            let ul=document.createElement("ul");
            let title=document.createElement(titleName);
            let span=document.createElement("span");
            span.innerText='('+conutAllTask(project)+')';
            title.innerText=project['name'];
            title.appendChild(span);
            ul.className='second';
            ul.appendChild(title);
            li.appendChild(ul);
            if(project==currentFirst&&!secondOpen){
                buildsecond(project['value'],ul)

            }
            $('#container').appendChild(li);
    }
}

function buildsecond(arr,container){
    //保存title
    clearFirst(container);
    for(let singletask of  arr){
            let li=document.createElement("li");
            let span=document.createElement("span");
            span.innerText='('+countTask(singletask)+')';
            li.innerText=singletask['name'];
            li.appendChild(span);
            container.appendChild(li);
    }

}


function buildTaskList(show=0){//参数该为第三级 日期数组 显示所有
    
    var container=$("#tasklist");//生成区域
    container.innerHTML="";
    let store=[];
    //获取数据
    for(let task of currentSecond['value']){
        if(show){//show==0 默认 显示全部 跳过判断,show！=0 要条件 进行判断
            if(task['done']!==show){//要和show相同才能通过 否则跳过(continue)
                continue
            }
        }
        task['done']
        let date=task['date'];//
        let index=findObjByDateReturnIndex(store,date)//查看该日期是否已经存在
       
        if(index<0){//不存在,新建并放入store
            let content={
                "name":date,
                "value":[task]
            }
            store.push(content);
        }else{
            store[index]['value'].push(task);
        }
    }
    console.log(store);
    //对store排序
    store.sort(sortrule);
    console.log(store);
    //遍历store并build
    for(let day of store){
        let ul=document.createElement('ul');
        let title= document.createElement(titleName);
        title.innerText=day['name'];
        ul.appendChild(title);
        for(let task of day['value']){
            let li = document.createElement('li') 
            li.innerText=task['name'];
            ul.appendChild(li)
        }
        container.appendChild(ul)
    }
}
function sortrule(a,b){
    if(a['name']>=b['name']){
        console.log('a>b');
        return 1;
    }
    console.log('a<b');
    return -1;
}

function showConfirmed(){
    buildTaskList(1);

}

function showtodo(){
    buildTaskList(-1);

}
function rebuildTaskList(){//根据current的值来判断使用 buildTaskList  showConfirmed 和 showToDo
    switch(currentShow){
        case 1:
            showConfirmed();
            break;
        case -1:
            showtodo();
            break;
        default:
            buildTaskList();
    }
}

function buildTaskContent(){
    var container=$("#taskcontent");
    var title=document.createElement(titleName);
    var date=document.createElement("p");
    var detail=document.createElement("p");
    var div=document.createElement('div');
    title.innerText=currentFourth['name'];
    date.innerText="任务日期"+currentFourth['date'];
    detail.innerText=currentFourth['value'];
    detail.id='taskdetail'
    div.appendChild(title);
    div.appendChild(date);
    div.appendChild(detail);
    container.innerHTML='';
    container.appendChild(div);

}
function quitEditMode(){
    $('#edit').innerText='编辑';
    edittingFourth=null;
    edittingSecond=null;
}
function IntoEditMode(){//最右栏进入编辑模式
    if(!currentFourth){
        return;
    }
    edittingFourth=currentFourth;
    $('#confirm').disabled=false;
    $('#edit').innerText='取消编辑';
    var container=$('#taskcontent')
    var mototitle=currentFourth['name'];
    var input=document.createElement('input');//用input替换原来的部分
    input.value=mototitle;
    var p=document.createElement('p');
    //p.innerText=container.querySelector("p").innerText;
    p.innerText='任务日期'
    var dateinput=document.createElement('input')
    dateinput.value=currentFourth['date']
    p.appendChild(dateinput);
    var textare=document.createElement('textarea');
    textare.value=currentFourth['value']
    var div=document.createElement('div');
    container.innerHTML='';
    div.appendChild(input);
    div.appendChild(p);
    div.appendChild(textare);
    container.appendChild(div);
    
}
function confirm(){
    var container=$('#taskcontent');
    var title=container.querySelector('input').value;
    var date=container.querySelectorAll('input')[1].value;
    var detail=container.querySelector('textarea').value;
    currentFourth['name']=title;
    currentFourth['date']=date;
    currentFourth['value']=detail;
    if(edittingSecond){
        edittingSecond['value'].push(edittingFourth);
        rebuild();
    }
    save()
    buildTaskList()
    buildTaskContent();
    quitEditMode();
}
function save(){//保存
    storage['project']=JSON.stringify(datawork);
}


//工具函数
var storage=window.localStorage;



var currentFirst; //当前选中的第一级
var currentSecond;//当前选中的第二级
var currentFourth;
var datawork
var currentShow;//记录显示完成1 显示未完成- 显示所有的状态0
var edittingFourth;
var edittingSecond;
var titleName="H2"
var secondOpen=false;
var preFirst;
//storage['project']='[{"默认":[]},{"project 01":[{"task01":""},{"task02":""}]}]';
//全局变量
if(storage['project']){
    datawork=JSON.parse(storage.getItem("project"))
}else{
    datawork=[//文件夹存于数组
        {//第一级 , 文件夹
            "name":"默认",
            'value':[]
        }
    ]
}
buildtop();
//初始化
//左栏及其操作
addEvent($('#left'),'click',function(event){//选中最左栏
   
    var target=event.target;
    removeClass($('.on'),'on')
    if(target.tagName=='SPAN'){
        target=target.parentNode;
    }
    if(target.tagName == 'LI'){   
        addClass(target,'on')
        //显示详细      
        currentFirst=findObjWithName(datawork,target.parentNode.firstElementChild.childNodes[0].data)
        currentSecond=findObjWithName(currentFirst['value'],target.childNodes[0].data);
        buildTaskList()
        return;
    }
    if(target.tagName == titleName){
        currentFirst=findObjWithName(datawork,target.childNodes[0].data)
        //toggleFirst(target.parentNode)
        if(preFirst==currentFirst){
            secondOpen=!secondOpen;
        }
        preFirst=currentFirst;
        rebuild();
        //buildsecond(currentFirst['value'],target.parentNode);
        addClass(target,'on')
        return;
    }


})


addEvent($('#add'),'click',function(){//添加
   var target=$('.on');//在选中的项目下新建
   let container=$('#container');
   console.log(target);
   if(!target){
        let container=$('#container');
        let res=prompt('名字');
        if( res ==''||res==null){
            return;
        }
        let li=document.createElement("li");
        let ul=document.createElement("ul");
        let title=document.createElement("title");
        title.innerText=res;
        ul.className='second';
        ul.appendChild(title)
        li.appendChild(ul);
        container.appendChild(li);
        let object={
            "name":res,
            "value":[],
        }
        datawork.push(object);  
        save();
        rebuild();
        return; 
   }
   if(target.tagName== titleName){
        let container=target.parentNode;
        let res=prompt('名字');
        if(res == ''||res==null){
            return;
        }
        let li=document.createElement("li");
        let object={
                        'name':res,
                        'value':[]
                    }
        let father=findObjWithName(datawork,target.innerText.split("\n")[0]);
        currentFirst['value'].push(object);
        li.innerText=res;
        container.appendChild(li);
        save();
    }
})

addEvent($('#del'),'click',function(){//从数组中删除对象
    var target=$('.on');//在选中的项目下删除
    if(target.tagName=="LI"){//删除文件，根据名字从value数组里找到子对象index
        let fatherName =target.parentNode.firstElementChild.innerText.split("\n")[0]; //先找到文件夹（父）对象
        let currentFirst=findObjWithName(datawork,fatherName);
        let selfName =target.innerText.split("\n")[0];
        let selfIndex=findObjReturnIndex(father['value'],selfName); //根据名字从value数组里找到子对象index
        currentFirst['value'].splice(selfIndex,1);
        rebuild()
    }else if(target.tagName== titleName){//删除文件夹
        console.log(target.innerText);
        console.log(target.innerText.split("\n"));
        let selfName=target.innerText.split("\n")[0];
        if(selfName=='默认'){
            alert('不能删除默认')
            return
        }
        let selfIndex=findObjReturnIndex(datawork,selfName);
        datawork.splice(selfIndex,1);
        rebuild();
    }
   save()
})



//中间栏及其操作
addEvent($('#tasklist'),'click',function(event){//选中 中间栏
    var target=event.target;
    removeClass($('.taskon'),'taskon')
    if(target.tagName == 'LI'){   
        currentFourth=findObjWithName(currentSecond["value"],target.innerText);
        if(currentFourth===edittingFourth){
            return;
        }
        quitEditMode();
        console.log(currentFourth);
        addClass(target,'taskon');
        buildTaskContent();
    }
})

addEvent($('#addTask'),'click',function(event){//添加第四级别或第三级别
        res={};
        res['date']=0;
        res['name']=name;
        res['done']=false;//默认是未完成的
        res['value']='';
        //currentSecond['value'].push(res);
        currentFourth=res;
        
        edittingSecond=currentSecond;
        IntoEditMode();
        //save()
        //rebuildTaskList();
})
addEvent($('#delTask'),'click',function(event){//删除四级别或第三级别
    var target=$(".taskon")  
    if(target.tagName == 'LI'){
        var selfIndex=findObjReturnIndex(currentSecond['value'],target.innerText);
        currentSecond['value'].splice(selfIndex,1);
        save()
        buildTaskList();
        rebuild();
    }
})
addEvent($('#showConfirmed'),'click',function(){
    showConfirmed();
    currentShow=1;
})
addEvent($('#showTodo'),'click',function(){
    showtodo();
    currentShow=-1;
})
addEvent($('#showAll'),'click',function(){
    buildTaskList();
    currentShow=0;
});






//右栏操作
addEvent($('#edit'),'click',function(event){
    if(event.target.innerText=='取消编辑'){
        quitEditMode();
        buildTaskContent();
        return;
    }
    IntoEditMode();
})

addEvent($('#confirm'),'click',function(){
    confirm()
})
addEvent($('#complete'),'click',function(){
    if(!currentFourth){
        return;
    }
    currentFourth['done']=1;
    save();
    rebuildTaskList();
})
addEvent($('#todo'),'click',function(){
    if(!currentFourth){
        return;
    }
    currentFourth['done']=-1;
    save();
    rebuildTaskList();
})