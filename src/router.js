import Vue from 'vue';
import Router from 'vue-router';
//import store from '@/store';

// Edit views
import Assessments from '@/views/Assessments';
import Assessment from '@/views/Assessment';
import AssessmentView from '@/views/Assessment/View';
import AssessmentEdit from '@/views/Assessment/Edit';
import AssessmentSuccess from '@/views/Assessment/Success';

// Error pages
import AssessmentNotFound from '@/views/Errors/AssessmentNotFound';
import AssessmentsNotFound from '@/views/Errors/AssessmentsNotFound';
import PageNotFound from '@/views/Errors/PageNotFound';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/assessments',
    },
    {
      path: '/assessments',
      name: 'assessments',
      component: Assessments,
      meta: {
        requiresAuth: true,
        title: 'Assessments',
      },
    },
    {
      path: '/assessments/:id',
      component: Assessment,
      children: [
        {
          path: '',
          name: 'assessment-view',
          component: AssessmentView,
          meta: {
            requiresAuth: true,
            title: 'Assessment review',
          },
        },
        {
          path: 'upload',
          name: 'assessment-edit',
          component: AssessmentEdit,
          meta: {
            requiresAuth: true,
            title: 'Assessment upload',
          },
        },
        {
          path: 'success',
          name: 'assessment-success',
          component: AssessmentSuccess,
          meta: {
            requiresAuth: true,
            title: 'Assessment upload success',
          },
        },
      ],
    },
    {
      path: '/errors/assessment-not-found',
      name: 'assessment-not-found',
      component: AssessmentNotFound,
      meta: {
        requiresAuth: true,
        title: 'Assessment Not Found',
      },
    },
    {
      path: '/errors/assessments-not-found',
      name: 'assessments-not-found',
      component: AssessmentsNotFound,
      meta: {
        requiresAuth: true,
        title: 'Assessments Not Found',
      },
    },
    {
      path: '/errors/page-not-found',
      name: 'page-not-found',
      component: PageNotFound,
      meta: {
        requiresAuth: true,
        title: 'Page Not Found',
      },
    },
  ],
});

// Global after hook to set an appropriate title for the page
router.afterEach((to) => {
  document.title = `${to.meta.title} | Judicial Appointments Commission`;
});

export default router;
