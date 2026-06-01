<template>
  <div class="landing">
    <header class="lp-nav">
      <div class="lp-nav-inner">
        <router-link to="/" class="lp-logo">
          <div class="lp-logo-mark">S</div>
          <span class="lp-logo-name">Slotifai</span>
        </router-link>
        <nav class="lp-nav-links">
          <router-link to="/masters" class="lp-nav-link">{{ t('nav.findMasters') }}</router-link>
          <a href="#how" class="lp-nav-link">{{ t('nav.howItWorks') }}</a>
          <a href="#for-pros" class="lp-nav-link">{{ t('nav.forProfessionals') }}</a>
        </nav>
        <div class="lp-nav-actions">
          <ThemeToggle />
          <LanguageSwitcher />
          <router-link to="/login" class="lp-btn-ghost">{{ t('nav.signIn') }}</router-link>
          <router-link to="/register" class="lp-btn-primary">{{ t('nav.getStarted') }}</router-link>
        </div>
      </div>
    </header>
    <section class="lp-hero">
      <div class="lp-hero-bg">
        <div class="hero-blob hero-blob-1" />
        <div class="hero-blob hero-blob-2" />
        <div class="hero-blob hero-blob-3" />
      </div>
      <div class="lp-container lp-hero-inner">
        <div class="hero-badge">
          <span class="mdi mdi-lightning-bolt" />
          {{ t('landing.heroBadge') }}
        </div>
        <h1 class="hero-title">
          {{ t('landing.heroTitle') }}<br />
          <span class="hero-title-accent">{{ t('landing.heroTitleAccent') }}</span>
        </h1>
        <p class="hero-desc">{{ t('landing.heroDesc') }}</p>
        <div class="hero-cta">
          <router-link to="/register" class="lp-btn-primary lp-btn-lg">
            <span class="mdi mdi-calendar-check-outline" />
            {{ t('landing.heroCtaBook') }}
          </router-link>
          <router-link to="/masters" class="lp-btn-outline lp-btn-lg">
            {{ t('landing.heroCtaBrowse') }}
            <span class="mdi mdi-arrow-right" />
          </router-link>
        </div>
        <div class="hero-trust">
          <div class="trust-item">
            <span class="trust-num">{{ statsLoading ? '…' : `${stats.masters}` }}</span>
            <span class="trust-label">{{ t('landing.trustMasters') }}</span>
          </div>
          <div class="trust-divider" />
          <div class="trust-item">
            <span class="trust-num">{{ statsLoading ? '…' : `${stats.bookings}` }}</span>
            <span class="trust-label">{{ t('landing.trustBookings') }}</span>
          </div>
          <div class="trust-divider" />
          <div class="trust-item">
            <span class="trust-num">{{ statsLoading ? '…' : `${stats.rating} ★` }}</span>
            <span class="trust-label">{{ t('landing.trustRating') }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="lp-strip">
      <div class="lp-container lp-strip-inner">
        <div v-for="spec in specs" :key="spec.key" class="spec-chip">
          <span class="mdi" :class="spec.mdi" />
          {{ t(`landing.specs.${spec.key}`) }}
        </div>
      </div>
    </section>
    <section class="lp-section" id="how">
      <div class="lp-container">
        <div class="section-head">
          <div class="section-label">{{ t('landing.howLabel') }}</div>
          <h2 class="section-title">{{ t('landing.howTitle') }}</h2>
        </div>
        <div class="steps-grid">
          <div v-for="step in howSteps" :key="step.num" class="step-card">
            <div class="step-num">{{ step.num }}</div>
            <div class="step-icon">
              <span class="mdi" :class="step.mdi" />
            </div>
            <div class="step-title">{{ t(step.titleKey) }}</div>
            <div class="step-desc">{{ t(step.descKey) }}</div>
          </div>
        </div>
      </div>
    </section>
    <section class="lp-section lp-section-tinted">
      <div class="lp-container">
        <div class="section-head">
          <div class="section-label">{{ t('landing.featuresLabel') }}</div>
          <h2 class="section-title">{{ t('landing.featuresTitle') }}</h2>
        </div>
        <div class="features-grid">
          <div v-for="f in features" :key="f.titleKey" class="feature-card">
            <div class="feature-icon" :class="f.color">
              <span class="mdi" :class="f.mdi" />
            </div>
            <div class="feature-title">{{ t(f.titleKey) }}</div>
            <div class="feature-desc">{{ t(f.descKey) }}</div>
          </div>
        </div>
      </div>
    </section>
    <section class="lp-section" id="for-pros">
      <div class="lp-container lp-pros-inner">
        <div class="pros-text">
          <div class="section-label">{{ t('landing.prosLabel') }}</div>
          <h2 class="section-title section-title-left">{{ t('landing.prosTitle') }}</h2>
          <p class="pros-desc">{{ t('landing.prosDesc') }}</p>
          <ul class="pros-list">
            <li v-for="(item, i) in prosList" :key="i" class="pros-list-item">
              <span class="mdi mdi-check-circle pros-check" />
              {{ item }}
            </li>
          </ul>
          <router-link to="/register?role=MASTER" class="lp-btn-primary lp-btn-md">
            <span class="mdi mdi-briefcase-outline" />
            {{ t('landing.prosJoin') }}
          </router-link>
        </div>
        <div class="pros-card-wrap">
          <div class="pros-preview-card">
            <div class="ppc-header">
              <div class="ppc-avatar">A</div>
              <div>
                <div class="ppc-name">Alex Johnson</div>
                <div class="ppc-spec">Hair stylist · Barber</div>
              </div>
              <div class="ppc-rating"><span class="mdi mdi-star" style="color:var(--accent);" /> 4.9</div>
            </div>
            <div class="ppc-services">
              <div v-for="s in previewServices" :key="s.name" class="ppc-service">
                <span>{{ s.name }}</span>
                <span class="ppc-service-meta">{{ s.dur }} · {{ s.price }} ₴</span>
              </div>
            </div>
            <button class="ppc-book-btn">{{ t('landing.prosBookNow') }}</button>
          </div>
        </div>
      </div>
    </section>
    <section class="lp-cta-banner">
      <div class="lp-container lp-cta-inner">
        <div class="cta-blob cta-blob-1" />
        <div class="cta-blob cta-blob-2" />
        <h2 class="cta-title">{{ t('landing.ctaTitle') }}</h2>
        <p class="cta-sub">{{ t('landing.ctaSub') }}</p>
        <div class="cta-btns">
          <router-link to="/register" class="cta-btn-white">
            {{ t('landing.ctaCreate') }}
          </router-link>
          <router-link to="/masters" class="cta-btn-outline">
            {{ t('landing.ctaBrowse') }}
          </router-link>
        </div>
      </div>
    </section>
    <footer class="lp-footer">
      <div class="lp-container lp-footer-inner">
        <div class="footer-brand">
          <div class="lp-logo">
            <div class="lp-logo-mark lp-logo-mark-sm">S</div>
            <span class="lp-logo-name" style="font-size:14px;">Slotifai</span>
          </div>
          <div class="footer-tagline">{{ t('landing.tagline') }}</div>
        </div>
        <div class="footer-links">
          <router-link to="/masters" class="footer-link">{{ t('nav.findMasters') }}</router-link>
          <router-link to="/register" class="footer-link">{{ t('nav.signUp') }}</router-link>
          <router-link to="/login" class="footer-link">{{ t('nav.signIn') }}</router-link>
        </div>
        <div class="footer-copy">{{ t('landing.footerCopy') }}</div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mastersApi } from '@/api/masters'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const { t, tm } = useI18n()

const prosList = computed(() => tm('landing.prosList') as string[])

const statsLoading = ref(true)
const stats = ref({ masters: 0, bookings: 0, rating: '0.0' })

onMounted(async () => {
  try {
    const result = await mastersApi.list({ limit: 100, page: 1 })
    const masters = result.data
    const totalMasters = result.total
    const totalBookings = masters.reduce((sum, m) => sum + (m.bookingCount ?? 0), 0)
    const rated = masters.filter(m => m.reviewCount > 0)
    const avgRating = rated.length
      ? (rated.reduce((sum, m) => sum + m.rating, 0) / rated.length).toFixed(1)
      : '—'
    stats.value = { masters: totalMasters, bookings: totalBookings, rating: avgRating }
  } catch {
  } finally {
    statsLoading.value = false
  }
})

const specs = [
  { key: 'hair', mdi: 'mdi-content-cut' },
  { key: 'nails', mdi: 'mdi-nail' },
  { key: 'skincare', mdi: 'mdi-face-woman-shimmer-outline' },
  { key: 'massage', mdi: 'mdi-spa-outline' },
  { key: 'brows', mdi: 'mdi-eye-outline' },
  { key: 'dentistry', mdi: 'mdi-tooth-outline' },
  { key: 'fitness', mdi: 'mdi-dumbbell' },
  { key: 'more', mdi: 'mdi-dots-horizontal' },
]

const howSteps = [
  { num: '01', mdi: 'mdi-magnify', titleKey: 'landing.step1Title', descKey: 'landing.step1Desc' },
  { num: '02', mdi: 'mdi-calendar-check-outline', titleKey: 'landing.step2Title', descKey: 'landing.step2Desc' },
  { num: '03', mdi: 'mdi-check-circle-outline', titleKey: 'landing.step3Title', descKey: 'landing.step3Desc' },
]

const features = [
  { mdi: 'mdi-clock-fast', titleKey: 'landing.feat1Title', descKey: 'landing.feat1Desc', color: 'fi-primary' },
  { mdi: 'mdi-shield-check-outline', titleKey: 'landing.feat2Title', descKey: 'landing.feat2Desc', color: 'fi-success' },
  { mdi: 'mdi-bell-ring-outline', titleKey: 'landing.feat3Title', descKey: 'landing.feat3Desc', color: 'fi-accent' },
  { mdi: 'mdi-chart-line', titleKey: 'landing.feat4Title', descKey: 'landing.feat4Desc', color: 'fi-info' },
  { mdi: 'mdi-calendar-sync-outline', titleKey: 'landing.feat5Title', descKey: 'landing.feat5Desc', color: 'fi-teal' },
  { mdi: 'mdi-account-group-outline', titleKey: 'landing.feat6Title', descKey: 'landing.feat6Desc', color: 'fi-rose' },
]

const previewServices = [
  { name: 'Haircut & Styling', dur: '45 min', price: 45 },
  { name: 'Beard Trim', dur: '20 min', price: 25 },
  { name: 'Full Package', dur: '60 min', price: 65 },
]
</script>

<style scoped>
/* ── Base ────────────────────────────────────────────── */
.landing {
  font-family: var(--font-sans);
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
}
.lp-container {
  max-width: 1120px; margin: 0 auto; padding: 0 32px;
}

/* ── Navbar ──────────────────────────────────────────── */
.lp-nav {
  position: sticky; top: 0; z-index: 100;
  background: var(--surface-glass);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.lp-nav-inner {
  max-width: 1120px; margin: 0 auto; padding: 0 32px;
  height: 64px; display: flex; align-items: center; gap: 32px;
}
.lp-logo {
  display: flex; align-items: center; gap: 9px;
  text-decoration: none; flex-shrink: 0;
}
.lp-logo-mark {
  width: 30px; height: 30px; border-radius: 7px;
  background: var(--primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 16px; letter-spacing: -0.5px;
}
.lp-logo-mark-sm { width: 24px; height: 24px; font-size: 13px; border-radius: 5px; }
.lp-logo-name { font-weight: 700; font-size: 16px; letter-spacing: -0.02em; color: var(--text); }

.lp-nav-links { display: flex; gap: 4px; flex: 1; }
.lp-nav-link {
  padding: 6px 12px; border-radius: var(--r-md);
  font-size: 13.5px; font-weight: 500; color: var(--text-muted);
  text-decoration: none; transition: all var(--t-fast);
}
.lp-nav-link:hover { background: var(--surface-3); color: var(--text); }

.lp-nav-actions { display: flex; align-items: center; gap: 8px; }

/* ── Shared buttons ──────────────────────────────────── */
.lp-btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 0 20px; height: 42px; border-radius: var(--r-md);
  background: var(--primary); color: #fff;
  font-size: 13.5px; font-weight: 600; text-decoration: none;
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
  white-space: nowrap;
}
.lp-btn-primary:hover {
  background: var(--primary-hover);
  box-shadow: 0 4px 16px var(--primary-glow);
  transform: translateY(-1px);
}
.lp-btn-primary.lp-btn-lg { height: 52px; padding: 0 28px; font-size: 15px; border-radius: var(--r-lg); }
.lp-btn-primary.lp-btn-md { height: 46px; padding: 0 24px; font-size: 14px; }

.lp-btn-ghost {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 0 16px; height: 42px; border-radius: var(--r-md);
  background: transparent; color: var(--text-muted);
  font-size: 13.5px; font-weight: 500; text-decoration: none;
  transition: all var(--t-fast);
}
.lp-btn-ghost:hover { background: var(--surface-3); color: var(--text); }

.lp-btn-outline {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 0 24px; height: 52px; border-radius: var(--r-lg);
  background: var(--surface); color: var(--text);
  border: 1.5px solid var(--border-strong);
  font-size: 15px; font-weight: 600; text-decoration: none;
  transition: all var(--t-fast);
}
.lp-btn-outline:hover { background: var(--surface-2); border-color: var(--primary); color: var(--primary); }

/* ── Hero ────────────────────────────────────────────── */
.lp-hero {
  position: relative; overflow: hidden;
  padding: 96px 0 80px;
  background: linear-gradient(160deg, #F0F7F9 0%, var(--bg) 60%);
}
.lp-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.hero-blob {
  position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.45;
}
.hero-blob-1 {
  width: 600px; height: 600px; top: -200px; right: -100px;
  background: radial-gradient(circle, rgba(15,76,92,.12) 0%, transparent 70%);
}
.hero-blob-2 {
  width: 400px; height: 400px; bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(229,168,35,.15) 0%, transparent 70%);
}
.hero-blob-3 {
  width: 300px; height: 300px; top: 40%; right: 20%;
  background: radial-gradient(circle, rgba(37,99,235,.07) 0%, transparent 70%);
}

.lp-hero-inner { position: relative; z-index: 1; }

.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: var(--r-pill);
  background: var(--primary-soft); border: 1px solid var(--primary-soft);
  color: var(--primary); font-size: 12.5px; font-weight: 600;
  margin-bottom: 24px;
}
.hero-badge .mdi { font-size: 14px; color: var(--accent); }

.hero-title {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800; line-height: 1.08;
  letter-spacing: -0.04em;
  margin: 0 0 20px; color: var(--text);
}
.hero-title-accent { color: var(--primary); }

.hero-desc {
  font-size: 17px; line-height: 1.65; color: var(--text-muted);
  max-width: 520px; margin: 0 0 36px;
}

.hero-cta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }

.hero-trust { display: flex; align-items: center; gap: 20px; }
.trust-item { display: flex; flex-direction: column; }
.trust-num { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; }
.trust-label { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
.trust-divider { width: 1px; height: 36px; background: var(--border-strong); }

/* ── Strip ───────────────────────────────────────────── */
.lp-strip {
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 20px 0;
}
.lp-strip-inner {
  display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
}
.spec-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: var(--r-pill);
  background: var(--surface-2); border: 1px solid var(--border);
  font-size: 12.5px; font-weight: 500; color: var(--text-muted);
  white-space: nowrap;
}
.spec-chip .mdi { font-size: 14px; color: var(--primary); }

/* ── Section base ────────────────────────────────────── */
.lp-section { padding: 80px 0; }
.lp-section-tinted { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }

.section-head { text-align: center; margin-bottom: 56px; }
.section-label {
  display: inline-block; margin-bottom: 12px;
  font-size: 12px; font-weight: 700; color: var(--primary);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.section-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800; letter-spacing: -0.03em;
  color: var(--text); margin: 0;
}
.section-title-left { text-align: left; }

/* ── How it works ────────────────────────────────────── */
.steps-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
}
.step-card {
  padding: 32px 28px; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--r-xl);
  box-shadow: var(--el-1); position: relative;
  transition: box-shadow var(--t-base), transform var(--t-base);
}
.step-card:hover { box-shadow: var(--el-3); transform: translateY(-2px); }
.step-num {
  font-size: 12px; font-weight: 800; color: var(--primary);
  letter-spacing: 0.05em; margin-bottom: 16px; opacity: 0.6;
}
.step-icon {
  width: 52px; height: 52px; border-radius: var(--r-lg);
  background: var(--primary-soft); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; margin-bottom: 18px;
}
.step-title { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
.step-desc  { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }

/* ── Features ────────────────────────────────────────── */
.features-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
}
.feature-card {
  padding: 28px 24px; background: var(--bg);
  border: 1px solid var(--border); border-radius: var(--r-xl);
  transition: box-shadow var(--t-base), transform var(--t-base);
}
.feature-card:hover { box-shadow: var(--el-2); transform: translateY(-1px); }
.feature-icon {
  width: 48px; height: 48px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; margin-bottom: 16px;
}
.fi-primary { background: var(--primary-soft); color: var(--primary); }
.fi-success { background: var(--success-soft); color: var(--success); }
.fi-accent  { background: var(--accent-soft);  color: var(--accent-hover); }
.fi-info    { background: var(--info-soft);    color: var(--info); }
.fi-teal    { background: #E0F2F1; color: #00695C; }
.fi-rose    { background: #FCE4EC; color: #C2185B; }
.feature-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
.feature-desc  { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

/* ── For professionals ───────────────────────────────── */
.lp-pros-inner {
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
}
.pros-desc {
  font-size: 14.5px; color: var(--text-muted); line-height: 1.7; margin: 16px 0 24px;
}
.pros-list { list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 10px; }
.pros-list-item { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; }
.pros-check { font-size: 18px; color: var(--success); }

/* Preview card */
.pros-card-wrap { display: flex; justify-content: center; }
.pros-preview-card {
  width: 320px; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--r-xl);
  box-shadow: var(--el-4); padding: 24px; overflow: hidden;
}
.ppc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.ppc-avatar {
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 20px; flex-shrink: 0;
}
.ppc-name { font-weight: 700; font-size: 15px; }
.ppc-spec { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.ppc-rating { margin-left: auto; font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 3px; }

.ppc-services { display: flex; flex-direction: column; gap: 2px; margin-bottom: 20px; }
.ppc-service {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 12px; border-radius: var(--r-md);
  font-size: 13.5px; font-weight: 500;
  background: var(--surface-2); border: 1px solid var(--border);
}
.ppc-service-meta { font-size: 12px; color: var(--text-muted); }

.ppc-book-btn {
  width: 100%; height: 44px;
  background: var(--primary); color: #fff;
  border: none; border-radius: var(--r-md);
  font-size: 14px; font-weight: 600; cursor: pointer; font-family: var(--font-sans);
  transition: background var(--t-fast), box-shadow var(--t-fast);
}
.ppc-book-btn:hover { background: var(--primary-hover); box-shadow: 0 4px 14px var(--primary-glow); }

/* ── CTA Banner ──────────────────────────────────────── */
.lp-cta-banner {
  background: var(--primary); position: relative; overflow: hidden;
  padding: 80px 0;
}
.lp-cta-inner {
  position: relative; z-index: 1; text-align: center;
}
.cta-blob {
  position: absolute; border-radius: 50%; pointer-events: none;
}
.cta-blob-1 {
  width: 500px; height: 500px; top: -200px; right: -100px;
  background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
}
.cta-blob-2 {
  width: 300px; height: 300px; bottom: -100px; left: 50px;
  background: radial-gradient(circle, rgba(229,168,35,.18) 0%, transparent 70%);
}
.cta-title {
  font-size: clamp(28px, 4vw, 44px); font-weight: 800;
  letter-spacing: -0.03em; color: #fff; margin: 0 0 14px;
}
.cta-sub { font-size: 16px; color: rgba(255,255,255,0.7); margin: 0 0 36px; }
.cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

.cta-btn-white {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 0 28px; height: 52px; border-radius: var(--r-lg);
  background: #fff; color: var(--primary);
  font-size: 15px; font-weight: 700; text-decoration: none;
  transition: all var(--t-fast);
}
.cta-btn-white:hover { background: var(--primary-50); box-shadow: 0 4px 20px rgba(0,0,0,.15); transform: translateY(-1px); }

.cta-btn-outline {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 0 28px; height: 52px; border-radius: var(--r-lg);
  background: transparent; color: rgba(255,255,255,0.85);
  border: 1.5px solid rgba(255,255,255,0.3);
  font-size: 15px; font-weight: 600; text-decoration: none;
  transition: all var(--t-fast);
}
.cta-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); }

/* ── Footer ──────────────────────────────────────────── */
.lp-footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 28px 0;
}
.lp-footer-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
}
.footer-brand { display: flex; align-items: center; gap: 12px; }
.footer-tagline { font-size: 12.5px; color: var(--text-subtle); }
.footer-links { display: flex; gap: 20px; }
.footer-link { font-size: 13px; color: var(--text-muted); text-decoration: none; font-weight: 500; }
.footer-link:hover { color: var(--primary); }
.footer-copy { font-size: 12px; color: var(--text-subtle); }

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 900px) {
  .steps-grid   { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: 1fr 1fr; }
  .lp-pros-inner { grid-template-columns: 1fr; gap: 40px; }
  .pros-card-wrap { display: none; }
}
@media (max-width: 600px) {
  .lp-nav-links  { display: none; }
  .features-grid { grid-template-columns: 1fr; }
  .lp-container  { padding: 0 20px; }
  .hero-cta      { flex-direction: column; }
  .lp-btn-primary.lp-btn-lg, .lp-btn-outline { width: 100%; justify-content: center; }
}
</style>
