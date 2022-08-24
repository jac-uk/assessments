<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <router-link
        class="govuk-back-link"
        to="/assessments"
      >
        View All Assessments
      </router-link>

      <h1 class="govuk-heading-l">
        Review Assessment
      </h1>

      <div
        v-if="assessment"
      >
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">
              Exercise
            </dt>
            <dd class="govuk-summary-list__value">
              <p class="govuk-body-s">
                <span class="govuk-caption-m">{{ assessment.exercise.referenceNumber }}</span>
              </p>
              <p class="govuk-body">
                {{ assessment.exercise.name }}
              </p>
            </dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">
              Candidate
            </dt>
            <dd class="govuk-summary-list__value">
              <p class="govuk-body">
                {{ assessment.candidate.fullName }}
              </p>
            </dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">
              Due date
            </dt>
            <dd class="govuk-summary-list__value">
              {{ assessment.dueDate | formatDate('datetime') }}
            </dd>
          </div>
          <div 
            v-if="assessment.updatedDate"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              Last uploaded
            </dt>
            <dd class="govuk-summary-list__value">
              {{ assessment.updatedDate | formatDate }}
            </dd>
          </div>
        </dl>

        <h2 class="govuk-heading-m">
          Review Independent Assessment
        </h2>

        <DownloadLink
          v-if="assessment.fileRef"
          class="moj-button-menu__item"
          :file-name="assessment.fileRef"
          :exercise-id="assessment.exercise.id"
          :application-id="assessment.application.id"
          :assessor-id="assessment.assessor.id"
          title="Download assessment"
          type="button"
        />
        <p
          v-else
          class="govuk-body"
        >
          No assessment uploaded.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

import DownloadLink from '@/components/DownloadLink';

export default {
  components: {
    DownloadLink,
  },
  computed: {
    ...mapState({
      assessment: state => state.assessment.record,
    }),
    assessmentId() {
      return this.$route.params.assessmentId;
    },
    fileName() {
      return this.assessment.id;
    },
    uploadPath() {
      const exerciseId = this.assessment.exercise.id;
      const candidateId = this.assessment.candidate.id;

      return `/exercise/${exerciseId}/user/${candidateId}/assessments`;
    },
  },
};
</script>

