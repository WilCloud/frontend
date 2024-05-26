<script setup lang="ts">
import { h, computed, ref, watch, nextTick } from 'vue';
import { NButton, NTime, NInput, NIcon } from 'naive-ui';
import type { DataTableColumns, DropdownOption } from 'naive-ui';
import { formatSize, toTimestamp } from '../utils/format';
import router from '../router';
import naiveui from '../plugins/naiveui';
import { isMobile } from '../consts';
import { t } from '../i18n';
import { CloudDownload, Edit, Delete, Upload } from '@vicons/carbon';
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
  children = ref<Child[]>([]);

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
      title: t('file.name'),
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
      title: t('file.size'),
      key: 'size',
      render: (row: any) => {
        return row.type === 'file' ? formatSize(row.size) : '-';
      },
    },
    {
      title: t('file.modified'),
      key: 'update_time',
      render: (row: any) => {
        return h(NTime, {
          time: toTimestamp(row.update_time ?? row.create_time),
        });
      },
    },
    // {
    //   title: 'Info',
    //   key: 'action',
    //   render: (row: any) => {
    //     return h(
    //       NButton,
    //       {
    //         text: true,
    //         onClick: () => {
    //           Axios.get(`/file/${row.id}/`).then(res => {
    //             console.log(res.data);
    //           });
    //         },
    //       },
    //       () => '123'
    //     );
    //   },
    // },
  ],
  rowKey = (item: Child) => `${item.type}-${item.id}`;

// Upload

const showUpload = ref(false);

const uploadRef = ref();
const uploadMap = ref<{ [key: string]: string }>({});
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
  },
  doUpload = (options: UploadCustomRequestOptions) => {
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
  createFolderLoading = ref(false),
  createFolder = () => {
    naiveui.dialog.create({
      title: t('file.create_folder'),
      loading: createFolderLoading.value,
      autoFocus: false,
      closable: false,
      content: () =>
        h(NInput, {
          value: createFolderName.value,
          onUpdateValue: (value: string) => {
            createFolderName.value = value;
          },
        }),
      positiveText: t('operation.confirm'),
      negativeText: t('operation.cancel'),
      onPositiveClick: () => {
        createFolderLoading.value = true;
        Axios.post('/folder/', {
          name: createFolderName.value,
          parent_id: folder.value.id,
        }).then(_res => {
          createFolderLoading.value = false;
        });
      },
    });
  };

const showFileDropdown = ref(false),
  fileDropdownOptions: DropdownOption[] = [
    {
      label: t('operation.download'),
      icon: () => h(NIcon, { component: CloudDownload }),
      key: 'download',
    },
    {
      label: t('operation.rename'),
      icon: () => h(NIcon, { component: Edit }),
      key: 'rename',
    },
    {
      label: () =>
        h('span', { style: { color: 'red' } }, t('operation.delete')),
      icon: () => h(NIcon, { component: Delete, color: 'red' }),
      key: 'delete',
    },
  ],
  folderDropdownOptions: DropdownOption[] = [
    {
      label: t('operation.rename'),
      icon: () => h(NIcon, { component: Edit }),
      key: 'rename',
    },
    {
      label: () =>
        h('span', { style: { color: 'red' } }, t('operation.delete')),
      icon: () => h(NIcon, { component: Delete, color: 'red' }),
      key: 'delete',
    },
  ],
  dropdownX = ref(0),
  dropdownY = ref(0),
  rightClickedObj = ref<Child | null>(null),
  fileRowProps = (row: any) => {
    return {
      onContextmenu(e: MouseEvent) {
        rightClickedObj.value = row;
        e.preventDefault();
        nextTick().then(() => {
          showFileDropdown.value = true;
          dropdownX.value = e.clientX;
          dropdownY.value = e.clientY;
        });
      },
    };
  },
  handleDropdownSelect = (key: string) => {
    showFileDropdown.value = false;
    const obj = rightClickedObj.value;
    if (obj === null) return;
    switch (key) {
      case 'download':
        Axios.get(`/file/${obj.id}/download/`).then(res => {
          const url = res.data;
          window.open(`/api${url}`);
        });
        break;
      case 'delete':
        const deleteLoading = ref(false);
        naiveui.dialog.warning({
          title: t(`operation.delete_${obj.type}`),
          loading: deleteLoading.value,
          content: t('confirmation.delete_confirm', [obj.name]),
          positiveText: t('operation.confirm'),
          negativeText: t('operation.cancel'),
          autoFocus: false,
          closable: false,
          onPositiveClick: () => {
            deleteLoading.value = true;
            Axios.delete(`/${obj.type}/${obj.id}/`).then(_res => {
              deleteLoading.value = false;
              naiveui.message.success(
                t('success.success', [t('operation.delete')])
              );
              listFile();
            });
          },
        });
        break;
      case 'rename':
        const renameNewName = ref(obj.name),
          renameLoading = ref(false);
        naiveui.dialog.create({
          title: t('operation.rename'),
          loading: renameLoading.value,
          autoFocus: false,
          closable: false,
          content: () =>
            h(NInput, {
              value: renameNewName.value,
              onUpdateValue: (value: string) => {
                renameNewName.value = value;
              },
            }),
          positiveText: t('operation.confirm'),
          negativeText: t('operation.cancel'),
          onPositiveClick: () => {
            renameLoading.value = true;
            Axios.patch(`/${obj.type}/${obj.id}/`, {
              name: renameNewName.value,
            }).then(res => {
              renameLoading.value = false;
              // @ts-ignore
              if (res.status === 'success') {
                naiveui.message.success(
                  t('success.success', [t('operation.rename')])
                );
              }
              listFile();
            });
          },
        });
    }
  };
</script>

<template>
  <n-breadcrumb style="margin: 1.5em 0">
    <n-breadcrumb-item @click="toPath(0)">
      {{ t('file.path.root') }}
    </n-breadcrumb-item>
    <n-breadcrumb-item
      v-for="(item, index) in path"
      :key="index"
      @click="toPath(index + 1)"
    >
      {{ item }}
    </n-breadcrumb-item>
  </n-breadcrumb>

  <n-button-group style="margin-left: 0.2em; margin-bottom: 1em">
    <n-button type="primary" @click="showUpload = true" ghost>
      {{ t('operation.upload_file') }}
    </n-button>
    <n-button type="primary" @click="createFolder" ghost>
      {{ t('file.create_folder') }}
    </n-button>
  </n-button-group>

  <n-data-table
    :columns="columns"
    :data="children"
    :row-key="rowKey"
    :pagination="false"
    :bordered="false"
    :row-props="fileRowProps"
    style="user-select: none"
  />

  <n-dropdown
    v-if="rightClickedObj !== null"
    placement="bottom-start"
    trigger="manual"
    :x="dropdownX"
    :y="dropdownY"
    :options="
      rightClickedObj.type === 'file'
        ? fileDropdownOptions
        : folderDropdownOptions
    "
    :show="showFileDropdown"
    :on-clickoutside="() => (showFileDropdown = false)"
    @select="handleDropdownSelect"
  />

  <n-drawer
    v-model:show="showUpload"
    width="35vw"
    :placement="isMobile ? 'bottom' : 'right'"
  >
    <n-drawer-content :title="t('operation.upload_file')">
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
            <n-icon :component="Upload" size="48" :depth="3" />
          </div>
          <n-text style="font-size: 16px">
            {{ t('prompt.drag_to_upload_1') }}
          </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            {{ t('prompt.drag_to_upload_2') }}
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </n-drawer-content>
  </n-drawer>
</template>
