import Vue from 'vue';
import App from './App.vue';
import * as filters from '@/filters';
import router from '@/router';
import store from '@/store';
import { auth } from '@/firebase';
//import firebase from '@firebase';

Vue.config.productionTip = false;

// Register global filters
Object.keys(filters)
  .forEach((filterName) => {
    Vue.filter(filterName, filters[filterName]);
  });

let vueInstance = false;

auth().onAuthStateChanged(async (user) => {
  // Bind Firebase auth state to the vuex auth state store
  await store.dispatch('auth/setCurrentUser', user);
  // Create the Vue instance, but only once
  if (!vueInstance) {
    vueInstance = new Vue({
      el: '#app',
      render: h => h(App),
      router,
      store,
    });
  }
});
