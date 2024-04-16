export const useAuthType = () => {
  return Object.freeze({
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
    OPEN: 'open',
  })
}

export const useRole = () => {
  return Object.freeze({
    MEMBER: 'member',
    ADMIN: 'admin',
    SUPER_USER: 'super_user',
    SYSTEM_SUPPORT: 'system_support',
  })
}
