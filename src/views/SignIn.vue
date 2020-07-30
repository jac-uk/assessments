<template>
  <div>
    <div
      v-if="emailLinkSent"
      class="govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-6"
    >
      <h1 class="govuk-panel__title">
        Sign in link sent
      </h1>
      <div class="govuk-panel__body">
        An email has been sent to {{ formData.email }}.<br>
        Please follow the link in the email to complete sign in.
      </div>
    </div>    
    <LoadingMessage
      v-else-if="loading"
      :load-failed="loadFailed"
    />
    <div
      v-else
      class="govuk-grid-row"
    >
      <form @submit.prevent="loginWithEmail">
        <div class="govuk-grid-column-two-thirds">
          <h1 class="govuk-heading-l">
            Sign in
          </h1>

          <ErrorSummary :errors="errors" />

          <TextField
            id="email"
            v-model="formData.email"
            label="Email address"
            type="email"
            required
          />

          <button class="govuk-button">
            Continue
          </button>

          <p class="govuk-body">
            Problems signing in? Make sure you use the same email address we previously contacted you with.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import LoadingMessage from '@/components/LoadingMessage';
import ErrorSummary from '@/components/Form/ErrorSummary';
import Form from '@/components/Form/Form';
import TextField from '@/components/Form/TextField';
import { auth, functions } from '@/firebase';

export default {
  components: {
    LoadingMessage,
    ErrorSummary,
    TextField,
  },
  extends: Form,
  data() {
    return {
      loading: true,
      loadFailed: false,
      emailLinkSent: false,
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
    async loginWithEmail() {
      this.validate();
      if (this.isValid()) {
        this.loading = true;
        const actionCodeSettings = {
          url: `${window.location.protocol}//${window.location.host}/sign-in?return=true`,
          handleCodeInApp: true,
        };
        await auth().sendSignInLinkToEmail(this.formData.email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', this.formData.email);
        window.localStorage.setItem('signInDestination', '/assessments');
        this.loading = false;
        this.emailLinkSent = true;
      }
    },
  },  
};
</script>
