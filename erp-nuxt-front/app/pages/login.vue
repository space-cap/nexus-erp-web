<script setup lang="ts">
import { LogIn } from '@lucide/vue'

const { currentUser, users, login, allowedModules } = useMockAuth()
const { showToast } = useToast()
const selectedUser = ref(currentUser.value.id)

function submitLogin() {
  if (login(selectedUser.value)) {
    showToast('mock 계정을 전환했습니다.')
  }
}
</script>

<template>
  <section class="page-hero">
    <div>
      <p class="eyebrow">Mock Auth</p>
      <h1>로그인/권한 선택</h1>
    </div>
  </section>

  <section class="auth-layout">
    <form class="form-panel" @submit.prevent="submitLogin">
      <label class="field">
        <span>사용자 선택</span>
        <select v-model="selectedUser">
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }} / {{ user.role }}
          </option>
        </select>
      </label>
      <button class="primary-button" type="submit">
        <LogIn />
        <span>mock 로그인</span>
      </button>
    </form>

    <aside class="panel">
      <h2>현재 세션</h2>
      <div class="detail-grid">
        <div class="detail-row">
          <span class="detail-label">이름</span>
          <span class="detail-value">{{ currentUser.name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">부서</span>
          <span class="detail-value">{{ currentUser.dept }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">역할</span>
          <span class="detail-value">{{ currentUser.role }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">권한</span>
          <span class="detail-value">{{ currentUser.auth }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">표시 메뉴</span>
          <span class="detail-value">{{ allowedModules.join(', ') }}</span>
        </div>
      </div>
    </aside>
  </section>
</template>
