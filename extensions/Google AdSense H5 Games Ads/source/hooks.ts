/* tslint:disable */
import {readFile, writeFile} from 'fs-extra';
import {join} from 'path';

import {BuildHook, IBuildTaskOption} from '../@types';

interface IOptions {
  adsensePropertyCode: string;
  enableTestAd: boolean;
  AFPHostPropertyCode: string;
  otherAFPHostPropertyCode: boolean;
}

const PACKAGE_NAME = 'adsense-h5g-plugin';

interface ITaskOptions extends IBuildTaskOption {
  packages: {'adsense-h5g-plugin': IOptions;};
}

function log(...arg: any[]) {
  return console.log(`[${PACKAGE_NAME}] `, ...arg);
}

let allAssets = [];

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function() {
  console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.`);
};

export const onAfterBuild: BuildHook.onAfterBuild =
    async function(options, result) {
  const packageOptions = options.packages[PACKAGE_NAME];
  const dest = join(result.dest, 'index.html');
  const dataAdBreakTest =
    packageOptions.enableTestAd ? 'data-adbreak-test="on"' : '';
  let dataAdHost = '';
  if (packageOptions.AFPHostPropertyCode = 'other' && packageOptions.otherAFPHostPropertyCode) {
    dataAdHost = `data-ad-host="${packageOptions.otherAFPHostPropertyCode}"`;
  } else {
    dataAdHost = `data-ad-host="${packageOptions.AFPHostPropertyCode}"`;
  }
  let htmlContent = await readFile(dest, 'utf8');
  htmlContent = htmlContent.replace('</head>', function(str) {
    return `
        <script async
            data-ad-client="${packageOptions.adsensePropertyCode}"
            ${dataAdBreakTest}
            ${dataAdHost}
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">
        </script>
        </head>
        `;
  });
  await writeFile(dest, htmlContent);
};
