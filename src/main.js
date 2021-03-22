import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
// import './assets/style/main.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(require('vue-moment'));

// Styles
import "./styles/styles.scss";


// Vue.directive('click-outside', {
//   bind: function (el, binding, vnode) {
//     el.clickOutsideEvent = function (event) {
//       // here I check that click was outside the el and his children
//       if (!(el == event.target || el.contains(event.target))) {
//         // and if it did, call method provided in attribute value
//         vnode.context[binding.expression](event);
//       }
//     };
//     document.body.addEventListener('click', el.clickOutsideEvent)
//   },
//   unbind: function (el) {
//     document.body.removeEventListener('click', el.clickOutsideEvent)
//   },
// });

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


