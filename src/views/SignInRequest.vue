<template>
  <div>
    <LoadingMessage
      v-if="loading"
      :load-failed="requestFailed"
    />
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Assessments
        </h1>

        <!-- error message -->
        <div
          v-if="requestFailed"
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
            There is a problem when requesting sign-in link
          </h2>
          <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
              <li>You may have the wrong link, or</li>
              <li>Your assessment is no longer required.</li>
            </ul>
          </div>
        </div>

        <!-- success message -->
        <div
          class="govuk-notification-banner govuk-notification-banner--success"
          role="alert"
          aria-labelledby="govuk-notification-banner-title"
          data-module="govuk-notification-banner"
        >
          <div class="govuk-notification-banner__header">
            <h2
              id="govuk-notification-banner-title"
              class="govuk-notification-banner__title"
            >
              Success
            </h2>
          </div>
          <div class="govuk-notification-banner__content">
            <h3 class="govuk-notification-banner__heading">
              A sign-in link has been sent to your email
            </h3>
            <p class="govuk-body">
              Click the sign-in link in your email for starting the assessment.
            </p>
          </div>
        </div>

        <!-- contact JAC -->
        <p class="govuk-body">
          Problems receiving a sign link from your email?<br>
          Please contact <a href="mailto:enquiries@judicialappointments.gov.uk">enquiries@judicialappointments.gov.uk</a> using the same email address we have contacted you with.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import LoadingMessage from '@/components/LoadingMessage.vue';
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';

export default {
  components: {
    LoadingMessage,
  },
  data() {
    return {
      loading: true,
      requestFailed: false,
      formData: {},
    };
  },
  async created() {

    try {

      console.log('this.$route.query:');
      console.log(this.$route.query);

      const identity = this.$route.query.identity;
      const ref = this.$route.query.ref;
      const assessmentId = ref.split('/').length > 1 ? ref.split('/')[1] : null;

      if (identity && assessmentId) {
        this.loading = true;
        const response = await httpsCallable(functions, 'sendAssessmentSignInLink')({ assessmentId, identity });
        console.log('RESPONSE:');
        console.log(response);
        if (response && response.data) {
          console.log('response.data.result:');
          console.log(response.data.result);

        } else {
          console.log('mal-formed request');
          this.requestFailed = true;
        }
      }
    }
    catch (err) {
      console.log('ERR:');
      console.log(err);
      this.requestFailed = true;

    } finally {
      this.loading = false;
    }
  },
  methods: {

  },
};
</script>
