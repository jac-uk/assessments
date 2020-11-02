<template>
  <div>
    <LoadingMessage
      v-if="loading"
      :load-failed="loadFailed"
    />
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Assessments
        </h1>
        <p class="govuk-body">
          Problems signing in? Make sure you use the same email address we previously contacted you with.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import LoadingMessage from '@/components/LoadingMessage';
import { auth, functions } from '@/firebase';

export default {
  components: {
    LoadingMessage,
  },
  data() {
    return {
      loading: true,
      loadFailed: false,
      formData: {},
    };
  },
  async created() {
    if (this.$route.query.email && this.$route.query.ref) {
      // we have email and ref querystring parameters so try to sign in automatically
      const email = this.$route.query.email.replace(/ /g, '+');  // Quick fix for #28 `+` being stripped from emails in IA links
      const ref = this.$route.query.ref;
      const returnUrl = `${window.location.protocol}//${window.location.host}/sign-in`;
      const response = await functions.httpsCallable('generateSignInWithEmailLink')({ ref: ref, email: email, returnUrl: returnUrl });
      if (response.data.result) {
        window.localStorage.setItem('emailForSignIn', email);
        window.localStorage.setItem('signInDestination', ref + '/upload');
        return window.location.replace(response.data.result);
      } else {
        // console.log('mal-formed request');
        this.signOut();
      }
    } else if (this.$route.query.return) {
      // we have 'return' flag set so try to complete sign in
      if (auth().isSignInWithEmailLink(window.location.href)) {
        const email = window.localStorage.getItem('emailForSignIn');
        const ref = window.localStorage.getItem('signInDestination');
        if (email && ref) {
          const result = await auth().signInWithEmailLink(email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          window.localStorage.removeItem('signInDestination');
          await this.$store.dispatch('auth/setCurrentUser', result.user);
          this.$router.replace(ref);
        }
      }
    }
    this.loading = false;
  },
  methods: {
    async signOut() {
      await auth().signOut();
    },
  },
};
</script>
