/* global process */

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_FURNICASA_API_BASE_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_FURNICASA_API_ORIGIN ||
  API_BASE_URL.replace(/\/api\/?$/, "")
).replace(/\/+$/, "");

export const FURNICASA_STORE_SLUG =
  process.env.NEXT_PUBLIC_FURNICASA_STORE_SLUG || "furnicase";

const IMAGE_BASE_URL = `${API_ORIGIN}/api/images`;

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`FurniCasa API request failed: ${response.status}`);
  }

  return response.json();
}

export function getImageUrl(imageId) {
  return imageId ? `${IMAGE_BASE_URL}/${imageId}` : "";
}

export function getSite() {
  return getJson(
    `/site/resolve?slug=${encodeURIComponent(FURNICASA_STORE_SLUG)}`
  );
}

export function getProducts({ category, featured } = {}) {
  const params = new URLSearchParams();

  if (category) params.set("category", category);
  if (featured !== undefined) params.set("featured", String(featured));

  const query = params.toString();
  return getJson(`/products${query ? `?${query}` : ""}`);
}

export function getCategories() {
  return getJson("/categories");
}

export function getMaterials(group) {
  const query = group ? `?group=${encodeURIComponent(group)}` : "";
  return getJson(`/materials${query}`);
}

export function normalizeProduct(product, index = 0) {
  const imageId = product.imageIds?.[0] || product.imageId || "";

  return {
    id: product._id || product.id || `product-${index}`,
    nameEn: product.titleEn || product.nameEn || product.title || "",
    nameAr: product.titleAr || product.nameAr || product.titleEn || "",
    descriptionEn: product.descriptionEn || "",
    descriptionAr: product.descriptionAr || product.descriptionEn || "",
    category: product.category || "Other",
    categoryAr: product.categoryAr || product.category || "أخرى",
    materialsEn: product.materialsEn || "",
    materialsAr: product.materialsAr || product.materialsEn || "",
    dimensionsEn: product.dimensionsEn || "",
    dimensionsAr: product.dimensionsAr || product.dimensionsEn || "",
    priceValue: Number(product.price) || 0,
    image: getImageUrl(imageId),
    imageIds: product.imageIds || (imageId ? [imageId] : []),
    isFeatured: Boolean(product.isFeatured),
    isNewArrival: Boolean(product.isNewArrival),
    createdAt: product.createdAt || "",
  };
}

export function normalizeCategory(category, index = 0) {
  return {
    id: category._id || category.id || `category-${index}`,
    nameEn: category.nameEn || category.name || "",
    nameAr: category.nameAr || category.nameEn || "",
    taglineEn: category.taglineEn || "",
    taglineAr: category.taglineAr || category.taglineEn || "",
    filter: category.filter || category.nameEn || "",
    image: getImageUrl(category.imageId),
  };
}

export function normalizeMaterial(material, index = 0) {
  return {
    id: material._id || material.id || `material-${index}`,
    nameEn: material.nameEn || material.name || "",
    nameAr: material.nameAr || material.nameEn || "",
    descriptionEn: material.specEn || material.descriptionEn || "",
    descriptionAr:
      material.specAr || material.descriptionAr || material.specEn || "",
    group: material.group || "",
    image: getImageUrl(material.imageId),
    sortOrder: Number(material.sortOrder) || index,
  };
}