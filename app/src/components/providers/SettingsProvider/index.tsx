import React, { Context, Dispatch, ReactElement, useReducer } from 'react';
import { defaultState, reducer } from '~reducers/backend/settings';
import { SettingsContextType } from '~types/context';
import { SettingsContextActionType } from '~types/action';

export const SettingsContext: Context<SettingsContextType> = React.createContext(null as SettingsContextType);
export const SettingsDispatchContext: Context<Dispatch<SettingsContextActionType>> = React.createContext(
  null as Dispatch<SettingsContextActionType>);

interface Props {
  children?: ReactElement | ReactElement[];
}

const SettingsProvider = ({ children }: Props): ReactElement => {
  const initialState = { ...defaultState };
  const [state, dispatch] = useReducer(reducer, initialState);
  return <SettingsDispatchContext.Provider value={dispatch}>
    <SettingsContext.Provider value={state}>{children}</SettingsContext.Provider>
  </SettingsDispatchContext.Provider>;
};

export default SettingsProvider;
