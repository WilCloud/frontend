import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import type { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import type { ModalApiInjection } from 'naive-ui/es/modal/src/ModalProvider';
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';

interface Naiveui {
  dialog: DialogApiInjection;
  loadingBar: LoadingBarApiInjection;
  message: MessageApiInjection;
  modal: ModalApiInjection;
  notification: NotificationApiInjection;
}
const naiveui: Naiveui = {
  dialog: {} as DialogApiInjection,
  loadingBar: {} as LoadingBarApiInjection,
  message: {} as MessageApiInjection,
  modal: {} as ModalApiInjection,
  notification: {} as NotificationApiInjection,
};

export default naiveui;
