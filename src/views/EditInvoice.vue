<template>
  <div class="edit-invoice">
    <div class="container">
      <div class="page-header">
        <h1>تعديل الفاتورة</h1>
        <router-link :to="`/invoices/${invoice.id}`" class="btn btn-secondary">
          رجوع للتفاصيل
        </router-link>
      </div>

      <div v-if="loading" class="loading">جاري التحميل...</div>

      <div v-else class="card">
        <p>سيتم عرض نموذج تعديل الفاتورة هنا</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditInvoice',
  setup() {
    return {
      loading: false,
      invoice: { id: 1 },
    }
  },
}
</script>
