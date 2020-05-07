<template>
  <div class="govuk-grid-column-two-thirds">
    <div class="govuk-panel govuk-panel--confirmation">
      <h1 class="govuk-panel__title">
        Assessment complete
      </h1>
      <!--<div class="govuk-panel__body">
        Confirmation message here
      </div>-->
    </div>

    <h2 class="govuk-heading-m">
      What happens next
    </h2>

    <p class="govuk-body">
      That's all. Thank you.
    </p>

    <p class="govuk-body">
      You can visit list of
      <router-link
        class="nav-link"
        :to="{name: 'assessments'}"
      >
        all requests for assessment
      </router-link>
      we sent to you.
    </p>
  </div>
</template>
