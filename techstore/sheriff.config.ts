import { sameTag } from '@softarc/sheriff-core';
import type { SheriffConfig } from '@softarc/sheriff-core';

export const config: SheriffConfig = {
  tagging: {
    'projects/design-system/src/lib/**/*.ts': ['type:design-system'],

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
    'app:shop': [sameTag, 'type:design-system'],
    'app:admin': [sameTag, 'type:design-system'],
  },
};
