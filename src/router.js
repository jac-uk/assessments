import {
  createWebHistory,
  createRouter
} from 'vue-router';

import store from '@/store';

import SignIn from '@/views/SignIn';

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

// const routes = ;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: '/sign-in',
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignIn,
      meta: {
        requiresAuth: false,
        title: 'Sign In',
      },
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
        requiresAuth: false,
        title: 'Page Not Found',
      },
    },
  ],
});

// Global before guard to verify if a user can access the requested page.
// It redirects unauthorized users to a sign-in page.
router.beforeEach(async (to, from, next) => {

  console.log('======== ROUTER =========');

  console.log('ROUTER to:');
  console.log(to);

  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const isSignedIn = store.getters['auth/isSignedIn'];

  console.log(`ROUTER requiresAuth: ${requiresAuth}`);
  console.log(`ROUTER isSignedIn: ${isSignedIn}`);

  if (requiresAuth && !isSignedIn) {

    console.log('ROUTER goto sign-in');

    return next({ name: 'sign-in' });
  }
  return next();
});

// Global after hook to set an appropriate title for the page
router.afterEach((to) => {
  document.title = `${to.meta.title} | Judicial Appointments Commission`;
});

export default router;
