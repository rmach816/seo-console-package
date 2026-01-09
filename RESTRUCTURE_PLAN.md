# Restructuring Plan: Standalone App → NPM Package

## Current State
- Full Next.js app in root directory
- All code mixed together (app, components, lib, etc.)

## Target State
- `packages/seo-console/` - The installable npm package
- `apps/demo/` - Example Next.js app showing package usage

## Migration Steps

### Phase 1: Create Package Structure ✅
- [x] Create `packages/seo-console/` directory
- [x] Create `packages/seo-console/package.json`
- [x] Create `packages/seo-console/tsconfig.json`
- [x] Create `packages/seo-console/tsup.config.ts`

### Phase 2: Move Core Library Code
- [ ] Move `lib/validation/` → `packages/seo-console/src/lib/validation/`
- [ ] Move `lib/database/` → `packages/seo-console/src/lib/database/`
- [ ] Move `lib/supabase/` → `packages/seo-console/src/lib/supabase/`
- [ ] Move `lib/utils.ts` → `packages/seo-console/src/lib/utils.ts`
- [ ] Move `types/database.types.ts` → `packages/seo-console/src/types/database.types.ts`

### Phase 3: Move Hooks
- [ ] Move `lib/hooks/useGenerateMetadata.ts` → `packages/seo-console/src/hooks/useGenerateMetadata.ts`
- [ ] Create `packages/seo-console/src/hooks/index.ts`

### Phase 4: Move Components
- [ ] Move `components/seo/` → `packages/seo-console/src/components/seo/`
- [ ] Move `components/ui/` → `packages/seo-console/src/components/ui/`
- [ ] Create `packages/seo-console/src/components/index.ts`

### Phase 5: Create Package Entry Points
- [ ] Create `packages/seo-console/src/index.ts` (main export)
- [ ] Export all public APIs

### Phase 6: Create Demo App
- [ ] Create `apps/demo/` Next.js app
- [ ] Install package locally
- [ ] Show usage examples

### Phase 7: Update Root
- [ ] Update root `package.json` for monorepo
- [ ] Add workspace configuration
- [ ] Update scripts

### Phase 8: Migrations
- [ ] Move `supabase/migrations/` → `packages/seo-console/migrations/`
- [ ] Update documentation

## Files to Keep in Root
- `.gitignore`
- `README.md` (monorepo overview)
- `package.json` (workspace root)
- `.cursor/rules.md`
- `PROJECT_GUIDE.md`
- `eslint.config.mjs`
- `tsconfig.json` (workspace config)

## Files to Move to Package
- All `lib/` code
- All `components/` code
- All `types/` code
- `supabase/migrations/`

## Files to Move to Demo App
- `app/` directory (as example)
- `middleware.ts` (as example)
- `next.config.ts` (as example)
