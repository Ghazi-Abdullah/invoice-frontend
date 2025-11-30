<template>
  <div class="invoices">
    <div class="container">
      <div class="page-header">
        <h1>الفواتير</h1>
        <router-link to="/invoices/create" class="btn btn-primary">
          إنشاء فاتورة جديدة
        </router-link>
      </div>

      <div class="card">
        <p>سيتم عرض قائمة الفواتير هنا</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Invoices',
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
</style>
