## Filtering flow (Frontend → Backend → DB) — end-to-end

Цей файл описує **повний** флоу фільтрації в проєкті: від кліку по чекбоксу на фронті до SQL в Postgres і назад до UI.

---

### 1) Концепція: URL = source of truth

У нас **немає локального стану** “які фільтри вибрані” (крім open/close акордіона/модалки).

Замість цього:

- **Вибрані фільтри живуть в URL query params** (`?color=white&size=m&fabric=wool`).
- UI “checked/unchecked” для кожного чекбоксу обчислюється з `useSearchParams()`.
- При кліку по фільтру ми **тільки міняємо URL** (`router.push(...)`), а дані (products + facets) перезавантажуються автоматично, бо залежать від URL.

---

### 2) Формат query params

#### Multi (можна багато)
- `color=white&color=black`
- `size=s&size=m`
- `fabric=wool&fabric=cotton`  ← **fabric == materials.name** (product-level)

#### Single (тільки одне)
- `sortby=price_low_high`
- `collection=in_stock` (або `out_stock`)

#### Pagination
- `page=1&limit=5` (зараз використовується саме це на фронті)

---

### 3) Frontend — які файли та функції за що відповідають

#### 3.1 `ProductFilters` — UI + зміна URL
Файл: `frontend/src/widgets/product-filters/ui/ProductFilters.tsx`

Роль:
- Рендерить фільтри (SortBy / Size / Color / Collection / Fabric).
- **Не викликає API** для продуктів/фасетів.
- При кліку міняє query params у URL.

Ключові хелпери в `ProductFilters.tsx`:
- **`normalizeParam(v)`**: `trim().toLowerCase()` — щоб URL і порівняння `checked` були стабільні.
- **`pushParams(params)`**: робить `router.push(...)`, причому без зайвого `?`, якщо параметри порожні.
- **`isMultiChecked(key, value)`**:
  - `searchParams.getAll(key).includes(normalizeParam(value))`
  - використовується для multi (`color/size/fabric`).
- **`isSingleChecked(key, value)`**:
  - `searchParams.get(key) === normalizeParam(value)`
  - використовується для single (`sortby/collection`).
- **`toggleMulti(key, value)`**:
  - якщо значення вже вибране → прибирає тільки це значення:
    - `getAll → filter → delete(key) → append назад`
  - якщо не вибране → `append(key, value)`
  - потім `pushParams`.
- **`setSingle(key, value)`**:
  - якщо натиснули те саме значення вдруге → `delete(key)` (toggle off)
  - інакше → `set(key, value)`
  - потім `pushParams`.

Акордіон:
- Компонент `Section` тримає `open` і анімує висоту через `scrollHeight` (`height: 0 → height: Npx`).
- CSS: `ProductFilters.module.scss` (`.sectionBodyOuter` з `transition: height`).

Модалка (mobile):
- `ProductFilters` приймає `onClose?: () => void`
- Якщо `onClose` передали — показує кнопку з SVG-хрестиком.

Props `ProductFilters`:
- `colors/sizes/fabric: FilterFacetItem[]`, де `FilterFacetItem = { value: string; count: number }`
- `isFacetsLoading?: boolean` — щоб disable-ити чекбокси під час оновлення facets.

---

#### 3.2 `ProductsPageClient` — хедер/футер + модалка + facets fetch
Файл: `frontend/src/widgets/products/ui/ProductsPageClient.tsx`

Роль:
- Відмальовує **Header + Footer** на сторінці продуктів.
- Відмальовує layout: sidebar filters (desktop) + button+modal (mobile) + products list.
- Тягне facets із бекенду:
  - викликає **`getFilterFacets(searchParams.toString())`**
  - зберігає `facets` у state і передає в `ProductFilters`.

Ключові змінні:
- `searchString = useSearchParams().toString()` — поточний query.
- `loadedKey` + `isLoading = loadedKey !== searchString` — індикатор, чи facets вже підвантажились для поточного URL.

UI логіка (mobile modal):
- `isFiltersOpen` (state) відкриває overlay.
- overlay кліком закривається.
- `ProductFilters` отримує `onClose` для кнопки-хрестика.

---

#### 3.3 `ProductsPage` — серверний контейнер
Файл: `frontend/src/widgets/products/ui/ProductsPage.tsx`

Роль:
- Просто рендерить `ProductsPageClient`.
- Не робить fetch атрибутів напряму.

---

#### 3.4 `ProductsList` — fetch products на кожну зміну URL
Файл: `frontend/src/widgets/products/ui/ProductsList.tsx`

Роль:
- Витягує query з URL: `useSearchParams()`.
- Формує `qs = new URLSearchParams(searchString)`, додає `page/limit`.
- Викликає **`getProductsByQuery(qs.toString())`**.
- Рендерить grid з товарами + пагінацію.

Loading логіка:
- `requestKey = ${searchString}|limit=${limit}|page=${page}`
- `loadedKey` зберігає, який request вже завершився
- `isLoading = loadedKey !== requestKey`

Чому так:
- eslint правило `react-hooks/set-state-in-effect` не дозволяє деякі патерни setState всередині effect.
- ми зробили loading derived-from-keys, а не `setIsLoading(true)` в effect.

---

#### 3.5 API layer — функції виклику бекенду
Файли:
- `frontend/src/entities/product/api/products.ts`
- `frontend/src/entities/product/api/index.ts`
- `frontend/src/entities/product/types.ts`

Типи:
- `FilterFacetItem` / `FilterFacetsResponse` в `entities/product/types.ts`.

Функції:
- **`getProductsByQuery(queryString, signal?)`**
  - робить `fetch(http://localhost:4000/products?${queryString})`
  - нормалізує `products` (ціни/картинки) і повертає `ProductsListResponse`.
- **`getFilterFacets(queryString, signal?)`**
  - робить `fetch(http://localhost:4000/filters?${queryString})`
  - повертає `{ facets: {color,size,fabric}, selected }`.
- **`getProducts(limit, page, signal?)`**
  - thin-wrapper: викликає `getProductsByQuery(limit/page)` для backward compatibility.

---

### 4) Backend — endpoints, парсинг query, SQL і репозиторії

#### 4.1 Entry points (Express routes)
Файл: `backend/server.js`
- `app.use("/products", productRouter)`
- `app.use("/filters", filtersRouter)`

Файл: `backend/routes/filters.routes.js`
- `GET /filters` → `getFacets`
- `GET /filters/fabric` → legacy список матеріалів

Файл: `backend/routes/product.routes.js`
- `GET /products` → `getAllProducts`

---

#### 4.2 Query parsing (одне місце)
Файл: `backend/utils/filters.js`

Функція: **`parseProductFilters(req.query)`**
- `color/size/fabric` → масиви (multi), нормалізовані в lower-case.
- `sortby/collection` → string або null.
- `limit/page/offset` → числа з default і cap.

Функція: **`sortByToOrderBy(sortBy)`**
- Whitelist мапа `sortby` → `ORDER BY ...`
- важливо: **ніколи** не підставляти сирий query напряму в SQL.

---

#### 4.3 `/products` controller
Файл: `backend/controllers/product.controller.js`

Функція: **`getAllProducts(req, res)`**
- `filters = parseProductFilters(req.query)`
- якщо немає жодних фільтрів/сортування → викликає `getAllProductsRepository(limit, offset)` (старий список).
- якщо є → викликає **`getFilteredProductsRepository(filters)`**.

---

#### 4.4 `/products` repository (SQL)
Файл: `backend/repositories/product.repository.js`

Функція: **`getFilteredProductsRepository(filters)`**
- Головна ідея: зібрати `filtered_variants` через CTE, щоб:
  - уникнути row explosion
  - коректно рахувати агрегації по відфільтрованих варіантах

Фільтри:
- `color/size` (variant-level) — через `EXISTS` по:
  - `variant_attribute_values → attribute_values → attributes` (`a.code = 'color'/'size'`).
- `collection` — зараз реалізовано через stock (in_stock/out_stock) на variants.
- **`fabric` (product-level)** — реалізовано через `products.material_id`:
  - `LEFT JOIN ecommerce.materials mat_filter ON mat_filter.id = p.material_id`
  - `lower(trim(mat_filter.name)) = ANY($3::text[])`

Результат:
- агрегований список продуктів (як і раніше), але з урахуванням вибраних filters.

---

#### 4.5 `/filters` controller + repository
Файл: `backend/controllers/filters.controller.js`
- `getFacets(req, res)`:
  - `filters = parseProductFilters(req.query)`
  - `rows = await getFacetsRepository(filters)`
  - групує rows в:
    - `facets.color[]`, `facets.size[]`, `facets.fabric[]`

Файл: `backend/repositories/filters.repository.js`
- **`getFacetsRepository({colors,sizes,fabric})`**:
  - будує CTE `filtered_variants` (приблизно як в /products, але легше)
  - повертає facet values + counts:
    - `color/size` — з attributes tables
    - `fabric` — з `materials` через `products.material_id`
  - `count` = `COUNT(DISTINCT product_id)` (скільки продуктів мають це значення в поточному наборі)

Legacy:
- `GET /filters/fabric` → `getAllFabricRepository()` повертає список `materials.name`.

---

### 5) DB layer — таблиці, які реально використовуються

#### 5.1 Variant-level facets (color/size)
- `ecommerce.product_variants` (pv)
- `ecommerce.variant_attribute_values` (vav) — link table variant ↔ attribute_value
- `ecommerce.attribute_values` (av) — значення (наприклад “White”, “M”)
- `ecommerce.attributes` (a) — опис атрибуту (`code = 'color' | 'size'`)

#### 5.2 Product-level “fabric”
- `ecommerce.products` (p) — має `material_id`
- `ecommerce.materials` (mat) — має `id, name, description`
- У URL воно називається `fabric`, але в БД це **materials**.

---

### 6) “Що стається при кліку” — покроково

Приклад: користувач клікає `Color = White`.

1) `ProductFilters` викликає `toggleMulti('color', 'White')`.\n
2) `toggleMulti` створює `URLSearchParams` з `useSearchParams().toString()`.\n
3) Якщо `color=white` вже є → видаляє; якщо нема → `append('color','white')`.\n
4) `pushParams` робить `router.push('/products?...')`.\n
5) URL змінився → `ProductsList` бачить новий `searchParams`:\n
   - формує `qs` + `page/limit`\n
   - викликає `getProductsByQuery(qs)`.\n
6) Паралельно `ProductsPageClient` бачить новий `searchParams`:\n
   - викликає `getFilterFacets(searchParams.toString())`.\n
7) Backend `/products`:\n
   - парсить query (`parseProductFilters`)\n
   - викликає `getFilteredProductsRepository` → SQL → Postgres.\n
8) Backend `/filters`:\n
   - парсить query (`parseProductFilters`)\n
   - викликає `getFacetsRepository` → SQL → Postgres.\n
9) Frontend оновлює:\n
   - grid продуктів\n
   - counts/опції facets\n
   - checked стани (бо вони залежать від URL)\n

---

### 7) Часті проблеми/пастки (і як ми їх обійшли)
- `URLSearchParams.delete(key, value)` не існує → треба `getAll → filter → delete(key) → append`.\n
- “checked” не треба тримати в локальному state → це призводить до розсинхрону; ми читаємо з URL.\n
- `fabric` не з’являвся, бо ми спочатку шукали `a.code='fabric'` (attributes), а треба було `materials`.\n
- row explosion в SQL від багатьох join-ів → використовуємо CTE + `EXISTS`.\n

---

### 8) Де що дивитись швидко
- Фільтри/URL-логіка: `frontend/src/widgets/product-filters/ui/ProductFilters.tsx`\n
- Fetch facets: `frontend/src/widgets/products/ui/ProductsPageClient.tsx`\n
- Fetch products: `frontend/src/widgets/products/ui/ProductsList.tsx`\n
- API: `frontend/src/entities/product/api/products.ts`\n
- Парсинг query (backend): `backend/utils/filters.js`\n
- SQL products: `backend/repositories/product.repository.js` (`getFilteredProductsRepository`)\n
- SQL facets: `backend/repositories/filters.repository.js` (`getFacetsRepository`)\n

