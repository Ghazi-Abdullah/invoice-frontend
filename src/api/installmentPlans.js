import axios from './axios';

export default {
  getPlan(invoiceId) {
    return axios.get(`/invoices/${invoiceId}/installment-plan`);
  },
  createPlan(invoiceId, data) {
    return axios.post(`/invoices/${invoiceId}/installment-plan`, data);
  },
  payInstallment(installmentId, paymentMethod) {
    return axios.put(`/installments/${installmentId}/pay`, { payment_method: paymentMethod });
  },
  cancelPlan(planId) {
    return axios.delete(`/installment-plans/${planId}`);
  }
};
