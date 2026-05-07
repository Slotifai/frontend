<template>
  <Teleport to="body">
    <button
      :style="{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 9000,
        width: '52px', height: '52px', borderRadius: '50%',
        background: 'var(--primary)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--el-3)', transition: 'transform 0.15s ease',
      }"
      @click="open = !open"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      :class="{ 'chat-fab-hover': hovered }"
    >
      <AppIcon v-if="!open" name="sparkle" :size="22" color="#fff" />
      <AppIcon v-else name="close" :size="20" color="#fff" />
    </button>

    <Transition name="chat-panel">
      <div
        v-if="open"
        style="
          position: fixed; bottom: 88px; right: 24px; z-index: 9000;
          width: 340px; height: 500px; border-radius: var(--r-lg);
          background: var(--surface); box-shadow: var(--el-3);
          border: 1px solid var(--border);
          display: flex; flex-direction: column; overflow: hidden;
        "
      >
        <div style="padding: 14px 16px; background: var(--primary); display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <AppIcon name="sparkle" :size="16" color="#fff" />
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #fff; font-size: 14px;">{{ t('aiChat.title') }}</div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.7);">{{ t('aiChat.subtitle') }}</div>
          </div>
          <button
            style="background: none; border: none; cursor: pointer; padding: 4px; color: rgba(255,255,255,0.7); display: flex; align-items: center;"
            @click="clearHistory"
            :title="t('aiChat.clearChat')"
          >
            <AppIcon name="trash" :size="14" color="rgba(255,255,255,0.7)" />
          </button>
        </div>

        <div ref="messagesEl" style="flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px;">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :style="{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }"
          >
            <div
              v-if="msg.role === 'assistant'"
              style="width: 22px; height: 22px; border-radius: 50%; background: var(--primary-soft); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 6px; margin-top: 2px;"
            >
              <AppIcon name="sparkle" :size="11" color="var(--primary)" />
            </div>

            <div style="max-width: 78%;">
              <div
                :style="{
                  padding: '8px 12px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--surface-2)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text)',
                  fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap',
                }"
              >{{ msg.text }}</div>

            </div>
          </div>

          <div v-if="loading" style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background: var(--primary-soft); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <AppIcon name="sparkle" :size="11" color="var(--primary)" />
            </div>
            <div style="display: flex; gap: 4px; padding: 8px 12px; background: var(--surface-2); border-radius: 16px 16px 16px 4px;">
              <span v-for="i in 3" :key="i" :style="{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block', animation: `bounce 1s ${(i-1)*0.2}s infinite` }" />
            </div>
          </div>

          <div v-if="rateLimitMsg" style="padding: 6px 10px; background: #FFF8E6; border-radius: 8px; font-size: 12px; color: var(--warning); text-align: center;">
            {{ rateLimitMsg }}
          </div>

          <div v-if="messages.length === 1 && !loading" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
            <button
              v-for="q in quickReplies"
              :key="q"
              style="padding: 5px 10px; border-radius: var(--r-pill); border: 1px solid var(--border-strong); background: var(--surface); font-size: 12px; color: var(--text); cursor: pointer; font-family: var(--font-sans); transition: all 0.12s;"
              @mouseenter="($event.target as HTMLElement).style.borderColor = 'var(--primary)'"
              @mouseleave="($event.target as HTMLElement).style.borderColor = 'var(--border-strong)'"
              @click="sendQuick(q)"
            >{{ q }}</button>
          </div>
        </div>

        <div style="padding: 10px 12px; border-top: 1px solid var(--border); display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0;">
          <textarea
            v-model="input"
            ref="inputEl"
            rows="1"
            :placeholder="t('aiChat.inputPlaceholder')"
            style="flex: 1; resize: none; border: 1px solid var(--border-strong); border-radius: var(--r-sm); padding: 8px 10px; font: inherit; font-size: 13px; outline: none; max-height: 80px; overflow-y: auto; line-height: 1.4;"
            @keydown.enter.exact.prevent="sendMessage"
            @input="autoResize"
          />
          <button
            :disabled="!canSend"
            :style="{
              width: '34px', height: '34px', borderRadius: '50%', border: 'none',
              background: canSend ? 'var(--primary)' : 'var(--border)',
              cursor: canSend ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.15s',
            }"
            @click="sendMessage"
          >
            <AppIcon name="arrow-right" :size="16" :color="canSend ? '#fff' : 'var(--text-muted)'" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'
import { aiApi } from '@/api/ai'

const { t, tm, locale } = useI18n()

interface Message { id: string; role: 'user' | 'assistant'; text: string }

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

const quickReplies = computed(() => tm('aiChat.suggestions') as string[])
const initialMsg = computed(() => t('aiChat.greeting'))

const open = ref(false)
const hovered = ref(false)
const input = ref('')
const loading = ref(false)
const messagesEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)

const requestTimestamps = ref<number[]>([])
const rateLimitMsg = computed(() => {
  const now = Date.now()
  const recent = requestTimestamps.value.filter(ts => now - ts < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) {
    const oldest = Math.min(...recent)
    const resetIn = Math.ceil((oldest + RATE_WINDOW_MS - now) / 1000)
    return t('aiChat.rateLimit', { seconds: resetIn })
  }
  return null
})
const canSend = computed(() => !!input.value.trim() && !loading.value && !rateLimitMsg.value)

const messages = ref<Message[]>([
  { id: '0', role: 'assistant', text: initialMsg.value },
])

watch(locale, () => {
  if (messages.value.length === 1 && messages.value[0].id === '0') {
    messages.value[0].text = initialMsg.value
  }
})

function clearHistory() {
  messages.value = [{ id: '0', role: 'assistant', text: initialMsg.value }]
}

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 80) + 'px'
}

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

function sendQuick(text: string) {
  input.value = text
  sendMessage()
}

async function sendMessage() {
  const text = input.value.trim()
  if (!canSend.value) return

  messages.value.push({ id: Date.now().toString(), role: 'user', text })
  input.value = ''
  if (inputEl.value) inputEl.value.style.height = 'auto'
  loading.value = true
  requestTimestamps.value = [
    ...requestTimestamps.value.filter(t => Date.now() - t < RATE_WINDOW_MS),
    Date.now(),
  ]
  await scrollToBottom()

  const isRecommend = /find|recommend|suggest|best|good|near/i.test(text)

  try {
    const res = isRecommend
      ? await aiApi.recommend(text)
      : await aiApi.chat(text)
    messages.value.push({ id: Date.now() + '_a', role: 'assistant', text: res.reply })
  } catch {
    messages.value.push({
      id: Date.now() + '_e',
      role: 'assistant',
      text: 'Sorry, I couldn\'t process that. Please try again.',
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}
</script>

<style>
.chat-fab-hover { transform: scale(1.08) !important; }

.chat-panel-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.chat-panel-leave-active { transition: all 0.2s ease; }
.chat-panel-enter-from { opacity: 0; transform: translateY(20px) scale(0.95); }
.chat-panel-leave-to { opacity: 0; transform: translateY(10px) scale(0.97); }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
</style>
