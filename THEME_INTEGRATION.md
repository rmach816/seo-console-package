# Theme Integration Guide

## Current Styling Approach

The package uses **Tailwind CSS** with utility classes. Components are designed to be themeable through:

1. **Tailwind CSS Configuration** - Users can extend/override Tailwind config
2. **CSS Variables** - Some components use CSS variables for colors
3. **className Props** - Most components accept className props

## Integration Options for Existing Projects

### Option 1: Tailwind CSS Projects (Recommended)

If your project already uses Tailwind CSS:

1. **Install the package:**
   ```bash
   npm install @seo-console/package
   ```

2. **The components will automatically use your Tailwind config:**
   - Colors from your `tailwind.config.js`
   - Spacing, typography, etc.
   - Your custom theme values

3. **Override specific styles** by passing `className` props:
   ```tsx
   <SEORecordList className="my-custom-styles" />
   ```

### Option 2: CSS-in-JS Projects (Styled Components, Emotion, etc.)

You can wrap the components:

```tsx
import { SEORecordList } from "@seo-console/package/components";
import styled from "styled-components";

const StyledSEORecordList = styled.div`
  /* Your custom styles */
  .seo-record-item {
    background: ${props => props.theme.colors.background};
  }
`;
```

### Option 3: CSS Modules / Global CSS

1. Import the components
2. Use CSS specificity to override styles
3. Or use `!important` for critical overrides

### Option 4: Custom Tailwind Config

Create a `tailwind.config.js` that extends the package's base styles:

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@seo-console/package/dist/**/*.js"
  ],
  theme: {
    extend: {
      // Your custom theme
    }
  }
}
```

## Component Customization

Most components accept standard props:

- `className` - Additional CSS classes
- `style` - Inline styles
- Component-specific props for behavior

## Current Limitations

⚠️ **Note:** The package currently uses hardcoded Tailwind classes. For full theme integration, you may need to:

1. Override with your own CSS
2. Use Tailwind's `@apply` directive
3. Wrap components in styled versions

## Recommendations

For best integration:
1. Use Tailwind CSS in your project
2. Configure Tailwind to scan the package's dist folder
3. Extend your theme to match your design system
4. Use className props for specific overrides
