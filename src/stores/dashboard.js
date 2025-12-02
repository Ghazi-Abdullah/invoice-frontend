import { defineStore } from "pinia";
import axios from "axios";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    clients: [],
    invoices: [],
    stats: {
      totalClients: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      revenue: 0,
    },
  }),
  actions: {
    async loadDashboardData() {
      try {
        // جلب العملاء
        const clientsRes = await axios.get("/api/clients");
        this.clients = clientsRes.data.data;
        this.stats.totalClients = this.clients.length;

        // جلب الفواتير
        const invoicesRes = await axios.get("/api/invoices");
        this.invoices = invoicesRes.data.data;
        this.stats.totalInvoices = this.invoices.length;
        this.stats.paidInvoices = this.invoices.filter(i => i.status === 'paid').length;
        this.stats.revenue = this.invoices.reduce((sum, i) => sum + Number(i.total_amount), 0);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    },
    recentClients(count = 5) {
      return this.clients.slice(0, count);
    },
    recentInvoices(count = 5) {
      return this.invoices.slice(0, count);
    }
  }
});
