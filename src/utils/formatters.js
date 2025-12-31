// src/utils/formatters.js
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0.00 ر.س'
  const num = parseFloat(amount)
  if (isNaN(num)) return '0.00 ر.س'
  return num.toLocaleString('ar-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' ر.س'
}

export const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    return 'تاريخ غير صالح'
  }
}

export const getInitials = (name) => {
  if (!name) return '؟'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'غير محدد'

  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `قبل ${days} يوم`
  if (hours > 0) return `قبل ${hours} ساعة`
  if (minutes > 0) return `قبل ${minutes} دقيقة`
  return 'الآن'
}

export const getStatusClass = (status) => {
  const classes = {
    paid: 'bg-green-100 text-green-800',
    sent: 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800',
    overdue: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

export const getStatusText = (status) => {
  const texts = {
    paid: 'مدفوعة',
    sent: 'مرسلة',
    draft: 'مسودة',
    overdue: 'متأخرة',
    active: 'نشط',
    inactive: 'غير نشط'
  }
  return texts[status] || status
}
