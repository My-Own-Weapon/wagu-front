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
