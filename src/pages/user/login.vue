<script setup lang="ts">
import { Axios } from '../../plugins/axios';
import { FormRules } from 'naive-ui';
import rules from '../../consts/rules';
import { ref } from 'vue';
import { useStore } from '../../stores';
import router from '../../router';
import { t } from '../../i18n';

const store = useStore();

const loading = ref(false);

const next = (res: any) => {
  console.log(res);
  store.user = res.data;
  if (router.currentRoute.value.query.next) {
    router.push(router.currentRoute.value.query.next as string);
  }
  router.push('/');
};

const loginForm = ref(),
  loginModel = ref({
    username: '',
    password: '',
  }),
  loginRules: FormRules = {
    username: rules.username(),
    password: rules.password(),
  },
  login = async () => {
    loginForm.value.validate().then(() => {
      loading.value = true;
      Axios.post('/user/login/', loginModel.value)
        .then(next)
        .finally(() => {
          loading.value = false;
        });
    });
  };
const registerForm = ref(),
  registerModel = ref({
    email: '',
    username: '',
    password: '',
  }),
  registerRules: FormRules = {
    email: rules.email(),
    username: rules.username(),
    password: rules.password(),
  },
  register = async () => {
    registerForm.value.validate().then(() => {
      loading.value = true;
      Axios.post('/user/register/', registerModel.value)
        .then(next)
        .finally(() => {
          loading.value = false;
        });
    });
  };
</script>

<template>
  <div style="display: flex; justify-content: center">
    <n-card style="max-width: 35rem; margin: 10vh 0">
      <n-tabs
        animated
        default-value="login"
        size="large"
        justify-content="space-evenly"
      >
        <n-tab-pane name="login" :tab="t('user.login')">
          <n-form
            style="padding: 1rem; margin-top: 0.5rem"
            ref="loginForm"
            :rules="loginRules"
            :model="loginModel"
          >
            <n-form-item-row :label="t('user.username')" path="username">
              <n-input v-model:value="loginModel.username" />
            </n-form-item-row>
            <n-form-item-row :label="t('user.password')" path="password">
              <n-input
                type="password"
                show-password-on="mousedown"
                v-model:value="loginModel.password"
              />
            </n-form-item-row>
            <n-form-item-row>
              <n-button type="primary" block secondary strong @click="login">
                {{ t('user.login') }}
              </n-button>
            </n-form-item-row>
          </n-form>
        </n-tab-pane>

        <n-tab-pane name="register" :tab="t('user.register')">
          <n-form
            style="padding: 1rem; margin-top: 0.5rem"
            ref="registerForm"
            :rules="registerRules"
            :model="registerModel"
          >
            <n-form-item-row :label="t('user.email')" path="email">
              <n-input v-model:value="registerModel.email" />
            </n-form-item-row>
            <n-form-item-row :label="t('user.username')" path="username">
              <n-input v-model:value="registerModel.username" />
            </n-form-item-row>
            <n-form-item-row :label="t('user.password')" path="password">
              <n-input
                type="password"
                show-password-on="mousedown"
                v-model:value="registerModel.password"
              />
            </n-form-item-row>
            <n-form-item-row>
              <n-button type="primary" block secondary strong @click="register">
                {{ t('user.register') }}
              </n-button>
            </n-form-item-row>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
