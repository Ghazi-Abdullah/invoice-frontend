import axios from 'axios'

const state = {
  privacyData: {},
  termsData: {},
  loading: false,
  error: null,
}

const getters = {
  privacyData: (state) => state.privacyData,
  termsData: (state) => state.termsData,
  loading: (state) => state.loading,
  error: (state) => state.error,
}

const actions = {
  async fetchPrivacyData({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('/api/content/privacy')
      commit('SET_PRIVACY_DATA', response.data)
    } catch (error) {
      console.error('Error fetching privacy data:', error)
      // Fallback data for demo
      commit('SET_PRIVACY_DATA', {
        last_updated: '2024-01-15',
        introduction: 'نحن نلتزم بحماية خصوصيتك وضمان أمان بياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك.',
        sections: [
          {
            title: 'المعلومات التي نجمعها',
            content: [
              'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند استخدامك لخدماتنا، مثل اسمك وبريدك الإلكتروني ومعلومات الشركة.',
              'كما نقوم بجمع معلومات تلقائية مثل عنوان IP ونوع المتصفح ونظام التشغيل لتحسين تجربتك.',
            ],
            items: [
              'معلومات الحساب (الاسم، البريد الإلكتروني، رقم الهاتف)',
              'معلومات الشركة (اسم الشركة، السجل التجاري)',
              'بيانات الفواتير والمدفوعات',
              'سجل النشاط والاستخدام',
            ],
          },
          {
            title: 'كيفية استخدام المعلومات',
            content: [
              'نستخدم معلوماتك لتقديم خدماتنا وتحسينها، ومعالجة الفواتير والمدفوعات، والتواصل معك بشأن حسابك.',
              'لن نقوم ببيع أو مشاركة بياناتك الشخصية مع أطراف ثالثة لأغراض تسويقية.',
            ],
          },
          {
            title: 'حماية البيانات',
            content: [
              'نستخدم تقنيات تشفير متقدمة (SSL/TLS) لحماية بياناتك أثناء النقل والتخزين.',
              'نطبق إجراءات أمنية صارمة لمنع الوصول غير المصرح به إلى بياناتك.',
            ],
            items: [
              'تشفير البيانات أثناء النقل والتخزين',
              'مصادقة ثنائية (2FA) للوصول الآمن',
              'نسخ احتياطي منتظم للبيانات',
              'مراقبة أمنية مستمرة للنظام',
            ],
          },
          {
            title: 'حقوقك',
            content: [
              'لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها أو حذفها.',
              'يمكنك طلب نسخة من بياناتك في أي وقت.',
              'لديك الحق في الاعتراض على معالجة بياناتك لأغراض تسويقية.',
            ],
          },
        ],
      })
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTermsData({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await axios.get('/api/content/terms')
      commit('SET_TERMS_DATA', response.data)
    } catch (error) {
      console.error('Error fetching terms data:', error)
      commit('SET_TERMS_DATA', {
        version: '1.0',
        effective_date: '2024-01-01',
        acceptance_text: 'باستخدامك لنظام الفواتير، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يجب عليك عدم استخدام الخدمة.',
        sections: [
          {
            title: 'تعريفات',
            content: [
              '"النظام" يشير إلى منصة إدارة الفواتير الإلكترونية.',
              '"المستخدم" يشير إلى أي شخص أو كيان يستخدم النظام.',
              '"العميل" يشير إلى الطرف الذي يتم إصدار الفاتورة له.',
            ],
          },
          {
            title: 'استخدام الخدمة',
            content: [
              'يجب أن يكون عمرك 18 عاماً على الأقل لاستخدام النظام.',
              'أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك.',
              'لا يجوز استخدام النظام لأي أغراض غير قانونية أو احتيالية.',
            ],
            sub_sections: [
              {
                title: 'قيود الاستخدام',
                content: 'ممنوع محاولة الوصول غير المصرح به أو تعطيل النظام أو إدخال برمجيات ضارة.',
              },
              {
                title: 'المحتوى',
                content: 'أنت المسؤول الوحيد عن دقة البيانات التي تدخلها في النظام.',
              },
            ],
          },
          {
            title: 'الاشتراكات والمدفوعات',
            content: [
              'الرسوم المحددة للاشتراكات غير قابلة للاسترداد.',
              'نحتفظ بالحق في تعديل أسعار الاشتراكات مع إشعار مسبق.',
              'في حالة عدم السداد، قد يتم تعليق حسابك مؤقتاً.',
            ],
          },
          {
            title: 'إخلاء المسؤولية',
            content: [
              'نقدم الخدمة "كما هي" دون أي ضمانات صريحة أو ضمنية.',
              'لا نتحمل المسؤولية عن أي خسائر غير مباشرة ناتجة عن استخدام النظام.',
            ],
          },
          {
            title: 'إنهاء الخدمة',
            content: [
              'يمكنك إلغاء حسابك في أي وقت.',
              'نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة انتهاك الشروط.',
            ],
          },
        ],
      })
    } finally {
      commit('SET_LOADING', false)
    }
  },
}

const mutations = {
  SET_PRIVACY_DATA(state, data) {
    state.privacyData = data
  },
  SET_TERMS_DATA(state, data) {
    state.termsData = data
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}