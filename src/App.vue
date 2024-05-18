<script lang="ts" setup>
import { zhCN, enUS, dateZhCN, dateEnUS, darkTheme } from 'naive-ui';
import { isMobile } from './consts';
import Header from './Header.vue';
import Layout from './Layout.vue';
import NaiveApi from './components/NaiveApi.vue';
import { useStore } from './stores';
import Axios from './plugins/axios';
import i18n from './i18n';

Axios.get('/user/info/').then(res => {
  store.user = res.data;
});

const store = useStore();
i18n.global.locale.value = store.locale;
</script>

<template>
  <n-config-provider
    :locale="store.locale === 'en' ? enUS : zhCN"
    :date-locale="store.locale === 'en' ? dateEnUS : dateZhCN"
    :theme="store.theme === 'dark' ? darkTheme : null"
  >
    <n-global-style />
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-message-provider>
          <n-modal-provider>
            <n-notification-provider>
              <NaiveApi />
              <n-layout
                :position="isMobile ? 'static' : 'absolute'"
                class="root-layout"
              >
                <Header />
                <Layout />
              </n-layout>
            </n-notification-provider>
          </n-modal-provider>
        </n-message-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
