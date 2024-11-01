import { createContext, useContext } from 'react';
import { useUser } from '../hooks/useUser';

const UserContext = createContext<{ userId: string | null } | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useUser();

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
