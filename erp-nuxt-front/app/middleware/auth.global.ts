export default defineNuxtRouteMiddleware((to) => {
  const { canAccessRoute } = useMockAuth()
  const result = canAccessRoute(to.path)

  if (result.allowed) {
    return
  }

  return navigateTo({
    path: '/forbidden',
    query: {
      from: to.fullPath,
      module: result.moduleKey,
      action: result.actionKey,
      reason: result.reason
    }
  })
})
