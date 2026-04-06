// Admin access configuration
// These emails determine who sees the Admin link in the navbar.
// Actual access control is enforced by the Firestore role: 'admin' check in AdminGuard.
export const ADMIN_EMAILS = ['kiretokk@gmail.com', 'georgiev.gancho@gmail.com'] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return (ADMIN_EMAILS as readonly string[]).includes(email);
}
