import { redirect } from 'next/navigation'

import { readCatalogFile } from '@/lib/catalog/storage'

import { isAdminAuthenticated, logoutAdmin, saveProduct } from '../actions'
import ProductCmsClient from './ProductCmsClient'

export default async function AdminProductsPage() {
  if (!await isAdminAuthenticated()) {
    redirect('/admin/login')
  }

  const products = await readCatalogFile()

  return <ProductCmsClient products={products} onSave={saveProduct} onLogout={logoutAdmin} />
}
