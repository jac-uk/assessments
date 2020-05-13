import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';

Vue.use(Vuex);

// Vuex modules
import auth from '@/store/auth';
import assessment from '@/store/assessment';
import assessments from '@/store/assessments';

const store = new Vuex.Store({
  // Don't use strict mode in production for performance reasons (https://vuex.vuejs.org/guide/strict.html)
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    auth,
    assessment,
    assessments,
  },
  state: {},
  mutations: {
    ...vuexfireMutations,
  },
  actions: {},
  getters: {},
});

export default store;
