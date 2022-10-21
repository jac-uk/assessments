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
                {{ assessment.dueDate | formatDate('date-hour') }}
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
                {{ assessment.updatedDate | formatDate('datetime') }}
              </dd>
            </div>
          </dl>
          <Warning
            v-if="assessmentLate && submissionPermitted"
            :message="`This Independent Assessment is past the due date. The Selection Exercise Team can be contacted via ` + assessment.exercise.exerciseMailbox + ` or ` + assessment.exercise.exercisePhoneNumber + `.`"
          />
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
              :path="buildFileFolder"
              :file-path="assessment.filePath"
              label="Please upload your assessment here"
              :required="!isDeclined"
            />

            <RadioGroup
              :id="`decline-assessment`"
              v-model="isDeclined"
              label="Would you like to decline this Independent Assessment?"
              :messages="{
                required: 'Please choose one of the following options'
              }"
            >
              <RadioItem
                :value="true"
                label="Yes"
              >
                <TextField
                  id="decline-reason"
                  v-model="declineReason"
                  label="Decline Reason"
                  class="govuk-!-width-two-thirds"
                />
              </RadioItem>
              <RadioItem
                :value="false"
                label="No"
              />
            </RadioGroup>

            <button
              class="govuk-button"
              :disabled="isSaveDisabled"
            >
              Save and continue
            </button>
          </div>
          <Warning
            v-else-if="isCompleted"
            :message="`This Independent Assessment has been completed. The Selection Exercise Team can be contacted via ` + assessment.exercise.exerciseMailbox + ` or ` + assessment.exercise.exercisePhoneNumber + `.`"
          />
          <Warning
            v-else
            :message="`This Independent Assessment has expired. The Selection Exercise Team can be contacted via ` + assessment.exercise.exerciseMailbox + ` or ` + assessment.exercise.exercisePhoneNumber + `.`"
          />
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
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload';
import Warning from '@/components/Warning';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

export default {
  components: {
    ErrorSummary,
    DownloadLink,
    FileUpload,
    Warning,
    RadioGroup,
    RadioItem,
    TextField,
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
      isSaveDisabled: false,
      isDeclined: false,
      declineReason: '',
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
    isCompleted() {
      return this.assessment.status === 'completed';
    },
    assessmentLate(){
      return !isDateInFuture(this.assessment.dueDate);
    },
    submissionPermitted() {
      if (this.isCompleted) {
        return false;
      }
      if (!this.assessment.hardLimitDate){
        return true;
      }
      if (isDateInFuture(this.assessment.hardLimitDate)){
        return true;
      }
      return false;
    },
    pastDueDate() {
      return !isDateInFuture(this.assessment.dueDate);
    },
    buildFileFolder() {
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
        this.isSaveDisabled = true;
        this.assessment.assessor.id = this.$store.state.auth.currentUser.uid;
        let routerName = '';
        if (this.isDeclined) {
          this.assessment.status = 'declined';
          this.assessment.declineReason = this.declineReason;
          routerName = 'assessments';
        } else {
          this.assessment.status = 'completed';
          this.assessment.filePath = `${this.buildFileFolder  }/${  this.assessment.fileRef}`;
          await this.$store.dispatch('assessment/save', this.assessment);
          routerName = 'assessment-success';
        }
        await this.$store.dispatch('assessment/save', this.assessment);
        this.$router.push({ name: routerName });
      } else {
        this.isSaveDisabled = false;
      }
    },
  },
};
</script>
