import { auth, functions } from '@/firebase';
import { httpsCallable } from '@firebase/functions';

const module = {
  namespaced: true,
  state: {
    currentUser: null,
    authError: null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setAuthError(state, message) {
      state.authError = message;
    },
  },
  actions: {
    async setCurrentUser({ state, commit }, user) {
      if (user === null) {
        commit('setCurrentUser', null);
      } else {
        if (state.authError) { commit('setAuthError', null); }
        let allOk = false;
        if (user.emailVerified) {
          const response = await httpsCallable(functions, 'checkSignInMethodsForEmail')();
          if (response.data) {
            allOk = true;
          }
        }
        if (allOk) {
          commit('setCurrentUser', {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
          });
        } else {
          auth.signOut();
          commit('setAuthError', 'This site is restricted'); // @TODO Use agreed error message
        }
      }
    },
  },
  getters: {
    isSignedIn(state) {
      return (state.currentUser !== null);
    },
    currentUserId(state) {
      if (state.currentUser !== null) {
        return state.currentUser.uid;
      } else {
        return '';
      }
    },
  },
};

export default module;
