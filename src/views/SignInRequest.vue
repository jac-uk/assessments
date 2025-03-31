<template>
  <div>
    <LoadingMessage
      v-if="loading"
      :load-failed="success"
    />
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Assessments
        </h1>

        <!-- success message -->
        <div
          v-if="!loading && success"
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
              An assessment sign-in link has been sent to your email
            </h3>
            <p class="govuk-body">
              You should receive an email with a sign-in link shortly.<br>
              Click on the link to start the assessment.<br><br>
              Note that the link will expire in 5 minutes.<br>
              You can request a new link by refreshing this page.
            </p>
          </div>
        </div>

        <!-- error message -->
        <div
          v-if="!loading && !success"
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
      success: false,
      formData: {},
    };
  },
  async created() {
    try {
      const identity = this.$route.query.identity;
      const ref = this.$route.query.ref;
      const assessmentId = ref.split('/').length > 1 ? ref.split('/')[1] : null;

      if (identity && assessmentId) {
        this.loading = true;
        const response = await httpsCallable(functions, 'sendAssessmentSignInLink')({ assessmentId, identity });
        let success = false;
        if (response && response.data) {
          success = response.data;
        }
        this.success = success;
      }
    }
    catch (err) {
      this.success = false;
    } finally {
      this.loading = false;
    }
  },
  methods: {

  },
};
</script>
