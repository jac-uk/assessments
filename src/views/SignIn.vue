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
        <div v-if="loginFail" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary" class="govuk-error-summary">
          <h2 id="error-summary-title" class="govuk-error-summary__title"> There is a problem </h2>
          <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
              <li>You may have the wrong link, or</li>
              <li>Your assessment is no longer required.</li>
            </ul>
          </div>
        </div>
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
      loginFail: false,
    };
  },
  async created() {
    if (this.$route.query.email && this.$route.query.ref) {
      // we have email and ref querystring parameters so try to sign in automatically
      const email = this.$route.query.email.replace(/ /g, '+');  // Quick fix for #28 `+` being stripped from emails in IA links
      const ref = this.$route.query.ref;
      const returnUrl = `${window.location.protocol}//${window.location.host}/sign-in`;
      const response = await functions.httpsCallable('generateSignInWithEmailLink')({ ref: ref, email: email, returnUrl: returnUrl });
      if (response && response.data && response.data.result) {
        window.localStorage.setItem('emailForSignIn', email);
        window.localStorage.setItem('signInDestination', ref + '/upload');
        return window.location.replace(response.data.result);
      } else {
        // console.log('mal-formed request');
        this.loginFail = true;
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
        } else {
          this.loginFail = true;
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
