import Vue from 'vue';
import App from './App.vue';
import * as filters from '@/filters';
import router from '@/router';
import store from '@/store';
//import firebase from '@firebase';

Vue.config.productionTip = false;

// Register global filters
Object.keys(filters)
  .forEach((filterName) => {
    Vue.filter(filterName, filters[filterName]);
  });

let vueInstance = false;

if (!vueInstance) {
  vueInstance = new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store,
  });
}
