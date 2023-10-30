import { createApp } from 'vue';
import App from './App.vue';
import * as filters from '@/filters';
import router from '@/router';
import store from '@/store';
import { auth } from '@/firebase';
import * as Sentry from '@sentry/vue';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import './main.scss';

import mitt from 'mitt';
const emitter = mitt();

let vueInstance = false;
auth().onAuthStateChanged( (user) => {
  store.dispatch('auth/setCurrentUser', user);

  // Create the Vue instance, but only once
  if (!vueInstance) {

    vueInstance = createApp(App)
      .use(router)
      .use(store)
      .use(VueDOMPurifyHTML);

    // Bind global filters before mounting
    vueInstance.config.globalProperties.$filters = filters;

    // Bind emitter for global events
    vueInstance.config.globalProperties.emitter = emitter;

    if (process.env.NODE_ENV !== 'development') {
      Sentry.init({
        app: vueInstance,
        dsn: 'https://23ac92825117451eb421535be7e4c334@o323827.ingest.sentry.io/5301649',
        environment: store.getters.appEnvironment.toLowerCase(),
        release: process.env.PACKAGE_VERSION,
        integrations: [
          new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          }),
        ],
      });
    }

    vueInstance.mount('#app');
  }
});
