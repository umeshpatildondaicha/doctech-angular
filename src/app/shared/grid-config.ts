import { 
    ClientSideRowModelModule,
    ModuleRegistry
} from 'ag-grid-community';

// Register AG Grid modules globally
export function registerAgGridModules() {
    ModuleRegistry.registerModules([
        ClientSideRowModelModule
        // Add other modules as needed
    ]);
}

// Execute registration immediately
registerAgGridModules();

// Export modules for component usage
export const AgGridModules = [ClientSideRowModelModule]; 