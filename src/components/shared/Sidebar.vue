<template>
  <!-- Mobile Overlay -->
  <div
    v-if="isMobileOpen"
    class="lg:hidden fixed inset-0 z-30 transition-opacity duration-500"
    style="background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px)"
    @click="$emit('close-mobile')"
  ></div>

  <!-- Sidebar -->
  <aside
    ref="sidebarEl"
    class="sidebar fixed lg:static h-screen flex flex-col z-40 transition-all duration-300 ease-in-out"
    :class="{
      '-translate-x-full lg:translate-x-0': !isMobileOpen,
      'w-[72px]': isCollapsed,
      'w-[260px]': !isCollapsed,
    }"
  >
    <!-- Noise texture overlay -->
    <div class="noise-overlay"></div>

    <!-- ══════════ HEADER ══════════ -->
    <div class="sidebar-header" :class="{ 'justify-center': isCollapsed }">
      <router-link
        to="/dashboard"
        class="logo-link"
        :class="{ 'justify-center': isCollapsed }"
        @click="closeMobileSidebar"
      >
        <div class="logo-icon">
          <i class="fas fa-file-invoice"></i>
          <span class="logo-badge"></span>
        </div>
        <transition name="fade-slide">
          <div v-if="!isCollapsed" class="logo-text">
            <span class="logo-name">{{ $t('app.name') }}</span>
            <span class="logo-version">v2.0 Enterprise</span>
          </div>
        </transition>
      </router-link>

      <button
        v-if="!isCollapsed"
        @click="toggleCollapse"
        class="collapse-btn hidden lg:flex"
        :title="$t('buttons.collapse')"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>

    <!-- ══════════ USER CARD ══════════ -->
    <transition name="fade-slide">
      <div v-if="!isCollapsed && user" class="user-card">
        <div class="user-avatar">
          <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
          <span v-else>{{ getUserInitials }}</span>
          <span class="online-dot"></span>
        </div>
        <div class="user-info">
          <p class="user-name">{{ user.name }}</p>
          <p class="user-email">{{ user.email }}</p>
          <span class="user-role" :class="isAdmin ? 'role-admin' : 'role-user'">
            <i class="fas" :class="isAdmin ? 'fa-crown' : 'fa-user'"></i>
            {{ userRole }}
          </span>
        </div>
      </div>
    </transition>

    <!-- Collapsed avatar -->
    <div v-if="isCollapsed && user" class="collapsed-avatar">
      <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
      <span v-else>{{ getUserInitials }}</span>
      <span class="online-dot"></span>
    </div>

    <!-- ══════════ NAV SECTION LABEL ══════════ -->
    <transition name="fade-slide">
      <div v-if="!isCollapsed" class="nav-label">
        <span>{{ $t('common.navigation') }}</span>
      </div>
    </transition>

    <!-- ══════════ NAVIGATION ══════════ -->
    <nav class="nav-menu scrollbar-thin">
      <ul>
        <!-- Dashboard -->
        <li v-if="hasPermission('view_dashboard')">
          <router-link
            to="/dashboard"
            @click="closeMobileSidebar"
            :class="['nav-item', isActive('/dashboard') && 'nav-item--active nav-item--blue']"
            :title="isCollapsed ? $t('nav.dashboard') : ''"
          >
            <span class="nav-icon nav-icon--blue">
              <i class="fas fa-tachometer-alt"></i>
            </span>
            <transition name="fade-slide">
              <span v-if="!isCollapsed" class="nav-label-text">{{ $t('nav.dashboard') }}</span>
            </transition>
            <span
              v-if="!isCollapsed && isActive('/dashboard')"
              class="active-dot active-dot--blue"
            ></span>
          </router-link>
        </li>

        <!-- Invoices -->
        <li v-if="hasPermission('view_invoices')">
          <router-link
            to="/invoices"
            @click="closeMobileSidebar"
            :class="['nav-item', isActive('/invoices') && 'nav-item--active nav-item--emerald']"
            :title="isCollapsed ? $t('nav.invoices') : ''"
          >
            <span class="nav-icon nav-icon--emerald" style="position: relative">
              <i class="fas fa-file-invoice-dollar"></i>
              <span v-if="pendingInvoices > 0" class="badge">
                {{ pendingInvoices > 9 ? '9+' : pendingInvoices }}
              </span>
            </span>
            <transition name="fade-slide">
              <div v-if="!isCollapsed" class="nav-text-block">
                <span class="nav-label-text">{{ $t('nav.invoices') }}</span>
                <span class="nav-sub">{{ $t('nav.invoices_desc') }}</span>
              </div>
            </transition>
          </router-link>
        </li>

        <!-- Clients -->
        <li v-if="hasPermission('view_clients')">
          <router-link
            to="/clients"
            @click="closeMobileSidebar"
            :class="['nav-item', isActive('/clients') && 'nav-item--active nav-item--violet']"
            :title="isCollapsed ? $t('nav.clients') : ''"
          >
            <span class="nav-icon nav-icon--violet">
              <i class="fas fa-users"></i>
            </span>
            <transition name="fade-slide">
              <div v-if="!isCollapsed" class="nav-text-block">
                <span class="nav-label-text">{{ $t('nav.clients') }}</span>
                <span class="nav-sub">{{ $t('nav.clients_desc') }}</span>
              </div>
            </transition>
          </router-link>
        </li>

        <!-- Reports -->
        <li v-if="hasPermission('view_reports')">
          <router-link
            to="/reports"
            @click="closeMobileSidebar"
            :class="['nav-item', isActive('/reports') && 'nav-item--active nav-item--amber']"
            :title="isCollapsed ? $t('nav.reports') : ''"
          >
            <span class="nav-icon nav-icon--amber">
              <i class="fas fa-chart-line"></i>
            </span>
            <transition name="fade-slide">
              <div v-if="!isCollapsed" class="nav-text-block">
                <span class="nav-label-text">{{ $t('nav.reports') }}</span>
                <span class="nav-sub">{{ $t('nav.reports_desc') }}</span>
              </div>
            </transition>
          </router-link>
        </li>

        <!-- ── ADMIN DIVIDER ── -->
        <li v-if="isAdmin">
          <transition name="fade-slide">
            <div v-if="!isCollapsed" class="section-divider">
              <div class="divider-line"></div>
              <span class="divider-label">{{ $t('admin.section_title') }}</span>
              <div class="divider-line"></div>
            </div>
            <div v-else class="divider-dot-wrap">
              <span class="divider-dot"></span>
            </div>
          </transition>
        </li>

        <!-- Users -->
        <li v-if="isAdmin">
          <router-link
            to="/users"
            @click="closeMobileSidebar"
            :class="['nav-item', isActive('/users') && 'nav-item--active nav-item--indigo']"
            :title="isCollapsed ? $t('nav.users') : ''"
          >
            <span class="nav-icon nav-icon--indigo">
              <i class="fas fa-user-shield"></i>
            </span>
            <transition name="fade-slide">
              <span v-if="!isCollapsed" class="nav-label-text">{{ $t('nav.users') }}</span>
            </transition>
          </router-link>
        </li>

        <!-- Groups -->
        <li v-if="isAdmin">
          <router-link
            to="/admin/groups"
            @click="closeMobileSidebar"
            :class="['nav-item', isActive('/admin/groups') && 'nav-item--active nav-item--pink']"
            :title="isCollapsed ? $t('adminGroups.title') : ''"
          >
            <span class="nav-icon nav-icon--pink">
              <i class="fas fa-users-cog"></i>
            </span>
            <transition name="fade-slide">
              <span v-if="!isCollapsed" class="nav-label-text">{{ $t('adminGroups.title') }}</span>
            </transition>
          </router-link>
        </li>

        <!-- Installment Tiers Settings -->
        <li v-if="isAdmin">
          <router-link
            to="/admin/installment-tiers"
            @click="closeMobileSidebar"
            :class="['nav-item', isActive('/admin/installment-tiers') && 'nav-item--active nav-item--pink']"
            :title="isCollapsed ? $t('installments.tiers_title') : ''"
          >
            <span class="nav-icon nav-icon--pink">
              <i class="fas fa-percentage"></i>
            </span>
            <transition name="fade-slide">
              <span v-if="!isCollapsed" class="nav-label-text">{{ $t('installments.tiers_title') }}</span>
            </transition>
          </router-link>
        </li>

        <!-- Permissions -->
        <li v-if="isAdmin">
          <router-link
            to="/permissions"
            @click="closeMobileSidebar"
            :class="['nav-item', isActive('/permissions') && 'nav-item--active nav-item--teal']"
            :title="isCollapsed ? $t('nav.permissions') : ''"
          >
            <span class="nav-icon nav-icon--teal">
              <i class="fas fa-shield-alt"></i>
            </span>
            <transition name="fade-slide">
              <span v-if="!isCollapsed" class="nav-label-text">{{ $t('nav.permissions') }}</span>
            </transition>
          </router-link>
        </li>

        <!-- OTP -->
        <li v-if="isAdmin">
          <router-link
            to="/admin/otp"
            @click="closeMobileSidebar"
            :class="['nav-item', isActive('/admin/otp') && 'nav-item--active nav-item--yellow']"
            :title="isCollapsed ? 'رموز OTP' : ''"
          >
            <span class="nav-icon nav-icon--yellow">
              <i class="fas fa-key"></i>
            </span>
            <transition name="fade-slide">
              <div v-if="!isCollapsed" class="nav-text-block">
                <span class="nav-label-text">رموز OTP</span>
                <span class="nav-sub">إدارة رموز التحقق</span>
              </div>
            </transition>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- ══════════ FOOTER ACTIONS ══════════ -->
    <div class="sidebar-footer">
      <!-- Language -->
      <button
        @click="toggleLanguage"
        class="footer-btn"
        :title="isCollapsed ? $t('buttons.toggle_language') : ''"
      >
        <span class="footer-btn-icon">
          <i class="fas fa-language"></i>
        </span>
        <transition name="fade-slide">
          <div v-if="!isCollapsed" class="footer-btn-text">
            <span>{{ isRTL ? 'English' : 'العربية' }}</span>
            <span class="footer-btn-sub">{{ $t('buttons.toggle_language') }}</span>
          </div>
        </transition>
      </button>

      <!-- Collapse toggle (mobile) -->
      <button
        v-if="isCollapsed && !isMobileOpen"
        @click="toggleCollapse"
        class="footer-btn lg:hidden"
      >
        <span class="footer-btn-icon">
          <i class="fas fa-chevron-right"></i>
        </span>
      </button>

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="footer-btn footer-btn--danger"
        :title="isCollapsed ? $t('auth.logout') : ''"
      >
        <span class="footer-btn-icon footer-btn-icon--danger">
          <i class="fas fa-sign-out-alt"></i>
        </span>
        <transition name="fade-slide">
          <div v-if="!isCollapsed" class="footer-btn-text">
            <span>{{ $t('auth.logout') }}</span>
            <span class="footer-btn-sub">{{ $t('auth.logout_desc') }}</span>
          </div>
        </transition>
      </button>

      <!-- Version -->
      <transition name="fade-slide">
        <div v-if="!isCollapsed" class="version-block">
          <div class="version-row">
            <span>{{ $t('app.version') }}</span>
            <span class="version-val">v2.0.0</span>
          </div>
          <div class="version-row">
            <span>{{ $t('app.status') }}</span>
            <div class="status-online">
              <span class="status-dot"></span>
              <span>{{ $t('app.online') }}</span>
            </div>
          </div>
          <p class="copyright">&copy; {{ new Date().getFullYear() }} {{ $t('app.name') }}</p>
        </div>
      </transition>
    </div>
  </aside>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  props: {
    isMobileOpen: { type: Boolean, default: false },
  },
  data() {
    return { isCollapsed: false }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('dashboard', ['stats']),
    ...mapGetters('auth', ['isAdmin', 'hasPermission']),
    isRTL() {
      return this.$i18n.locale === 'ar'
    },
    pendingInvoices() {
      return this.stats?.pendingInvoices || 0
    },
    getUserInitials() {
      if (!this.user?.name) return 'U'
      return this.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
    userRole() {
      if (this.isAdmin) return this.$t('auth.admin')
      return this.user?.roles?.[0]?.name || this.$t('auth.user')
    },
  },
  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      localStorage.setItem('sidebarCollapsed', this.isCollapsed)
      this.$emit('toggle-collapse', this.isCollapsed)
    },
    closeMobileSidebar() {
      if (window.innerWidth < 1024) this.$emit('close-mobile')
    },
    toggleLanguage() {
      const newLang = this.isRTL ? 'en' : 'ar'
      this.$i18n.locale = newLang
      localStorage.setItem('userLanguage', newLang)
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = newLang
      this.$toast?.info(
        this.$t('language.changed', { lang: newLang === 'ar' ? 'العربية' : 'English' }),
      )
    },
    async handleLogout() {
      try {
        const confirmed = await this.$swal({
          title: this.$t('auth.logout_confirm'),
          text: this.$t('auth.logout_confirm_text'),
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#6b7280',
          confirmButtonText: this.$t('auth.logout'),
          cancelButtonText: this.$t('common.cancel'),
          reverseButtons: true,
        })
        if (confirmed.isConfirmed) {
          await this.$store.dispatch('auth/logout')
          this.$router.push('/login')
        }
      } catch (e) {
        console.error(e)
      }
    },
  },
  mounted() {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) this.isCollapsed = saved === 'true'
    if (!this.stats) this.$store.dispatch('dashboard/fetchDashboardData')
  },
}
</script>

<style scoped>
/* ═══════════════════════════════════════
   CSS VARIABLES
═══════════════════════════════════════ */
:root {
  --sidebar-bg: #0f1117;
  --sidebar-border: rgba(255, 255, 255, 0.06);
  --sidebar-text: #a1a8bc;
  --sidebar-text-active: #ffffff;
}

/* ═══════════════════════════════════════
   SIDEBAR BASE
═══════════════════════════════════════ */
.sidebar {
  background: linear-gradient(160deg, #0f1117 0%, #141720 50%, #0f1117 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}

/* Noise texture */
.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.3;
}

/* Ambient glow */
.sidebar::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -80px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.sidebar::after {
  content: '';
  position: absolute;
  bottom: -100px;
  left: -60px;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.sidebar > * {
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════════
   HEADER
═══════════════════════════════════════ */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  flex: 1;
  min-width: 0;
}

.logo-icon {
  position: relative;
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.logo-link:hover .logo-icon {
  transform: scale(1.05);
  box-shadow: 0 6px 28px rgba(99, 102, 241, 0.5);
}

.logo-icon i {
  color: #fff;
  font-size: 18px;
}

.logo-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #0f1117;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(34, 197, 94, 0);
  }
}

.logo-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo-name {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logo-version {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.5px;
  margin-top: 1px;
}

.collapse-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* ═══════════════════════════════════════
   USER CARD
═══════════════════════════════════════ */
.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  flex-shrink: 0;
}

.user-avatar {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.3);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 11px;
  height: 11px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #0f1117;
}

.collapsed-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  color: #fff;
  margin: 12px auto;
  flex-shrink: 0;
  overflow: hidden;
}

.collapsed-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 1px;
}

.user-email {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.user-role {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.role-admin {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.role-user {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

/* ═══════════════════════════════════════
   NAV LABEL
═══════════════════════════════════════ */
.nav-label {
  padding: 16px 20px 6px;
  flex-shrink: 0;
}

.nav-label span {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.2);
}

/* ═══════════════════════════════════════
   NAV MENU
═══════════════════════════════════════ */
.nav-menu {
  flex: 1;
  overflow-y: auto;
  padding: 4px 10px;
}

.nav-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Nav Item Base */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.45);
  transition: all 0.18s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0);
  transition: background 0.2s;
  border-radius: 10px;
}

.nav-item:hover {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.05);
}

/* Active States */
.nav-item--active {
  color: #fff !important;
}

.nav-item--blue.nav-item--active {
  background: rgba(59, 130, 246, 0.15);
  border-right: 2px solid #3b82f6;
}
.nav-item--emerald.nav-item--active {
  background: rgba(16, 185, 129, 0.15);
  border-right: 2px solid #10b981;
}
.nav-item--violet.nav-item--active {
  background: rgba(139, 92, 246, 0.15);
  border-right: 2px solid #8b5cf6;
}
.nav-item--amber.nav-item--active {
  background: rgba(245, 158, 11, 0.15);
  border-right: 2px solid #f59e0b;
}
.nav-item--indigo.nav-item--active {
  background: rgba(99, 102, 241, 0.15);
  border-right: 2px solid #6366f1;
}
.nav-item--pink.nav-item--active {
  background: rgba(236, 72, 153, 0.15);
  border-right: 2px solid #ec4899;
}
.nav-item--teal.nav-item--active {
  background: rgba(20, 184, 166, 0.15);
  border-right: 2px solid #14b8a6;
}
.nav-item--yellow.nav-item--active {
  background: rgba(234, 179, 8, 0.15);
  border-right: 2px solid #eab308;
}

/* Nav Icon */
.nav-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.35);
}

.nav-item:hover .nav-icon {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
}

.nav-item--blue.nav-item--active .nav-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}
.nav-item--emerald.nav-item--active .nav-icon {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}
.nav-item--violet.nav-item--active .nav-icon {
  background: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
}
.nav-item--amber.nav-item--active .nav-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}
.nav-item--indigo.nav-item--active .nav-icon {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
}
.nav-item--pink.nav-item--active .nav-icon {
  background: rgba(236, 72, 153, 0.2);
  color: #f472b6;
}
.nav-item--teal.nav-item--active .nav-icon {
  background: rgba(20, 184, 166, 0.2);
  color: #2dd4bf;
}
.nav-item--yellow.nav-item--active .nav-icon {
  background: rgba(234, 179, 8, 0.2);
  color: #facc15;
}

/* Nav Text */
.nav-label-text {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.nav-text-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.nav-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.25);
}

/* Active dot */
.active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: auto;
  animation: pulse-dot 2s infinite;
}

.active-dot--blue {
  background: #3b82f6;
}

/* Badge */
.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background: #ef4444;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0f1117;
  padding: 0 3px;
  animation: badge-pulse 2s infinite;
}

@keyframes badge-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
  }
}

/* ═══════════════════════════════════════
   SECTION DIVIDER
═══════════════════════════════════════ */
.section-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 4px 8px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.divider-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.2);
  white-space: nowrap;
}

.divider-dot-wrap {
  display: flex;
  justify-content: center;
  padding: 10px 0 4px;
}

.divider-dot {
  width: 20px;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  display: block;
}

/* ═══════════════════════════════════════
   SIDEBAR FOOTER
═══════════════════════════════════════ */
.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 10px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  width: 100%;
  text-align: right;
  transition: all 0.18s;
}

.footer-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.75);
}

.footer-btn--danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.footer-btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  transition: all 0.2s;
}

.footer-btn-icon--danger {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.footer-btn-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  text-align: right;
}

.footer-btn-text span:first-child {
  font-size: 12px;
  font-weight: 500;
}
.footer-btn-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.2);
}

/* ═══════════════════════════════════════
   VERSION BLOCK
═══════════════════════════════════════ */
.version-block {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 6px;
  padding-top: 10px;
}

.version-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.2);
}

.version-val {
  color: #22c55e;
  font-weight: 600;
}

.status-online {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #22c55e;
}

.status-dot {
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

.copyright {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.1);
  text-align: center;
  margin-top: 8px;
}

/* ═══════════════════════════════════════
   SCROLLBAR
═══════════════════════════════════════ */
.scrollbar-thin::-webkit-scrollbar {
  width: 3px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* ═══════════════════════════════════════
   TRANSITIONS
═══════════════════════════════════════ */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* RTL */
[dir='rtl'] .nav-item--blue.nav-item--active,
[dir='rtl'] .nav-item--emerald.nav-item--active,
[dir='rtl'] .nav-item--violet.nav-item--active,
[dir='rtl'] .nav-item--amber.nav-item--active,
[dir='rtl'] .nav-item--indigo.nav-item--active,
[dir='rtl'] .nav-item--pink.nav-item--active,
[dir='rtl'] .nav-item--teal.nav-item--active,
[dir='rtl'] .nav-item--yellow.nav-item--active {
  border-right: none;
  border-left: 2px solid;
}

[dir='rtl'] .fade-slide-enter-from,
[dir='rtl'] .fade-slide-leave-to {
  transform: translateX(8px);
}

/* ═══════════════════════════════════════
   MOBILE
═══════════════════════════════════════ */
@media (max-width: 1024px) {
  .sidebar {
    box-shadow: 8px 0 40px rgba(0, 0, 0, 0.5);
  }
}
</style>
