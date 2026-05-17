export const protectedRoutes = [
  "dashboard",
  "clients",
  "projects",
  "employees",
  "calendar",
  "tasks",
  "messages-ai",
  "settings",
];

export const publicRoutes = [
  "login",
  "terms",
  "privacy",
  "documentation",
];

export function isProtectedRoute(segment?: string) {
  if (!segment) return false;

  return protectedRoutes.includes(segment);
}

export function isPublicRoute(segment?: string) {
  if (!segment) return false;

  return publicRoutes.includes(segment);
}