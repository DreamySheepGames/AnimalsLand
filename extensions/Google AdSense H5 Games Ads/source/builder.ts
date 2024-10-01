/* tslint:disable */
import { BuildPlugin } from '../@types';
import axios from 'axios';

/**
 * Callback when the plugin loaded into the Cocos Creator
 */
export const load: BuildPlugin.load = async () => {
  console.debug('adsense-h5g-plugin load');
  const codeInfoList = (await axios.get('https://adsense.cocos.com/agent.json')).data;
  const AFPHostPropertyCodeList: { label: string, value: string }[] = codeInfoList.map((Info) => {
      return {
          label: Info.name,
          value: Info.code,
      }
  });
  AFPHostPropertyCodeList.push({
      value: 'other',
      label: 'i18n:adsense-h5g-plugin.options.otherAFPHostPropertyCode'
  })
  options.options.AFPHostPropertyCode.render.items = AFPHostPropertyCodeList;
  options.options.AFPHostPropertyCode.default = AFPHostPropertyCodeList[0].value;
};

/**
 * Callback when the plugin unloaded into the Cocos Creator
 */
export const unload: BuildPlugin.load = () => {
  console.debug('adsense-h5g-plugin unload');
};

const options = {
  hooks: './hooks',
  options: {
    adsensePropertyCode: {
      label: 'i18n:adsense-h5g-plugin.options.adsensePropertyCode',
      description:
          'i18n:adsense-h5g-plugin.options.adsensePropertyCodeTips',
      render: {
        ui: 'ui-input',
        attributes: {
          placeholder: 'i18n:adsense-h5g-plugin.options.adsensePropertyCodePlaceholder',
        },
      },
      verifyRules: ['adsensePropertyCodeRule'],
    },
    enableTestAd: {
      label: 'i18n:adsense-h5g-plugin.options.enableTestAd',
      description:
          'i18n:adsense-h5g-plugin.options.enableTestAdTips',
      default: false,
      render: {
        ui: 'ui-checkbox',
      },
    },
    AFPHostPropertyCode: {
        label: 'i18n:adsense-h5g-plugin.options.AFPHostPropertyCode',
        default: 'option_1',
        render: {
            ui: 'ui-select',
            items: [
                {
                    label: 'option 1',
                    value: 'option_1',
                }
            ],
        },
    },
    otherAFPHostPropertyCode: {
        label: 'i18n:adsense-h5g-plugin.options.otherAFPHostPropertyCode',
        description: 'i18n:adsense-h5g-plugin.options.otherAFPHostPropertyCodeTips',
        default: '',
        render: {
            ui: 'ui-input',
        },
    }
  },
  verifyRuleMap: {
    adsensePropertyCodeRule: {
      message: 'i18n:adsense-h5g-plugin.adsensePropertyCodeRule_msg',
      func(val, buildOptions) {
        const regex = new RegExp('^ca-pub-\\d+$');
        return regex.test(val);
      },
    },
  }
}

/**
 * Configs for H5 Game Ads Plugin
 */
export const configs: BuildPlugin.Configs = {
  'web-desktop': options,
  'web-mobile': options,
};