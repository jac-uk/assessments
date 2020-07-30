<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <router-link
          class="govuk-back-link"
          to="/assessments"
        >
          View All Assessments
        </router-link>

        <h1 class="govuk-heading-l">
          Upload Independent Assessment
        </h1>

        <ErrorSummary :errors="errors" />

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
                {{ assessment.dueDate | formatDate }}
              </dd>
            </div>
          </dl>

          <div
            v-if="submissionPermitted"
          >
            <p class="govuk-body-l">
              Download the template on this page to complete your assessment.
            </p>

            <p class="govuk-body-l">
              Come back to this page to upload your finished assessment.
            </p>

            <div class="govuk-form-group">
              <h2 class="govuk-heading-m">
                Download self assessment template
              </h2>

              <DownloadLink
                :file-name="assessment.exercise.template.file"
                :exercise-id="assessment.exercise.id"
                :title="assessment.exercise.template.title"
              />
            </div>

            <FileUpload
              id="independent-assessment-file"
              ref="independent-assessment-file"
              v-model="assessment.fileRef"
              :name="fileName"
              :path="uploadPath"
              label="Please upload your assessment here"
              required
            />

            <button class="govuk-button">
              Save and continue
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { isDateInFuture } from '@/helpers/date';
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import DownloadLink from '@/components/DownloadLink';
import FileUpload from '@/components/Form/FileUpload';

export default {
  components: {
    ErrorSummary,
    DownloadLink,
    FileUpload,
  },
  extends: Form,
  data() {
    const defaults = {
      fileRef: null,
    };
    const data = this.$store.getters['assessment/data']();
    const assessment = { ...defaults, ...data };
    return {
      assessment: assessment,
    };
  },
  computed: {
    assessmentId() {
      return this.$route.params.id;
    },
    fileName() {
      return this.assessmentId;
    },
    assessorId() {
      return this.$store.getters['auth/currentUserId'];
    },
    submissionPermitted() {
      if(!this.assessment.hardLimit){
        return true;
      }

      if(isDateInFuture(this.assessment.hardLimit)){
        return true;
      }

      return false;
    },
    uploadPath() {
      const exerciseId = this.assessment.exercise.id;
      const applicationId = this.assessment.application.id;
      const assessorId = this.assessorId;
      return `/exercise/${exerciseId}/application/${applicationId}/assessor/${assessorId}`;
    },
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        this.assessment.status = 'completed';
        this.assessment.assessor.id = this.$store.state.auth.currentUser.uid;
        await this.$store.dispatch('assessment/save', this.assessment);
        this.$router.push({ name: 'assessment-success' });
      }
    },
  },
};
</script>

