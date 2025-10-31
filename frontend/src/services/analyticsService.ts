import { analytics } from './firebase';
import { logEvent, setUserProperties, setUserId } from 'firebase/analytics';

// Helper function to check if analytics is enabled
const isAnalyticsEnabled = async (): Promise<boolean> => {
  if (!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    return false;
  }
  try {
    const analyticsInstance = await analytics;
    return analyticsInstance !== null;
  } catch {
    return false;
  }
};

// Analytics service for tracking user actions
export const analyticsService = {
  // Initialize user tracking
  setUser: async (userId: string, properties?: Record<string, any>) => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        setUserId(analyticsInstance, userId);
        if (properties) {
          setUserProperties(analyticsInstance, properties);
        }
      }
    } catch (error) {
      console.warn('Analytics setUser failed:', error);
    }
  },

  // Track authentication events
  trackLogin: async (method: 'email' | 'google') => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'login', { method });
      }
    } catch (error) {
      console.warn('Analytics trackLogin failed:', error);
    }
  },

  trackSignup: async (method: 'email' | 'google') => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'sign_up', { method });
      }
    } catch (error) {
      console.warn('Analytics trackSignup failed:', error);
    }
  },

  trackLogout: async () => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'logout');
      }
    } catch (error) {
      console.warn('Analytics trackLogout failed:', error);
    }
  },

  // Track Todo actions
  trackTodoCreated: async (hasTags: boolean = false) => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'todo_created', {
          has_tags: hasTags
        });
      }
    } catch (error) {
      console.warn('Analytics trackTodoCreated failed:', error);
    }
  },

  trackTodoUpdated: async (hasTags: boolean = false) => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'todo_updated', {
          has_tags: hasTags
        });
      }
    } catch (error) {
      console.warn('Analytics trackTodoUpdated failed:', error);
    }
  },

  trackTodoDeleted: async () => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'todo_deleted');
      }
    } catch (error) {
      console.warn('Analytics trackTodoDeleted failed:', error);
    }
  },

  trackTodoCompleted: async (hasTags: boolean = false) => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'todo_completed', {
          has_tags: hasTags
        });
      }
    } catch (error) {
      console.warn('Analytics trackTodoCompleted failed:', error);
    }
  },

  // Track Tag actions
  trackTagCreated: async () => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'tag_created');
      }
    } catch (error) {
      console.warn('Analytics trackTagCreated failed:', error);
    }
  },

  trackTagUpdated: async () => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'tag_updated');
      }
    } catch (error) {
      console.warn('Analytics trackTagUpdated failed:', error);
    }
  },

  trackTagDeleted: async () => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'tag_deleted');
      }
    } catch (error) {
      console.warn('Analytics trackTagDeleted failed:', error);
    }
  },

  // Track filtering actions
  trackFilterApplied: async (tagCount: number) => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'filter_applied', {
          tag_count: tagCount
        });
      }
    } catch (error) {
      console.warn('Analytics trackFilterApplied failed:', error);
    }
  },

  trackFilterCleared: async () => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'filter_cleared');
      }
    } catch (error) {
      console.warn('Analytics trackFilterCleared failed:', error);
    }
  },

  // Track page views
  trackPageView: async (pageName: string) => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'page_view', {
          page_title: pageName
        });
      }
    } catch (error) {
      console.warn('Analytics trackPageView failed:', error);
    }
  },

  // Track errors
  trackError: async (errorType: string, errorMessage: string) => {
    try {
      if (!(await isAnalyticsEnabled())) return;

      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'exception', {
          description: `${errorType}: ${errorMessage}`,
          fatal: false
        });
      }
    } catch (error) {
      console.warn('Analytics trackError failed:', error);
    }
  }
};