# GridMenuRenderer Component

A standalone Angular component that provides a menu cell renderer for ag-grid with Material Design styling.

## Features

- **Material Design Menu**: Uses Angular Material's `mat-menu` component
- **Configurable Actions**: Menu items are configurable through `menuActions` array
- **Standalone Component**: Can be used independently or as part of the grid component
- **TypeScript Support**: Full TypeScript support with proper interfaces

## Usage

### As a Cell Renderer in ag-grid

```typescript
import { GridMenuRendererComponent } from './tools/grid-menu-renderer/grid-menu-renderer.component';

// In your column definitions
const columnDefs = [
  // ... other columns
  {
    headerName: 'Actions',
    field: 'actions',
    sortable: false,
    filter: false,
    minWidth: 80,
    maxWidth: 80,
    pinned: 'right',
    cellRenderer: GridMenuRendererComponent
  }
];

// In your grid options
const gridOptions = {
  context: {
    gridOptions: {
      menuActions: [
        {
          title: 'View',
          icon: 'visibility',
          click: (param) => this.onView(param.data)
        },
        {
          title: 'Edit',
          icon: 'edit',
          click: (param) => this.onEdit(param.data)
        },
        {
          title: 'Delete',
          icon: 'delete',
          click: (param) => this.onDelete(param.data)
        }
      ]
    }
  }
};
```

### Menu Action Interface

```typescript
interface MenuAction {
  title: string;        // Display text for the menu item
  icon: string;         // Material icon name
  click: (param: any) => void;  // Click handler function
}
```

### Click Handler Parameters

The click handler receives an object with the following structure:

```typescript
{
  data: any,      // The row data
  action: MenuAction  // The action that was clicked
}
```

## Styling

The component includes built-in styles for:
- Menu button hover effects
- Menu panel sizing
- Menu item layout and spacing
- Icon sizing and alignment

## Dependencies

- Angular Material (`@angular/material`)
- Angular Common (`@angular/common`)
- ag-grid-community (for `ICellRendererParams`)

## Example

See the `diet.component.ts` for a complete implementation example. 