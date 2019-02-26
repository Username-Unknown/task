import progressbar from './progressbar.vue'
import volumebar from './volumebar.vue'
import playlist from './playlist.vue'
import bus from './bus.js'
export default{
	el:"#player",
	data:{	
			music:[],
			index:0,
			curper:0,
			playedtime:'00:00/00:00',
			showlist:'hidden',
			volume:75,
			showVolumeBar:'hidden',
			muted:'muted:no'
		},
	components:{
		'progress-bar':progressbar,
		'playlist':playlist,
		'volume-bar':volumebar
	},
	computed:{
		nowMusic() {//当前播放的src
			if(this.music[this.index]==undefined)
				return " ";
			console.log('src变了');
			return this.music[this.index]["src"]
		},
		audio() {//用ref获取audio标签
			return this.$refs.audio
		},
		length(){//歌单长度
			console.log("长度变了");
			return this.music.length
		},
		songname(){
			if(this.music[this.index]==undefined)
				return " ";
			return this.music[this.index]["name"];
		}
		
	},
	methods:{
		toggleplay(){
			if (!this.audio.paused) {
				console.log('pause()');
				  this.pause()
				} else {
				  console.log('paly()');
				  this.play()
			}
		},
		togglelist(){
			if(this.showlist=='hidden')
				this.showlist='visible';
			else
				this.showlist='hidden';
		},
		play(){
			this.audio.play()
			$(".play").css("background-position","-1px -164px");
		},
		pause(){
			this.audio.pause()
			$(".play").css("background-position","-1px -204px");
		},
		pre(){
			if(this.index!=0){
				this.index--;
			}else{
				this.index=this.length-1;
			}
			var pstat=this.audio.paused;//保存之前状态，用来实现 暂停时上下一曲不自动播放，播放时上下一曲自动播放
			var wtacher =this.nowMusic;
			this.audio.load();
			if(!pstat)
				this.play();
		},
		nxt(){
			
			if(this.index!=this.length-1){
				this.index++;
			}else{
				this.index=0;
			}
			var pstat=this.audio.paused;
			this.audio.src=this.nowMusic;
			this.audio.load();
			if(!pstat)
				this.play();
		},	
		timeformater(time){//格式xxx秒的时间为xx:xx
			if(isNaN(time))
				return "00:00"
			let min=Math.floor(time/60);
			let sec=Math.floor(time%60);
			if(sec<10)
				sec='0'+sec;
			if(min<10)
				min='0'+min;
			return min+':'+sec;
		},
		onTimeUpdate(){
			var ct = this.audio.currentTime;
			var du = this.audio.duration;
			this.playedtime=this.timeformater(ct)+'/'+this.timeformater(du);
			this.curper=ct/du*100;
		},
		onclickInBar(val){
			console.log("点击了条(父组件)");
			this.curper=val;
			this.audio.currentTime=val/100*this.audio.duration;
		},
		clickinball(){
			console.log("点击了球(父组件)");
			this.audio.removeEventListener('timeupdate', this.onTimeUpdate)
		},
		indrag(val){
			let du = this.audio.duration;
			let ct = du*val/100;
			this.playedtime=this.timeformater(ct)+'/'+this.timeformater(du);
			this.curper=val;
		},
		dragend(val){
			console.log("鼠标放开(父组件)");
			this.curper=val;
			this.audio.currentTime=val/100*this.audio.duration;
			this.audio.addEventListener('timeupdate', this.onTimeUpdate);
		},
		onMouseDown(e){//用来检测点击区域以关闭playlist
			 (e.target);
			if(!this.$el.contains(e.target)){
				this.showlist='hidden';
			}
		},
		onclickInVolumeBar(val){
			this.audio.volume=val/100;
		},
		indexChange(val){//playlist传出改变正在播放歌曲下标的事件
			this.index=val;
			this.audio.src=this.nowMusic;
			this.audio.load();
			this.play();
		},
		newsong(val){//检测是否存在，不存在则加入，但是否存在都播放该歌曲
			 (val["name"]);
			let i=0;
			let flag=false;
			for(i=0;i<this.length;i++){//找同src
				if(this.music[i]['src']==val['src']){
					flag=true;
					console.log('已存在');
					break;
				}
			}
			if(flag==false){//没找到是新歌
				this.music.push(val);                                    
				this.$http({//传给服务器
					url:'http://127.0.0.1:8080/addtolist',
					method: 'post',
					headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			},
					data: {
						src:val,
					}
				})
			}
			this.index=i;
			this.audio.src=this.nowMusic;
			this.audio.load();
			this.play();
		},
		deletFromList(val){//传入的参数val是下标
			console.log("下标是"+val);
			var delet=this.music.splice(val,1);
			 (delet[0]);
			this.$http({//传给服务器
				url:'http://127.0.0.1:8080/deletFromList',
				method: 'post',
				headers:{
					'Content-Type':'application/x-www-form-urlencoded'
			},
				data: {
					src:delet[0],
				}
			})
		},
		getData () {
			this.$http({
			//
			url:'http://127.0.0.1:8080/page.json',
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			},
			data: {
				page:1,
				page_size:5
			},
			params: {
				listID:0
			},
			responseType:'json',
			//withCredentials:false ,
		}).then((response)=>{
			//console.log("ajax 返回");
			 (response.data[1]);
			 (typeof(response.data[1]));
			this.$data.music=response.data;
			console.log(this.$data.music);
			this.init();
		});
		},
		onVolumeInDrag(val){
			this.audio.volume=val/100
		},
		togglemuted(){
			console.log("点击了静音键");
			//this.audio.volume=0;
			if(this.audio.muted){
				this.muted="muted:no";
				this.audio.muted = !this.audio.muted;
			}else{
				this.muted="muted:yes";
				this.audio.muted = !this.audio.muted;
			}
			
		},
		entermuted(){
			this.showVolumeBar='visible';
		},
		outmuted(){
			this.showVolumeBar='hidden';
		},
		audioend(){
			
			this.pause()
		},
		init(){
			console.log("初始化");
			 (this.$data.music);
			this.audio.src=this.nowMusic;//装载第一首歌的src
			this.audio.load();
			this.audio.volume=this.volume/100;
			 (this.audio.volume);
			this.audio.addEventListener('timeupdate', this.onTimeUpdate);//监听事件
			document.addEventListener('mousedown', this.onMouseDown)
		}
	},
	mounted(){
		this.init();
	},
	created(){
		console.log("created");
		this.getData ();
		bus.$on('newsong',this.newsong);
	}
}