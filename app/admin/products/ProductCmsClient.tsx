'use client'

import Image from 'next/image'
import { LogOut, Save, Search } from 'lucide-react'
import { useMemo, useState, useTransition } from 'react'

import type { Niche, Product, SubNiche } from '@/lib/catalog/types'
import { formatPrice } from '@/lib/pricing'

import {
  cloneProduct,
  reconcileSavedProduct,
  updateProductField,
  type EditableProduct,
} from './product-form'

type SaveResult = {
  ok: boolean
  errors: string[]
}

type ProductCmsClientProps = {
  products: Product[]
  onSave: (product: Product) => Promise<SaveResult>
  onLogout: () => Promise<void>
}

type JsonField = 'media' | 'variants' | 'specifications'
type JsonEditorState = Record<JsonField, string>
type JsonErrorState = Partial<Record<JsonField, string>>
type StatusMessage = {
  tone: 'success' | 'error'
  text: string
} | null

const BADGE_OPTIONS: NonNullable<Product['badge']>[] = ['Best seller', 'Trending', 'Premium Edition']
const NICHE_OPTIONS: Niche[] = ['Sports', 'Animal', 'Art & Music', 'Vintage']
const SUB_NICHE_OPTIONS: Record<Niche, SubNiche[]> = {
  Sports: ['Football'],
  Animal: ['Cat', 'Dog', 'Lion', 'Tiger'],
  'Art & Music': ['Piano', 'Photography'],
  Vintage: ['Train'],
}

const EMPTY_PRODUCT: Product = {
  id: '',
  slug: '',
  name: 'Untitled product',
  price: 0,
  hook: '',
  description: '',
  productType: 'Hawaiian Shirt',
  niche: 'Sports',
  subNiche: 'Football',
  thumbnail: '',
  images: [],
  media: [],
  sizes: [],
  materials: [],
  variants: [],
  specifications: [],
}

function formatJsonField(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function getJsonEditorState(product: Product): JsonEditorState {
  return {
    media: formatJsonField(product.media),
    variants: formatJsonField(product.variants),
    specifications: formatJsonField(product.specifications),
  }
}

function getJsonParseError(value: string): string | undefined {
  try {
    const parsed = JSON.parse(value)

    return Array.isArray(parsed) ? undefined : 'JSON must be an array.'
  } catch (error) {
    return error instanceof Error ? error.message : 'Invalid JSON.'
  }
}

function getPriceInputError(value: string): string | undefined {
  const trimmedValue = value.trim()

  if (!trimmedValue) return 'Enter a product price.'

  const parsedPrice = Number(trimmedValue)

  if (!Number.isFinite(parsedPrice)) return 'Enter a valid product price.'
  if (parsedPrice < 0) return 'Price cannot be negative.'

  return undefined
}

export default function ProductCmsClient({ products: initialProducts, onSave, onLogout }: ProductCmsClientProps) {
  const initialProduct = initialProducts[0] ?? EMPTY_PRODUCT

  const [productList, setProductList] = useState<Product[]>(() => initialProducts.map((product) => cloneProduct(product)))
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(initialProduct.id)
  const [draft, setDraft] = useState<EditableProduct>(() => cloneProduct(initialProduct))
  const [priceInput, setPriceInput] = useState(() => String(initialProduct.price))
  const [jsonText, setJsonText] = useState<JsonEditorState>(() => getJsonEditorState(initialProduct))
  const [jsonErrors, setJsonErrors] = useState<JsonErrorState>({})
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null)
  const [isSaving, startSaveTransition] = useTransition()
  const [isLoggingOut, startLogoutTransition] = useTransition()

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase()

    if (!needle) return productList

    return productList.filter((product) => (
      [
        product.id,
        product.name,
        product.slug,
        product.niche,
        product.subNiche,
        product.hook,
      ].join(' ').toLowerCase().includes(needle)
    ))
  }, [productList, query])

  const previewImage = draft.thumbnail || draft.media.find((item) => item.type === 'image')?.url
  const hasJsonErrors = Object.values(jsonErrors).some(Boolean)
  const priceError = getPriceInputError(priceInput)
  const selectedSubNiches = SUB_NICHE_OPTIONS[draft.niche]
  const previewPrice = Number.isFinite(draft.price) ? formatPrice(draft.price) : 'Invalid price'

  if (productList.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--hiwaii-bg)] px-6 py-10 text-[var(--hiwaii-text-primary)]">
        <div className="mx-auto max-w-4xl rounded-lg border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-6">
          <h1 className="text-3xl font-black uppercase text-white">Products</h1>
          <p className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
            No products are available in the catalog.
          </p>
        </div>
      </main>
    )
  }

  function selectProduct(product: Product): void {
    const nextDraft = cloneProduct(product)

    setSelectedId(product.id)
    setDraft(nextDraft)
    setPriceInput(String(nextDraft.price))
    setJsonText(getJsonEditorState(nextDraft))
    setJsonErrors({})
    setStatusMessage(null)
  }

  function updateDraft<K extends keyof EditableProduct>(key: K, value: EditableProduct[K]): void {
    setDraft((currentDraft) => updateProductField(currentDraft, key, value))
    setStatusMessage(null)
  }

  function updateNiche(nextNiche: Niche): void {
    setDraft((currentDraft) => {
      const allowedSubNiches = SUB_NICHE_OPTIONS[nextNiche]
      const nextSubNiche = allowedSubNiches.includes(currentDraft.subNiche)
        ? currentDraft.subNiche
        : allowedSubNiches[0]

      return { ...currentDraft, niche: nextNiche, subNiche: nextSubNiche }
    })
    setStatusMessage(null)
  }

  function updatePriceInput(value: string): void {
    setPriceInput(value)

    const error = getPriceInputError(value)

    if (!error) {
      setDraft((currentDraft) => updateProductField(currentDraft, 'price', Number(value.trim())))
    }

    setStatusMessage(null)
  }

  function updateJsonField(field: JsonField, value: string): void {
    setJsonText((current) => ({ ...current, [field]: value }))

    const error = getJsonParseError(value)
    setJsonErrors((current) => {
      const nextErrors = { ...current }

      if (error) {
        nextErrors[field] = error
      } else {
        delete nextErrors[field]
      }

      return nextErrors
    })

    if (!error) {
      const parsed = JSON.parse(value) as EditableProduct[JsonField]
      setDraft((currentDraft) => updateProductField(currentDraft, field, parsed))
    }

    setStatusMessage(null)
  }

  function saveDraft(): void {
    if (priceError || hasJsonErrors) {
      setStatusMessage({
        tone: 'error',
        text: priceError ? 'Fix the invalid price before saving.' : 'Fix the invalid JSON fields before saving.',
      })
      return
    }

    setStatusMessage(null)
    const draftToSave = cloneProduct(draft)
    startSaveTransition(async () => {
      const result = await onSave(draftToSave)

      if (result.ok) {
        setProductList((currentProducts) => reconcileSavedProduct(currentProducts, draftToSave))
        setStatusMessage({
          tone: 'success',
          text: 'Product saved. Deploy the storefront to publish catalog changes.',
        })
      } else {
        setStatusMessage({
          tone: 'error',
          text: result.errors.join('\n') || 'Unable to save product.',
        })
      }
    })
  }

  function logout(): void {
    startLogoutTransition(async () => {
      await onLogout()
    })
  }

  return (
    <main className="min-h-screen bg-[var(--hiwaii-bg)] p-4 text-[var(--hiwaii-text-primary)] sm:p-6">
      <div className="mx-auto grid max-w-[1440px] gap-4 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <aside className="hiwaii-glass rounded-lg border border-[var(--hiwaii-border)] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--hiwaii-accent)]">
                Hiwaii CMS
              </p>
              <h1 className="mt-1 text-3xl font-black uppercase leading-none text-white">
                Products
              </h1>
              <p className="mt-2 text-xs font-semibold text-[var(--hiwaii-text-muted)]">
                {productList.length} catalog items
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              aria-label="Log out of product CMS"
              className="flex size-10 items-center justify-center rounded-md border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface-soft)] text-[var(--hiwaii-text-secondary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 space-y-2">
            <label htmlFor="product-search" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              Search products
            </label>
            <div className="flex min-h-11 items-center gap-2 rounded-md border border-[var(--hiwaii-border)] bg-slate-950/40 px-3 focus-within:border-[var(--hiwaii-accent)] focus-within:ring-2 focus-within:ring-[var(--hiwaii-accent)]/25">
              <Search className="size-4 shrink-0 text-[var(--hiwaii-text-muted)]" aria-hidden="true" />
              <input
                id="product-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                className="w-full bg-transparent text-sm font-semibold text-white outline-none"
              />
            </div>
          </div>

          <nav aria-label="Products" className="mt-5 max-h-[68vh] space-y-2 overflow-y-auto pr-1">
            {filteredProducts.map((product) => {
              const isSelected = product.id === selectedId

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => selectProduct(product)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={[
                    'w-full rounded-md border p-3 text-left transition',
                    isSelected
                      ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)] text-white'
                      : 'border-[var(--hiwaii-border)] bg-slate-950/35 text-[var(--hiwaii-text-secondary)] hover:border-[var(--hiwaii-accent)] hover:text-white',
                  ].join(' ')}
                >
                  <span className="block text-sm font-extrabold leading-5">{product.name}</span>
                  <span className="mt-2 block text-xs font-semibold text-[var(--hiwaii-text-muted)]">
                    {product.niche} / {product.subNiche}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] text-[var(--hiwaii-text-muted)]">
                    {product.id}
                  </span>
                </button>
              )
            })}

            {filteredProducts.length === 0 && (
              <p className="rounded-md border border-[var(--hiwaii-border)] bg-slate-950/35 p-3 text-sm font-semibold text-[var(--hiwaii-text-muted)]">
                No matching products.
              </p>
            )}
          </nav>
        </aside>

        <section className="hiwaii-glass rounded-lg border border-[var(--hiwaii-border)] p-4 sm:p-5">
          <div className="flex flex-col gap-4 border-b border-[var(--hiwaii-border)] pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--hiwaii-accent)]">
                Edit product
              </p>
              <h2 className="mt-1 text-3xl font-black uppercase leading-tight text-white">
                {draft.name}
              </h2>
              <p className="mt-2 font-mono text-xs text-[var(--hiwaii-text-muted)]">
                /product/{draft.id}
              </p>
            </div>

            <button
              type="button"
              onClick={saveDraft}
              disabled={isSaving || Boolean(priceError) || hasJsonErrors}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--hiwaii-accent)] px-5 text-sm font-extrabold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-[var(--hiwaii-accent)]/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="size-4" aria-hidden="true" />
              {isSaving ? 'Saving' : 'Save'}
            </button>
          </div>

          {statusMessage && (
            <div
              role="status"
              className={[
                'mt-4 whitespace-pre-wrap rounded-md border px-4 py-3 text-sm font-semibold',
                statusMessage.tone === 'success'
                  ? 'border-[var(--hiwaii-accent)]/50 bg-[var(--hiwaii-accent-soft)] text-white'
                  : 'border-red-400/45 bg-red-500/10 text-red-100',
              ].join(' ')}
            >
              {statusMessage.text}
            </div>
          )}

          <form className="mt-5 space-y-6" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="product-name" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  Name
                </label>
                <input
                  id="product-name"
                  value={draft.name}
                  onChange={(event) => updateDraft('name', event.currentTarget.value)}
                  className="min-h-11 w-full rounded-md border border-[var(--hiwaii-border)] bg-slate-950/45 px-3 text-sm font-semibold text-white outline-none focus:border-[var(--hiwaii-accent)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]/25"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="product-slug" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  Slug
                </label>
                <input
                  id="product-slug"
                  value={draft.slug}
                  onChange={(event) => updateDraft('slug', event.currentTarget.value)}
                  className="min-h-11 w-full rounded-md border border-[var(--hiwaii-border)] bg-slate-950/45 px-3 font-mono text-sm text-white outline-none focus:border-[var(--hiwaii-accent)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]/25"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="product-price" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  Price
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceInput}
                  onChange={(event) => updatePriceInput(event.currentTarget.value)}
                  aria-invalid={Boolean(priceError)}
                  aria-describedby={priceError ? 'product-price-error' : undefined}
                  className="min-h-11 w-full rounded-md border border-[var(--hiwaii-border)] bg-slate-950/45 px-3 text-sm font-semibold text-white outline-none focus:border-[var(--hiwaii-accent)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]/25 aria-invalid:border-red-400 aria-invalid:focus:border-red-300 aria-invalid:focus:ring-red-400/25"
                />
                {priceError && (
                  <p id="product-price-error" className="text-xs font-semibold text-red-200">
                    {priceError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="product-badge" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  Badge
                </label>
                <select
                  id="product-badge"
                  value={draft.badge ?? ''}
                  onChange={(event) => updateDraft('badge', (event.currentTarget.value || undefined) as Product['badge'])}
                  className="min-h-11 w-full rounded-md border border-[var(--hiwaii-border)] bg-slate-950/45 px-3 text-sm font-semibold text-white outline-none focus:border-[var(--hiwaii-accent)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]/25"
                >
                  <option value="">No badge</option>
                  {BADGE_OPTIONS.map((badge) => (
                    <option key={badge} value={badge}>{badge}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="product-niche" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  Niche
                </label>
                <select
                  id="product-niche"
                  value={draft.niche}
                  onChange={(event) => updateNiche(event.currentTarget.value as Niche)}
                  className="min-h-11 w-full rounded-md border border-[var(--hiwaii-border)] bg-slate-950/45 px-3 text-sm font-semibold text-white outline-none focus:border-[var(--hiwaii-accent)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]/25"
                >
                  {NICHE_OPTIONS.map((niche) => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="product-sub-niche" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  Sub-niche
                </label>
                <select
                  id="product-sub-niche"
                  value={draft.subNiche}
                  onChange={(event) => updateDraft('subNiche', event.currentTarget.value as SubNiche)}
                  className="min-h-11 w-full rounded-md border border-[var(--hiwaii-border)] bg-slate-950/45 px-3 text-sm font-semibold text-white outline-none focus:border-[var(--hiwaii-accent)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]/25"
                >
                  {selectedSubNiches.map((subNiche) => (
                    <option key={subNiche} value={subNiche}>{subNiche}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="product-hook" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  Hook
                </label>
                <textarea
                  id="product-hook"
                  value={draft.hook}
                  onChange={(event) => updateDraft('hook', event.currentTarget.value)}
                  className="min-h-24 w-full rounded-md border border-[var(--hiwaii-border)] bg-slate-950/45 p-3 text-sm font-semibold leading-6 text-white outline-none focus:border-[var(--hiwaii-accent)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]/25"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="product-description" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  Description
                </label>
                <textarea
                  id="product-description"
                  value={draft.description}
                  onChange={(event) => updateDraft('description', event.currentTarget.value)}
                  className="min-h-24 w-full rounded-md border border-[var(--hiwaii-border)] bg-slate-950/45 p-3 text-sm font-semibold leading-6 text-white outline-none focus:border-[var(--hiwaii-accent)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]/25"
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {(['media', 'variants', 'specifications'] as const).map((field) => {
                const error = jsonErrors[field]
                const fieldId = `product-${field}`
                const errorId = `${fieldId}-error`

                return (
                  <div key={field} className="space-y-2">
                    <label htmlFor={fieldId} className="text-sm font-semibold capitalize text-[var(--hiwaii-text-secondary)]">
                      {field} JSON
                    </label>
                    <textarea
                      id={fieldId}
                      value={jsonText[field]}
                      onChange={(event) => updateJsonField(field, event.currentTarget.value)}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? errorId : undefined}
                      spellCheck={false}
                      className="min-h-72 w-full resize-y rounded-md border border-[var(--hiwaii-border)] bg-slate-950/60 p-3 font-mono text-xs leading-5 text-white outline-none focus:border-[var(--hiwaii-accent)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]/25 aria-invalid:border-red-400 aria-invalid:focus:border-red-300 aria-invalid:focus:ring-red-400/25"
                    />
                    {error && (
                      <p id={errorId} className="text-xs font-semibold text-red-200">
                        {error}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </form>
        </section>

        <aside className="hiwaii-glass rounded-lg border border-[var(--hiwaii-border)] p-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--hiwaii-accent)]">
            Preview
          </h2>

          <div className="relative mt-4 aspect-square overflow-hidden rounded-lg border border-[var(--hiwaii-border)] bg-slate-950/50">
            {previewImage ? (
              <Image
                src={previewImage}
                alt={`${draft.name} product preview`}
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 320px, 100vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-[var(--hiwaii-text-muted)]">
                No image available
              </div>
            )}
          </div>

          <div className="mt-4 rounded-md border border-[var(--hiwaii-border)] bg-slate-950/35 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--hiwaii-text-muted)]">
              Storefront price
            </p>
            <p className="mt-1 text-3xl font-black text-white">
              {previewPrice}
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              {draft.badge ?? 'No merchandising badge'}
            </p>
          </div>

          <div className="mt-4 rounded-md border border-[var(--hiwaii-border)] bg-slate-950/35 p-4">
            <h3 className="text-lg font-black uppercase text-white">SEO preview</h3>
            <p className="mt-3 text-sm font-bold text-[#8ab4f8]">
              {draft.name} | Hiwaii
            </p>
            <p className="mt-1 break-all font-mono text-xs text-emerald-200">
              hiwaii.store/product/{draft.id}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--hiwaii-text-secondary)]">
              {draft.description}
            </p>
          </div>

          <div className="mt-4 rounded-md border border-[var(--hiwaii-border)] bg-slate-950/35 p-4">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-white">
              Catalog checks
            </h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[var(--hiwaii-text-muted)]">Media</dt>
                <dd className="font-bold text-white">{draft.media.length}</dd>
              </div>
              <div>
                <dt className="text-[var(--hiwaii-text-muted)]">Variants</dt>
                <dd className="font-bold text-white">{draft.variants.length}</dd>
              </div>
              <div>
                <dt className="text-[var(--hiwaii-text-muted)]">Specs</dt>
                <dd className="font-bold text-white">{draft.specifications.length}</dd>
              </div>
              <div>
                <dt className="text-[var(--hiwaii-text-muted)]">JSON</dt>
                <dd className={hasJsonErrors ? 'font-bold text-red-200' : 'font-bold text-[var(--hiwaii-accent)]'}>
                  {hasJsonErrors ? 'Fix' : 'Valid'}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  )
}
