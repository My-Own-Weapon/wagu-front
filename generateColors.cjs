/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-const */
/* eslint-disable max-depth */
/* eslint-disable no-restricted-syntax */

const fs = require('fs');

const rawData = fs.readFileSync('tokens.json');
const tokenInfo = JSON.parse(rawData);

const colors = {};
const borderRadius = {};
const fontWeight = {};
const zIndex = {
  header: 50,
  footer: 50,
  dropDown: 100,
  modal: 500,
  toast: 1000,
};

/* colors */
function parsingTheme(tokenInfo, prefix = '') {
  Object.entries(tokenInfo).forEach(([color, token]) => {
    if (token.type === 'color') {
      let colorName = prefix + color;
      colorName = colorName.charAt(0).toLowerCase() + colorName.slice(1);

      colors[colorName] = token.value;
    } else if (typeof token === 'object') {
      if (
        color !== 'key-color' &&
        color !== 'borderRadius' &&
        color !== 'fontWeight'
      ) {
        let newPrefix = prefix
          ? prefix + color.charAt(0).toUpperCase() + color.slice(1)
          : color;
        parsingTheme(token, newPrefix);
      }
    }
  });
}

parsingTheme(tokenInfo.global);

/* key-color */
if (tokenInfo.global['key-color']) {
  Object.entries(tokenInfo.global['key-color']).forEach(([key, value]) => {
    colors[key.charAt(0).toLowerCase() + key.slice(1)] = value.value;
  });
}

/* borderRadius */
if (tokenInfo.global.borderRadius) {
  Object.entries(tokenInfo.global.borderRadius).forEach(([key, value]) => {
    borderRadius[key] = value.value; // 문자열 그대로 유지
  });
}

/* fontWeight */
if (tokenInfo.global.fontWeight) {
  Object.entries(tokenInfo.global.fontWeight).forEach(([key, value]) => {
    fontWeight[key] = Number(value.value); // 숫자로 변환
  });
}

/* TS 파일 생성 */
let output = 'export const colors = {\n';

Object.entries(colors).forEach(([key, value]) => {
  output += `  ${key}: '${value}',\n`;
});
output += '} as const;\n\n';

output += 'export const borderRadius = {\n';
Object.entries(borderRadius).forEach(([key, value]) => {
  output += `  ${key}: '${value}',\n`;
});
output += '} as const;\n\n';

output += 'export const fontWeight = {\n';
Object.entries(fontWeight).forEach(([key, value]) => {
  output += `  ${key}: ${value},\n`;
});
output += '} as const;\n\n';

output += 'export const zIndex = {\n';
Object.entries(zIndex).forEach(([key, value]) => {
  output += `  ${key}: ${value},\n`;
});
output += '} as const;\n';

fs.writeFileSync('./src/constants/theme.ts', output);
console.log('theme.ts 파일이 생성되었습니다.');
