<template>
  <div>
    <div
      v-if="!loadFailed"
      ref="loadingMessage"
    >
      <span class="spinner-border spinner-border-sm" />
      Loading...
    </div>
    <div
      v-else
      ref="errorMessage"
    >
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h1>Something went wrong</h1>
          <p>Reload the page and try again</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '@/firebase';
export default {
  props: {
    loadFailed: Boolean,
  },
  watch: {
    loadFailed: function(newVal) {
      if (newVal == true){
        // If we fail to load, log the user out
        auth.signOut();
      }
    },
  },
};
</script>

<style scoped>
@-webkit-keyframes spinner-border {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spinner-border {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: spinner-border .75s linear infinite;
  animation: spinner-border .75s linear infinite;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}
</style>
