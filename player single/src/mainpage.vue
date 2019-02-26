<template>
<div id='main'>
	<ul @click='clickInList' v-if='isloaded'>
		<li v-for='item in music' ref='li'>
			{{item['name']}}
		</li>
	</ul>
	<div v-else>
		loading
	</div>
</div>
</template>

<script>

import bus from './bus.js';
var container;
var instance = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  timeout: 2500,
});	

instance.interceptors.request.use(function(config){
	container.$data.isloaded=false;
	console.log('拦截器');
	return config;
})
export default{
	props:{
		listID:Number
	},
	data:function(){
			return {
				music:[
					{"name":"梦灯笼","src":"music/123.mp3"},
					{"name":"なんでもないや","src":"music/321.mp3"},
					{"name":"前前前世","src":"music/113.mp3"}
				],
				isloaded:false
				}
		},
	computed:{
		li:function(){//获取dom元素组成的数组
			return this.$refs.li
		}
	},
	methods:{
		clickInList(e){
			let i=0;
			for(i=0;i<this.li.length;i++){
				if(this.li[i]==e.target){
					 (i);
					bus.$emit('newsong',this.music[i]);
				}
			}
		}
	},
	mounted(){		
		console.log('mainpage加载');
		var self=this;
		container=this;
		instance.get('/page.json',{
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		},
		params: {
			listID:self.listID
		},
		responseType:'json',
		}).then((response)=>{
				console.log(response.data);
				 (typeof(response.data[1]));
				this.$data.music=response.data;
				this.$data.isloaded=true;
				
		});
	}

}
</script>