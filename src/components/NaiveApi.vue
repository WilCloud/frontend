<template></template>

<script lang="ts" setup>
import {
  useDialog,
  useLoadingBar,
  useMessage,
  useModal,
  useNotification,
} from 'naive-ui';
import naiveui from '../plugins/naiveui';

naiveui.dialog = useDialog();
naiveui.loadingBar = useLoadingBar();
naiveui.message = useMessage();
naiveui.modal = useModal();
naiveui.notification = useNotification();
</script>
