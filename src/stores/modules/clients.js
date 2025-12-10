import axios from '@/api/axios';

const state = {
  clients: [],
  currentClient: null,
  loading: false,
  pagination: {}
};

const mutations = {
  SET_CLIENTS(state, response) {
    console.log('📊 SET_CLIENTS mutation called with:', response);

    if (response && response.data) {
      // إذا كان الرد يحتوي على pagination
      state.clients = response.data.data || response.data || [];
      state.pagination = {
        current_page: response.data.current_page || 1,
        last_page: response.data.last_page || 1,
        per_page: response.data.per_page || 10,
        total: response.data.total || 0,
        from: response.data.from || 0,
        to: response.data.to || 0
      };
    } else {
      // افتراضياً، مصفوفة فارغة
      state.clients = [];
      state.pagination = {};
    }

    console.log('✅ Clients set to:', state.clients);
    console.log('✅ Pagination set to:', state.pagination);
  },

  SET_CURRENT_CLIENT(state, client) {
    state.currentClient = client;
  },

  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  ADD_CLIENT(state, client) {
    // تأكد أن state.clients هي مصفوفة قبل push
    if (!Array.isArray(state.clients)) {
      state.clients = [];
    }
    state.clients.unshift(client); // أضف في البداية
  },

  UPDATE_CLIENT(state, updatedClient) {
    if (Array.isArray(state.clients)) {
      const index = state.clients.findIndex(c => c.id === updatedClient.id);
      if (index !== -1) {
        state.clients.splice(index, 1, updatedClient);
      }
    }
  },

  DELETE_CLIENT(state, id) {
    if (Array.isArray(state.clients)) {
      state.clients = state.clients.filter(c => c.id !== id);
    }
  }
};

const actions = {
  async fetchClients({ commit }) {
    commit('SET_LOADING', true);
    console.log('🚀 Fetching clients...');

    try {
      const response = await axios.get('/api/clients');
      console.log('✅ API Response:', response.data);

      commit('SET_CLIENTS', response.data);

      // إرجاع البيانات للاستخدام المباشر
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error fetching clients:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchClient({ commit }, id) {
    try {
      console.log(`🚀 Fetching client with ID: ${id}`);
      const response = await axios.get(`/api/clients/${id}`);
      console.log('✅ Client details:', response.data);

      commit('SET_CURRENT_CLIENT', response.data.data || response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching client:', error);
      throw error;
    }
  },

  async createClient({ commit }, clientData) {
    try {
      console.log('🚀 Creating client:', clientData);
      const response = await axios.post('/api/clients', clientData);
      console.log('✅ Client created:', response.data);

      const client = response.data.data || response.data;
      commit('ADD_CLIENT', client);
      return client;
    } catch (error) {
      console.error('❌ Error creating client:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateClient({ commit }, { id, data }) {
    try {
      console.log(`🚀 Updating client ${id}:`, data);
      const response = await axios.put(`/api/clients/${id}`, data);
      console.log('✅ Client updated:', response.data);

      const updatedClient = response.data.data || response.data;
      commit('UPDATE_CLIENT', updatedClient);
      return updatedClient;
    } catch (error) {
      console.error('❌ Error updating client:', error);
      throw error;
    }
  },

  async deleteClient({ commit }, id) {
    try {
      console.log(`🚀 Deleting client ${id}`);
      await axios.delete(`/api/clients/${id}`);
      console.log('✅ Client deleted');
      commit('DELETE_CLIENT', id);
    } catch (error) {
      console.error('❌ Error deleting client:', error);
      throw error;
    }
  },

  async getSimpleList({ commit }) {
    try {
      console.log('🚀 Fetching simple client list...');
      const response = await axios.get('/api/clients/list/simple');
      console.log('✅ Simple list:', response.data);

      return response.data.data || response.data || [];
    } catch (error) {
      console.error('❌ Error fetching simple client list:', error);
      throw error;
    }
  }
};

const getters = {
  clients: state => {
    // تأكد أننا نعيد مصفوفة دائمًا
    if (Array.isArray(state.clients)) {
      return state.clients;
    } else if (state.clients && state.clients.data) {
      return state.clients.data;
    }
    return [];
  },
  currentClient: state => state.currentClient,
  loading: state => state.loading,
  pagination: state => state.pagination
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
