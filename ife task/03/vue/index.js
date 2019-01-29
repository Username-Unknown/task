function findObjWithName(arr,name){

    for(var project of arr){  
        if(project['name'] == name){
            return project;
        }
    }
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
var storage=window.localStorage;
var currentFirst; //当前选中的第一级
var currentSecond={};//当前选中的第二级
var datawork;
var currentFourth;
var bianliang=123;
datawork=JSON.parse(storage.getItem("project"))
currentSecond=datawork[1]['value'][0]
var bus=new Vue()
var left=new Vue({
    el:'#left',
    data:{
        index:0,
        data:datawork,
        Second:currentSecond
    },
    computed:{
        taskNumber:function(){
            var res=[];
            for(let tasksheet of datawork){
                var number=0;
                for(let tasklist of tasksheet['value'] ){
                    number+=tasklist['value'].length;
                    console.log(number);
                }
                res.push(number)
            }
            return res;
        }
    },
    methods:{
        deletFirst(){
            console.log('删除'); 
            datawork.splice(-1,1);

        },
        test(){
            console.log(this.data);
            console.log(datawork);
        },
        selectSecond(event){
            var target=event.target;
            if(target.tagName=='SPAN'){
                target=target.parentNode;
            }
            currentFirst=findObjWithName(datawork,target.parentNode.firstElementChild.childNodes[0].data)
            currentSecond=findObjWithName(currentFirst['value'],target.childNodes[0].data);
            bus.$emit('secondChanged',currentSecond);
            console.log('selectSecond');
        }
    },
    mounted(){     
    },
    template:"<ul><button @click='deletFirst'>删除</button><button @click='test'>测试</button><li v-for='(item, index) in data' @click='selectSecond'> <ul><h2>{{item['name']}}<span>({{taskNumber[index]}})</span></h2><li v-for='tasklist in item[\"value\"]'>{{tasklist['name']}}<span>({{tasklist['value'].length}})</span></li></ul></li></ul>"
})
var middle=new Vue({
    el:'#middle',
    data:{
        second:null,
        tem:null
    },
    computed:{

    },
    mounted(){
        //this.Second=currentSecond
    },
    methods:{
        secondChanged(newSecond){
            this.second=newSecond;
            console.log('newsceond')
        }
    },
    created(){
        bus.$on('secondChanged',this.secondChanged);
    },
    template:"<ul>{{tem}}{{second['name']}}<li v-for='item in second[\"value\"]'> {{item['name']}}</li></ul>"
})
