'use client'

import React from 'react'
import { ProductSpec } from '@/lib/products'

interface ProductSpecsProps {
  specifications: ProductSpec[]
  fitGuide: string
  careInstructions: string
}

export function ProductSpecs({ specifications, fitGuide, careInstructions }: ProductSpecsProps) {
  const tabs = [
    { label: 'Specifications', id: 'specs' },
    { label: 'Fit Guide', id: 'fit' },
    { label: 'Care Instructions', id: 'care' },
  ]

  const [activeTab, setActiveTab] = React.useState<'specs' | 'fit' | 'care'>('specs')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'specs' | 'fit' | 'care')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'specs' && (
          <div className="grid sm:grid-cols-2 gap-6">
            {specifications.map((spec, index) => (
              <div key={index}>
                <p className="text-slate-400 text-sm mb-2">{spec.label}</p>
                <p className="text-white font-medium">{spec.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'fit' && (
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">{fitGuide}</p>
            <div className="mt-6 bg-slate-800 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">Size Chart</h4>
              <div className="text-slate-300 text-sm space-y-2">
                <p>Check our detailed size chart in the images section to find your perfect fit.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">{careInstructions}</p>
            <div className="mt-6 bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
              <p className="text-orange-300 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Proper care will extend the life of your 3D printed shirt. Avoid high heat and direct sunlight on the print.</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
