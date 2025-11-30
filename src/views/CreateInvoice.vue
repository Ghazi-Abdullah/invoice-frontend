<template>
  <div class="create-invoice">
    <div class="container">
      <div class="page-header">
        <h1>إنشاء فاتورة جديدة</h1>
        <router-link to="/invoices" class="btn btn-secondary"> رجوع للفواتير </router-link>
      </div>

      <div class="card">
        <form @submit.prevent="createInvoice">
          <div class="form-group">
            <label for="client">العميل</label>
            <select id="client" v-model="invoiceData.client_id" required class="form-input">
              <option value="">اختر العميل</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }} - {{ client.company_name }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="issue_date">تاريخ الإصدار</label>
              <input
                type="date"
                id="issue_date"
                v-model="invoiceData.issue_date"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="due_date">تاريخ الاستحقاق</label>
              <input
                type="date"
                id="due_date"
                v-model="invoiceData.due_date"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="invoice-items">
            <h3>عناصر الفاتورة</h3>

            <div v-for="(item, index) in invoiceData.items" :key="index" class="item-row">
              <input
                type="text"
                v-model="item.description"
                placeholder="وصف العنصر"
                class="form-input"
                required
              />
              <input
                type="number"
                v-model="item.quantity"
                placeholder="الكمية"
                min="1"
                class="form-input"
                required
              />
              <input
                type="number"
                v-model="item.unit_price"
                placeholder="سعر الوحدة"
                min="0"
                step="0.01"
                class="form-input"
                required
              />
              <span class="item-total">{{ (item.quantity * item.unit_price).toFixed(2) }}</span>
              <button type="button" @click="removeItem(index)" class="btn btn-danger">×</button>
            </div>

            <button type="button" @click="addItem" class="btn btn-secondary">إضافة عنصر</button>
          </div>

          <div class="form-group">
            <label for="notes">ملاحظات</label>
            <textarea
              id="notes"
              v-model="invoiceData.notes"
              class="form-input"
              rows="3"
              placeholder="ملاحظات إضافية..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'جاري الإنشاء...' : 'إنشاء الفاتورة' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInvoiceStore } from '../stores/modules/invoices'
import { useClientStore } from '../stores/clients'

export default {
  name: 'CreateInvoice',
  setup() {
    const invoiceStore = useInvoiceStore()
    const clientStore = useClientStore()
    const router = useRouter()

    const invoiceData = ref({
      client_id: '',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unit_price: 0 }],
      notes: '',
    })

    const loading = ref(false)

    onMounted(async () => {
      await clientStore.fetchClients()
    })

    const addItem = () => {
      invoiceData.value.items.push({ description: '', quantity: 1, unit_price: 0 })
    }

    const removeItem = (index) => {
      if (invoiceData.value.items.length > 1) {
        invoiceData.value.items.splice(index, 1)
      }
    }

    const createInvoice = async () => {
      loading.value = true
      try {
        await invoiceStore.createInvoice(invoiceData.value)
        router.push('/invoices')
      } catch (error) {
        console.error('Failed to create invoice:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      invoiceData,
      loading,
      clients: clientStore.clients,
      addItem,
      removeItem,
      createInvoice,
    }
  },
}
</script>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.invoice-items {
  margin: 2rem 0;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-total {
  text-align: center;
  font-weight: bold;
  color: #2c3e50;
}

.form-actions {
  margin-top: 2rem;
  text-align: left;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .item-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
