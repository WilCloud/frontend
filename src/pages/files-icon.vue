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
  if (_value.length === 0) return [] as string[];
  return _value.split('/');
});

const folder = ref({ id: 0 }),
  children = ref([]);

const listFile = () => {
  Axios.get(`/folder/?path=/${path.value.join('/')}`).then(res => {
    if (res.data) folder.value = res.data;
  });
  Axios.get('/folder/list/', {
    params: { path: `/${path.value.join('/')}` },
  }).then(res => {
    if (res.data) {
      children.value = res.data.results;
    }
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
    render: (row: any) => {
      return row.type === 'file'
        ? row.name
        : h(
            NButton,
            {
              text: true,
              onClick: () => {
                let _path = path.value.join('/');
                if (_path) _path += '/';
                router.push(`/root/${_path}${row.name}`);
              },
            },
            () => `${row.name}/`
          );
    },
  },
  {
    title: 'Size',
    key: 'size',
    render: (row: any) => {
      return row.type === 'file' ? formatSize(row.size) : '-';
    },
  },
  {
    title: '修改日期',
    key: 'update_time',
    render: (row: any) => {
      return h(NTime, { timestamp: toTimestamp(row.update_time) });
    },
  },
  {
    title: 'Info',
    key: 'action',
    render: (row: any) => {
      return h(
        NButton,
        {
          text: true,
          onClick: () => {
            Axios.get(`/file/${row.id}/`).then(res => {
              console.log(res.data);
            });
          },
        },
        () => '123'
      );
    },
  },
];

// Upload

const showUpload = ref(false);

const uploadRef = ref();
const uploadMap = ref({});
const handleFileUpload = (options: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  console.log(options);

  const file = options.file;
  const fileObj = file.file as File;
  // Local Storage
  Axios.post('/upload/init/', {
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
  Axios.post(uploadUrl, formData, {
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
        Axios.post('/folder/', {
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

  <n-grid x-gap="12" :cols="4">
    <n-gi v-for="(item, index) in children" :key="index">
      <n-card draggable="true" class="file-card" tabindex="-1">
        <template #cover>
          <img
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            draggable="false"
          />
        </template>
        {{ item.name }}
      </n-card>
    </n-gi>
  </n-grid>

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
        @change="handleFileUpload"
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

<style lang="scss" scoped>
.file-card {
  cursor: pointer;
}

.file-card:focus {
  background-color: blue;
}

.file-card:active {
  background-color: red;
}
</style>
