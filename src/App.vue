<template>
  <div class="govuk-width-container">
    <div class="govuk-main-wrapper">
      <header class="header">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-half">
            <!-- HEADER SECTION -->
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-two-thirds">
                <div class="gem-c-organisation-logo brand--ministry-of-justice">
                  <img
                    src="@/assets/jac-logo.svg"
                    alt="Judicial Appointments Commission"
                    width="197"
                    height="66"
                    style="text-align: center"
                  >
                </div>
              </div>
              <div class="govuk-grid-column-one-third text-right">
                <button
                  v-if="isSignedIn && $route.name !== 'sign-in'"
                  class="govuk-button"
                  @click="signOut"
                >
                  Sign Out
                </button>
              </div>              
            </div>
            <!-- HEADER SECTION -->
          </div>
        </div>
      </header>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-full">
          <div class="govuk-phase-banner">
            <p class="govuk-phase-banner__content">
              <strong class="govuk-tag govuk-phase-banner__content__tag">
                alpha
              </strong>
              <span class="govuk-phase-banner__text">
                This is a new service – your feedback will help us improve it.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <main id="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script>
import { auth } from '@/firebase';
export default {
  name: 'App',
  computed: {
    isSignedIn() {
      return this.$store.getters['auth/isSignedIn'];
    },
  },
  methods: {
    async signOut() {
      await auth().signOut();
      this.$router.go('/sign-in');
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss">
// Required to include global main.scss styles
.govuk-grid-column-one-half {
  width: 100%;
  float: left;
}
.header {
  background-color: #fafafa;
  padding: 1.25em 0.625em 0 0.625em;
};

.govuk-main-wrapper {
  padding-top: 0px;
}
</style>
