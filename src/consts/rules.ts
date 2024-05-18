import { FormItemRule } from 'naive-ui';
import { _ } from '../i18n';

export const rules = {
  username(required = true) {
    return {
      required,
      validator(_rule: FormItemRule, value: string) {
        if (!value) {
          return new Error(_('form.required', { key: _('user.username') }));
        } else if (!/^[\w-_]*$/.test(value)) {
          return new Error(
            _('form.character_limit1', {
              key: _('user.username'),
            })
          );
        } else if (value.length > 32) {
          return new Error(
            _('form.max_length', { key: _('user.username'), max: 32 })
          );
        } else if (value.length < 4) {
          return new Error(
            _('form.min_length', { key: _('user.username'), min: 4 })
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
          return new Error(_('form.required', { key: _('user.password') }));
        } else if (value.length > 128) {
          return new Error(
            _('form.max_length', { key: _('user.username'), max: 128 })
          );
        } else if (value.length < 8) {
          return new Error(
            _('form.min_length', { key: _('user.username'), min: 8 })
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
          return new Error(_('form.email'));
        }
        return true;
      },
      trigger: ['blur'],
    };
  },
};

export default rules;
