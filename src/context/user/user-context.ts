import { createContext, useContext } from 'react';
//
import { UseContextProps } from './user-provider';

// ----------------------------------------------------------------------

export const UserContext = createContext<UseContextProps | null>(null);

export const useUserContext = (): UseContextProps => {
  const context = useContext(UserContext);

  if (!context) throw new Error('useUserContext must be use inside UserProvider');

  return context;
};
