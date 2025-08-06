import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UIStore, Notification } from './types';

const initialState = {
  theme: 'system' as const,
  sidebarOpen: false,
  activeTab: 'overview',
  notifications: [],
  modals: {
    equationModal: false,
    interpretationModal: false,
    settingsModal: false
  }
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        setTheme: (theme: 'light' | 'dark' | 'system') => {
          set({ theme }, false, 'setTheme');
        },

        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar');
        },

        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open }, false, 'setSidebarOpen');
        },

        setActiveTab: (tab: string) => {
          set({ activeTab: tab }, false, 'setActiveTab');
        },

        addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
          const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newNotification: Notification = {
            ...notification,
            id,
            timestamp: new Date()
          };
          
          set((state) => ({ notifications: [...state.notifications, newNotification] }), false, 'addNotification');
          
          // Auto-remove notification after duration (default 5 seconds)
          const duration = notification.duration || 5000;
          if (duration > 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, duration);
          }
        },

        removeNotification: (id: string) => {
          set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) }), false, 'removeNotification');
        },

        clearNotifications: () => {
          set({ notifications: [] }, false, 'clearNotifications');
        },

        openModal: (modal: keyof UIStore['modals']) => {
          set((state) => ({ modals: { ...state.modals, [modal]: true } }), false, 'openModal');
        },

        closeModal: (modal: keyof UIStore['modals']) => {
          set((state) => ({ modals: { ...state.modals, [modal]: false } }), false, 'closeModal');
        },

        closeAllModals: () => {
          set(() => ({ modals: { ...initialState.modals } }), false, 'closeAllModals');
        },

        reset: () => {
          set({ ...initialState, theme: get().theme }, false, 'reset');
        }
      }),
      {
        name: 'ui-store',
        partialize: (state: UIStore) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          activeTab: state.activeTab
        })
      }
    )
  )
);

// Selectors
export const useUISelectors = () => {
  const store = useUIStore();
  
  return {
    // Basic selectors
    theme: store.theme,
    sidebarOpen: store.sidebarOpen,
    activeTab: store.activeTab,
    notifications: store.notifications,
    modals: store.modals,
    
    // Computed selectors
    hasNotifications: store.notifications.length > 0,
    unreadNotifications: store.notifications.length,
    hasOpenModals: Object.values(store.modals).some(isOpen => isOpen),
    
    // Notification selectors by type
    errorNotifications: store.notifications.filter(n => n.type === 'error'),
    warningNotifications: store.notifications.filter(n => n.type === 'warning'),
    successNotifications: store.notifications.filter(n => n.type === 'success'),
    infoNotifications: store.notifications.filter(n => n.type === 'info'),
    
    // Recent notifications (last 10)
    recentNotifications: store.notifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
  };
};

// Helper functions
export const useUIActions = () => {
  const {
    setTheme,
    toggleSidebar,
    setSidebarOpen,
    setActiveTab,
    addNotification,
    removeNotification,
    clearNotifications,
    openModal,
    closeModal,
    closeAllModals,
    reset
  } = useUIStore();

  return {
    // Basic actions
    setTheme,
    toggleSidebar,
    setSidebarOpen,
    setActiveTab,
    addNotification,
    removeNotification,
    clearNotifications,
    openModal,
    closeModal,
    closeAllModals,
    reset,
    
    // Convenience notification methods
    showSuccess: (title: string, message: string, duration?: number) => {
      addNotification({
        type: 'success',
        title,
        message,
        duration
      });
    },
    
    showError: (title: string, message: string, duration?: number) => {
      addNotification({
        type: 'error',
        title,
        message,
        duration: duration || 0 // Error notifications don't auto-dismiss by default
      });
    },
    
    showWarning: (title: string, message: string, duration?: number) => {
      addNotification({
        type: 'warning',
        title,
        message,
        duration
      });
    },
    
    showInfo: (title: string, message: string, duration?: number) => {
      addNotification({
        type: 'info',
        title,
        message,
        duration
      });
    },
    
    // Modal convenience methods
    showEquationModal: () => openModal('equationModal'),
    hideEquationModal: () => closeModal('equationModal'),
    
    showInterpretationModal: () => openModal('interpretationModal'),
    hideInterpretationModal: () => closeModal('interpretationModal'),
    
    showSettingsModal: () => openModal('settingsModal'),
    hideSettingsModal: () => closeModal('settingsModal'),
    
    // Tab management
    switchToOverview: () => setActiveTab('overview'),
    switchToAnalytics: () => setActiveTab('analytics'),
    switchToPredictions: () => setActiveTab('predictions'),
    switchToMap: () => setActiveTab('map'),
    
    // Theme management
    setLightTheme: () => setTheme('light'),
    setDarkTheme: () => setTheme('dark'),
    setSystemTheme: () => setTheme('system'),
    
    // Bulk operations
    clearErrorNotifications: () => {
      const { notifications } = useUIStore.getState();
      const errorIds = notifications
        .filter(n => n.type === 'error')
        .map(n => n.id);
      
      errorIds.forEach(id => removeNotification(id));
    },
    
    clearOldNotifications: (olderThanMinutes: number = 30) => {
      const { notifications } = useUIStore.getState();
      const cutoffTime = Date.now() - (olderThanMinutes * 60 * 1000);
      
      const oldIds = notifications
        .filter(n => n.timestamp.getTime() < cutoffTime)
        .map(n => n.id);
      
      oldIds.forEach(id => removeNotification(id));
    }
  };
};