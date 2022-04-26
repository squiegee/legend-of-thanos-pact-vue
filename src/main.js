import Vue from 'vue' //vue - https://github.com/vuejs/vue
import App from './App.vue' //our app
import Vuex from 'vuex' //vuex - https://github.com/vuejs/vuex
import {store} from './store/index.js' //vue store - https://github.com/vuejs/vuex
import router from './router.js' //vue router - https://github.com/vuejs/vue-router
import ScrollDiv from 'vue-scroll-div';  //vue scroll div - https://github.com/pekonchan/ScrollDiv
import VueScreen from 'vue-screen'; //vue-screen - https://github.com/reegodev/vue-screen
import Pact from "pact-lang-api"; //pact lang api - https://github.com/kadena-io/pact-lang-api
import Buefy from 'buefy' //buefy - https://github.com/buefy/buefy
import '../public/buefy/bulma.scss' //buefy/bulma styles

Vue.config.productionTip = false //turn off vue tips

//use our plugins
Vue.use(Vuex);
Vue.use(ScrollDiv);
Vue.use(VueScreen);
Vue.use(Pact);
Vue.use(Buefy)

//mount our app
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
