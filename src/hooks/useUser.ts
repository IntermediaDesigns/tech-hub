import { useEffect, useState } from 'react';

export const useUser = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Generate a random user ID when the app is initialized
    const randomUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(randomUserId);
  }, []);

  return { userId };
};
