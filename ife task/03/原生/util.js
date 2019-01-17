
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
    // console.log(name);
    // console.log(typeof name);
    for(var project of arr){  
        if(project['name'] == name){
            //console.log(project);
            return project;
        }
    }
}

function findObjReturnIndex(arr,name){
    // console.log(name);
    var length=arr.length;
    for(var i=0;i<length;i++){  
        if(arr[i]['name'] == name){
            return i;
        }
    }
}

function build(){
    buildtop(datawork);
}
function rebuild(){
    $('#container').innerHTML='';
    build();
}

function buildtop(arr){ 
    for(let project of arr){
            let li=document.createElement("li");
            let ul=document.createElement("ul");
            let title=document.createElement(titleName);
            title.innerText=project['name'];
            ul.className='second';
            ul.appendChild(title);
            li.appendChild(ul);
            buildsecond(project['value'],ul)
            $('#container').appendChild(li);
    }
}

function buildsecond(arr,container){
    for(let singletask of  arr){
            let li=document.createElement("li");
            li.innerText=singletask['name'];
            container.appendChild(li);
    }

}


function buildTaskList(){//参数该为第三级 日期数组 显示所有
    var container=$("#tasklist");//生成区域
    container.innerHTML="";
    //获取数据
    for(let day of currentSecond['value']){//日期数组中的一项，称作day
        let ul = document.createElement('ul') 
        let title= document.createElement(titleName);
        title.innerText=day['name'];
        ul.appendChild(title)
        for(let task of day['value']){
            let li = document.createElement('li') 
            li.innerText=task['name'];
            ul.appendChild(li)
        }
        container.appendChild(ul);
    }

}

function checkConfirmed(arr){//检查是否有done
   return arr.some(function(element){
        return element['done']
    })
}
function checkToDo(arr){//检查是否有done
    return arr.some(function(element){
         return !element['done']
     })
 }
function showConfirmed(){
    var container=$("#tasklist");//生成区域
    container.innerHTML="";//清空
    for(let day of currentSecond['value']){//遍历
        //查看是是否有done的
       let flag=checkConfirmed(day['value']);
       if(flag){
            let ul = document.createElement('ul') 
            let title= document.createElement(titleName);
            title.innerText=day['name'];
            ul.appendChild(title)
            for(let task of day['value']){
               if(task['done']){
                    let li = document.createElement('li') 
                    li.innerText=task['name'];
                    ul.appendChild(li)
               }
            }
        container.appendChild(ul);    
       }
    }
}

function showtodo(){
    var container=$("#tasklist");//生成区域
    container.innerHTML="";//清空
    for(let day of currentSecond['value']){//遍历
        //查看是是否有done的
       let flag=checkToDo(day['value']);
       if(flag){
            let ul = document.createElement('ul') 
            let title= document.createElement(titleName);
            title.innerText=day['name'];
            ul.appendChild(title)
            for(let task of day['value']){
               if(!task['done']){
                    let li = document.createElement('li') 
                    li.innerText=task['name'];
                    ul.appendChild(li)
               }
            }
        container.appendChild(ul);    
       }
    }
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
    date.innerText="任务日期"+currentThird['name'];
    detail.innerText=currentFourth['value'];
    detail.id='taskdetail'
    div.appendChild(title);
    div.appendChild(date);
    div.appendChild(detail);
    container.innerHTML='';
    container.appendChild(div);

}

function IntoEditMode(){//最右栏进入编辑模式
    var container=$('#taskcontent')
    var mototitle=container.querySelector(titleName).innerText;
    var input=document.createElement('input');//用input替换原来的部分
    input.value=mototitle;
    container.appendChild(input);
    var p=document.createElement('p');
    p.innerText=container.querySelector("p").innerText;
    var textare=document.createElement('textarea');
    textare.value= container.querySelector('#taskdetail').innerText;
    var div=document.createElement('div');
    container.innerHTML='';
    div.appendChild(input);
    div.appendChild(p);
    div.appendChild(textare);
    container.appendChild(div);
    
}
function confirm(){
    var  container=$('#taskcontent');
    var title=container.querySelector('input').value;
    var detail=container.querySelector('textarea').value;
    currentFourth['name']=title;
    currentFourth['value']=detail;
    save()
    buildTaskList()
    buildTaskContent();

}
function save(){//保存
    storage['project']=JSON.stringify(datawork);
}
//工具函数
var storage=window.localStorage;
var data=[{"默认":[]},{"project 01":[{"task01":""},{"task02":""}]}]

// var datawork=[//文件夹存于数组
//     {//第一级 , 文件夹
//         "name":"默认",
//         'value':[]
//     },
//     {//第一级 , 文件夹
//         "name":"ifeproject",//文件夹名字
//         "value":[//文件存于数组
//             {//第二级文件
//                 "name":"文件名",
//                 "value":[
//                     {//第三级别 日期
//                         "name":"2019-1-15",
//                         "value":[
//                             {
//                                 "name":"todo1",
//                                 "value":"完成编码工作"
//                             },
//                             {
//                                 "name":"todo2",
//                                 "value":"继续完成"
//                             }
//                         ]
//                     }
//                 ]
//             },
//         ]
//     }
// ]

// storage['project']=JSON.stringify(datawork)


//全局变量
var datawork=JSON.parse(storage.getItem("project"))
var currentFirst; //当前选中的第一级
var currentSecond;//当前选中的第二级
var currentThird;//当前选中的第三级
var currentFourth;
var currentShow;//记录显示完成1 显示未完成- 显示所有的状态0
var titleName="H2"
//storage['project']='[{"默认":[]},{"project 01":[{"task01":""},{"task02":""}]}]';


buildtop(datawork);
//左栏及其操作
addEvent($('#left'),'click',function(event){//选中最左栏
   
    var target=event.target;
    removeClass($('.on'),'on')
    if(target.tagName == 'LI'){   
        addClass(target,'on')
        //显示详细      
        currentFirst=findObjWithName(datawork,target.parentNode.firstElementChild.innerText.split("\n")[0])
        //用 innerText.split("\n")[0] 取到标签名字
        currentSecond=findObjWithName(currentFirst['value'],target.innerText.split("\n")[0]);
        buildTaskList()

    }
    if(target.tagName == titleName){
        currentFirst=findObjWithName(datawork,target.innerText.split("\n")[0])
        addClass(target,'on')
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
        father['value'].push(object);
        li.innerText=res;
        container.appendChild(li);
        save();
    }else if(target.tagName== 'LI'){
        let res={}
        let date=prompt('在'+currentFirst['name']+'的'+currentSecond['name']+'建立新日期?'+'\n输入日期(建议格式yyyy-mm-dd)')
        if(date==''||date==null){
            return;
        }
        res['name']=date;
        res["value"]=[];
        currentSecond['value'].push(res);
        //save()
        buildTaskList();
        return;
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
        currentThird=findObjWithName(currentSecond['value'],target.parentNode.firstElementChild.innerText.split("\n")[0]);
        currentFourth=findObjWithName(currentThird["value"],target.innerText)
        console.log(currentFourth);
        addClass(target,'taskon');
        buildTaskContent();
    }else if(target.tagName == titleName){
        currentThird=findObjWithName(currentSecond['value'],target.innerText)
        addClass(target,'taskon');
    }
})

addEvent($('#addTask'),'click',function(event){//添加第四级别或第三级别
    var target=$(".taskon")
    if(!target){//如果没有选中第三级别则 添加的是第三级别
        let res={}
        let date=prompt('在'+currentFirst['name']+'的'+currentSecond['name']+'建立新日期?'+'\n输入日期(建议格式yyyy-mm-dd)')
        if(date==''||name==null)
            return ;
        res['name']=date;
        res["value"]=[];
        currentSecond['value'].push(res);
        save()
        buildTaskList();
        return;
    }
    if(target.tagName == titleName){
        res={};
        name=prompt("name")
        if( name == ''||name==null)
            return
        res['name']=name;
        res['done']=false;//默认是未完成的
        res['value']='';
        console.log(currentThird['value'])
        currentThird['value'].push(res);
        save()
        rebuildTaskList();
    }
})
addEvent($('#delTask'),'click',function(event){//删除四级别或第三级别
    var target=$(".taskon")  
    if(target.tagName == 'LI'){
        var selfIndex=findObjReturnIndex(currentThird['value'],target.innerText);
        currentThird['value'].splice(selfIndex,1);
        save()
        buildTaskList();
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
addEvent($('#edit'),'click',function(){
    IntoEditMode();
})

addEvent($('#confirm'),'click',function(){
    confirm()
})
addEvent($('#complete'),'click',function(){
    currentFourth['done']=true;
    save();
    rebuildTaskList();
})
addEvent($('#todo'),'click',function(){
    currentFourth['done']=false;
    save();
    rebuildTaskList();
})