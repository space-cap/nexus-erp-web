<script setup lang="ts">
import { Bell, ChevronDown, LogOut, Menu, Search } from '@lucide/vue'

const emit = defineEmits<{
  toggleMenu: []
}>()

const globalSearch = useGlobalSearch()
const { currentUser, logout } = useMockAuth()
const { showToast } = useToast()

function logoutMock() {
  logout()
  showToast('mock 세션을 관리자 계정으로 초기화했습니다.')
}
</script>

<template>
  <header class="topbar">
    <button class="icon-button menu-toggle" type="button" aria-label="메뉴 열기" @click="emit('toggleMenu')">
      <Menu />
    </button>
    <label class="global-search" for="globalSearch">
      <Search />
      <input id="globalSearch" v-model="globalSearch" type="search" placeholder="거래처, 품목, 문서번호 검색">
    </label>
    <div class="topbar-actions">
      <button class="icon-button" type="button" aria-label="알림">
        <Bell />
        <span class="notification-dot"></span>
      </button>
      <NuxtLink class="user-button" to="/login">
        <span class="avatar">{{ currentUser.name.slice(0, 1) }}</span>
        <span>{{ currentUser.name }}</span>
        <ChevronDown />
      </NuxtLink>
      <button class="icon-button" type="button" aria-label="mock 로그아웃" @click="logoutMock">
        <LogOut />
      </button>
    </div>
  </header>
</template>
