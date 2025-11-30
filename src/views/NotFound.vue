<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <h1>404</h1>
        <h2>الصفحة غير موجودة</h2>
        <p>عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
        <router-link to="/dashboard" class="btn btn-primary"> العودة للرئيسية </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  text-align: center;
  padding: 2rem;
}

.error-content h1 {
  font-size: 6rem;
  color: #e74c3c;
  margin: 0;
}

.error-content h2 {
  color: #2c3e50;
  margin: 1rem 0;
}

.error-content p {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}
</style>
