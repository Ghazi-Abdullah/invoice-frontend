import axios from './axios';

export default {
  getTiers() {
    return axios.get('/installment-interest-tiers');
  },
  storeTier(data) {
    return axios.post('/installment-interest-tiers', data);
  },
  deleteTier(id) {
    return axios.delete(`/installment-interest-tiers/${id}`);
  },
  suggestRate(numberOfInstallments) {
    return axios.get(`/installment-interest-tiers/suggest/${numberOfInstallments}`);
  }
};
