import router from '../router';
import { useStore } from '../stores';

export const handleMenuChange = (
  key: string,
  item: any,
  mobilePopoverRef: any = null
) => {
  if (item.action === 'changeTheme') {
    const store = useStore();
    store.switchTheme();
  } else if (item.action === 'changeLanguage') {
    const store = useStore();
    store.setLocale(key as Language);
  } else if (item.action === 'logout') {
    const store = useStore();
    store.logout();
  } else {
    router.push({ name: key });
  }
  if (mobilePopoverRef) {
    mobilePopoverRef.setShow(false);
  }
};

export default handleMenuChange;
