function $(selector) {
    return document.querySelector(selector);
}
function findObjWithName(arr,name){

    for(var project of arr){  
        if(project['name'] == name){
            return project;
        }
    }
}
function findObjWithItself(arr,obj){
    var length=arr.length;
    for(var i=0;i<length;i++){  
        if(arr[i] == obj){
            return i;
        }
    }
    return null;
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
function sortrule(a,b){
    return Date.parse(a['date'])<Date.parse(b['date']);
}
function clone(src) {
    // your implement
    if( typeof(src)!="object" || src === null )
        return src;
    var rescon={};//result container
    var key;
    for( key in src){
        rescon[key]=clone(src[key])
    }
    return rescon
}


var storage=window.localStorage;
var datawork=JSON.parse(storage.getItem("project"))




var bus=new Vue();
const store = new Vuex.Store({
    state: {
      datawork:datawork,
      currentFirst:0,
      currentSecond:0,
      preSecond:0,
      preThird:0,
      currentThird:0,
      show:0,
    },
    mutations: {
      changeFirst(state,newFirst){
        state.currentFirst=newFirst;
      },
      clearFirst(state){
        state.currentFirst=null;
      },
      changeSecond(state,newSecond){
        state.currentSecond=newSecond;
        state.preSecond=state.currentSecond;
      },
      clearSecond(state){
        state.currentSecond=null;
      },
      changeThird(state,newThird){
        state.currentThird=newThird;
       // state.preThird=clone(state.currentThird);
      },
      addFirst(state,newFirst){
          state.datawork.push(newFirst);
      },
      addSecond(state,newSecond){
        state.currentFirst['value'].push(newSecond)
      },
      deletFirst(state,index){
        state.datawork.splice(index,1);
      },
      deletSecond(state,index){
        state.currentFirst['value'].splice(index,1);
      },
      deletThird(state,index){
        state.currentSecond['value'].splice(index,1);
      },
      complete(state){
        state.currentThird['done']=1;
      },
      todo(state){
        state.currentThird['done']=-1;
      },
      resetShow(state){
        state.show=0;
      },
      showDone(state){
        state.show=1;
      },
      showToDo(state){
          state.show=-1;
      },
      newThird(state){
        var tem={
            "name":'',
            "done":-1,
            "date":'',
            "value":""
        }
        state.currentThird=tem;
        state.currentSecond['value'].push(tem);
      },
      save(state){
        storage['project']=JSON.stringify(state.datawork);
      }
    }
})

var left=new Vue({
    el:'#left',
    store,
    data:{
    },
    computed:{
        datawork:function(){
            return store.state.datawork;
        },
        taskNumber:function(){
            var res=[];
            for(let tasksheet of this.datawork){
                var number=0;
                for(let tasklist of tasksheet['value'] ){
                    number+=tasklist['value'].length;
                }
                res.push(number)
            }
            return res;
        }
    },
    methods:{
        selectSecond(event){
            var target=event.target;
            if(target.tagName=='SPAN'){
                target=target.parentNode;
            }
            var currentFirst=findObjWithName(datawork,target.parentNode.firstElementChild.childNodes[0].data)
            var currentSecond=findObjWithName(currentFirst['value'],target.childNodes[0].data);
            if(currentSecond!=store.state.preSecond){
                store.commit("resetShow");
            }
            store.commit("changeFirst",currentFirst)
            store.commit("changeSecond",currentSecond)
            //console.log(target);
            removeClass($('.on'),'on')
            addClass(target,'on')
            event.stopPropagation();
        },
        selectFirst(event){
            var target=event.target;
            if(target.tagName=='SPAN'){
                target=target.parentNode;
            }
            var currentFirst=findObjWithName(datawork,target.childNodes[0].data);
            store.commit("changeFirst",currentFirst)
            removeClass($('.on'),'on')
            addClass(target,'on')
            event.stopPropagation();

        },
        add(event){
            var target=$('.on');//在选中的项目下新建
            if(!target){
                let res=prompt('名字');
                if( res ==''||res==null){
                    return;
                }
                let object={
                    "name":res,
                    "value":[],
                }
                store.commit('addFirst',object)
            }else{
                let res=prompt('名字');
                if( res ==''||res==null){
                    return;
                }
                let object={
                    "name":res,
                    "value":[],
                }
                store.commit('addSecond',object)
            }
            store.commit('save');
        },
        del(event){
            var target=$('.on');
            if(target.tagName=="LI"){
                let selfName=target.childNodes[0].data;
                let index=findObjReturnIndex(store.state.currentFirst['value'],selfName);
                if(index<0){
                    return 
                }
                store.commit('deletSecond',index);
            }
            if(target.tagName =="H2"){
                let selfName=target.childNodes[0].data;
                let index=findObjReturnIndex(store.state.datawork,selfName);
                if(index<0){
                    return 
                }
                store.commit('deletFirst',index);
            }
            store.commit('save');
            event.stopPropagation();
        },
        clickOther(event){
            console.log('点击其他');
            removeClass($('.on'),'on');
            store.commit('clearFirst');
            store.commit('clearSecond');
        }
    },
    mounted(){     
    },
    template:"<div id='left' @click='clickOther'><ul id='container'><li v-for='(item, index) in datawork' ><ul><h2 @click='selectFirst'>{{item['name']}}<span>({{taskNumber[index]}})</span></h2><li v-for='tasklist in item[\"value\"]' @click='selectSecond'>{{tasklist['name']}}<span>({{tasklist['value'].length}})</span></li></ul></li></ul><div class='buttonArea'><button @click='add'>添加</button><button @click='del'>删除</button></div></div>"
})

var middle=new Vue({
    el:'#middle',
    data:{
        clu:this.cluster,
        show:0
    },
    store,
    computed:{
        second:function(){
            return store.state.currentSecond;
        },
        cluster:function(){
            if(!this.second){
                return;
            }
            let container=[];
            for(let task of this.second['value']){
                if(store.state.show){//show==0 默认 显示全部 跳过判断,show！=0 要条件 进行判断
                    if(task['done']!==store.state.show){//要和show相同才能通过 否则跳过(continue)
                        continue;
                    }
                }
                let date=task['date'];//
                let index=findObjReturnIndex(container,date);
                if(index==null){
                    let content={
                        "name":date,
                        "value":[task]
                    }
                    container.push(content);
                }else{
                    container[index]['value'].push(task);
                }
            }
            container.sort(sortrule);
            return container;
        },
        showingFlag:function(){
            switch(store.state.show){
                case 0:
                    return '正在显示所有';
                case 1:
                    return '正在显示已完成';
                case -1:
                    return '正在显示未完成';
            }
        }
    },
    mounted(){
    },
    methods:{
        selectThird(event){
            var target=event.target;
            var currentThird=findObjWithName(store.state.currentSecond["value"],target.innerText);
            bus.$emit('changeThird');
            store.commit("changeThird",currentThird);
            removeClass($('.taskon'),'taskon')
            addClass(target,'taskon');
        },
        add(){
            console.log('emit');
            if( !this.second){
                alert('没有选中second,返回')
                return;
            }
            store.commit('newThird');
            bus.$emit('intoEditMode',0);
        },
        del(){
            var target=$('.taskon');
            if(!target){
                alert("未选择目标")
                return;
            }
            if(target.tagName == 'LI'){
                var index=findObjReturnIndex(store.state.currentSecond['value'],target.innerText);
                store.commit('deletThird',index);
                store.commit('save');
            }

        },
        showDone(){
            store.commit("showDone");
            
        },
        showToDo(){
            store.commit("showToDo");
        },
        showAll(){
            store.commit("resetShow");
        }
    },
    created(){
    },
    // template:"<div id='middle'><ul><li v-for='item in second[\"value\"]' @click='selectThird'> {{item['name']}}</li></ul><div class='buttonArea'><button @click='add'>添加</button><button @click='del'>删除</button></div></div>"
    template:"<div id='middle'><div class='buttonArea'><button @click='showDone'>显示完成</button><button @click='showToDo'>显示未完成</button><button @click='showAll'>显示所有</button></div><div id='tasklist'><ul v-for='item in cluster' :key='item.name'><h2>{{item['name']}}</h2><li v-for='task in item[\"value\"]' @click='selectThird'> {{task['name']}}</li></ul></div><div class='buttonArea'><button @click='add'>添加</button><button @click='del'>删除</button>{{showingFlag}}</div></div>"
})

var right=new Vue({
    el:'#right',
    data:{
        isShowing:true,
        title:0,
        date:0,
        content:0,
    },
    computed:{
        third:function(){
            return store.state.currentThird;
        }
    },
    methods:{
        intoEditMode(){
            this.title=store.state.currentThird['name'];
            this.date=store.state.currentThird['date'];
            this.content=store.state.currentThird['value'];
            this.isShowing=false;
        },
        exit(){
            this.isShowing=true;
        },
        confirm(){
            this.isShowing=true;
            store.state.currentThird['value']= this.content;
            if(this.title==''){
                //let index=findObjWithItself(store.state.currentSecond['value'],store.state.currentThird)
                //store.commit('deletThird',index);
                //store.commit()
                //this.title=store.state.currentThird['name'];
                alert('任务名不能为空')
                return;
            }
            var time=Date.parse(this.date);
            if(isNaN(time)){
                alert('请输入正确日期')
                return;
            }
            var date=new Date(time);
            var year=date.getFullYear();
            var month=date.getMonth()+1;
            var day=date.getDate();
            this.date=year+'-'+month+'-'+day;
            store.state.currentThird['name']=this.title;
            store.state.currentThird['date']=this.date;
            
            
            store.commit('save');
        },
        complete(){
            store.commit('complete')
        },
        todo(){
            store.commit('todo')
        }
    },
    created(){
        bus.$on('intoEditMode',this.intoEditMode);
        bus.$on('changeThird',this.exit)
    },
    template:"<div id='right'><button @click='intoEditMode'>编辑</button><button id='confirm' @click='confirm'>确认</button><button @click='complete'>完成</button><button @click='todo'>没有完成</button><div v-if='isShowing'><h2>{{third['name']}}<p>{{third['date']}}</p><p>{{third['value']}}</p></h2></div><div v-else><input type='text' v-model='title'><p><input type='text' v-model='date'></p><textarea  cols='30' rows='10' v-model='content'></textarea></div></div>"

})