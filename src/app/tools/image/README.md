# Image Component

A reusable Angular component for displaying images with customizable properties and responsive behavior.

## Features

- 🖼️ **Flexible sizing**: Support for width, height, and responsive classes
- 🎨 **Styling options**: Built-in classes for rounded corners, shadows, borders
- 📱 **Responsive**: Automatic responsive behavior with aspect ratio containers
- ⚡ **Performance**: Lazy loading support and optimized loading strategies
- 🎯 **Accessibility**: Proper ARIA labels and semantic markup
- 🖱️ **Interactive**: Click events and hover effects
- 🔧 **Configurable**: Multiple ways to configure the component

## Usage

### Basic Usage

```html
<app-image 
  src="assets/images/logo.png" 
  alt="Company Logo">
</app-image>
```

### With Size Properties

```html
<app-image 
  src="assets/images/photo.jpg" 
  alt="Profile Photo"
  width="200"
  height="150">
</app-image>
```

### With Styling Classes

```html
<app-image 
  src="assets/images/avatar.jpg" 
  alt="User Avatar"
  class="rounded circle shadow"
  width="100"
  height="100">
</app-image>
```

### Responsive Image

```html
<app-image 
  src="assets/images/banner.jpg" 
  alt="Banner Image"
  class="responsive cover">
</app-image>
```

### Aspect Ratio Container

```html
<app-image 
  src="assets/images/video-thumbnail.jpg" 
  alt="Video Thumbnail"
  class="aspect-ratio-16-9">
</app-image>
```

### Clickable Image

```html
<app-image 
  src="assets/images/gallery-item.jpg" 
  alt="Gallery Item"
  [clickable]="true"
  (imageClick)="onImageClick($event)">
</app-image>
```

### Using Configuration Object

```typescript
imageConfig: ImageConfig = {
  src: 'assets/images/hero.jpg',
  alt: 'Hero Image',
  width: '100%',
  height: '400px',
  class: 'responsive shadow',
  loading: 'lazy'
};
```

```html
<app-image [config]="imageConfig"></app-image>
```

### Event Handling

```html
<app-image 
  src="assets/images/upload.jpg" 
  alt="Uploaded Image"
  (imageLoad)="onImageLoaded($event)"
  (imageError)="onImageError($event)"
  (imageClick)="onImageClicked($event)">
</app-image>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | string | '' | Image source URL |
| `alt` | string | '' | Alternative text for accessibility |
| `width` | string \| number | '' | Image width |
| `height` | string \| number | '' | Image height |
| `class` | string | '' | CSS classes to apply |
| `style` | string | '' | Inline styles |
| `loading` | 'lazy' \| 'eager' | 'lazy' | Loading strategy |
| `decoding` | 'async' \| 'sync' \| 'auto' | 'async' | Image decoding strategy |
| `crossorigin` | 'anonymous' \| 'use-credentials' | undefined | CORS policy |
| `config` | ImageConfig | undefined | Configuration object |
| `clickable` | boolean | false | Enable click interactions |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `imageLoad` | EventEmitter<Event> | Fired when image loads successfully |
| `imageError` | EventEmitter<Event> | Fired when image fails to load |
| `imageClick` | EventEmitter<Event> | Fired when image is clicked (if clickable) |

## Available CSS Classes

### Size Classes
- `.small` - Max width 100px
- `.medium` - Max width 200px
- `.large` - Max width 400px
- `.xlarge` - Max width 600px

### Style Classes
- `.rounded` - Rounded corners
- `.circle` - Circular image
- `.shadow` - Drop shadow
- `.border` - Border outline
- `.clickable` - Hover effects and cursor pointer

### Object Fit Classes
- `.contain` - object-fit: contain
- `.cover` - object-fit: cover
- `.fill` - object-fit: fill

### Aspect Ratio Classes
- `.aspect-ratio-16-9` - 16:9 aspect ratio container
- `.aspect-ratio-4-3` - 4:3 aspect ratio container
- `.aspect-ratio-1-1` - 1:1 aspect ratio container (square)

### Responsive Classes
- `.responsive` - Full width, auto height

## Examples

### Profile Avatar
```html
<app-image 
  src="assets/avatars/user.jpg" 
  alt="User Profile"
  class="circle shadow"
  width="80"
  height="80">
</app-image>
```

### Hero Banner
```html
<app-image 
  src="assets/banners/hero.jpg" 
  alt="Hero Banner"
  class="responsive cover"
  height="400px">
</app-image>
```

### Gallery Thumbnail
```html
<app-image 
  src="assets/gallery/thumb.jpg" 
  alt="Gallery Thumbnail"
  class="aspect-ratio-1-1 rounded shadow clickable"
  [clickable]="true"
  (imageClick)="openLightbox($event)">
</app-image>
```

### Video Thumbnail
```html
<app-image 
  src="assets/videos/thumbnail.jpg" 
  alt="Video Thumbnail"
  class="aspect-ratio-16-9 rounded">
</app-image>
``` 