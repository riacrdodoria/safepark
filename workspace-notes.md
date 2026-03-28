# Workspace Notes

- `drizzle.config.ts` requires `DATABASE_URL` in the environment.
- Production migrations should be handled by the deployment workflow.
- In development, use `pnpm --filter @workspace/db run push` and fallback to `pnpm --filter @workspace/db run push-force` when needed.
