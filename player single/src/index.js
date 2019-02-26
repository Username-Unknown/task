Vue.prototype.$http = axios;



import mainpage from './mainpage.vue'
import player from './player.js'
new Vue(player);


const leftnav = {
	template:"<div id='main'><router-view></router-view></div>"
}



const router = new VueRouter({
	
	routes:[
		{path: '/', redirect: '/playlist/list1'},
		{ path: '/playlist', component: leftnav ,
		children: [
			{
				path: 'list1',
				component: mainpage,
				props:{listID:1}
			},
			{	path:'list2',
				component: mainpage,
				props:{listID:2}
			}	
			]
		 }
	] 
})


console.log(mainpage);
const app = new Vue({
  router
}).$mount('#app')
