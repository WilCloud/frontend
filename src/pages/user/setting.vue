<script setup lang="ts">
import { Axios } from '../../plugins/axios';
import { FormRules } from 'naive-ui';
import rules from '../../consts/rules';
import { ref } from 'vue';
import { useStore } from '../../stores';
import router from '../../router';
import { t } from '../../i18n';
import naiveui from '../../plugins/naiveui';

const store = useStore();

const loading = ref(false);

const user = ref<User>({
    id: 0,
    username: '',
    email: '',
    avatar: null,
    is_superuser: false,
    preference: {},
    totp: null,
  }),
  updateUser = () => {
    Axios.put('/user/info/', user.value).then(res => {
      store.user = res.data;
    });
  };

Axios.get('/user/info/').then(res => {
  user.value = res.data;
});

const passwordForm = ref(),
  passwordModel = ref({
    original_password: '',
    new_password: '',
    confirm_password: '',
  }),
  passwordLoading = ref(false),
  passwordRules: FormRules = {
    original_password: rules.password(),
    new_password: rules.password(),
    confirm_password: rules.password(),
  },
  updatePassword = () => {
    passwordForm.value.validate().then(() => {
      if (
        passwordModel.value.new_password !==
        passwordModel.value.confirm_password
      ) {
        naiveui.message.error(t('propmt.password_not_match'));
        return;
      }
      passwordLoading.value = true;
      Axios.post('/user/password/', passwordModel.value)
        .then(() => {
          window.location.reload();
        })
        .finally(() => {
          passwordLoading.value = false;
        });
    });
  };
</script>

<template>
  <n-h2>{{ t('user.setting') }}</n-h2>

  <n-h3>{{ t('user.profile') }}</n-h3>
  <n-form label-placement="left" label-width="auto" style="max-width: 600px">
    <n-form-item :label="t('user.id')">
      <span>{{ user.id }}</span>
    </n-form-item>
    <n-form-item :label="t('user.username')">
      <span>{{ user.username }}</span>
    </n-form-item>
    <n-form-item :label="t('user.email')">
      <n-input v-model:value="user.email" />
    </n-form-item>
    <n-form-item :label="t('user.avatar')">
      <n-input v-model:value="user.avatar" />
    </n-form-item>
    <n-form-item label=" " v-show="user.avatar">
      <n-image width="100" :src="user.avatar" />
    </n-form-item>
    <n-form-item :label="t('user.date_joined')">
      <n-time :time="user.date_joined ? new Date(user.date_joined) : 0" />
    </n-form-item>
    <n-button type="primary" @click="updateUser">
      {{ t('operation.update') }}
    </n-button>
  </n-form>

  <n-h3>{{ t('user.security') }}</n-h3>
  <n-form
    label-placement="left"
    label-width="auto"
    style="max-width: 600px"
    ref="passwordForm"
    :rules="passwordRules"
    :model="passwordModel"
  >
    <n-form-item :label="t('user.original_password')" path="original_password">
      <n-input
        v-model:value="passwordModel.original_password"
        type="password"
      />
    </n-form-item>
    <n-form-item :label="t('user.new_password')" path="new_password">
      <n-input v-model:value="passwordModel.new_password" type="password" />
    </n-form-item>
    <n-form-item :label="t('user.confirm_password')" path="confirm_password">
      <n-input v-model:value="passwordModel.confirm_password" type="password" />
    </n-form-item>
    <n-button type="warning" @click="updatePassword">
      {{ t('user.update_password') }}
    </n-button>
  </n-form>
</template>

<style lang="scss" scoped>
// :deep(.n-form-item-feedback-wrapper) {
//   min-height: 10px;
// }
</style>
