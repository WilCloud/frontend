<script setup lang="ts">
import { h, computed, ref, watch } from 'vue';
import { NButton, NTime, NInput } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { formatSize, toTimestamp } from '../utils/format';
import router from '../router';
import naiveui from '../plugins/naiveui';
import { isMobile } from '../consts';
import { _ } from '../i18n';
import { ArchiveOutline } from '@vicons/ionicons5';
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import Axios from '../plugins/axios';

const path = computed(() => {
  let _value: string = (router.currentRoute.value.params.path as string) || '/';
  if (!_value) _value = '/';
  while (_value.indexOf('//') !== -1) _value = _value.replace('//', '/');
  while (_value.substr(-1) === '/')
    _value = _value.substr(0, _value.length - 1);
  while (_value.substr(0, 1) === '/') _value = _value.substr(1);
  return _value.split('/');
});

const folder = ref({ id: 0, files: [] });

const listFile = () => {
  Axios.get(`/file/folder/list/?path=/${path.value.join('/')}`).then(res => {
    if (res.data) folder.value = res.data;
  });
};

listFile();
watch(() => path.value, listFile);

const columns: DataTableColumns = [
  {
    type: 'selection',
  },
  // {
  //   title: 'ID',
  //   key: 'id',
  // },
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Size',
    key: 'size',
    render: (row: any) => {
      return formatSize(row.size);
    },
  },
  {
    title: '修改日期',
    key: 'update_time',
    render: (row: any) => {
      return h(NTime, { timestamp: toTimestamp(row.update_time) });
    },
  },
];

// Upload

const showUpload = ref(false);

const uploadRef = ref();
const uploadMap = ref({});
const handleFileChange = (options: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  console.log(options);

  const file = options.file;
  const fileObj = file.file as File;
  // Local Storage
  Axios.post('/file/upload/init/', {
    name: fileObj.name,
    size: fileObj.size,
    storage_id: 1,
    parent_id: folder.value.id,
  }).then(res => {
    console.log(res);
    uploadMap.value[file.id] = res.data.upload_url;
    uploadRef.value.submit(file.id);
  });
};
const doUpload = (options: UploadCustomRequestOptions) => {
  console.log(options);
  const file = options.file;
  const uploadUrl = uploadMap.value[file.id] as string,
    fileObj = file.file as File;

  const formData = new FormData();
  formData.append('file', fileObj);
  Axios.put(uploadUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => {
    console.log(res);
  });
};

const toPath = (index: number) => {
  let _path = '';
  for (let i = 0; i < index; i++) {
    _path += path.value[i] + '/';
  }
  router.push(`/root/${_path}`);
};

const createFolderName = ref(''),
  createFolder = () => {
    const m = naiveui.modal.create({
      title: '创建文件夹',
      preset: 'dialog',
      content: () =>
        h(NInput, {
          placeholder: '请输入文件夹名称',
          value: createFolderName.value,
          onUpdateValue: (value: string) => {
            createFolderName.value = value;
          },
        }),
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        Axios.post('/file/folder/', {
          name: createFolderName.value,
          parent_id: folder.value.id,
        }).then(res => {
          m.destroy();
        });
      },
      onNegativeClick: () => {
        m.destroy();
      },
    });
  };
</script>

<template>
  <n-breadcrumb style="margin: 1.5em 0">
    <n-breadcrumb-item @click="toPath(0)">
      {{ _('file.path.root') }}
    </n-breadcrumb-item>
    <n-breadcrumb-item
      v-for="(item, index) in path"
      :key="index"
      @click="toPath(index + 1)"
    >
      {{ item }}
    </n-breadcrumb-item>
  </n-breadcrumb>

  <n-button type="primary" @click="showUpload = true">
    {{ _('file.upload') }}
  </n-button>
  <n-button type="primary" @click="createFolder">
    {{ _('file.create_folder') }}
  </n-button>

  <n-data-table
    :columns="columns"
    :data="folder.files"
    :pagination="false"
    :bordered="false"
  />

  <n-drawer
    v-model:show="showUpload"
    width="35vw"
    :placement="isMobile ? 'bottom' : 'right'"
  >
    <n-drawer-content title="上传文件">
      <n-upload
        directory-dnd
        :default-upload="false"
        multiple
        ref="uploadRef"
        @change="handleFileChange"
        :custom-request="doUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <ArchiveOutline />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">
            点击或者拖动文件到该区域来上传
          </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0"> 上传文件不超过 </n-p>
        </n-upload-dragger>
      </n-upload>
    </n-drawer-content>
  </n-drawer>
</template>