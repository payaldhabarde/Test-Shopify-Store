document.addEventListener("DOMContentLoaded", initInfiniteScroll);
document.addEventListener("shopify:section:load", initInfiniteScroll);

function initInfiniteScroll() {

  const grid = document.querySelector("#product-grid");
  if (!grid) return;

  /* ----------------------------------
     Disable Infinite Scroll on:
     - Sorting
     - Filtering
     - Price filter
  -----------------------------------*/

  const params = new URLSearchParams(window.location.search);

  if (
    params.has("sort_by") ||
    window.location.search.includes("filter.")
  ) {
    document.body.classList.remove("infinite-scroll-active");
    return;
  }

  /* ----------------------------------
     Activate Infinite Scroll
  -----------------------------------*/

  document.body.classList.add("infinite-scroll-active");

  /* Loader */
  let loader = document.querySelector("#infinite-loader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "infinite-loader";
    loader.innerText = "Loading...";
    loader.style.cssText =
      "text-align:center;padding:20px;display:none;font-weight:600;";
    grid.after(loader);
  }

  let currentPage = 1;
  let loading = false;
  let hasMore = true;

  const loadedIds = new Set();
  grid.querySelectorAll(".product-card").forEach(card => {
    if (card.dataset.productId) {
      loadedIds.add(card.dataset.productId);
    }
  });

  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScroll);

  async function handleScroll() {

    if (loading || !hasMore) return;

    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 300
    ) {

      loading = true;
      loader.style.display = "block";
      currentPage++;

      try {

        const response = await fetch(
          `${window.location.pathname}?page=${currentPage}`
        );

        const html = await response.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const newProducts = tempDiv.querySelectorAll(".product-card");

        if (!newProducts.length) {
          hasMore = false;
          loader.style.display = "none";
          return;
        }

        newProducts.forEach(product => {

          const id = product.dataset.productId;

          if (!loadedIds.has(id)) {
            loadedIds.add(id);
            grid.appendChild(product);
          }

        });

        loading = false;
        loader.style.display = "none";

      } catch (error) {
        console.error("Infinite Scroll Error:", error);
        loading = false;
        loader.style.display = "none";
      }
    }
  }
}