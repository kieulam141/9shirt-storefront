'use client'

import { createContext, createElement, useContext, type ReactNode } from 'react'

const BrandContext = createContext<boolean>(true)

export function BrandProvider({ children, isViHost }: { children: ReactNode; isViHost: boolean }) {
  return createElement(BrandContext.Provider, { value: isViHost }, children)
}

export function useIsViHost(): boolean {
  return useContext(BrandContext)
}
