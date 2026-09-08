import { useColorScheme as useColorSchemeCore } from 'react-native';

export const useColorScheme = () => {
  const coreScheme = useColorSchemeCore();
  if (coreScheme === 'unspecified' || !coreScheme) return 'dark';
  return coreScheme;
};
