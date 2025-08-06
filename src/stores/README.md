# Zustand Stores Documentation

This directory contains all Zustand stores for the Dashboard Skripsi application. The stores are organized by domain and provide centralized state management for different aspects of the application.

## Store Structure

### 1. Dashboard Store (`dashboardStore.ts`)
Manages main dashboard state including selected regions, active layers, and filters.

**State:**
- `selectedRegion`: Currently selected region
- `selectedPredictionRegion`: Region selected for prediction analysis
- `activeLayer`: Active map layer (signifikansi, y_pneumonia, etc.)
- `filters`: Dashboard filters (region, timeframe)
- `metrics`: Dashboard metrics
- `isLoading`: Loading state
- `error`: Error state

**Usage:**
```typescript
import { useDashboardStore, useDashboardSelectors } from '@/stores';

// In component
const { setSelectedRegion, setActiveLayer } = useDashboardStore();
const { selectedRegion, activeLayer, isReady } = useDashboardSelectors();
```

### 2. Map Store (`mapStore.ts`)
Manages map-related state including geojson data, selected features, and map view settings.

**State:**
- `geojsonData`: GeoJSON data for map rendering
- `selectedFeature`: Currently selected map feature
- `mapCenter`: Map center coordinates
- `mapZoom`: Map zoom level
- `isLoading`: Loading state
- `error`: Error state

**Usage:**
```typescript
import { useMapStore, useMapSelectors, useMapActions } from '@/stores';

// In component
const { setGeojsonData, setSelectedFeature } = useMapStore();
const { geojsonData, selectedRegionName, isReady } = useMapSelectors();
const { selectFeatureByRegionName, zoomToFeature } = useMapActions();
```

### 3. Data Store (`dataStore.ts`)
Manages research data and coefficients with caching and refresh capabilities.

**State:**
- `researchData`: Array of research data points
- `coefficients`: GWNBR coefficients
- `isLoading`: Loading state
- `error`: Error state
- `lastUpdated`: Last data update timestamp

**Usage:**
```typescript
import { useDataStore, useDataSelectors, useDataActions } from '@/stores';

// In component
const { refreshData } = useDataStore();
const { researchData, hasData, isDataStale } = useDataSelectors();
const { getRegionData, getTopRegionsByMetric } = useDataActions();
```

### 4. Prediction Store (`predictionStore.ts`)
Manages GWNBR predictions, equations, and interpretations.

**State:**
- `predictions`: Array of GWNBR predictions
- `equations`: Equation displays for regions
- `interpretations`: Region interpretations
- `globalSummary`: Global model summary
- `filters`: Prediction filters
- `isLoading`: Loading state
- `error`: Error state

**Usage:**
```typescript
import { usePredictionStore, usePredictionSelectors, usePredictionActions } from '@/stores';

// In component
const { refreshPredictions, updateFilters } = usePredictionStore();
const { filteredPredictions, globalSummary, averageAccuracy } = usePredictionSelectors();
const { getPredictionByRegion, resetFilters } = usePredictionActions();
```

### 5. UI Store (`uiStore.ts`)
Manages UI state including theme, modals, notifications, and navigation.

**State:**
- `theme`: Current theme (light/dark/system)
- `sidebarOpen`: Sidebar open state
- `activeTab`: Currently active tab
- `notifications`: Array of notifications
- `modals`: Modal open states

**Usage:**
```typescript
import { useUIStore, useUISelectors, useUIActions } from '@/stores';

// In component
const { setTheme, addNotification, openModal } = useUIStore();
const { theme, hasNotifications, hasOpenModals } = useUISelectors();
const { showSuccess, showError, showEquationModal } = useUIActions();
```

## Store Features

### Persistence
Most stores use Zustand's persist middleware to save state to localStorage:
- **Dashboard Store**: Persists selected region, active layer, and filters
- **Map Store**: Persists map center and zoom level
- **Data Store**: Persists research data and coefficients (with 1-hour expiry)
- **UI Store**: Persists theme, sidebar state, and active tab
- **Prediction Store**: Persists only filters

### DevTools
All stores are configured with Redux DevTools for debugging:
```typescript
// Enable in browser console
window.__REDUX_DEVTOOLS_EXTENSION__?.connect()
```

### Error Handling
Each store includes comprehensive error handling:
- Loading states for async operations
- Error states with descriptive messages
- Automatic error clearing on successful operations

### Type Safety
All stores are fully typed with TypeScript:
- Separate type definitions in `types.ts`
- Proper inference for state and actions
- Type-safe selectors and actions

## Usage Patterns

### 1. Basic Store Usage
```typescript
// Direct store access
const { selectedRegion, setSelectedRegion } = useDashboardStore();

// Using selectors (recommended)
const { selectedRegion, hasSelectedRegion } = useDashboardSelectors();
const { setSelectedRegion } = useDashboardStore();
```

### 2. Computed Values
```typescript
// Selectors provide computed values
const { 
  filteredPredictions, // Filtered based on current filters
  averageAccuracy,     // Computed from predictions
  isReady             // Computed from loading and error states
} = usePredictionSelectors();
```

### 3. Cross-Store Communication
```typescript
// Stores can access other stores when needed
const refreshPredictions = async () => {
  const { researchData, coefficients } = useDataStore.getState();
  // Use data to generate predictions
};
```

### 4. Notifications
```typescript
const { showSuccess, showError } = useUIActions();

// Show success notification
showSuccess('Data Updated', 'Research data has been refreshed successfully');

// Show error with no auto-dismiss
showError('Load Failed', 'Failed to load research data', 0);
```

### 5. Modal Management
```typescript
const { showEquationModal, hideEquationModal } = useUIActions();
const { modals } = useUISelectors();

// Open equation modal
showEquationModal();

// Check if modal is open
if (modals.equationModal) {
  // Render modal content
}
```

## Best Practices

### 1. Use Selectors
Prefer using selector hooks over direct store access for better performance:
```typescript
// ✅ Good - uses memoized selectors
const { selectedRegion, hasSelectedRegion } = useDashboardSelectors();

// ❌ Avoid - direct store access
const store = useDashboardStore();
const hasSelectedRegion = store.selectedRegion !== null;
```

### 2. Batch Updates
For multiple related updates, use a single action:
```typescript
// ✅ Good - single update
const updateDashboard = (region: string, layer: string) => {
  useDashboardStore.setState({
    selectedRegion: region,
    activeLayer: layer
  });
};

// ❌ Avoid - multiple updates
setSelectedRegion(region);
setActiveLayer(layer);
```

### 3. Error Handling
Always handle errors in async operations:
```typescript
const loadData = async () => {
  try {
    setLoading(true);
    const data = await fetchData();
    setData(data);
    setError(null);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 4. Cleanup
Reset stores when appropriate:
```typescript
// Reset on logout or navigation
const handleLogout = () => {
  useDashboardStore.getState().reset();
  useDataStore.getState().reset();
  usePredictionStore.getState().reset();
};
```

## Migration Guide

To migrate existing components to use Zustand stores:

### 1. Replace useState with Store
```typescript
// Before
const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

// After
const { selectedRegion } = useDashboardSelectors();
const { setSelectedRegion } = useDashboardStore();
```

### 2. Replace useEffect with Store Actions
```typescript
// Before
useEffect(() => {
  fetchData().then(setData);
}, []);

// After
const { refreshData } = useDataStore();
useEffect(() => {
  refreshData();
}, [refreshData]);
```

### 3. Replace Prop Drilling with Store
```typescript
// Before - passing props through multiple components
<Parent selectedRegion={selectedRegion} onRegionSelect={setSelectedRegion}>
  <Child selectedRegion={selectedRegion} onRegionSelect={setSelectedRegion} />
</Parent>

// After - direct store access in child
<Parent>
  <Child /> {/* Child uses useDashboardSelectors() directly */}
</Parent>
```

## Performance Considerations

1. **Selective Subscriptions**: Use selectors to subscribe only to needed state
2. **Memoization**: Selectors are memoized for performance
3. **Persistence**: Only essential state is persisted to localStorage
4. **Lazy Loading**: Stores are created only when first accessed
5. **DevTools**: Disabled in production builds

## Debugging

1. **Redux DevTools**: Use browser extension to inspect store state
2. **Console Logging**: Stores log actions in development mode
3. **State Inspection**: Access store state directly in console:
   ```javascript
   // In browser console
   window.stores = {
     dashboard: useDashboardStore.getState(),
     map: useMapStore.getState(),
     data: useDataStore.getState(),
     prediction: usePredictionStore.getState(),
     ui: useUIStore.getState()
   };
   ```