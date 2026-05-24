import { redirect } from 'next/navigation'

import { products } from '@/lib/products'

import { isAdminAuthenticated, logoutAdmin, saveProduct } from '../actions'
import ProductCmsClient from './ProductCmsClient'

export default async function AdminProductsPage() {
  if (!await isAdminAuthenticated()) {
    redirect('/admin/login')
  }

  return <ProductCmsClient products={products} onSave={saveProduct} onLogout={logoutAdmin} />
}
