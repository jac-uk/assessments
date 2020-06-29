import Vue from 'vue';
import App from './App.vue';
import * as filters from '@/filters';
import router from '@/router';
import store from '@/store';
import { auth } from '@/firebase';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://23ac92825117451eb421535be7e4c334@o323827.ingest.sentry.io/5301649',
    environment: process.env.NODE_ENV,
    release: process.env.npm_package_version,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
  });
}
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
  if (store.getters['auth/isSignedIn']) {
    if (window.location.pathname == '/sign-in') {
      router.push('/assessments');
    }
  }
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
