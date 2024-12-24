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
        <div
          v-if="loginFail"
          aria-labelledby="error-summary-title"
          role="alert"
          tabindex="-1"
          data-module="govuk-error-summary"
          class="govuk-error-summary"
        >
          <h2
            id="error-summary-title"
            class="govuk-error-summary__title"
          >
            {{ loginError.title }}
          </h2>
          <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
              <li>{{ loginError.message }}</li>
            </ul>
          </div>
        </div>
        <p class="govuk-body">
          Problems signing in?<br>
          Please contact <a href="mailto:enquiries@judicialappointments.gov.uk">enquiries@judicialappointments.gov.uk</a> using the same email address we have contacted you with.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import LoadingMessage from '@/components/LoadingMessage.vue';
import { httpsCallable } from '@firebase/functions';
import { isSignInWithEmailLink, signInWithEmailLink } from '@firebase/auth';
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
      loginError: {
        title: 'Invalid sign-in link',
        message: 'The sign-in link is invalid.',
      },
    };
  },
  async created() {

    try {
      // assessor can get the token from requesting sign-in link, then use will receive the sign-in link with the token
      if (this.$route.query.token) {
        const token = this.$route.query.token;
        const returnUrl = `${window.location.protocol}//${window.location.host}/sign-in`;

        // create firebase email link with token
        const response = await httpsCallable(functions, 'createFirebaseEmailLink')({ token, returnUrl });

        const { success, emailLink, ref, email, errorMsg } = response.data;

        if (success) {
          // save email and ref to local storage for firebase email link sign in
          window.localStorage.setItem('emailForSignIn', email);
          window.localStorage.setItem('signInDestination', `${ref}/upload`);

          // redirect to firebase email link
          return window.location.replace(emailLink);
        } else {
          console.error('sign in with email link failed', errorMsg);
          this.loginFail = true;
          this.loginError = this.mapLoginError(errorMsg);
          this.signOut();
        }
      } else if (this.$route.query.return) { // firebase email link sign in
        // we have 'return' flag set so try to complete sign in
        if (isSignInWithEmailLink(auth, window.location.href)) {

          // get email and ref from local storage from creating firebase email link process
          const email = window.localStorage.getItem('emailForSignIn');
          const ref = window.localStorage.getItem('signInDestination');
          if (email && ref) {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            // email in user object from signInWithEmailLink will be converted to lowercase which might cause query issue
            if (result && result.user && result.user.email !== email) {
              result.user.email = email;
            }
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
    }
    catch (err) {
      console.error('ERR', err);
      this.loadFailed = true;
    }
  },
  methods: {
    async signOut() {
      await auth.signOut();
    },
    mapLoginError(error) {
      switch (error) {
      case 'token-expired':
        return {
          title: 'Sign-in link expired',
          message: 'The sign-in link has expired, please request a new one.',
        };
      case 'cannot-access':
        return {
          title: 'Can not access the assessment',
          message: 'The assessor of the assessment has changed.',
        };
      case 'invalid-token':
      default:
        return {
          title: 'Invalid sign-in link',
          message: 'The sign-in link is invalid.',
        };
      }
    },
  },
};
</script>
