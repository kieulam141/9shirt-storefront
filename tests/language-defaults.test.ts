import assert from 'node:assert/strict'
import { register } from 'node:module'
import test from 'node:test'

register(
  `data:text/javascript,${encodeURIComponent(`
    import { pathToFileURL } from 'node:url'

    export async function resolve(specifier, context, nextResolve) {
      if (specifier.startsWith('@/')) {
        return {
          url: pathToFileURL(process.cwd() + '/' + specifier.slice(2) + '.ts').href,
          shortCircuit: true,
        }
      }

      return nextResolve(specifier, context)
    }
  `)}`,
  import.meta.url,
)

const { getDefaultLangForHost, getLangFromSearchParams, isVietnameseDefaultHost } = await import('../lib/seo.ts')

test('9shirt domains default to Vietnamese', () => {
  assert.equal(isVietnameseDefaultHost('9shirt.vn'), true)
  assert.equal(isVietnameseDefaultHost('www.9shirt.com'), true)
  assert.equal(getDefaultLangForHost('9shirt.store'), 'vi')
})

test('non-9shirt domains keep English as default', () => {
  assert.equal(isVietnameseDefaultHost('hiwaii.store'), false)
  assert.equal(getDefaultLangForHost('www.hiwaii.store'), 'en')
})

test('explicit lang query overrides host default', () => {
  assert.equal(getLangFromSearchParams({}, '9shirt.vn'), 'vi')
  assert.equal(getLangFromSearchParams({ lang: 'en' }, '9shirt.vn'), 'en')
  assert.equal(getLangFromSearchParams({ lang: 'vi' }, 'hiwaii.store'), 'vi')
})
