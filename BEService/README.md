# BE Service

Node.js Express backend service for the Techstore mock API.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

The API runs on `http://localhost:3000` by default. To use a different port, set `PORT`.

```bash
PORT=3101 npm run dev
```

## Data Shape

Main product fields:

- `id`
- `masterProductId`
- `marketCode`
- `locale`
- `slug`
- `title`
- `brand`
- `manufacturerCode`
- `categoryIds`
- `description`
- `seo`
- `badges`
- `price`
- `availability`
- `images`
- `specs`
- `variants`
- `stockStatus`

## Endpoints

### `GET /api/categories`

Returns all category trees.

Example:

```bash
curl http://localhost:3000/api/categories
```

Response:

```json
[
  {
    "code": "laptops",
    "name": "Laptops",
    "children": [
      {
        "code": "business-laptops",
        "name": "Business Laptops",
        "children": []
      }
    ]
  }
]
```

### `GET /api/categories/:categoryCode`

Returns one category by `code`. The lookup is recursive, so child category codes also work.

Path parameters:

| Name | Required | Description |
| --- | --- | --- |
| `categoryCode` | Yes | Category code, for example `laptops`, `business-laptops`, `audio`, `headphones`, `monitors`, `gaming-monitors`. |

Example:

```bash
curl http://localhost:3000/api/categories/business-laptops
```

Success response:

```json
{
  "code": "business-laptops",
  "name": "Business Laptops",
  "children": []
}
```

Not found response:

```json
{
  "message": "Category not found"
}
```

### `GET /api/products`

Returns a paged list of products.

Query parameters:

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `categoryCode` | No | - | Filters products where `categoryIds` contains the value. |
| `brand` | No | - | Filters by exact brand, case-insensitive. Multiple brands can be provided as a comma-separated list. |
| `sort` | No | - | Supported values: `price-asc`, `price-desc`, `rating-desc`. Current `rating-desc` falls back to title ordering because mock products do not contain rating data. |
| `page` | No | `1` | Page number. |
| `pageSize` | No | `20` | Number of products per page. |

Example:

```bash
curl "http://localhost:3000/api/products?categoryCode=laptops&brand=Lenovo,Sony&sort=price-asc&page=1&pageSize=10"
```

Response:

```json
{
  "items": [
    {
      "id": "100",
      "masterProductId": "mp-100",
      "marketCode": "bg",
      "locale": "bg-BG",
      "slug": "lenovo-thinkpad",
      "title": "Lenovo ThinkPad X1 Carbon Gen",
      "brand": "Lenovo",
      "categoryIds": ["laptops", "business-laptops"],
      "price": {
        "current": {
          "amount": 3699,
          "currencyCode": "EUR"
        },
        "includesTax": true,
        "taxRate": 20
      },
      "availability": {
        "status": "inStock",
        "storesAvailableCount": 12
      },
      "images": [],
      "specs": [],
      "variants": [],
      "stockStatus": "inStock"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 10
}
```

Note: The real response includes the full product objects, including full `images`, `specs`, and `variants` arrays.

### `GET /api/products/:id`

Returns one product in `ProductDetailsModel` shape.

Path parameters:

| Name | Required | Description |
| --- | --- | --- |
| `id` | Yes | Product `id` or product `slug`. Examples: `100`, `lenovo-thinkpad`, `101`, `sony-wh-1000xm6`. |

Example by id:

```bash
curl http://localhost:3000/api/products/100
```

Example by slug:

```bash
curl http://localhost:3000/api/products/lenovo-thinkpad
```

Success response:

```json
{
  "id": "100",
  "masterProductId": "mp-100",
  "marketCode": "bg",
  "locale": "bg-BG",
  "slug": "lenovo-thinkpad",
  "title": "Lenovo ThinkPad X1 Carbon Gen",
  "brand": "Lenovo",
  "manufacturerCode": "21NS001PBM",
  "categoryIds": ["laptops", "business-laptops"],
  "description": "Light business laptop with OLED display, long battery life, and durable chassis for everyday work.",
  "price": {
    "current": {
      "amount": 3699,
      "currencyCode": "EUR"
    },
    "includesTax": true,
    "taxRate": 20
  },
  "availability": {
    "status": "inStock",
    "storesAvailableCount": 12
  },
  "images": [],
  "specs": [],
  "variants": [],
  "stockStatus": "inStock"
}
```

Note: The real response includes full `seo`, `badges`, `images`, `specs`, and `variants` data.

Not found response:

```json
{
  "message": "Product not found"
}
```

## Available Mock Values

Categories:

- `laptops`
- `business-laptops`
- `audio`
- `headphones`
- `monitors`
- `gaming-monitors`

Products:

| id | slug | brand |
| --- | --- | --- |
| `100` | `lenovo-thinkpad` | `Lenovo` |
| `101` | `sony-wh-1000xm6` | `Sony` |
| `102` | `samsung-odyssey-oled` | `Samsung` |
