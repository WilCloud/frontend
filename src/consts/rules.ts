import { FormItemRule } from 'naive-ui';
import { t } from '../i18n';

export const rules = {
  username(required = true) {
    return {
      required,
      validator(_rule: FormItemRule, value: string) {
        if (!value) {
          return new Error(t('form.required', { key: t('user.username') }));
        } else if (!/^[\w-_]*$/.test(value)) {
          return new Error(
            t('form.character_limit1', {
              key: t('user.username'),
            })
          );
        } else if (value.length > 32) {
          return new Error(
            t('form.max_length', { key: t('user.username'), max: 32 })
          );
        } else if (value.length < 4) {
          return new Error(
            t('form.min_length', { key: t('user.username'), min: 4 })
          );
        }
        return true;
      },
      trigger: ['blur'],
    };
  },
  password(required = true) {
    return {
      required,
      validator(_rule: FormItemRule, value: string) {
        if (!value) {
          return new Error(t('form.required', { key: t('user.password') }));
        } else if (value.length > 128) {
          return new Error(
            t('form.max_length', { key: t('user.username'), max: 128 })
          );
        } else if (value.length < 8) {
          return new Error(
            t('form.min_length', { key: t('user.username'), min: 8 })
          );
        }
        return true;
      },
      trigger: ['blur'],
    };
  },
  email(required = true) {
    return {
      required,
      validator(_rule: FormItemRule, value: string) {
        if (!/^[\w_-]+@[\w_-]+(\.[\w_-]+)+$/.test(value)) {
          return new Error(t('form.email'));
        }
        return true;
      },
      trigger: ['blur'],
    };
  },
};

export default rules;
