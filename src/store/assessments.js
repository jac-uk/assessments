import { query, collection, where, orderBy } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

export default {
  namespaced: true,
  actions: {
    bindPending: firestoreAction(({ bindFirestoreRef }, assessorEmail) => {
      const firestoreRef = query(
        collection(firestore, 'assessments'),
        where('assessor.email', '==', assessorEmail),
        where('status', '==', 'pending'),
        orderBy('dueDate', 'asc')
      );

      return bindFirestoreRef('pending', firestoreRef, { serialize: vuexfireSerialize });
    }),
    bindDecline: firestoreAction(({ bindFirestoreRef }, assessorEmail) => {
      const firestoreRef = query(
        collection(firestore, 'assessments'),
        where('assessor.email', '==', assessorEmail),
        where('status', '==', 'declined'),
        orderBy('dueDate', 'asc')
      );

      return bindFirestoreRef('decline', firestoreRef, { serialize: vuexfireSerialize });
    }),
    bindComplete: firestoreAction(({ bindFirestoreRef }, assessorEmail) => {
      const firestoreRef = query(
        collection(firestore, 'assessments'),
        where('assessor.email', '==', assessorEmail),
        where('status', '==', 'completed'),
        orderBy('dueDate', 'asc')
      );

      return bindFirestoreRef('complete', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('pending') && unbindFirestoreRef('complete');
    }),
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    records: [],
  },
};
