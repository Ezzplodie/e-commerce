"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/widgets/header";
import styles from "./AdminProducts.module.scss";
import {
  AdminProduct,
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "@/shared/api/adminProducts";
import {
  AdminVariant,
  AdminVariantImage,
  createVariant,
  createVariantImage,
  deleteVariant,
  deleteVariantImage,
  listVariantImages,
  listVariants,
} from "@/shared/api/adminVariants";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Draft = {
  category_id: string;
  name: string;
  slug: string;
  description: string;
  base_price: string;
};

type VariantDraft = {
  product_id: number | null;
  sku: string;
  price: string;
  stock: string;
  attribute_value_ids: string;
};

type VariantImageDraft = {
  variant_id: number | null;
  image_link: string;
  image_order: string;
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState<Draft>({
    category_id: "",
    name: "",
    slug: "",
    description: "",
    base_price: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Draft | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [variants, setVariants] = useState<AdminVariant[]>([]);
  const [variantImages, setVariantImages] = useState<
    Record<number, AdminVariantImage[]>
  >({});

  const [variantDraft, setVariantDraft] = useState<VariantDraft>({
    product_id: null,
    sku: "",
    price: "",
    stock: "",
    attribute_value_ids: "",
  });

  const [variantImageDraft, setVariantImageDraft] = useState<VariantImageDraft>({
    variant_id: null,
    image_link: "",
    image_order: "",
  });

  const canCreate = useMemo(() => {
    return (
      draft.name.trim().length > 0 &&
      (draft.slug.trim().length > 0 || slugify(draft.name).length > 0) &&
      draft.category_id.trim().length > 0 &&
      draft.base_price.trim().length > 0
    );
  }, [draft]);

  async function refresh() {
    setError(null);
    setIsLoading(true);
    try {
      const products = await listProducts();
      setItems(products);
      if (!selectedProductId && products[0]) {
        setSelectedProductId(products[0].id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    async function loadVariants(productId: number | null) {
      if (!productId) {
        setVariants([]);
        return;
      }
      try {
        const vs = await listVariants(productId);
        setVariants(vs);
        const imagesByVariant: Record<number, AdminVariantImage[]> = {};
        for (const v of vs) {
          imagesByVariant[v.id] = await listVariantImages(v.id);
        }
        setVariantImages(imagesByVariant);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load variants");
      }
    }
    void loadVariants(selectedProductId);
  }, [selectedProductId]);

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Admin · Products</h1>
          <button className={styles.secondaryBtn} onClick={refresh} type="button">
            Refresh
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Create product</h2>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Category ID</span>
              <input
                value={draft.category_id}
                onChange={(e) => setDraft((d) => ({ ...d, category_id: e.target.value }))}
                placeholder="e.g. 1"
                inputMode="numeric"
              />
            </label>

            <label className={styles.field}>
              <span>Name</span>
              <input
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    name: e.target.value,
                    slug: d.slug ? d.slug : slugify(e.target.value),
                  }))
                }
                placeholder="Product name"
              />
            </label>

            <label className={styles.field}>
              <span>Slug</span>
              <input
                value={draft.slug}
                onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                placeholder="product-slug"
              />
            </label>

            <label className={styles.field}>
              <span>Base price</span>
              <input
                value={draft.base_price}
                onChange={(e) => setDraft((d) => ({ ...d, base_price: e.target.value }))}
                placeholder="e.g. 49.99"
                inputMode="decimal"
              />
            </label>

            <label className={styles.fieldWide}>
              <span>Description</span>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Optional"
                rows={3}
              />
            </label>
          </div>

          <div className={styles.actionsRow}>
            <button
              className={styles.primaryBtn}
              type="button"
              disabled={!canCreate}
              onClick={async () => {
                setError(null);
                try {
                  const created = await createProduct({
                    category_id: Number(draft.category_id),
                    name: draft.name.trim(),
                    slug: (draft.slug || slugify(draft.name)).trim(),
                    description: draft.description.trim() || undefined,
                    base_price: Number(draft.base_price),
                  });
                  setItems((prev) => [created, ...prev]);
                  setDraft({
                    category_id: "",
                    name: "",
                    slug: "",
                    description: "",
                    base_price: "",
                  });
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Create failed");
                }
              }}
            >
              Create
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Product variants</h2>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Product</span>
              <select
                value={selectedProductId ?? ""}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  setSelectedProductId(id);
                  setVariantDraft((d) => ({ ...d, product_id: id }));
                  setVariantImageDraft((d) => ({ ...d, variant_id: null }));
                }}
              >
                <option value="">Select product to manage variants</option>
                {items.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} · {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>SKU</span>
              <input
                value={variantDraft.sku}
                onChange={(e) =>
                  setVariantDraft((d) => ({ ...d, sku: e.target.value }))
                }
                placeholder="SKU code"
              />
            </label>

            <label className={styles.field}>
              <span>Price</span>
              <input
                value={variantDraft.price}
                onChange={(e) =>
                  setVariantDraft((d) => ({ ...d, price: e.target.value }))
                }
                placeholder="e.g. 59.99"
                inputMode="decimal"
              />
            </label>

            <label className={styles.field}>
              <span>Stock</span>
              <input
                value={variantDraft.stock}
                onChange={(e) =>
                  setVariantDraft((d) => ({ ...d, stock: e.target.value }))
                }
                placeholder="e.g. 10"
                inputMode="numeric"
              />
            </label>

            <label className={styles.fieldWide}>
              <span>Attribute value IDs</span>
              <input
                value={variantDraft.attribute_value_ids}
                onChange={(e) =>
                  setVariantDraft((d) => ({
                    ...d,
                    attribute_value_ids: e.target.value,
                  }))
                }
                placeholder="Comma-separated IDs (e.g. 1,5,9)"
              />
            </label>
          </div>

          <div className={styles.actionsRow}>
            <button
              className={styles.primaryBtn}
              type="button"
              disabled={
                !variantDraft.product_id ||
                !variantDraft.sku.trim() ||
                !variantDraft.price.trim() ||
                !variantDraft.stock.trim() ||
                !variantDraft.attribute_value_ids.trim()
              }
              onClick={async () => {
                if (!variantDraft.product_id) return;
                setError(null);
                try {
                  const attributeIds = variantDraft.attribute_value_ids
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean)
                    .map((x) => Number(x));
                  const created = await createVariant({
                    product_id: variantDraft.product_id,
                    sku: variantDraft.sku.trim(),
                    price: Number(variantDraft.price),
                    stock: Number(variantDraft.stock),
                    attribute_value_ids: attributeIds,
                  });
                  setVariants((prev) => [created, ...prev]);
                  setVariantDraft({
                    product_id: variantDraft.product_id,
                    sku: "",
                    price: "",
                    stock: "",
                    attribute_value_ids: "",
                  });
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Failed to create variant");
                }
              }}
            >
              Create variant
            </button>
          </div>

          {selectedProductId && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Images</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id}>
                      <td className={styles.mono}>{v.id}</td>
                      <td>{v.sku}</td>
                      <td className={styles.mono}>{v.price}</td>
                      <td className={styles.mono}>{v.stock}</td>
                      <td>
                        <ul className={styles.imageList}>
                          {(variantImages[v.id] ?? []).map((img) => (
                            <li key={img.id} className={styles.imageListItem}>
                              <span className={styles.mono}>
                                {img.image_order ?? "-"}
                              </span>
                              <span className={styles.imageUrl}>{img.image_link}</span>
                              <button
                                className={styles.dangerBtn}
                                type="button"
                                onClick={async () => {
                                  setError(null);
                                  try {
                                    await deleteVariantImage(img.id);
                                    setVariantImages((prev) => ({
                                      ...prev,
                                      [v.id]: (prev[v.id] ?? []).filter(
                                        (x) => x.id !== img.id,
                                      ),
                                    }));
                                  } catch (e) {
                                    setError(
                                      e instanceof Error
                                        ? e.message
                                        : "Failed to delete image",
                                    );
                                  }
                                }}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className={styles.rowActions}>
                        <button
                          className={styles.dangerBtn}
                          type="button"
                          onClick={async () => {
                            const ok = confirm(
                              `Delete variant #${v.id} for product #${v.product_id}?`,
                            );
                            if (!ok) return;
                            setError(null);
                            try {
                              await deleteVariant(v.id);
                              setVariants((prev) => prev.filter((x) => x.id !== v.id));
                              setVariantImages((prev) => {
                                const clone = { ...prev };
                                delete clone[v.id];
                                return clone;
                              });
                            } catch (e) {
                              setError(
                                e instanceof Error ? e.message : "Failed to delete variant",
                              );
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedProductId && (
            <>
              <h3 className={styles.subTitle}>Add image to variant</h3>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Variant</span>
                  <select
                    value={variantImageDraft.variant_id ?? ""}
                    onChange={(e) => {
                      const id = e.target.value ? Number(e.target.value) : null;
                      setVariantImageDraft((d) => ({ ...d, variant_id: id }));
                    }}
                  >
                    <option value="">Select variant</option>
                    {variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        #{v.id} · {v.sku}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.fieldWide}>
                  <span>Image URL</span>
                  <input
                    value={variantImageDraft.image_link}
                    onChange={(e) =>
                      setVariantImageDraft((d) => ({
                        ...d,
                        image_link: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                </label>

                <label className={styles.field}>
                  <span>Order</span>
                  <input
                    value={variantImageDraft.image_order}
                    onChange={(e) =>
                      setVariantImageDraft((d) => ({
                        ...d,
                        image_order: e.target.value,
                      }))
                    }
                    placeholder="1, 2, 3..."
                    inputMode="numeric"
                  />
                </label>
              </div>

              <div className={styles.actionsRow}>
                <button
                  className={styles.primaryBtn}
                  type="button"
                  disabled={
                    !variantImageDraft.variant_id ||
                    !variantImageDraft.image_link.trim()
                  }
                  onClick={async () => {
                    if (!variantImageDraft.variant_id) return;
                    setError(null);
                    try {
                      const created = await createVariantImage({
                        variant_id: variantImageDraft.variant_id,
                        image_link: variantImageDraft.image_link.trim(),
                        image_order: variantImageDraft.image_order
                          ? Number(variantImageDraft.image_order)
                          : undefined,
                      });
                      setVariantImages((prev) => ({
                        ...prev,
                        [created.variant_id]: [
                          ...(prev[created.variant_id] ?? []),
                          created,
                        ],
                      }));
                      setVariantImageDraft({
                        variant_id: variantImageDraft.variant_id,
                        image_link: "",
                        image_order: "",
                      });
                    } catch (e) {
                      setError(
                        e instanceof Error ? e.message : "Failed to add image",
                      );
                    }
                  }}
                >
                  Add image
                </button>
              </div>
            </>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Products</h2>
          {isLoading ? (
            <div className={styles.muted}>Loading…</div>
          ) : items.length === 0 ? (
            <div className={styles.muted}>No products yet.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Category</th>
                    <th>Base price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => {
                    const isEditing = editingId === p.id;
                    return (
                      <tr key={p.id}>
                        <td className={styles.mono}>{p.id}</td>
                        <td>
                          {isEditing ? (
                            <input
                              value={editDraft?.name ?? ""}
                              onChange={(e) =>
                                setEditDraft((d) =>
                                  d ? { ...d, name: e.target.value } : d,
                                )
                              }
                            />
                          ) : (
                            p.name
                          )}
                        </td>
                        <td className={styles.mono}>
                          {isEditing ? (
                            <input
                              value={editDraft?.slug ?? ""}
                              onChange={(e) =>
                                setEditDraft((d) =>
                                  d ? { ...d, slug: e.target.value } : d,
                                )
                              }
                            />
                          ) : (
                            p.slug
                          )}
                        </td>
                        <td className={styles.mono}>
                          {isEditing ? (
                            <input
                              value={editDraft?.category_id ?? ""}
                              onChange={(e) =>
                                setEditDraft((d) =>
                                  d ? { ...d, category_id: e.target.value } : d,
                                )
                              }
                              inputMode="numeric"
                            />
                          ) : (
                            p.category_id ?? "-"
                          )}
                        </td>
                        <td className={styles.mono}>
                          {isEditing ? (
                            <input
                              value={editDraft?.base_price ?? ""}
                              onChange={(e) =>
                                setEditDraft((d) =>
                                  d ? { ...d, base_price: e.target.value } : d,
                                )
                              }
                              inputMode="decimal"
                            />
                          ) : (
                            p.base_price
                          )}
                        </td>
                        <td className={styles.rowActions}>
                          {isEditing ? (
                            <>
                              <button
                                className={styles.primaryBtn}
                                type="button"
                                onClick={async () => {
                                  if (!editDraft) return;
                                  setError(null);
                                  try {
                                    const updated = await updateProduct(p.id, {
                                      category_id: Number(editDraft.category_id),
                                      name: editDraft.name.trim(),
                                      slug: editDraft.slug.trim(),
                                      description: editDraft.description.trim() || null,
                                      base_price: Number(editDraft.base_price),
                                    });
                                    setItems((prev) =>
                                      prev.map((x) => (x.id === p.id ? updated : x)),
                                    );
                                    setEditingId(null);
                                    setEditDraft(null);
                                  } catch (e) {
                                    setError(e instanceof Error ? e.message : "Update failed");
                                  }
                                }}
                              >
                                Save
                              </button>
                              <button
                                className={styles.secondaryBtn}
                                type="button"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditDraft(null);
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className={styles.secondaryBtn}
                                type="button"
                                onClick={() => {
                                  setEditingId(p.id);
                                  setEditDraft({
                                    category_id: String(p.category_id ?? ""),
                                    name: p.name ?? "",
                                    slug: p.slug ?? "",
                                    description: p.description ?? "",
                                    base_price: String(p.base_price ?? ""),
                                  });
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className={styles.dangerBtn}
                                type="button"
                                onClick={async () => {
                                  const ok = confirm(
                                    `Delete product #${p.id} (“${p.name}”)?`,
                                  );
                                  if (!ok) return;
                                  setError(null);
                                  try {
                                    await deleteProduct(p.id);
                                    setItems((prev) => prev.filter((x) => x.id !== p.id));
                                  } catch (e) {
                                    setError(e instanceof Error ? e.message : "Delete failed");
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

