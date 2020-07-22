import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

export default {
  namespaced: true,
  actions: {
    bindPending: firestoreAction(({ bindFirestoreRef }, assessorEmail) => {
      let firestoreRef = firestore
        .collection('assessments')
        .where('assessor.email', '==', assessorEmail)
        .where('status', '==', 'pending')
        .orderBy('dueDate', 'asc');

      return bindFirestoreRef('pending', firestoreRef, { serialize: vuexfireSerialize });
    }),
    bindComplete: firestoreAction(({ bindFirestoreRef }, assessorEmail) => {
      let firestoreRef = firestore
        .collection('assessments')
        .where('assessor.email', '==', assessorEmail)
        .where('status', '==', 'completed')
        .orderBy('dueDate', 'asc');

      return bindFirestoreRef('complete', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('pending') && unbindFirestoreRef('complete');
    }),
  },
  state: {
    records: [],
  },
};
