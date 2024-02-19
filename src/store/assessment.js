
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import clone from 'clone';
import { doc, collection, setDoc, serverTimestamp } from '@firebase/firestore';

const collectionName = 'assessments';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = doc(collectionRef, id);

      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),

    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    save: async ({ state }, data) => {
      // Update the CRUD timestamps
      if (!data.submittedDate){
        data.submittedDate = serverTimestamp();
      }
      data.updatedDate = serverTimestamp();

      const ref = doc(collectionRef, state.record.id);
      await setDoc(ref, data, { merge: true });
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    record: null,
  },
  getters: {
    id: (state) => {
      if (state.record === null) return null;
      return state.record.id;
    },
    data: (state) => () => {
      return clone(state.record);
    },
  },
};
