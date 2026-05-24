import { register } from 'node:module'

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
