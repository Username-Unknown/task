<template>
	<div class='playlist' v-bind:style='{visibility:showlist}'>
		<ul @click='clickInList' >
			<li v-for='item in music' ref='li'>
				{{item['name']}}
				<button type='button' @click='clickInDelet'>
					删除
				</button>
			</li>
		</ul>
	</div>
</template>

<script>

export default{
	props:{
		music:Array,
		showlist:String
	},
	computed:{
		li:function(){//获取dom元素组成的数组
			return this.$refs.li
		}
	},
	methods:{
		clickInList(e){//找到点的是第几首歌
			let i=0;
			for(i=0;i<this.li.length;i++){
				if(this.li[i]==e.target){
					console.log(i);
					this.$emit('index-change',i);
				}
			}
		},
		clickInDelet(e){
			let i=0;
			for(i=0;i<this.li.length;i++){
				if(this.li[i].contains(e.target)){
					
					console.log("下标是"+i);
					this.$emit('delet',i);
				}
			}
		}
}
}
</script>