import { auth } from '@/firebase';

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
          const signInMethods = await auth().fetchSignInMethodsForEmail(user.email);
          if (signInMethods && signInMethods.length > 0 && signInMethods.indexOf(auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) >= 0) {
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
          auth().signOut();
          commit('setAuthError', 'This site is restricted'); // @TODO Use agreed error message
        }
      }
    },
  },
  getters: {
    isSignedIn(state) {
      return (state.currentUser !== null);
    },
  },
};

export default module;
