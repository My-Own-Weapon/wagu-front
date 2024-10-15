/**
 * @warning propertyGroups는 ESM 모듈이므로 CommonJS에서 가져올 시에 require가 아닌 import를 사용해야 합니다.
 */
import propertyGroups from 'stylelint-config-recess-order/groups';

export default {
  extends: ['stylelint-config-recess-order'],
  rules: {
    /**
     * @see https://markdotto.com/2011/11/29/css-property-order/
     */
    'order/properties-order': propertyGroups.map((group) => ({
      ...group,
      emptyLineBefore: 'always',
      noEmptyLineBetween: true,
    })),
  },
};
