<template>
<div class='bar' ref='bar'　@mousedown='onMouseDown'>
	<div class='cur' v-bind:style='{width:curper+"%"}'>
		<div  class='btnOfBar' ref='ball' @mousedown='onBallDown'>
		</div>
	</div>
</div>
</template>

<script>
import {getElementViewLeft} from '../utils.js'

export default{
	props:{
		curper:Number
	},
	data:function(){
		return{
			percentage:0
		}
	},
	computed:{
		barWidth:function(){
			return this.$refs.bar.clientWidth;
		}
	},
	methods:{
		onMouseDown(e){
			console.log("点击了条(子组件)");
			this.percentage = (e.clientX - getElementViewLeft(this.$refs.bar))*100/ this.barWidth;
			 (this.percentage);
			this.$emit('click-in-bar', this.percentage)
		},
		onBallDown(e){
			e.preventDefault();
			console.log("点击了球(子组件)");
			this.$emit('clickinball',0);
			
			document.addEventListener('mousemove', this.onDocumentMouseMove);
			document.addEventListener('mouseup', this.onDocumentMouseUp);
		},
		onDocumentMouseMove(e){
			console.log("拖动球");
			this.percentage =Math.max(0,Math.min(100,(e.clientX - getElementViewLeft(this.$refs.bar))*100/ this.barWidth));
			this.$emit('indrag', this.percentage);
		},
		onDocumentMouseUp(){
			console.log("鼠标放开(子组件)");
			this.$emit('dragend', this.percentage)
			document.removeEventListener('mouseup', this.onDocumentMouseUp)
			document.removeEventListener('mousemove', this.onDocumentMouseMove)
		} 
	}
}
</script>