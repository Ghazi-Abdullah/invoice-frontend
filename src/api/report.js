import axios from './axios'

export default {
  // تقرير الفواتير
  getInvoiceReport(params) {
    return axios.get('/admin/reports/invoices', { params })
  },

  // تقرير العملاء
  getClientReport(params) {
    return axios.get('/admin/reports/clients', { params })
  },

  // تقرير الإيرادات
  getRevenueReport(params) {
    return axios.get('/admin/reports/revenue', { params })
  },

  // تقرير المتأخرات
  getOverdueReport(params) {
    return axios.get('/admin/reports/overdue', { params })
  },

  // تصدير التقرير
  exportReport(type, params) {
    return axios.get(`/admin/reports/export/${type}`, {
      params,
      responseType: 'blob'
    })
  },

  // إرسال تذكير
  sendReminder(id) {
    return axios.post(`/admin/reports/send-reminder/${id}`)
  },

  // تسديد فاتورة
  markAsPaid(id) {
    return axios.post(`/admin/reports/mark-paid/${id}`)
  }
}
