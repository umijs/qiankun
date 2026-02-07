# Qiankun Examples Design System

A modern design system for qiankun micro-frontend examples.

## Philosophy

- **Modern**: Using latest CSS features and design patterns
- **Consistent**: Unified visual language across all examples
- **Accessible**: WCAG 2.1 AA compliant
- **Flexible**: Easy to customize and extend

## Tokens

### Colors

#### Primary
- 50: #e6f4ff
- 100: #bae0ff
- 200: #7fc3ff
- 300: #4096ff
- 400: #1677ff (Primary)
- 500: #0958d9
- 600: #003eb3
- 700: #002c8c
- 800: #001d66
- 900: #001141

#### Functional
- Success: #22c55e
- Warning: #f59e0b
- Error: #ef4444
- Info: #3b82f6

#### Neutral
- Gray scale from white to black

### Typography

#### Font Families
- Primary: Inter, system-ui, sans-serif
- Mono: Fira Code, JetBrains Mono, monospace

#### Scale
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### Spacing

Based on 4px grid:
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 5: 1.25rem (20px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 10: 2.5rem (40px)
- 12: 3rem (48px)

### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Components

### Button
Variants: primary, secondary, outline, ghost, danger
Sizes: xs, sm, md, lg, xl

### Card
Sections: header, body, footer
Variants: default, bordered, shadow

### Navigation
Types: horizontal, vertical, sidebar
Items: icon + label + badge

### Input
Types: text, password, email, number, search
States: default, focus, error, disabled

### Modal
Sizes: sm, md, lg, xl, fullscreen
Sections: header, body, footer

### Table
Features: sortable, filterable, pagination, selectable

### Tabs
Types: horizontal, vertical, pill

### Toast/Notification
Types: success, error, warning, info
Position: top-right, top-center, top-left, bottom-right, bottom-center, bottom-left

## Usage

### For React
```tsx
import { Button, Card, Navigation } from '@qiankun/design-system/react';

function App() {
  return (
    <Navigation>
      <Navigation.Item active>Home</Navigation.Item>
      <Navigation.Item>About</Navigation.Item>
    </Navigation>
    
    <Card>
      <Card.Header>Title</Card.Header>
      <Card.Body>
        <Button variant="primary">Click me</Button>
      </Card.Body>
    </Card>
  );
}
```

### For Vue
```vue
<template>
  <Navigation>
    <NavigationItem active>Home</NavigationItem>
    <NavigationItem>About</NavigationItem>
  </Navigation>
  
  <Card>
    <CardHeader>Title</CardHeader>
    <CardBody>
      <Button variant="primary">Click me</Button>
    </CardBody>
  </Card>
</template>

<script setup>
import { Navigation, Card, Button } from '@qiankun/design-system/vue';
</script>
```

## Development

### Setup
```bash
pnpm install
pnpm dev
```

### Build
```bash
pnpm build
```

### Test
```bash
pnpm test
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

MIT
