<script setup lang="ts">
import { ArrowLeft, Home, LockKeyhole } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const { currentUser } = useMockAuth()

const blockedPath = computed(() => String(route.query.from || ''))
const blockedModule = computed(() => String(route.query.module || ''))
const blockedAction = computed(() => String(route.query.action || ''))
const reason = computed(() => String(route.query.reason || ''))

const reasonText = computed(() => {
  if (reason.value === 'action') {
    return '현재 역할에는 이 등록/수정 작업 권한이 없습니다.'
  }

  return '현재 역할에는 이 메뉴에 접근할 권한이 없습니다.'
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/dashboard')
}
</script>

<template>
  <section class="forbidden-view">
    <div class="forbidden-icon">
      <LockKeyhole />
    </div>
    <p class="eyebrow">권한 제한</p>
    <h1>접근할 수 없는 화면입니다.</h1>
    <p class="forbidden-copy">{{ reasonText }}</p>

    <dl class="forbidden-meta">
      <div>
        <dt>현재 사용자</dt>
        <dd>{{ currentUser.name }} / {{ currentUser.role }}</dd>
      </div>
      <div v-if="blockedPath">
        <dt>요청 경로</dt>
        <dd>{{ blockedPath }}</dd>
      </div>
      <div v-if="blockedModule">
        <dt>메뉴 권한</dt>
        <dd>{{ blockedModule }}</dd>
      </div>
      <div v-if="blockedAction">
        <dt>작업 권한</dt>
        <dd>{{ blockedAction }}</dd>
      </div>
    </dl>

    <div class="forbidden-actions">
      <button class="secondary-button" type="button" @click="goBack">
        <ArrowLeft />
        <span>이전 화면</span>
      </button>
      <NuxtLink class="primary-button" to="/dashboard">
        <Home />
        <span>대시보드</span>
      </NuxtLink>
    </div>
  </section>
</template>
