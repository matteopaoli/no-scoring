import React, {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    Dispatch,
  } from 'react';
  import { UserInfo } from './types';
  
  type State = {
    step: number;
    shouldValidate: boolean;
    userInfo: UserInfo;
  };
  
  type Action =
    | { type: 'SET_STEP'; payload: number }
    | { type: 'SET_VALIDATE'; payload: boolean }
    | { type: 'SET_USER_INFO'; payload: UserInfo };
  
  type OnboardingContextType = State & {
    dispatch: Dispatch<Action>;
  };
  
  const initialUserInfo: UserInfo = {
    firstName: '',
    lastName: '',
    storeName: '',
    storeDescription: '',
    storeLocation: null,
    storePlaceId: '',
    customerPaysFees: false,
    profileImage: null,
    storeImage: null,
    password: '',
    confirmPassword: '',
    acceptedTOS: false,
  };
  
  const initialState: State = {
    step: 0,
    shouldValidate: false,
    userInfo: initialUserInfo,
  };
  
  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'SET_STEP':
        return { ...state, step: action.payload };
      case 'SET_VALIDATE':
        return { ...state, shouldValidate: action.payload };
      case 'SET_USER_INFO':
        return { ...state, userInfo: action.payload };
      default:
        return state;
    }
  };
  
  const OnboardingContext = createContext<OnboardingContextType>({
    ...initialState,
    dispatch: () => undefined,
  });
  
  export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    const value = React.useMemo(
      () => ({ ...state, dispatch }),
      [state, dispatch]
    );
  
    return (
      <OnboardingContext.Provider value={value}>
        {children}
      </OnboardingContext.Provider>
    );
  };
  
  export const useOnboarding = (): OnboardingContextType => {
    const context = useContext(OnboardingContext);
    if (!context) {
      throw new Error(
        'useOnboarding must be used within an OnboardingProvider'
      );
    }
    return context;
  };
  