import { useState, useEffect } from 'react';
import type { UserPreferences } from '../lib/supabase';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  showContentOnFeed: true,
  showImagesOnFeed: true,
  showVideosOnFeed: true,
};

export function useFeedPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('feedPreferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('feedPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, [preferences]);

  const toggleContentVisibility = () => {
    setPreferences(prev => ({
      ...prev,
      showContentOnFeed: !prev.showContentOnFeed,
    }));
  };

  const toggleImageVisibility = () => {
    setPreferences(prev => ({
      ...prev,
      showImagesOnFeed: !prev.showImagesOnFeed,
    }));
  };

  const toggleVideoVisibility = () => {
    setPreferences(prev => ({
      ...prev,
      showVideosOnFeed: !prev.showVideosOnFeed,
    }));
  };

  return {
    preferences,
    toggleContentVisibility,
    toggleImageVisibility,
    toggleVideoVisibility,
  };
}