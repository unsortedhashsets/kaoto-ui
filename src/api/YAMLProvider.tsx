import YAML from '../stories/data/yaml';
import usePrevious from '../utils/usePrevious';
import { useStepsAndViewsContext } from './StepsAndViewsProvider';
import { fetchViewDefinitions } from './apiService';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface IYAMLDataProvider {
  children: ReactNode;
}

export type IUseYAMLData = [string, Dispatch<SetStateAction<string>>];

export const useYAMLData = (newYAMLData: string): IUseYAMLData => {
  // const [YAMLData, setYAMLData] = useState<string>(YAML);
  const [YAMLData, setYAMLData] = useState<string>();
  const previousYaml = usePrevious(YAMLData);
  const [, dispatch] = useStepsAndViewsContext();

  // useEffect(() => {
  //   console.table(newData);
  // }, [YAMLData]);

  useEffect(() => {
    if (previousYaml === YAMLData) {
      return;
    }

    fetchViewDefinitions(YAMLData)
      .then((res) => {
        dispatch({ type: 'UPDATE_INTEGRATION', payload: res });
      })
      .catch((e) => {
        console.error(e);
      });

    setYAMLData(newYAMLData);
  }, [newYAMLData]);

  return [YAMLData, setYAMLData];
};

function YAMLProvider({ children }: IYAMLDataProvider) {
  const [YAMLData, setYAMLData] = useYAMLData(YAML);

  return (
    <YAMLDataContext.Provider value={[YAMLData, setYAMLData]}>{children}</YAMLDataContext.Provider>
  );
}

const YAMLDataContext = createContext<IUseYAMLData>([YAML, () => null]);

function useYAMLContext() {
  const context = useContext(YAMLDataContext);
  if (!context) {
    throw new Error('useYAMLDataContext must be used within YAMLDataProvider!');
  }
  return context;
}

export { YAMLProvider, useYAMLContext };
