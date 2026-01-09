# Interface Preview Guide

## Quick Preview

### Run the Demo App

```bash
cd apps/demo
npm install
npm run dev
```

Then open **http://localhost:3000** to see:
- Complete interface preview
- All components in action
- Real-time interactions

## Interface Components

### 1. SEO Records List

**Location:** Main admin page

**Features:**
- Table/card view of all SEO records
- Route path, title, description displayed
- Status indicators (pending, valid, invalid)
- Edit and Delete buttons
- Create new record button
- Loading and error states

**Design:**
- Clean card-based layout
- Responsive grid
- Hover effects on interactive elements
- Color-coded status badges

### 2. SEO Record Form

**Location:** Modal or inline form

**Features:**
- Comprehensive form for all SEO fields:
  - Basic: Title, Description, Keywords
  - Open Graph: Title, Description, Image, Type, URL
  - Twitter Card: Card type, Title, Description, Image
  - Canonical URL
  - Robots meta
  - Structured data (JSON)
- Real-time OG Image preview
- Validation feedback
- Save/Cancel buttons

**Design:**
- Organized sections with clear labels
- Input fields with proper spacing
- Image preview component
- Error messages inline

### 3. Validation Dashboard

**Location:** Separate page or section

**Features:**
- Overview cards showing:
  - Total records
  - Records with issues
  - Critical issues count
  - Warnings count
- List of all records with validation status
- Expandable issue details
- Re-validate buttons
- Filter by severity

**Design:**
- Dashboard-style layout
- Color-coded severity (red=critical, yellow=warning, blue=info)
- Expandable sections
- Clear visual hierarchy

### 4. OG Image Preview

**Location:** Within SEO Record Form

**Features:**
- Preview on multiple platforms:
  - Facebook (520x272px)
  - Twitter (506x253px)
  - LinkedIn (520x272px)
- Platform-specific styling
- Image validation status
- Dimensions and format info
- Real-time updates

**Design:**
- Platform mockups
- Visual preview of how image appears
- Validation indicators
- Responsive layout

## Design Characteristics

### Visual Style
- **Clean and Modern** - Minimal, professional design
- **Card-based** - Information organized in cards
- **Spacious** - Generous padding and margins
- **Consistent** - Uniform spacing and typography

### Color Scheme
- **Primary Actions:** Blue/primary color
- **Destructive Actions:** Red
- **Status Indicators:**
  - Green: Valid/Success
  - Red: Critical/Error
  - Yellow: Warning
  - Blue: Info

### Typography
- **Headings:** Bold, clear hierarchy
- **Body Text:** Readable, appropriate sizing
- **Labels:** Clear, descriptive

### Responsive Design
- Works on desktop, tablet, and mobile
- Adaptive layouts
- Touch-friendly buttons

## Theme Integration

The interface uses:
- **Tailwind CSS** utility classes
- **Semantic color tokens** (primary, secondary, card, etc.)
- **CSS variables** for customizable colors
- **className props** for custom styling

### Customization Options

1. **Tailwind Config** - Override colors in your config
2. **CSS Variables** - Set custom color values
3. **className Props** - Pass custom classes
4. **Wrapper Components** - Wrap with your own styling

## Standard Design

The interface has a **standard, consistent design** that:
- Works out of the box
- Adapts to your Tailwind theme
- Maintains visual consistency
- Provides professional appearance

Users don't need to design anything - the interface is ready to use!
