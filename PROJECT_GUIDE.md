I'll search for the latest information on Next.js, React best practices, and accessibility standards before generating the guide.

<search_quality_check>
I need to verify current versions and best practices for:
1. Latest Next.js version and features
2. Current React and accessibility best practices
3. WCAG accessibility standards
4. Supabase current practices
</search_quality_check>

<search>
latest Next.js version 2026
</search>

<search>
Next.js App Router best practices 2026 generateMetadata
</search>

<search>
React accessibility WCAG standards 2026
</search>

<search>
Supabase authentication best practices 2026
</search>

<search>
TypeScript Next.js package development best practices 2026
</search>

Based on my research, here's the comprehensive PROJECT_GUIDE.md:

# SEO Console Package - Project Guide

## Vision
A pragmatic, developer-focused SEO validation package that prevents structural SEO failures across Next.js sites by providing strict metadata validation, server-side verification, and seamless integration with Next.js App Router's `generateMetadata`. This eliminates common issues like broken OG images, duplicate titles, and missing canonicals before they reach production.

## Tech Stack
- **Next.js**: Latest App Router with React Server Components for optimal SEO rendering
- **TypeScript**: Full type safety for route inference and metadata validation
- **Supabase**: Database and authentication backend with real-time subscriptions
- **Tailwind CSS**: Utility-first styling for rapid UI development
- **Zod**: Runtime schema validation for SEO metadata
- **Cheerio**: Server-side HTML parsing for validation
- **Sharp**: Image processing and validation for OG images
- **React Hook Form**: Form handling with validation
- **Radix UI**: Accessible component primitives
- **Vitest**: Fast unit testing framework
- **Playwright**: End-to-end testing for validation workflows

**Note**: Check `package.json` for exact versions of all dependencies.

## Architecture
The package consists of three main layers:
1. **Core Library**: TypeScript utilities for metadata validation, HTML parsing, and Supabase integration
2. **Next.js Integration**: Hook-based API that integrates with `generateMetadata` and build process
3. **Admin UI Components**: Pre-built React components for managing SEO records

Data flows from the admin UI → Supabase → Next.js sites via the package's `generateMetadata` integration. Build-time validation runs automatically and reports issues without failing builds.

## Milestones

### Phase 1: Foundation

#### 1.1 Project Setup & Quality Foundation
- [ ] **Initialize TypeScript package structure**: Set up monorepo with package and demo site
  - Files: `package.json`, `tsconfig.json`, `turbo.json`, `packages/seo-console/`, `apps/demo/`
  - Outcome: Can run `npm run build` and `npm run dev` successfully
  - Quality: Bundle analyzer configured, initial bundle < 50KB gzipped for core package

- [ ] **Configure Supabase integration**: Set up database schema and TypeScript types
  - Files: `packages/seo-console/src/database/schema.sql`, `packages/seo-console/src/types/database.ts`
  - Outcome: SEO records table with proper RLS policies and TypeScript types
  - Quality: All database queries use prepared statements, proper error handling

- [ ] **Set up validation with Zod**: Create schema validation for SEO metadata
  - Files: `packages/seo-console/src/validation/seo-schema.ts`
  - Outcome: Can validate SEO records with proper TypeScript inference
  - Quality: Comprehensive error messages, supports all Open Graph and Twitter Card types

#### 1.2 Authentication System
- [ ] **Implement Supabase auth**: Email/password authentication with session management
  - Files: `packages/seo-console/src/auth/supabase-client.ts`, `packages/seo-console/src/components/AuthProvider.tsx`
  - Outcome: Users can sign up, log in, and access protected admin routes
  - Quality Checklist:
    - ✓ Login form has ARIA labels and keyboard navigation
    - ✓ Error messages are announced to screen readers
    - ✓ Password visibility toggle with proper ARIA attributes
    - ✓ Form validation prevents submission with invalid data
    - ✓ Loading states for all auth actions

### Phase 2: Core SEO Engine

#### 2.1 SEO Record Management
- [ ] **Create SEO record CRUD operations**: Database operations with TypeScript types
  - Files: `packages/seo-console/src/lib/seo-records.ts`
  - Outcome: Can create, read, update, delete SEO records with validation
  - Quality: All operations handle errors gracefully, optimistic updates in UI

- [ ] **Build admin UI for SEO records**: Form interface for managing metadata
  - Files: `packages/seo-console/src/components/SEORecordForm.tsx`, `packages/seo-console/src/components/SEORecordList.tsx`
  - Outcome: Admin can manage all SEO metadata fields through intuitive interface
  - Quality Checklist:
    - ✓ Form uses React Hook Form with Zod validation
    - ✓ All form fields have proper labels and descriptions
    - ✓ Rich text preview for titles and descriptions
    - ✓ Character count indicators for title/description limits
    - ✓ Color contrast meets WCAG AA (4.5:1 minimum)
    - ✓ Mobile-responsive layout works on 320px+ screens

- [ ] **Implement route path management**: UI for associating SEO records with Next.js routes
  - Files: `packages/seo-console/src/components/RoutePathInput.tsx`
  - Outcome: Can map SEO records to dynamic and static routes
  - Quality: Supports Next.js route patterns, validates path syntax

#### 2.2 Next.js Integration Layer
- [ ] **Create generateMetadata hook**: Core integration with Next.js App Router
  - Files: `packages/seo-console/src/hooks/useGenerateMetadata.ts`
  - Outcome: Next.js sites can use `generateMetadata` with SEO records
  - Quality: Full TypeScript support, handles dynamic routes, graceful fallbacks

- [ ] **Build validation engine**: Server-side HTML parsing and validation
  - Files: `packages/seo-console/src/validation/html-validator.ts`, `packages/seo-console/src/validation/image-validator.ts`
  - Outcome: Can fetch and validate actual rendered HTML from production sites
  - Quality Checklist:
    - ✓ Validates all Open Graph required properties
    - ✓ Checks Twitter Card metadata completeness
    - ✓ Verifies OG image dimensions, file size, and HTTP status
    - ✓ Detects duplicate titles across site
    - ✓ Validates canonical URL format and accessibility
    - ✓ Handles rate limiting and timeouts gracefully

### Phase 3: Validation & Reporting

#### 3.1 Build Integration
- [ ] **Create Next.js plugin**: Automatic validation during build process
  - Files: `packages/seo-console/src/plugins/nextjs-plugin.ts`
  - Outcome: SEO validation runs automatically on `next build`
  - Quality: Warns for issues but doesn't fail build, configurable validation rules

- [ ] **Build validation dashboard**: UI for viewing validation results
  - Files: `packages/seo-console/src/components/ValidationDashboard.tsx`
  - Outcome: Clear visualization of SEO issues with actionable recommendations
  - Quality Checklist:
    - ✓ Issues grouped by severity (critical, warning, info)
    - ✓ Direct links to edit affected SEO records
    - ✓ Export validation reports as CSV/JSON
    - ✓ Search and filter validation results
    - ✓ Accessible data tables with proper headers
    - ✓ Screen reader support for issue announcements

#### 3.2 Image Validation System
- [ ] **Implement OG image validation**: Comprehensive image checking
  - Files: `packages/seo-console/src/validation/og-image-validator.ts`
  - Outcome: Validates OG images for dimensions, format, and accessibility
  - Quality: Checks 1200x630 recommendations, supports WebP/AVIF, validates alt text

- [ ] **Create image preview component**: Visual validation in admin UI
  - Files: `packages/seo-console/src/components/OGImagePreview.tsx`
  - Outcome: Admin can preview how images appear on social platforms
  - Quality: Simulates Facebook, Twitter, LinkedIn preview formats accurately

### Phase 4: Package Distribution

#### 4.1 Package Publishing Setup
- [ ] **Configure npm publishing**: Set up automated releases and versioning
  - Files: `packages/seo-console/package.json`, `.github/workflows/release.yml`
  - Outcome: Package published to npm with proper versioning and documentation
  - Quality: Semantic versioning, comprehensive README, TypeScript declarations included

- [ ] **Create comprehensive documentation**: Usage guide and API reference
  - Files: `packages/seo-console/README.md`, `docs/` directory
  - Outcome: Developers can integrate package following clear documentation
  - Quality: Code examples, troubleshooting guide, migration instructions

#### 4.2 Testing & Quality Assurance
- [ ] **Write comprehensive test suite**: Unit and integration tests
  - Files: `packages/seo-console/src/**/*.test.ts`
  - Outcome: >90% test coverage, all core functionality tested
  - Quality: Tests for edge cases, error scenarios, and TypeScript types

- [ ] **Set up E2E testing**: Playwright tests for full workflows
  - Files: `packages/seo-console/e2e/`
  - Outcome: Critical user journeys tested end-to-end
  - Quality: Tests include accessibility checks, mobile responsive testing

### Phase 5: Polish & Launch

#### 5.1 Quality Assurance
- [ ] **Run Lighthouse audit**: Optimize package demo site performance
  - Files: `apps/demo/`, `.lighthouserc.json`
  - Outcome: Demo site scores ≥95 performance, ≥98 accessibility/SEO
  - Quality: Package itself has minimal performance impact on host sites

- [ ] **Accessibility audit**: Comprehensive a11y testing of admin components
  - Outcome: Zero critical accessibility violations in admin UI
  - Quality: Full keyboard navigation, proper ARIA attributes, screen reader compatibility

- [ ] **Security review**: Audit authentication and data handling
  - Outcome: No security vulnerabilities, proper data sanitization
  - Quality: SQL injection prevention, XSS protection, secure session management

#### 5.2 Documentation & Examples
- [ ] **Create integration examples**: Sample implementations for common use cases
  - Files: `examples/` directory with multiple Next.js integration patterns
  - Outcome: Developers can copy working examples for quick integration
  - Quality: Examples cover dynamic routes, internationalization, multi-tenant setups

## AI Guidelines
Rules for AI assistants working on this project:

### Quality Standards (MANDATORY)
1. **TypeScript First**: 
   - All code must be fully typed with no `any` types
   - Export proper TypeScript declarations
   - Use branded types for IDs and URLs where appropriate

2. **Package Development**:
   - Keep external dependencies minimal and peer dependencies clearly marked
   - Support tree-shaking with ESM exports
   - Provide both CommonJS and ESM builds

3. **Accessibility**:
   - All admin UI components must be keyboard navigable
   - Form validation errors announced to screen readers
   - Data tables need proper headers and ARIA labels
   - Color contrast 4.5:1 minimum for all text

4. **Performance**:
   - Package bundle size must stay under 100KB gzipped
   - Use dynamic imports for admin UI components
   - Minimize impact on host site performance

5. **SEO Validation**:
   - Support all major Open Graph types (website, article, product)
   - Validate Twitter Card types (summary, summary_large_image)
   - Check structured data (JSON-LD) syntax
   - Verify canonical URLs are absolute and accessible

6. **Error Handling**:
   - All async operations need proper error boundaries
   - Network failures should not crash validation
   - Provide meaningful error messages for debugging

### Integration Requirements
- Must work with Next.js App Router `generateMetadata`
- Support both static and dynamic route patterns
- Handle edge cases like missing environment variables gracefully
- Provide TypeScript autocomplete for SEO record fields

### Testing Requirements
- Unit tests for all validation logic
- Integration tests for Supabase operations
- E2E tests for critical admin workflows
- Performance tests for validation speed

## Non-Goals
- Keyword research or competitive SEO analysis
- Content optimization suggestions
- Analytics or traffic monitoring
- Multi-language SEO management (v1)
- Advanced schema.org types beyond basic Article/Product
- Real-time collaboration features
- White-label or multi-tenant admin UI

---
*Generated by Lattice Architect*