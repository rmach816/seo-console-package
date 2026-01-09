# Preview the Interface

## Quick Preview Options

### Option 1: Run the Demo App (Recommended)

The demo app shows the complete interface:

```bash
cd apps/demo
npm install
npm run dev
```

Then open http://localhost:3000 to see:
- SEO Records List component
- Validation Dashboard component
- Complete interface preview

### Option 2: View Component Screenshots

The interface includes:

1. **SEO Records List**
   - Table/card view of all SEO records
   - Edit/Delete buttons
   - Create new record button
   - Status indicators

2. **SEO Record Form**
   - Form fields for all SEO metadata
   - OG Image preview
   - Validation feedback
   - Save/Cancel buttons

3. **Validation Dashboard**
   - List of all records with validation status
   - Critical issues highlighted
   - Warnings and info messages
   - Re-validate buttons

4. **OG Image Preview**
   - Preview on Facebook, Twitter, LinkedIn
   - Image dimensions and format info
   - Validation status

## Design Characteristics

- **Clean, modern design** with standard spacing
- **Card-based layout** for organized sections
- **Color-coded status** (red for critical, yellow for warnings)
- **Responsive** - works on mobile and desktop
- **Accessible** - proper ARIA labels and keyboard navigation

## Theme Integration

The components use:
- Standard Tailwind CSS utility classes
- CSS variables for colors (can be overridden)
- No hardcoded colors (uses theme defaults)
- Accepts `className` props for customization

## Customization

You can customize the appearance by:

1. **Tailwind Config** - Extend your theme
2. **CSS Overrides** - Target component classes
3. **className Props** - Pass custom classes
4. **Wrapper Components** - Wrap with your own styled components
