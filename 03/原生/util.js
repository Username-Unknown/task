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
            ul.innerText=project['name'];
            ul.className='second';
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


function buildTaskList(arr){//参数该为第三级 日期
    var container=$("#tasklist");//生成区域
    container.innerHTML="";
    //获取数据
    for(let day of arr){
        let ul = document.createElement('ul') 
        ul.innerText=day['name'];
        for(let task of day['value']){
            let li = document.createElement('li') 
            li.innerText=task['name'];
            ul.appendChild(li)
        }
        container.appendChild(ul);
    }

}

//工具函数
var storage=window.localStorage;
var data=[{"默认":[]},{"project 01":[{"task01":""},{"task02":""}]}]
// var datawork=[//格式
//     {   
//         "name":"默认",
//         "value":[]
//     },
//     {
//         "name":"project 01",
//         "value":[
//             {
//                 "name":"task01",
//                 "value":""
//              },
//             {
//                    "name":"task02",
//                    "value":""
//               }
//         ]
//     }
// ]
var datawork=[//文件夹存于数组
    {//第一级 , 文件夹
        "name":"默认",
        'value':[]
    },
    {//第一级 , 文件夹
        "name":"ifeproject",//文件夹名字
        "value":[//文件存于数组
            {//第二级文件
                "name":"文件名",
                "value":[
                    {//第三级别 日期
                        "name":"2019-1-15",
                        "value":[
                            {
                                "name":"todo1",
                                "value":"完成编码工作"
                            },
                            {
                                "name":"todo2",
                                "value":"继续完成"
                            }
                        ]
                    }
                ]
            },
        ]
    }
]

storage['project']=JSON.stringify(datawork)
datawork=JSON.parse(storage.getItem("project"))
var currentFirst; //当前选中的第一级
var currentSecond;//当前选中的第二级
var currenThird;//当前选中的第三级
//storage['project']='[{"默认":[]},{"project 01":[{"task01":""},{"task02":""}]}]';


buildtop(datawork);

addEvent($('#add'),'click',function(){//添加
   var target=$('.on');//在选中的项目下新建
   console.log(target);
   if(target.tagName=="UL"){
       if(classContain(target,'second')){//新建文件
            let res=prompt('名字');
            let li=document.createElement("li");
            li.innerText=res;
            target.appendChild(li);
            let object={
                'name':res,
                'value':''
            }
            let container=findObjWithName(datawork,target.innerText.split("\n")[0]);
            container.value.push(object);
       }else{//新建文件夹
            let res=prompt('名字');
            let li=document.createElement("li");
            let ul=document.createElement("ul");
            ul.innerText=res;
            ul.className='second'
            li.appendChild(ul);
            target.appendChild(li);
            let object={
                "name":res,
                "value":[],
            }
            datawork.push(object);   
                 
       }
       storage['project']=JSON.stringify(datawork)    
   }

})

addEvent($('#del'),'click',function(){//从数组中删除对象
    var target=$('.on');//在选中的项目下删除
    if(target.tagName=="LI"){//删除文件，根据名字从value数组里找到子对象index
        let fatherName =target.parentNode.innerText.split("\n")[0]; //先找到文件夹（父）对象
        let father=findObjWithName(datawork,fatherName);
        let selfName =target.innerText.split("\n")[0];
        let selfIndex=findObjReturnIndex(father['value'],selfName); //根据名字从value数组里找到子对象index
        father['value'].splice(selfIndex,1);
        rebuild()
    }else if(target.tagName=="UL"){//删除文件夹
        let selfName=target.innerText.split("\n")[0];
        if(selfName=='默认'){
            alert('不能删除默认')
            return
        }
        let selfIndex=findObjReturnIndex(datawork,selfName);
        datawork.splice(selfIndex,1);
        rebuild();
    }
    storage['project']=JSON.stringify(datawork)  
})

addEvent($('#container'),'click',function(event){//选中最左栏
   
    var target=event.target;
    removeClass($('.on'),'on')
    if(target.tagName == 'LI'){   
        addClass(target,'on')
        //显示详细      
        let father=findObjWithName(datawork,target.parentNode.innerText.split("\n")[0])
        //用 innerText.split("\n")[0] 取到标签名字
        let self=findObjWithName(father['value'],target.innerText.split("\n")[0]);
        buildTaskList(self['value'])

    }
    if(target.tagName == 'UL'){
        addClass(target,'on')
    }

})

addEvent($('#tasklist'),'click',function(event){//选中 中间栏
   
    var target=event.target;
    removeClass($('.taskon'),'taskon')
    if(target.tagName == 'LI'){   
        addClass(target,'taskon')
        //显示详细      
        //let father=findObjWithName(datawork,target.parentNode.innerText.split("\n")[0])
        //用 innerText.split("\n")[0] 取到标签名字
       // let self=findObjWithName(father['value'],target.innerText.split("\n")[0]);
       // buildTaskList(self['value'])

    }


})
