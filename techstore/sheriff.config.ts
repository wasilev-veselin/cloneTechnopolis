import { noDependencies, sameTag } from '@softarc/sheriff-core';
import type { SheriffConfig } from '@softarc/sheriff-core';

export const config: SheriffConfig = {
  tagging: {
    'projects/design-system/src/lib/**/*.ts': ['type:design-system'],
    'projects/shared-util/src/lib/**/*.ts': ['type:shared-util'],

    'projects/shop/src/app/core/**/*.ts': ['app:shop', 'type:core'],
    'projects/shop/src/app/features/catalog/**/*.ts': [
      'app:shop',
      'feature:catalog',
    ],
    'projects/shop/src/app/features/product-details/**/*.ts': [
      'app:shop',
      'feature:product-details',
    ],
    'projects/shop/src/app/features/cart/**/*.ts': [
      'app:shop',
      'feature:cart',
    ],
    'projects/shop/src/app/features/checkout/**/*.ts': [
      'app:shop',
      'feature:checkout',
    ],

    'projects/admin/src/app/**/*.ts': ['app:admin'],
  },
  depRules: {
    'type:shared-util': noDependencies,
    'type:design-system': ['type:shared-util'],
    'app:shop': [sameTag, 'type:design-system', 'type:shared-util'],
    'app:admin': [sameTag, 'type:design-system', 'type:shared-util'],
  },
};
