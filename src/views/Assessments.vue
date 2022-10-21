<template>
  <div>
    <LoadingMessage
      v-if="loaded === false"
      :load-failed="loadFailed"
    />
    <div
      v-else
      class="govuk-grid-row"
    >
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">
          Independent Assessments
        </h1>
        <TabsList
          :tabs="tabs"
          :active-tab.sync="activeTab"
        />
        <table
          v-if="(activeTab == 'pending' && assessmentsPending.length) || 
            (activeTab == 'decline' && assessmentsDecline.length) || 
            (activeTab == 'complete' && assessmentsComplete.length)
          "
          class="govuk-table table-with-border"
        >
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header"
              >
                Exercise
              </th>
              <th
                scope="col"
                class="govuk-table__header"
              >
                Candidate
              </th>
              <th
                scope="col"
                class="govuk-table__header"
              >
                Due date
              </th>
              <th
                scope="col"
                class="govuk-table__header"
              >
                Status
              </th>
              <th
                scope="col"
                class="govuk-table__header"
              >
                {{ activeTab === 'decline' ? 'Reason' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr
              v-for="assessment in (activeTab == 'complete') ? assessmentsComplete : (activeTab == 'decline') ? assessmentsDecline : assessmentsPending"
              :key="assessment.id"
              class="govuk-table__row"
            >
              <td class="govuk-table__cell">
                {{ assessment.exercise.referenceNumber }}
              </td>
              <td class="govuk-table__cell">
                {{ assessment.candidate.fullName }}
              </td>
              <td class="govuk-table__cell">
                {{ assessment.dueDate | formatDate('date-hour') }}
              </td>
              <td 
                class="govuk-table__cell"
              >
                {{ assessment.status | lookup }}
              </td>
              <td class="govuk-table__cell">
                <span v-if="activeTab === 'decline'">
                  {{ assessment.declineReason }}
                </span>
                <div v-else>
                  <router-link
                    v-if="canEdit(assessment) && submissionPermitted(assessment)"
                    class="govuk-button govuk-button--primary"
                    :to="{ name: 'assessment-edit', params: { id: assessment.id }}"
                  >
                    View Incomplete Assessment
                  </router-link>
                  <router-link
                    v-else-if="canEdit(assessment) && !submissionPermitted(assessment)"
                    class="govuk-button govuk-button--primary"
                    :to="{ name: 'assessment-view', params: { id: assessment.id }}"
                    disabled
                  >
                    Assessment Expired
                  </router-link>
                  <router-link
                    v-else
                    class="govuk-button govuk-button--secondary"
                    :to="{ name: 'assessment-view', params: { id: assessment.id }}"
                  >
                    Review Completed Assessment
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p
          v-else
          class="govuk-body"
        >
          You don't have any assessments.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { isDateInFuture } from '@/helpers/date';
import TabsList from '@/components/Page/TabsList';
import LoadingMessage from '@/components/LoadingMessage';
export default {
  components: {
    LoadingMessage,
    TabsList,
  },
  data() {
    return {
      activeTab: 'pending',
      loaded: false,
      loadFailed: false,
    };
  },
  computed: {
    ...mapState({
      assessmentsPending: state => state.assessments.pending,
      assessmentsDecline: state => state.assessments.decline,
      assessmentsComplete: state => state.assessments.complete,
      currentUser: state => state.auth.currentUser,
    }),
    tabs() {
      return [
        {
          ref: 'pending',
          title: 'Pending',
        },
        {
          ref: 'decline',
          title: 'Decline',
        },
        {
          ref: 'complete',
          title: 'Complete',
        },
      ];
    },
  },
  created() {
    // Ideally we'd use allSettled but IE doesn't support this
    Promise.all([
      this.$store.dispatch('assessments/bindPending', this.currentUser.email),
      this.$store.dispatch('assessments/bindDecline', this.currentUser.email),
      this.$store.dispatch('assessments/bindComplete', this.currentUser.email),
    ]).then((data) => {
      if (data === null) {
        this.redirectToErrorPage();
      }
      else {
        this.loaded = true;
      }
    }).catch((e) => {
      this.loadFailed = true;
      throw e;
    });
  },
  methods: {
    canEdit(assessment) {
      return assessment.status === 'pending';
    },
    submissionPermitted(assessment) {
      if (!assessment.hardLimitDate){
        return true;
      }

      if (isDateInFuture(assessment.hardLimitDate)){
        return true;
      }

      return false;
    },
    assessmentLate(assessment){
      return !isDateInFuture(assessment.dueDate) && this.canEdit(assessment);
    },
    redirectToErrorPage() {
      this.$router.replace({ name: 'assessments-not-found' });
    },
  },
};
</script>
