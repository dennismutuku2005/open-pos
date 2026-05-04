/**
 * Mock Authentication Utility
 * Handles simulated auth state for local demonstration
 */

class AuthService {
 constructor() {
 this.tokenKey ='openpos_auth_token';
 this.userKey ='openpos_user_data';
 }

 /**
 * Mock Login
 */
 async login(username, password) {
 // Simulate network delay
 await new Promise(resolve => setTimeout(resolve, 800));

 // Simple demo logic: any non-empty username/password works
 if (username && password) {
 const mockUser = {
 id:'user_1',
 name:'Demo Admin',
 username: username,
 phone:'+254 700 000 000',
 type:'admin', // superadmin bypasses all policy checks
 policies: [],
 createdAt: new Date().toISOString()
 };

 this.setToken('mock_token_'+ Date.now());
 this.setUser(mockUser);
 return { success: true, data: { user: mockUser } };
 }

 return { success: false, message:'Invalid credentials'};
 }

 /**
 * Mock Logout
 */
 async logout() {
 this.clearAuth();
 if (typeof window !=='undefined') {
 window.location.href ='/login';
 }
 }

 isAuthenticated() {
 return !!this.getToken();
 }

 getUser() {
 if (typeof window ==='undefined') return null;
 const userData = localStorage.getItem(this.userKey);
 return userData ? JSON.parse(userData) : null;
 }

 getToken() {
 if (typeof window ==='undefined') return null;
 return localStorage.getItem(this.tokenKey);
 }

 isTokenExpired(token) {
 // In demo mode, tokens never expire locally
 return false;
 }

 async verifyToken() {
 // In demo mode, we assume the token is always valid if it exists
 return !!this.getToken();
 }

 setToken(token) {
 if (typeof window ==='undefined') return;
 localStorage.setItem(this.tokenKey, token);
 }

 setUser(user) {
 if (typeof window ==='undefined') return;
 localStorage.setItem(this.userKey, JSON.stringify(user));
 }

 clearAuth() {
 if (typeof window ==='undefined') return;
 localStorage.removeItem(this.tokenKey);
 localStorage.removeItem(this.userKey);
 }

 /**
 * Mock Policy Check
 */
 hasPolicy(policy) {
 if (typeof window ==='undefined') return false;
 const user = this.getUser();
 if (!user) return false;

 // Admin/Superadmin bypass
 if (user.type ==='admin'|| user.type ==='superadmin') return true;

 // Check specific policy
 const policies = user.policies || [];
 return policies.includes(policy);
 }
}

export const authService = new AuthService();
export default authService;
