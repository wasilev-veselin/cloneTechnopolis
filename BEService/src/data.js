export const categories = [
  {
    code: 'phones',
    name: 'Phones',
    children: [
      {
        code: 'smartphones',
        name: 'Smartphones',
        children: [
          {
            code: 'iphone',
            name: 'iPhone',
            children: [],
          },
          {
            code: 'android-phones',
            name: 'Android Phones',
            children: [],
          },
        ],
      },
      {
        code: 'phone-accessories',
        name: 'Phone Accessories',
        children: [],
      },
    ],
  },
  {
    code: 'washing-machines',
    name: 'Washing Machines',
    children: [
      {
        code: 'front-load-washing-machines',
        name: 'Front Load Washing Machines',
        children: [],
      },
      {
        code: 'washer-dryers',
        name: 'Washer Dryers',
        children: [],
      },
    ],
  },
  {
    code: 'televisions',
    name: 'Televisions',
    children: [
      {
        code: 'qled-tvs',
        name: 'QLED TVs',
        children: [],
      },
      {
        code: 'oled-tvs',
        name: 'OLED TVs',
        children: [],
      },
      {
        code: 'smart-tvs',
        name: 'Smart TVs',
        children: [],
      },
    ],
  },
];

export const products = [
  {
    id: 'product-1',
    sku: 'IPHONE-15-128-BLACK',
    title: 'Apple iPhone 15 128GB Black',
    brand: 'Apple',
    categoryCode: 'phones',
    price: {
      amount: 1499,
      currencyCode: 'BGN',
    },
    oldPrice: {
      amount: 1699,
      currencyCode: 'BGN',
    },
    imageUrl: 'https://placehold.co/600x400?text=iPhone+15',
    availability: {
      status: 'inStock',
      quantity: 12,
    },
    rating: {
      average: 4.7,
      count: 124,
    },
    attributes: [
      {
        code: 'batteryCapacity',
        name: 'Battery',
        value: 3349,
        unit: 'mAh',
      },
      {
        code: 'storage',
        name: 'Storage',
        value: 128,
        unit: 'GB',
      },
      {
        code: 'screenSize',
        name: 'Screen Size',
        value: 6.1,
        unit: 'inch',
      },
    ],
    reviews: [
      {
        id: 'review-1',
        author: 'Ivan',
        rating: 5,
        comment: 'Very good phone.',
        createdAt: '2026-01-15',
      },
      {
        id: 'review-2',
        author: 'Maria',
        rating: 4,
        comment: 'Good camera and display.',
        createdAt: '2026-01-20',
      },
    ],
    relatedProductIds: ['product-2'],
    description: 'Apple iPhone 15 with 128GB storage and black finish.',
  },
  {
    id: 'product-2',
    sku: 'SAMSUNG-S24-256-BLACK',
    title: 'Samsung Galaxy S24 256GB Black',
    brand: 'Samsung',
    categoryCode: 'phones',
    price: {
      amount: 1399,
      currencyCode: 'BGN',
    },
    oldPrice: null,
    imageUrl: 'https://placehold.co/600x400?text=Galaxy+S24',
    availability: {
      status: 'limited',
      quantity: 4,
    },
    rating: {
      average: 4.5,
      count: 89,
    },
    attributes: [
      {
        code: 'batteryCapacity',
        name: 'Battery',
        value: 4000,
        unit: 'mAh',
      },
      {
        code: 'storage',
        name: 'Storage',
        value: 256,
        unit: 'GB',
      },
      {
        code: 'screenSize',
        name: 'Screen Size',
        value: 6.2,
        unit: 'inch',
      },
    ],
    reviews: [],
    relatedProductIds: ['product-1'],
    description: 'Samsung Galaxy S24 with 256GB storage.',
  },
  {
    id: 'product-3',
    sku: 'BOSCH-WAN28263BY',
    title: 'Bosch WAN28263BY Washing Machine',
    brand: 'Bosch',
    categoryCode: 'washing-machines',
    price: {
      amount: 899,
      currencyCode: 'BGN',
    },
    oldPrice: {
      amount: 999,
      currencyCode: 'BGN',
    },
    imageUrl: 'https://placehold.co/600x400?text=Bosch+Washer',
    availability: {
      status: 'inStock',
      quantity: 8,
    },
    rating: {
      average: 4.4,
      count: 57,
    },
    attributes: [
      {
        code: 'capacity',
        name: 'Capacity',
        value: 8,
        unit: 'kg',
      },
      {
        code: 'spinSpeed',
        name: 'Spin Speed',
        value: 1400,
        unit: 'rpm',
      },
      {
        code: 'energyClass',
        name: 'Energy Class',
        value: 'A',
        unit: null,
      },
    ],
    reviews: [
      {
        id: 'review-3',
        author: 'Georgi',
        rating: 4,
        comment: 'Quiet and reliable washing machine.',
        createdAt: '2026-02-02',
      },
    ],
    relatedProductIds: ['product-4'],
    description: 'Bosch washing machine with 8kg capacity and 1400 rpm.',
  },
  {
    id: 'product-4',
    sku: 'LG-F4WV309S6TE',
    title: 'LG F4WV309S6TE Washing Machine',
    brand: 'LG',
    categoryCode: 'washing-machines',
    price: {
      amount: 799,
      currencyCode: 'BGN',
    },
    oldPrice: null,
    imageUrl: 'https://placehold.co/600x400?text=LG+Washer',
    availability: {
      status: 'outOfStock',
      quantity: 0,
    },
    rating: {
      average: 4.2,
      count: 42,
    },
    attributes: [
      {
        code: 'capacity',
        name: 'Capacity',
        value: 9,
        unit: 'kg',
      },
      {
        code: 'spinSpeed',
        name: 'Spin Speed',
        value: 1200,
        unit: 'rpm',
      },
      {
        code: 'energyClass',
        name: 'Energy Class',
        value: 'B',
        unit: null,
      },
    ],
    reviews: [],
    relatedProductIds: ['product-3'],
    description: 'LG washing machine with 9kg capacity.',
  },
  {
    id: 'product-5',
    sku: 'SAMSUNG-TV-55-QLED',
    title: 'Samsung 55 inch QLED TV',
    brand: 'Samsung',
    categoryCode: 'televisions',
    price: {
      amount: 1199,
      currencyCode: 'BGN',
    },
    oldPrice: null,
    imageUrl: 'https://placehold.co/600x400?text=Samsung+TV',
    availability: {
      status: 'inStock',
      quantity: 15,
    },
    rating: {
      average: 4.6,
      count: 73,
    },
    attributes: [
      {
        code: 'screenSize',
        name: 'Screen Size',
        value: 55,
        unit: 'inch',
      },
      {
        code: 'resolution',
        name: 'Resolution',
        value: '4K',
        unit: null,
      },
      {
        code: 'refreshRate',
        name: 'Refresh Rate',
        value: 120,
        unit: 'Hz',
      },
    ],
    reviews: [],
    relatedProductIds: [],
    description: 'Samsung 55 inch QLED television with 4K resolution.',
  },
];
