<template>
  <div class="govuk-grid-column-two-thirds">
    <div class="govuk-panel govuk-panel--confirmation">
      <h1 class="govuk-panel__title">
        Assessment complete
      </h1>
      <div class="govuk-panel__body">
        Please treat this as confirmation of your submission. You do not need to contact the JAC.
      </div>
    </div>

    <h2 class="govuk-heading-m">
      What happens next
    </h2>

    <p class="govuk-body">
      Your assessment has been passed to the selection exercise team who will review it. 
      Thank you for taking the time to complete this assessment. 
    </p>

    <p class="govuk-body">
      You can visit list of
      <router-link
        class="nav-link"
        :to="{name: 'assessments'}"
      >
        all requests for assessment
      </router-link>
      we have sent to you.
    </p>
  </div>
</template>
