import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getRoleHomePath } from '@/utils/roleUtils'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: ('CLIENT' | 'MASTER' | 'ADMIN')[]
    guestOnly?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/LandingView.vue'),
      meta: { title: 'Slotifai — Smart booking platform' },
      beforeEnter: () => {
        const auth = useAuthStore()
        if (auth.isAuthenticated) return getRoleHomePath(auth.role)
      },
    },

    {
      path: '/login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guestOnly: true, title: 'Sign in' },
    },
    {
      path: '/register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guestOnly: true, title: 'Create account' },
    },
    {
      path: '/verify-email',
      component: () => import('@/views/auth/VerifyEmailView.vue'),
      meta: { title: 'Verify email' },
    },
    {
      path: '/forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { guestOnly: true, title: 'Reset password' },
    },
    {
      path: '/reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { guestOnly: true, title: 'New password' },
    },

    {
      path: '/masters',
      component: () => import('@/views/public/MastersListView.vue'),
      meta: { title: 'Find a master' },
    },
    {
      path: '/masters/:id',
      component: () => import('@/views/public/MasterProfileView.vue'),
      meta: { title: 'Master profile' },
    },
    {
      path: '/masters/:id/book',
      component: () => import('@/views/public/BookingView.vue'),
      meta: { requiresAuth: true, roles: ['CLIENT'], title: 'Book appointment' },
    },

    {
      path: '/dashboard',
      component: () => import('@/views/client/ClientDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['CLIENT'], title: 'My appointments' },
    },
    {
      path: '/appointments/:id/review',
      component: () => import('@/views/client/ReviewView.vue'),
      meta: { requiresAuth: true, roles: ['CLIENT'], title: 'Leave a review' },
    },
    {
      path: '/profile',
      component: () => import('@/views/client/ClientProfileView.vue'),
      meta: { requiresAuth: true, roles: ['CLIENT'], title: 'My profile' },
    },
    {
      path: '/profile/reviews',
      component: () => import('@/views/client/ClientReviewsView.vue'),
      meta: { requiresAuth: true, roles: ['CLIENT'], title: 'My reviews' },
    },
    {
      path: '/onboarding',
      component: () => import('@/views/onboarding/ClientOnboardingView.vue'),
      meta: { requiresAuth: true, roles: ['CLIENT'], title: 'Welcome' },
    },

    {
      path: '/master/dashboard',
      component: () => import('@/views/master/MasterDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['MASTER'], title: 'Appointments' },
    },
    {
      path: '/master/appointments/:id',
      component: () => import('@/views/master/MasterAppointmentDetailView.vue'),
      meta: { requiresAuth: true, roles: ['MASTER'], title: 'Appointment details' },
    },
    {
      path: '/master/services',
      component: () => import('@/views/master/MasterServicesView.vue'),
      meta: { requiresAuth: true, roles: ['MASTER'], title: 'My services' },
    },
    {
      path: '/master/schedule',
      component: () => import('@/views/master/MasterScheduleView.vue'),
      meta: { requiresAuth: true, roles: ['MASTER'], title: 'My schedule' },
    },
    {
      path: '/master/profile',
      component: () => import('@/views/master/MasterProfileView.vue'),
      meta: { requiresAuth: true, roles: ['MASTER'], title: 'My profile' },
    },
    {
      path: '/master/onboarding',
      component: () => import('@/views/onboarding/MasterOnboardingView.vue'),
      meta: { requiresAuth: true, roles: ['MASTER'], title: 'Get started' },
    },

    {
      path: '/admin/login',
      component: () => import('@/views/auth/AdminLoginView.vue'),
      meta: { guestOnly: true, title: 'Admin sign in' },
    },

    {
      path: '/admin',
      component: () => import('@/views/admin/AdminDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Admin dashboard' },
    },
    {
      path: '/admin/users',
      component: () => import('@/views/admin/AdminUsersView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Users' },
    },
    {
      path: '/admin/masters',
      component: () => import('@/views/admin/AdminMastersView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Masters' },
    },
    {
      path: '/admin/appointments',
      component: () => import('@/views/admin/AdminAppointmentsView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Appointments' },
    },

    {
      path: '/404',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Not found' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return getRoleHomePath(auth.role)
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && auth.role && !to.meta.roles.includes(auth.role)) {
    return '/404'
  }
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} · Slotifai` : 'Slotifai'
})

export default router
