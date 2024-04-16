import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomePage.vue'
import AuthenticationPage from '@/views/AuthenticationPage.vue'
import { vueApp } from '@/app.js'
import { useAuthStore } from '@/stores/auth.js'
import { useAuthType, useRole } from '@/composables/enums.js'
import ProfilePage from '@/views/ProfilePage.vue'
import NotificationsPage from '@/views/NotificationsPage.vue'
import { useFindOneInArray } from '@/composables/helpers.js'

const authType = useAuthType()
const role = useRole()

const routes = [
  {
    path: '',
    name: 'home',
    component: Home,
    meta: {
      label: 'Home',
      isNavMenu: true, // if this should show in the main nav menu
      auth: authType.AUTHENTICATED,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: {
      label: 'Profile',
      isNavMenu: false,
      auth: authType.AUTHENTICATED,
    },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsPage,
    meta: {
      label: 'Notifications',
      isNavMenu: false,
      auth: authType.AUTHENTICATED,
    },
  },
  {
    path: '/admin',
    name: 'admin-tools',
    redirect: { name: 'user-management' },
    meta: {
      label: 'Admin Tools',
      isNavMenu: true,
      auth: authType.AUTHENTICATED,
      roles: [role.ADMIN, role.SUPER_USER],
    },
    children: [
      {
        path: 'user-management',
        name: 'user-management',
        component: () => import('@/views/UserManagementPage.vue'),
        meta: {
          label: 'Manage Users',
          auth: authType.AUTHENTICATED,
          icon: 'fa-solid fa-users-gear',
        },
      },
      {
        path: 'app-settings',
        name: 'app-settings',
        component: () => import('@/views/AppSettingsPage.vue'),
        meta: {
          label: 'App Settings',
          auth: authType.AUTHENTICATED,
          icon: 'fa-solid fa-gear',
        },
      },
    ],
  },
  {
    path: '/help-and-support',
    name: 'help-and-support',
    component: () => import('@/views/HelpAndSupportPage.vue'),
    meta: {
      label: 'Help & Support',
      isNavMenu: true,
      auth: authType.OPEN,
    },
  },
  {
    path: '/auth',
    name: 'auth',
    meta: {
      label: 'Authentication',
      hideNavBar: true,
    },
    children: [
      {
        path: 'login',
        name: 'login',
        component: AuthenticationPage,
        meta: {
          label: 'Login',
          hideNavBar: true,
          auth: authType.UNAUTHENTICATED,
        },
      },
      {
        path: 'sign-up',
        name: 'sign-up',
        component: AuthenticationPage,
        meta: {
          label: 'Sign up',
          hideNavBar: true,
          auth: authType.UNAUTHENTICATED,
        },
      },
      {
        path: 'verify-email-guard',
        name: 'verify-email-guard',
        component: () => import('@/views/misc/VerifyEmailGuardPage.vue'),
        meta: {
          label: 'Verify Email',
          hideNavBar: true,
          auth: authType.AUTHENTICATED,
        },
      },
      {
        path: 'verify-email/:id/:hash',
        name: 'process-email-verification',
        component: () => import('@/views/misc/ProcessEmailVerificationPage.vue'),
        meta: {
          label: 'Email Verification In-progress',
          hideNavBar: true,
          auth: authType.OPEN,
        },
      },
      {
        path: 'verify-account/:id/:hash',
        name: 'verify-account',
        component: () => import('@/views/misc/VerifyAccountPage.vue'),
        meta: {
          label: 'Verify Your Account',
          hideNavBar: true,
          auth: authType.OPEN,
        },
      },
      {
        path: 'email-verification-success',
        name: 'email-verification-success',
        component: () => import('@/views/misc/EmailVerificationPageSuccess.vue'),
        meta: {
          label: 'Email Verification Success',
          hideNavBar: true,
        },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/views/ResetPasswordPage.vue'),
        meta: {
          label: 'Reset Password',
          hideNavBar: true,
          auth: authType.UNAUTHENTICATED,
        },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/ForgotPasswordPage.vue'),
        meta: {
          label: 'Forgot Password',
          hideNavBar: true,
          auth: authType.UNAUTHENTICATED,
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: () => import('@/views/misc/404Page.vue'),
    meta: {
      label: 'Page not found',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const appName = import.meta.env.VITE_APP_NAME

router.beforeEach(async (to, from) => {
  // Always scroll to the top of the page
  window.scrollTo(0, 0)

  if (to.name === 'auth') {
    // Redirect 'domain.com/auth' to 'domain.com/auth/sign-up'
    return { name: 'sign-up' }
  }

  // Block access to sign-up, login, reset & forgot password, verify email
  const authStore = useAuthStore()
  if (authStore.isAuthenticated && to.meta.auth === authType.UNAUTHENTICATED) {
    return from
  }

  // Protect routes that need authentication
  if (to.meta.auth === authType.AUTHENTICATED && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  // Users must also have their emails verified to access auth routes (Except for the VerifyEmailGuard and Process Page)
  const omittedVerificationPages = ['verify-email-guard', 'email-verification-success']
  if (
    to.meta.auth === authType.AUTHENTICATED &&
    authStore.isAuthenticated &&
    !omittedVerificationPages.includes(to.name)
  ) {
    if (!authStore.authEmailIsVerified) return { name: 'verify-email-guard' }
  }

  // Verify email guard page can only be accessed if the user have not validated their email address
  if (to.name === 'verify-email-guard' && authStore.authEmailIsVerified) {
    return from
  }

  // Protect routes that need certain roles to access
  if (to.meta.auth === authType.AUTHENTICATED) {
    const roles = authStore.authRoles
    if (to.meta.roles && !useFindOneInArray(to.meta.roles, roles)) return { name: 'home' }
  }

  // Change the browser tab title
  document.title = `${appName} | ${to.meta.label}` || appName
})

vueApp.use(router)
