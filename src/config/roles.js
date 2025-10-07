// ============================================
// Role-based configuration
// ============================================

export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'PlaygroundManager',
  STAFF: 'Staff',
  CUSTOMER: 'Customer'
}

/**
 * Homepage cho mỗi role
 */
export const ROLE_HOMEPAGES = {
  [ROLES.ADMIN]: '/admin/user-management',
  [ROLES.MANAGER]: '/manager/event-management',
  [ROLES.STAFF]: '/staff/event',
  [ROLES.CUSTOMER]: '/user/homepage'
}

/**
 * Default homepage nếu không có role hoặc role không xác định
 */
export const DEFAULT_HOMEPAGE = '/'

/**
 * Get homepage dựa trên role
 */
export const getHomepageByRole = (role = ROLES.ADMIN) => {
  return ROLE_HOMEPAGES[role] || DEFAULT_HOMEPAGE
}

/**
 * Role permissions (optional - nếu cần check chi tiết hơn)
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['manage_events', 'view_reports'],
  [ROLES.MANAGER]: [
    'manage_users',
    'manage_products',
    'manage_orders',
    'view_reports',
    'manage_staff',
    'manage_settings'
  ],
  [ROLES.STAFF]: ['manage_products', 'manage_orders', 'view_reports'],
  [ROLES.CUSTOMER]: ['view_products', 'manage_cart', 'place_order', 'view_order_history']
}

/**
 * Check if user has permission
 */
export const hasPermission = (userRole, permission) => {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(permission)
}

/**
 * Role display names (cho UI)
 */
export const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: 'Quản trị viên',
  [ROLES.MANAGER]: 'Quản lý',
  [ROLES.STAFF]: 'Nhân viên',
  [ROLES.CUSTOMER]: 'Khách hàng'
}

/**
 * Protected routes configuration
 */
export const ROUTE_ACCESS = {
  '/admin': [ROLES.ADMIN],
  '/staff': [ROLES.STAFF, ROLES.ADMIN],
  '/manager': [ROLES.MANAGER, ROLES.ADMIN],
  '/user': [ROLES.CUSTOMER, ROLES.STAFF, ROLES.ADMIN]
}

/**
 * Check if user can access route
 */
export const canAccessRoute = (path, userRole) => {
  // Find matching route pattern
  const routeKey = Object.keys(ROUTE_ACCESS).find((route) => path.startsWith(route))

  if (!routeKey) return true // No restriction

  const allowedRoles = ROUTE_ACCESS[routeKey]

  if (allowedRoles === 'public') return true
  if (!Array.isArray(allowedRoles)) return true

  return allowedRoles.includes(userRole)
}
