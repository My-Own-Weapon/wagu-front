/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-const */
/* eslint-disable max-depth */
/* eslint-disable no-restricted-syntax */

const fs = require('fs');

const rawData = fs.readFileSync('tokens.json');
const data = JSON.parse(rawData);

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
function processColor(obj, prefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    if (value.type === 'color') {
      let colorName = prefix + key;
      colorName = colorName.charAt(0).toLowerCase() + colorName.slice(1);
      colors[colorName] = value.value;
    } else if (typeof value === 'object') {
      if (
        key !== 'key-color' &&
        key !== 'borderRadius' &&
        key !== 'fontWeight'
      ) {
        let newPrefix = prefix
          ? prefix + key.charAt(0).toUpperCase() + key.slice(1)
          : key;
        processColor(value, newPrefix);
      }
    }
  }
}

processColor(data.global);

/* key-color */
if (data.global['key-color']) {
  for (const [key, value] of Object.entries(data.global['key-color'])) {
    colors[key.charAt(0).toLowerCase() + key.slice(1)] = value.value;
  }
}

/* borderRadius */
if (data.global.borderRadius) {
  for (const [key, value] of Object.entries(data.global.borderRadius)) {
    borderRadius[key] = value.value; // 문자열 그대로 유지
  }
}

/* fontWeight */
if (data.global.fontWeight) {
  for (const [key, value] of Object.entries(data.global.fontWeight)) {
    fontWeight[key] = Number(value.value); // 숫자로 변환
  }
}

/* TS 파일 생성 */
let output = 'export const colors = {\n';
for (const [key, value] of Object.entries(colors)) {
  output += `  ${key}: '${value}',\n`;
}
output += '} as const;\n\n';

output += 'export const borderRadius = {\n';
for (const [key, value] of Object.entries(borderRadius)) {
  output += `  ${key}: '${value}',\n`;
}
output += '} as const;\n\n';

output += 'export const fontWeight = {\n';
for (const [key, value] of Object.entries(fontWeight)) {
  output += `  ${key}: ${value},\n`;
}
output += '} as const;\n\n';

output += 'export const zIndex = {\n';
for (const [key, value] of Object.entries(zIndex)) {
  output += `  ${key}: ${value},\n`;
}
output += '} as const;\n';

fs.writeFileSync('./src/constants/theme.ts', output);
console.log('theme.ts 파일이 생성되었습니다.');
