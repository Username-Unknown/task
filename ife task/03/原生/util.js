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



// addEvent($('ul'),'mouseover',function(event){

//     var targetchild=event.target.firstElementChild;

//     if(targetchild.tagName == 'SPAN'){
//         console.log(targetchild)
//     }
// })
   // if(event.target.tagName == 'LI'){
        //console.log(event.target);
        //var span=document.createElement('span')
        //span.innerText="X";
       // event.target.appendChild(span);
   // }

//    function buildtop(arr){
//     for(let project of arr){
//         for(let task in project ){
//             let li=document.createElement("li");
//             let ul=document.createElement("ul");
//             ul.innerText=task;
//             ul.className='second';
//             li.appendChild(ul);
//             buildsecond(project[task],ul)
//             $('#container').appendChild(li);
//         }
       
//     }
// }

// function buildsecond(arr,container){
//     for(let singletask of  arr){
//         for( let attr in singletask){
//             let li=document.createElement("li");
//             li.innerText=attr;
//             container.appendChild(li);
//         }
//     }

// }
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
// storage['project']=JSON.stringify(datawork)
datawork=JSON.parse(storage.getItem("project"))

//storage['project']='[{"默认":[]},{"project 01":[{"task01":""},{"task02":""}]}]';


buildtop(datawork);
// for(let project of projectdata){
//     for(let task in project ){
//         let li=document.createElement("li");
//         let ul=document.createElement("ul");
//         ul.innerText=task;
//         ul.className='second';
//         li.appendChild(ul);
//         for(let singletask of  project[task]){
//             for( let attr in singletask){
//                 let li=document.createElement("li");
//                 li.innerText=attr;
//                 ul.appendChild(li);
//             }
//         }
//         $('#container').appendChild(li);
//     }

//}
// console.log(getstorage);
// console.log(typeof getstorage);
// console.log(JSON.parse(getstorage));
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

   // console.log(res)
})

addEvent($('#del'),'click',function(){
    var target=$('.on');//在选中的项目下删除
    if(target.tagName=="LI"){
        let selfName =target.innerText.split("\n")[0];
        let fatherName =target.parentNode.innerText.split("\n")[0];
        let father=findObjWithName(datawork,fatherName);
        let fatherIndex=findObjReturnIndex(datawork,fatherName);
        console.log(father);
        console.log(fatherIndex);
    }
})

addEvent($('#container'),'click',function(event){
   
    var target=event.target;
    //console.log(target);
    removeClass($('.on'),'on')
    if(target.tagName == 'LI'){   
        addClass(target,'on')
    }
    if(target.tagName == 'UL'){
        addClass(target,'on')
    }
    // var targetchild=event.target.firstElementChild;

    // if(targetchild.tagName == 'SPAN'){
    //     console.log(targetchild)
    // }
})