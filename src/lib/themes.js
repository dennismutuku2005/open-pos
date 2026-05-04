/**
 * Mock Themes Service
 */

export const themesService = {
 async getThemes(page = 1, limit = 10) {
 return { success: true, data: [], pagination: { total: 0, has_more: false }, message:'Demo mode active'};
 },

 async activateTheme(themeId, routerId) {
 return { success: true, message:'Theme activated (Mock)'};
 },

 async getRouters() {
 return { success: true, data: [{ id: 1, name:'Main POS Router'}] };
 },

 async getActiveThemes() {
 return { success: true, data: [] };
 }
};
