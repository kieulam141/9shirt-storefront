# 9Shirt Deployment

This repository deploys to Vercel through the manual GitHub Actions workflow
`Deploy 9Shirt to Vercel`.

Required GitHub repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Manual deploy flow:

1. Open the GitHub repository.
2. Go to `Actions`.
3. Select `Deploy 9Shirt to Vercel`.
4. Click `Run workflow`.
5. Choose `production` or `preview`.

The workflow installs dependencies with pnpm, runs tests, pulls Vercel project
settings, builds with Vercel, then deploys the prebuilt output.
