<template>
<div class='vloumebar' ref='bar' @click='onclick'　@mousedown='onMouseDown' v-bind:style='{visibility:showvolumebar}'>
	<div class='vloumecur' v-bind:style='{height:100-percentage+"%"}'>
	</div>
</div>
</template>

<script>
import {getElementViewTop} from '../utils.js'

export default{
	props:{
		volume:Number,
		muted:String,
		showvolumebar:String
	},
	data:function(){
		return{
			percentage:this.volume
		}
	},
	computed:{
		barHeight:function(){
			return this.$refs.bar.clientHeight;
		}
	},
	methods:{
		onMouseDown(e){
			e.preventDefault();
			e.stopPropagation();//阻止产生点击bar的事件
			console.log("点击了音量条(子组件)");
			this.percentage = 100-(e.clientY - getElementViewTop(this.$refs.bar))*100/ this.barHeight;
			 (this.percentage);
			this.$emit('click-in-volume-bar', this.percentage)
			document.addEventListener('mousemove', this.onDocumentMouseMove);
			document.addEventListener('mouseup', this.onDocumentMouseUp);
		},
		onDocumentMouseMove(e){
			 ("拖动球");
			this.percentage =100-Math.max(0,Math.min(100,(e.clientY - getElementViewTop(this.$refs.bar))*100/ this.barHeight));
			this.$emit('volume-indrag', this.percentage);
		},
		onDocumentMouseUp(e){
			 ("鼠标放开(子组件)");
			
			document.removeEventListener('mouseup', this.onDocumentMouseUp)
			document.removeEventListener('mousemove', this.onDocumentMouseMove)
		},
		onclick(e){
			e.stopPropagation();
		}
	}
}
</script>