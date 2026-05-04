export const logsService = {
    getLogs: async ({ page = 1, limit = 30, search = '', status = 'all' }) => {
        // Mock data for system logs with retail theme
        const mockLogs = [
            { id: '1-a8d2', user: 'Admin', action: 'SALE_COMPLETE', description: 'Transaction #POS-1092 completed for KES 12,500', ip: '192.168.1.15', date: '2026-05-03 14:30:22', time: '02:30 PM', status: 'success' },
            { id: '2-b9e3', user: 'Admin', action: 'STOCK_ADJUST', description: 'Adjusted stock for Logitech MX Master (+10 units)', ip: '192.168.1.15', date: '2026-05-03 13:15:45', time: '01:15 PM', status: 'success' },
            { id: '3-c0f4', user: 'Staff_Mike', action: 'LOGIN_FAIL', description: 'Invalid password attempt from terminal 02', ip: '192.168.1.22', date: '2026-05-03 12:45:10', time: '12:45 PM', status: 'failed' },
            { id: '4-d1g5', user: 'Admin', action: 'CATEGORY_CREATE', description: 'New category "Wireless Accessories" created', ip: '192.168.1.15', date: '2026-05-03 11:20:05', time: '11:20 AM', status: 'success' },
            { id: '5-e2h6', user: 'Staff_Billie', action: 'SALE_VOID', description: 'Transaction #POS-1088 voided by manager approval', ip: '192.168.1.18', date: '2026-05-03 10:05:33', time: '10:05 AM', status: 'success' },
            { id: '6-f3i7', user: 'Admin', action: 'PRODUCT_DELETE', description: 'Product "Old USB Hub" removed from inventory', ip: '192.168.1.15', date: '2026-05-03 09:45:12', time: '09:45 AM', status: 'success' },
            { id: '7-g4j8', user: 'System', action: 'BACKUP_AUTO', description: 'Automatic cloud backup completed successfully', ip: 'INTERNAL', date: '2026-05-03 03:00:00', time: '03:00 AM', status: 'success' },
            { id: '8-h5k9', user: 'Staff_Richard', action: 'DRAWER_OPEN', description: 'Manual cash drawer opening - No sale', ip: '192.168.1.20', date: '2026-05-02 21:15:44', time: '09:15 PM', status: 'success' },
            { id: '9-i6l0', user: 'Admin', action: 'PRICE_UPDATE', description: 'Bulk price update for "Storage" category', ip: '192.168.1.15', date: '2026-05-02 18:30:11', time: '06:30 PM', status: 'success' },
            { id: '10-j7m1', user: 'Staff_Mike', action: 'CUSTOMER_REG', description: 'New loyalty customer "Jane Doe" registered', ip: '192.168.1.22', date: '2026-05-02 16:45:55', time: '04:45 PM', status: 'success' },
        ];

        // Filter by search
        let filtered = mockLogs.filter(log => 
            log.user.toLowerCase().includes(search.toLowerCase()) ||
            log.action.toLowerCase().includes(search.toLowerCase()) ||
            log.description.toLowerCase().includes(search.toLowerCase())
        );

        // Filter by status
        if (status !== 'all') {
            filtered = filtered.filter(log => log.status === status);
        }

        // Return promise to simulate API
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    status: 'success',
                    data: page === 1 ? filtered : [],
                    pagination: {
                        total: filtered.length,
                        page: page,
                        limit: limit,
                        has_more: false
                    }
                });
            }, 600);
        });
    }
};
