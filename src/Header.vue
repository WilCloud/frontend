<template>
  <n-layout-header
    bordered
    class="nav"
    :style="{
      '--side-padding': isMobile ? '16px' : '32px',
      'grid-template-columns': isMobile
        ? 'auto 1fr auto'
        : 'calc(272px - var(--side-padding)) 1fr auto',
    }"
  >
    <n-text tag="div" class="ui-logo" :depth="1" @click="router.push('/')">
      <img src="/logo.png" />
      <span> {{ _('site.name') }} </span>
    </n-text>
    <div
      :style="
        !isMobile ? 'display: flex; align-items: center; overflow: hidden;' : ''
      "
    >
      <div v-if="!isMobile" class="nav-menu">
        <n-menu
          ref="menuInstRef"
          responsive
          mode="horizontal"
          :options="headerMenuOptions"
          @update:value="handleMenuUpdate"
        />
      </div>
    </div>
    <n-popover
      v-if="isMobile"
      ref="mobilePopoverRef"
      style="padding: 0; width: 288px"
      placement="bottom-end"
      display-directive="show"
      trigger="click"
    >
      <template #trigger>
        <n-icon size="20" style="margin-left: 12px">
          <menu-outline />
        </n-icon>
      </template>
      <div style="overflow: auto; max-height: 79vh">
        <n-menu
          :options="mobileMenuOptions"
          :indent="18"
          @update:value="handleMenuUpdate"
        />
      </div>
    </n-popover>
    <div v-else class="nav-end">
      <n-popselect
        v-model:value="store.locale"
        :options="languageOptions"
        trigger="click"
        @update:value="store.setLocale"
      >
        <n-button size="small" quaternary class="nav-picker">
          {{ _('locale.lang') }}
        </n-button>
      </n-popselect>

      <n-button
        size="small"
        quaternary
        class="nav-picker"
        @click="store.switchTheme"
      >
        {{ store.theme === 'light' ? _('theme.dark') : _('theme.light') }}
      </n-button>
    </div>
  </n-layout-header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { MenuOutline } from '@vicons/ionicons5';
import { isMobile } from './consts';
import { useStore } from './stores';
import router from './router';
import { languageOptions } from './consts/options';
import handleMenuChange from './utils/handleMenuChange';
import { NPopselect, NButton } from 'naive-ui';
import { menu, menuLoggedOut } from './consts/menu';
import i18n from './i18n';

const _ = i18n.global.t;
const store = useStore();

const mobilePopoverRef = ref();

const headerMenuOptions = computed(() => [
  //   {
  //     label: _('home'),
  //     key: 'home',
  //   },
  //   {
  //     label: _('user.login'),
  //     key: 'user-login',
  //   },
]);

const mobileMenuOptions = ref([]);

if (menu.value) {
  mobileMenuOptions.value = mobileMenuOptions.value.concat(
    store.loggedIn ? menu.value : menuLoggedOut.value
  );
} else {
  mobileMenuOptions.value = headerMenuOptions.value;
}

mobileMenuOptions.value = mobileMenuOptions.value.concat([
  {
    type: 'divider',
  },
  {
    label: () => (store.theme === 'light' ? _('theme.dark') : _('theme.light')),
    key: 'changeTheme',
    action: 'changeTheme',
  },
  {
    label: _('locale.lang'),
    key: 'changeLanguage',
    children: languageOptions.map(item => {
      return {
        label: item.label,
        key: item.value,
        action: 'changeLanguage',
      };
    }),
  },
]);

const handleMenuUpdate = (key: string, item: any) => {
  if (mobilePopoverRef.value) {
    handleMenuChange(key, item, mobilePopoverRef.value);
  } else {
    handleMenuChange(key, item);
  }
};
</script>

<style scoped>
.nav {
  display: grid;
  grid-template-rows: calc(var(--header-height) - 1px);
  align-items: center;
  padding: 0 var(--side-padding);
}

.ui-logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.ui-logo > img {
  margin-right: 12px;
  height: 32px;
  width: 32px;
}

.nav-menu {
  overflow: hidden;
  flex-grow: 0;
  flex-shrink: 1;
}

.nav-picker {
  margin-right: 4px;
}

.nav-picker.padded {
  padding: 0 10px;
}

.nav-picker:last-child {
  margin-right: 0;
}

.nav-end {
  display: flex;
  align-items: center;
}
</style>

<style>
.nav-menu .n-menu-item,
.nav-menu .n-submenu,
.nav-menu .n-menu-item-content {
  height: calc(var(--header-height) - 1px) !important;
}
</style>
