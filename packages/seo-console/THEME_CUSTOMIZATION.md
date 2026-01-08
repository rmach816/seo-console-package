# Theme Customization Guide

## Current Theme Integration

### ✅ What Works Well

1. **Semantic Color Tokens** - Components use Tailwind's semantic tokens:
   - `bg-primary`, `text-primary-foreground`
   - `bg-card`, `text-card-foreground`
   - `bg-secondary`, `text-secondary-foreground`
   - `bg-destructive`, `text-destructive-foreground`

2. **className Props** - All components accept `className` for custom styling

3. **Tailwind Merge** - Uses `cn()` utility that merges classes intelligently

### ⚠️ Current Limitations

Some components use hardcoded colors:
- `text-gray-600`, `text-gray-900` (should use theme tokens)
- `bg-white` (should use `bg-card` or theme background)
- `border-gray-200` (should use theme border colors)

## How to Customize for Your Theme

### Option 1: Tailwind Config (Recommended)

Extend your `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@seo-console/package/dist/**/*.{js,mjs}"
  ],
  theme: {
    extend: {
      colors: {
        // Override semantic colors to match your theme
        primary: {
          DEFAULT: 'your-primary-color',
          foreground: 'your-primary-text-color',
        },
        card: {
          DEFAULT: 'your-card-bg',
          foreground: 'your-card-text',
        },
        // ... other colors
      }
    }
  }
}
```

### Option 2: CSS Variables

Add to your global CSS:

```css
:root {
  --primary: your-color;
  --primary-foreground: your-text-color;
  --card: your-card-bg;
  --card-foreground: your-card-text;
  /* etc */
}
```

### Option 3: Wrapper Components

Create themed wrappers:

```tsx
import { SEORecordList as BaseSEORecordList } from "@seo-console/package/components";

export function SEORecordList(props) {
  return (
    <div className="your-theme-wrapper">
      <BaseSEORecordList className="your-custom-classes" {...props} />
    </div>
  );
}
```

### Option 4: CSS Overrides

Target component classes with higher specificity:

```css
/* Your custom CSS */
.seo-record-list {
  /* Override styles */
}
```

## Best Practices

1. **Use Tailwind Config** - Most flexible and maintainable
2. **Extend, Don't Override** - Use `theme.extend` to add your colors
3. **Test in Your Environment** - Always test with your actual theme
4. **Use className Props** - For one-off customizations

## Future Improvements

We plan to:
- Replace all hardcoded colors with semantic tokens
- Add CSS variable support
- Provide theme presets
- Add dark mode support
