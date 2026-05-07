import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { categories, products } from './data.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function toProductSummary(product) {
  return {
    id: product.id,
    sku: product.sku,
    title: product.title,
    brand: product.brand,
    categoryCode: product.categoryCode,
    price: product.price,
    oldPrice: product.oldPrice,
    imageUrl: product.imageUrl,
    availability: product.availability,
    rating: product.rating,
  };
}

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
  const brand = request.query.brand;
  const sort = request.query.sort;
  const page = Number(request.query.page ?? 1);
  const pageSize = Number(request.query.pageSize ?? 20);

  let filteredProducts = [...products];

  if (categoryCode) {
    filteredProducts = filteredProducts.filter(
      (product) => product.categoryCode === categoryCode,
    );
  }

  if (brand) {
    filteredProducts = filteredProducts.filter(
      (product) => product.brand.toLowerCase() === String(brand).toLowerCase(),
    );
  }

  if (sort === 'price-asc') {
    filteredProducts.sort(
      (firstProduct, secondProduct) =>
        firstProduct.price.amount - secondProduct.price.amount,
    );
  }

  if (sort === 'price-desc') {
    filteredProducts.sort(
      (firstProduct, secondProduct) =>
        secondProduct.price.amount - firstProduct.price.amount,
    );
  }

  if (sort === 'rating-desc') {
    filteredProducts.sort(
      (firstProduct, secondProduct) =>
        secondProduct.rating.average - firstProduct.rating.average,
    );
  }

  const startIndex = (page - 1) * pageSize;
  const pagedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  response.json({
    items: pagedProducts.map(toProductSummary),
    totalCount: filteredProducts.length,
    page,
    pageSize,
  });
});

app.get('/api/products/:id', (request, response) => {
  const product = products.find(
    (productItem) => productItem.id === request.params.id,
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
