import { computed } from 'vue';

export const isMobile = computed(() => {
  const ua = navigator.userAgent;
  const ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
  const isAndroid = ua.match(/(Android)\s+([\d.]+)/);
  const isMobile = isIphone || isAndroid;
  return isMobile;
});
