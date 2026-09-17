// src/stores/modules/invoiceNotifications.js
// يدير حالة إشعارات لوحة تحكم الأدمن: عدادات الفواتير + التذاكر المفتوحة،
// مع الاستماع الفوري (Real-time) عبر Laravel Echo لأي تحديث يبثه الباك اند.

import echo from '@/echo'
import axios from '@/api/axios'

export default {
  namespaced: true,

  state: {
    unpaidCount: 0,       // عدد الفواتير غير المدفوعة (كل الحالات ما عدا paid)
    overdueCount: 0,      // عدد الفواتير المتأخرة عن الاستحقاق
    dueSoonCount: 0,      // عدد الفواتير المستحقة خلال 7 أيام قادمة
    openTicketsCount: 0,  // عدد تذاكر الدعم المفتوحة/قيد المعالجة
    hasNew: false,        // يتحكم بعرض نقطة/رسم متحرك على الجرس (تنبيه بصري لوجود جديد)
    lastTrigger: null,    // آخر سبب تحديث وصل (initial | broadcast | due_date_check ...)
    channel: null,        // مرجع قناة Echo الحالية، نحتاجه لإيقاف الاستماع لاحقًا بدقة
  },

  getters: {
    unpaidCount: state => state.unpaidCount,
    overdueCount: state => state.overdueCount,
    dueSoonCount: state => state.dueSoonCount,
    openTicketsCount: state => state.openTicketsCount,
    // المجموع الكلي المعروض على شارة الجرس الحمراء
    totalCount: state => state.unpaidCount + state.overdueCount + state.dueSoonCount + state.openTicketsCount,
    hasNew: state => state.hasNew,
    lastTrigger: state => state.lastTrigger,
  },

  mutations: {
    // يحدّث كل العدادات دفعة وحدة (يُستخدم من fetchInitialCounts وأيضًا من حدث البث الفوري)
    SET_COUNTS(state, { unpaid, overdue, due_soon, open_tickets, trigger }) {
      const oldTotal = state.unpaidCount + state.overdueCount + state.dueSoonCount + state.openTicketsCount
      const newTotal = unpaid + overdue + due_soon + (open_tickets || 0)

      state.unpaidCount = unpaid
      state.overdueCount = overdue
      state.dueSoonCount = due_soon
      state.openTicketsCount = open_tickets || 0
      state.lastTrigger = trigger || null

      // نفعّل مؤشر "جديد" لو تغيّر المجموع، أو لو التحديث جاي من بث حقيقي (مو التحميل الأول)
      if (newTotal !== oldTotal || trigger !== 'initial') {
        state.hasNew = true
      }
    },

    SET_HAS_NEW(state, value) {
      state.hasNew = value
    },

    // تُستدعى لما المستخدم يفتح الجرس أو يضغط على أحد العناصر — تخفي مؤشر "جديد"
    CLEAR_NEW(state) {
      state.hasNew = false
    },

    SET_CHANNEL(state, channel) {
      state.channel = channel
    },

    CLEAR_CHANNEL(state) {
      state.channel = null
    },
  },

  actions: {
    // يجلب العدادات الحالية مرة وحدة (يُستخدم عند فتح التطبيق، وعند فتح قائمة الجرس يدويًا)
    async fetchInitialCounts({ commit }) {
      try {
        const { data } = await axios.get('/admin/invoices/notification-counts')
        if (data.status) {
          commit('SET_COUNTS', {
            unpaid: data.data.unpaid || 0,
            overdue: data.data.overdue || 0,
            due_soon: data.data.due_soon || 0,
            open_tickets: data.data.open_tickets || 0,
            trigger: 'initial', // يمنع تفعيل "hasNew" عند أول تحميل للصفحة
          })
        }
      } catch (e) {
        console.error('❌ Failed to fetch notification counts:', e)
      }
    },

    // يبدأ الاستماع الفوري على قناة الأدمن المشتركة (invoice-admin-channel)
    // يُستدعى مرة وحدة عند mount مكوّن الجرس (InvoiceNotificationBell.vue)
    startListening({ commit, dispatch }) {
      if (!echo) {
        console.warn('Echo not initialized')
        return
      }

      // نجلب القيم الحالية أول شي، قبل ما ننتظر أي بث جديد
      dispatch('fetchInitialCounts')

      const channel = echo
        .channel('invoice-admin-channel')

        // حدث تحديث العدادات العام — يُبث من InvoiceNotificationHelper::broadcastCounts()
        // في كل مرة تتغير فيها أرقام الفواتير/التذاكر (سواء من أمر مجدول أو أكشن يدوي)
        .listen('.invoice-notification-updated', (data) => {
          commit('SET_COUNTS', {
            unpaid: data.unpaidCount || 0,
            overdue: data.overdueCount || 0,
            due_soon: data.dueSoonCount || 0,
            open_tickets: data.openTicketsCount || 0,
            trigger: data.trigger || 'broadcast',
          })
        })

        // حدث تنبيه فوري تفصيلي (مو مجرد عداد) — يُبث من
        // InvoiceNotificationHelper::broadcastDueDateAlerts() لحظة تحول فاتورة لمتأخرة
        // أو دخولها نافذة "تستحق قريبًا"، ويحمل تفاصيل الفواتير نفسها (رقم، اسم العميل...)
        .listen('.invoice-due-date-alert', (data) => {
          console.log('📢 Due date alert:', data.alertType, data.invoices)
          // TODO: يمكن لاحقًا استبدال الـ console.log بعرض toast فوري
          // يسرد أسماء العملاء/أرقام الفواتير المتأثرة، بدل الاكتفاء بالعداد فقط
        })

      commit('SET_CHANNEL', channel)
    },

    // يوقف الاستماع ويغادر القناة — يُستدعى عند beforeUnmount لتفادي تسريب الذاكرة
    // (Memory leak) أو استماع مكرر لو المكوّن يتركب أكثر من مرة
    stopListening({ commit, state }) {
      if (state.channel) {
        state.channel.stopListening('.invoice-notification-updated')
        state.channel.stopListening('.invoice-due-date-alert')
      }
      if (echo) {
        echo.leaveChannel('invoice-admin-channel')
      }
      commit('CLEAR_CHANNEL')
    },

    // إعادة جلب يدوية — تُستدعى لما المستخدم يفتح قائمة الجرس (toggle) للتأكد
    // إن الأرقام محدّثة حتى لو فاته حدث بث لأي سبب (انقطاع اتصال مؤقت مثلًا)
    async refreshCounts({ dispatch }) {
      await dispatch('fetchInitialCounts')
    },
  },
}
