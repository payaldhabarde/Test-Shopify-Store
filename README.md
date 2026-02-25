Shopify Infinite Scroll with Featured Products.

1. Featured vs Non-Featured Products

Each product in the collection is rendered as a <li> with a data-featured attribute:

data-featured="{% if product.tags contains 'featured' %}true{% else %}false{% endif %}"

In JavaScript, we separate products on page load:

allProducts.forEach(p => {
  if (p.dataset.featured === "true") featured.push(p);
  else normal.push(p);
});

Featured products are always displayed at the top of the grid, followed by normal products.

2. Infinite Scroll Implementation

Infinite scroll triggers when the user scrolls near the bottom of the page.

We fetch the next page via AJAX:

const response = await fetch(`${window.location.pathname}?page=${currentPage}`);

New products are extracted from the returned HTML and appended to the existing grid dynamically.

A loading indicator (#infinite-loader) is shown while fetching.

3. Duplicate Products Prevention

Every product has a data-product-id.

JS maintains a Set of loaded IDs:

const loadedIds = new Set();
loadedIds.add(product.dataset.productId);

Before appending a product, we check if its ID already exists. This prevents duplicates during scrolling.

4. Scalability for Large Collections

Only a limited number of products are rendered initially (e.g., first 20).

Infinite scroll loads more products page by page, reducing initial DOM size.

Smooth appending via requestAnimationFrame ensures minimal layout thrashing and keeps performance high.

5. Filtering & Sorting Handling

We detect filter/sort parameters using the URL:

const params = new URLSearchParams(window.location.search);
if (params.has("sort_by") || window.location.search.includes("filter.")) return;

Infinite scroll is disabled when sorting or filtering is applied, ensuring Shopify’s default behavior remains intact.

Pagination remains visible during filter/sort to allow standard navigation.

6. Liquid Limitations & Solutions

Limitation: Liquid cannot reorder products dynamically on the client side.

Solution: We use JS to reorder featured vs normal products after page load, while Liquid simply adds attributes (data-featured) to each product.

Limitation: Liquid cannot detect scroll events or fetch additional pages dynamically.

Solution: JS handles infinite scroll and AJAX page requests, seamlessly working with the Liquid-rendered HTML.

&
Originally, the product grid used:

{%- paginate collection.products by section.settings.products_per_page -%}

This paginated products based on the theme setting.

We replaced it with:

{%- paginate collection.products 20-%} 
Why: So JavaScript can handle infinite scroll and load 20 products at a time dynamically.

Liquid now only provides the container (<ul id="product-grid">), and JS appends products in batches while keeping featured products first and avoiding duplicates.abarde/Test-Shopify-Store.git
