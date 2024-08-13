import { createContext, useContext } from 'react';
//
import { UseContextProps } from './form-provider';

// ----------------------------------------------------------------------

export const FormContext = createContext<UseContextProps | null>(null);

export const useFormContext = (): UseContextProps => {
  const context = useContext(FormContext);

  if (!context) throw new Error('useFormContext must be use inside FormProvider');

  return context;
};
