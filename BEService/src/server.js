import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { categories, products } from './data.js';

const app = express();
const port = process.env.PORT || 3000;

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

  let filteredProducts = [...products];

  if (categoryCode) {
    filteredProducts = filteredProducts.filter(
      (product) => product.categoryIds.includes(categoryCode),
    );
  }

  if (brands.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => brands.includes(product.brand.toLowerCase()),
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
