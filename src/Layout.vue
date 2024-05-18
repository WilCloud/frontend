<template>
  <n-layout
    :has-sider="showSider"
    :position="isMobile ? 'static' : 'absolute'"
    :style="{
      top: isMobile ? '' : 'var(--header-height)',
    }"
  >
    <n-layout-sider
      v-if="showSider"
      :native-scrollbar="false"
      :collapsed-width="0"
      collapse-mode="transform"
      trigger-style="top: 240px;"
      collapsed-trigger-style="top: 240px; right: -20px;"
      bordered
      show-trigger="arrow-circle"
    >
      <n-menu
        :options="store.loggedIn ? menu : menuLoggedOut"
        @update:value="handleMenuChange"
        :value="null"
      />
    </n-layout-sider>
    <n-layout
      ref="layoutInstRef"
      :scrollbar-props="{
        containerClass: 'document-scroll-container',
      }"
      :native-scrollbar="false"
      :position="isMobile || showSider ? 'static' : 'absolute'"
      content-style="min-height: calc(100vh - var(--header-height)); display: flex; flex-direction: column;"
    >
      <n-layout style="margin: 2vh 2vw"> <RouterView /> </n-layout>
      <Footer />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { isMobile } from './consts';
import { menu, menuLoggedOut } from './consts/menu';
import { useStore } from './stores';
import handleMenuChange from './utils/handleMenuChange';
import Footer from './Footer.vue';

const route = useRoute(),
  store = useStore();

const showSider = ref(false);
const loadSider = () => {
  showSider.value = !(route.meta.showSider === false || isMobile.value);
  return;
};
loadSider();
watch(() => route.name, loadSider);
</script>
