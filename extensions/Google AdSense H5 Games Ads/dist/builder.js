"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = exports.unload = exports.load = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Callback when the plugin loaded into the Cocos Creator
 */
const load = () => __awaiter(void 0, void 0, void 0, function* () {
    console.debug('adsense-h5g-plugin load');
    const codeInfoList = (yield axios_1.default.get('https://adsense.cocos.com/agent.json')).data;
    const AFPHostPropertyCodeList = codeInfoList.map((Info) => {
        return {
            label: Info.name,
            value: Info.code,
        };
    });
    AFPHostPropertyCodeList.push({
        value: 'other',
        label: 'i18n:adsense-h5g-plugin.options.otherAFPHostPropertyCode'
    });
    options.options.AFPHostPropertyCode.render.items = AFPHostPropertyCodeList;
    options.options.AFPHostPropertyCode.default = AFPHostPropertyCodeList[0].value;
});
exports.load = load;
/**
 * Callback when the plugin unloaded into the Cocos Creator
 */
const unload = () => {
    console.debug('adsense-h5g-plugin unload');
};
exports.unload = unload;
const options = {
    hooks: './hooks',
    options: {
        adsensePropertyCode: {
            label: 'i18n:adsense-h5g-plugin.options.adsensePropertyCode',
            description: 'i18n:adsense-h5g-plugin.options.adsensePropertyCodeTips',
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
            description: 'i18n:adsense-h5g-plugin.options.enableTestAdTips',
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
};
/**
 * Configs for H5 Game Ads Plugin
 */
exports.configs = {
    'web-desktop': options,
    'web-mobile': options,
};
