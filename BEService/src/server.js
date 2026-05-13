import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { categories, products } from './data.js';

const app = express();
const port = process.env.PORT || 3000;

const facetDefinitionsByCategory = {
  phones: [
    {
      code: 'model',
      label: 'Модел',
      type: 'multiSelect',
    },
    {
      code: 'storage',
      label: 'Вътрешна памет',
      type: 'multiSelect',
    },
    {
      code: 'ram',
      label: 'RAM памет',
      type: 'multiSelect',
    },
    {
      code: 'manufacturer',
      label: 'Производител',
      type: 'multiSelect',
    },
    {
      code: 'battery',
      label: 'Батерия',
      type: 'range',
    },
  ],
};

app.use(cors());
app.use(express.json());

function findCategoryByCode(categoryItems, categoryCode) {
  for (const category of categoryItems) {
    if (category.code === categoryCode) {
      return category;
    }

    const childCategory = findCategoryByCode(category.children, categoryCode);

    if (childCategory) {
      return childCategory;
    }
  }

  return null;
}

function parseSpecFilters(request) {
  const requestUrl = new URL(request.originalUrl, `http://${request.headers.host}`);
  const filters = new Map();
  const specParamPattern = /^spec\[([^\]]+)\](?:\[(min|max)\])?$/;

  for (const [key, rawValue] of requestUrl.searchParams.entries()) {
    const match = specParamPattern.exec(key);

    if (!match) {
      continue;
    }

    const [, code, rangeBound] = match;
    const value = rawValue.trim();

    if (!code || !value) {
      continue;
    }

    if (rangeBound === 'min' || rangeBound === 'max') {
      const numericValue = Number(value);

      if (!Number.isFinite(numericValue)) {
        continue;
      }

      const currentFilter = filters.get(code);
      const rangeFilter =
        currentFilter?.type === 'range' ? currentFilter : { code, type: 'range' };

      rangeFilter[rangeBound] = numericValue;
      filters.set(code, rangeFilter);
      continue;
    }

    const values = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (values.length > 0) {
      filters.set(code, { code, type: 'in', values });
    }
  }

  return [...filters.values()];
}

function getProductSpec(product, code) {
  if (code === 'manufacturer') {
    return {
      code,
      label: 'Производител',
      value: product.brand,
      filterable: true,
    };
  }

  return product.specs?.find((spec) => spec.code === code);
}

function productMatchesSpecFilter(product, filter) {
  const spec = getProductSpec(product, filter.code);

  if (!spec) {
    return false;
  }

  if (filter.type === 'range') {
    const specValue = Number(spec.value);

    if (!Number.isFinite(specValue)) {
      return false;
    }

    if (filter.min !== undefined && specValue < filter.min) {
      return false;
    }

    if (filter.max !== undefined && specValue > filter.max) {
      return false;
    }

    return true;
  }

  if (filter.type === 'in') {
    return filter.values.includes(String(spec.value));
  }

  return true;
}

function createFacets(categoryCode, facetProducts, specFilters) {
  const facetDefinitions = facetDefinitionsByCategory[categoryCode] ?? [];
  const selectedValuesByCode = new Map(
    specFilters
      .filter((filter) => filter.type === 'in')
      .map((filter) => [filter.code, new Set(filter.values)]),
  );

  return facetDefinitions.map((definition) => {
    if (definition.type === 'range') {
      const numericSpecs = facetProducts
        .map((product) => getProductSpec(product, definition.code))
        .filter(Boolean)
        .map((spec) => ({
          value: Number(spec.value),
          unit: spec.unit,
        }))
        .filter((spec) => Number.isFinite(spec.value));
      const values = numericSpecs.map((spec) => spec.value);

      return {
        code: definition.code,
        label: definition.label,
        type: definition.type,
        values: [],
        min: values.length > 0 ? Math.min(...values) : undefined,
        max: values.length > 0 ? Math.max(...values) : undefined,
        step: 100,
        unit: numericSpecs.find((spec) => spec.unit)?.unit,
      };
    }

    const counts = new Map();

    for (const product of facetProducts) {
      const spec = getProductSpec(product, definition.code);

      if (!spec) {
        continue;
      }

      const value = String(spec.value);
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    const selectedValues = selectedValuesByCode.get(definition.code) ?? new Set();

    return {
      code: definition.code,
      label: definition.label,
      type: definition.type,
      values: [...counts.entries()]
        .sort(([firstValue], [secondValue]) => firstValue.localeCompare(secondValue))
        .map(([value, count]) => ({
          value,
          label: value,
          count,
          selected: selectedValues.has(value),
        })),
    };
  });
}

app.get('/api/categories', (request, response) => {
  response.json(categories);
});

app.get('/api/categories/:categoryCode', (request, response) => {
  const category = findCategoryByCode(categories, request.params.categoryCode);

  if (!category) {
    response.status(404).json({
      message: 'Category not found',
    });

    return;
  }

  response.json(category);
});

app.get('/api/products', (request, response) => {
  const categoryCode = request.query.categoryCode;
  const brands = String(request.query.brand ?? '')
    .split(',')
    .map((brand) => brand.trim().toLowerCase())
    .filter(Boolean);
  const sort = request.query.sort;
  const page = Number(request.query.page ?? 1);
  const pageSize = Number(request.query.pageSize ?? 20);
  const specFilters = parseSpecFilters(request);

  let filteredProducts = [...products];

  if (categoryCode) {
    filteredProducts = filteredProducts.filter(
      (product) => product.categoryIds.includes(categoryCode),
    );
  }

  const facetProducts = [...filteredProducts];

  if (brands.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => brands.includes(product.brand.toLowerCase()),
    );
  }

  if (specFilters.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      specFilters.every((filter) => productMatchesSpecFilter(product, filter)),
    );
  }

  if (sort === 'price-asc') {
    filteredProducts.sort(
      (firstProduct, secondProduct) =>
        firstProduct.price.current.amount - secondProduct.price.current.amount,
    );
  }

  if (sort === 'price-desc') {
    filteredProducts.sort(
      (firstProduct, secondProduct) =>
        secondProduct.price.current.amount - firstProduct.price.current.amount,
    );
  }

  if (sort === 'rating-desc') {
    filteredProducts.sort((firstProduct, secondProduct) =>
      firstProduct.title.localeCompare(secondProduct.title),
    );
  }

  const startIndex = (page - 1) * pageSize;
  const pagedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  response.json({
    items: pagedProducts,
    totalCount: filteredProducts.length,
    page,
    pageSize,
    facets: categoryCode ? createFacets(categoryCode, facetProducts, specFilters) : [],
  });
});

app.get('/api/products/:id', (request, response) => {
  const product = products.find(
    (productItem) =>
      productItem.id === request.params.id ||
      productItem.slug === request.params.id,
  );

  if (!product) {
    response.status(404).json({
      message: 'Product not found',
    });

    return;
  }

  response.json(product);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
