import { register } from 'node:module'

register(
  `data:text/javascript,${encodeURIComponent(`
    import { existsSync, statSync } from 'node:fs'
    import { resolve as resolvePath } from 'node:path'
    import { pathToFileURL } from 'node:url'

    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs']

    function isFile(path) {
      return existsSync(path) && statSync(path).isFile()
    }

    function resolveAliasTarget(target) {
      for (const extension of extensions) {
        const candidate = target + extension
        if (isFile(candidate)) return candidate
      }

      if (existsSync(target) && statSync(target).isDirectory()) {
        for (const extension of extensions.slice(1)) {
          const candidate = resolvePath(target, 'index' + extension)
          if (isFile(candidate)) return candidate
        }
      }
    }

    export async function resolve(specifier, context, nextResolve) {
      if (specifier.startsWith('@/')) {
        const target = resolvePath(process.cwd(), specifier.slice(2))
        const resolved = resolveAliasTarget(target)

        if (resolved) {
          return {
            url: pathToFileURL(resolved).href,
            shortCircuit: true,
          }
        }
      }

      return nextResolve(specifier, context)
    }
  `)}`,
  import.meta.url,
)
