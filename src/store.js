import { createStore } from 'vuex';

// Vuex modules
import auth from '@/store/auth';
import assessment from '@/store/assessment';
import assessments from '@/store/assessments';

// const store = new Vuex.Store({
const store = createStore({
  // Don't use strict mode in production for performance reasons (https://vuex.vuejs.org/guide/strict.html)
  strict: import.meta.env.NODE_ENV !== 'production',
  modules: {
    auth,
    assessment,
    assessments,
  },
  state: {
    packageVersion: import.meta.env.PACKAGE_VERSION || '0',
  },
  mutations: {},
  actions: {},
  getters: {
    appVersion: (state) => {
      return state.packageVersion;
    },
    appEnvironment: () => {
      const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      if (projectId.indexOf('-develop') >= 0) {
        return 'DEVELOP';
      }
      if (projectId.indexOf('-staging') >= 0) {
        return 'STAGING';
      }
      if (projectId.indexOf('-production') >= 0) {
        return 'PRODUCTION';
      }
      return '';
    },
  },
});

export default store;
