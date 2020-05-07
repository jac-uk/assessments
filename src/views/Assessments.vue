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

        <table
          v-if="assessments.length"
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr
              v-for="assessment in assessments"
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
                {{ assessment.dueDate | formatDate }}
              </td>
              <td class="govuk-table__cell">
                {{ assessment.status | lookup }}
                <strong
                  v-if="overdue(assessment)"
                  class="govuk-tag govuk-tag--red"
                >
                  Overdue
                </strong>
              </td>
              <td class="govuk-table__cell">
                <router-link
                  v-if="assessment.status === 'draft'"
                  class="govuk-button govuk-button--secondary"
                  :to="{ name: 'assessment-edit', params: { id: assessment.id }}"
                >
                  Upload
                </router-link>
                <router-link
                  v-else
                  class="govuk-button govuk-button--secondary"
                  :to="{ name: 'assessment-view', params: { id: assessment.id }}"
                >
                  Review
                </router-link>
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
import LoadingMessage from '@/components/LoadingMessage';
export default {
  components: {
    LoadingMessage,
  },
  data() {
    return {
      loaded: false,
      loadFailed: false,
    };
  },
  computed: {
    ...mapState({
      assessments: state => state.assessments.records,
    }),
  },
  mounted() {
    this.$store.dispatch('assessments/bind', 'email@somewhere.com')
      .then((data) => {
        if(data === null) {
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
    overdue(assessment) {
      const today = new Date();

      return assessment.status === 'draft' && today > assessment.dueDate;
    },
    redirectToErrorPage() {
      this.$router.replace({ name: 'assessments-not-found' });
    },
  },
};
</script>
