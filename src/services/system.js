export const systemService = {
 getNotifications: async (page = 1, limit = 20) => {
 // Mock data
 const mockData = [
 { id: 1, type:'alert', title:'Low Stock Alert', message:'Mechanical Keyboard is running low on stock (5 remaining).', is_read: 0, created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
 { id: 2, type:'info', title:'Daily Report Ready', message:'Your daily sales report for yesterday is ready to download.', is_read: 1, created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
 { id: 3, type:'success', title:'System Updated', message:'POS System was successfully updated to version 2.4.1.', is_read: 1, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
 ];

 return new Promise(resolve => {
 setTimeout(() => {
 resolve({
 status:'success',
 data: page === 1 ? mockData : [],
 pagination: { page, limit, total: mockData.length, has_more: false }
 });
 }, 500);
 });
 },

 markNotificationAsRead: async (id = null) => {
 return new Promise(resolve => {
 setTimeout(() => {
 resolve({ status:'success'});
 }, 200);
 });
 }
};
