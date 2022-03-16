import { SettingsContextType } from '~types/context';
import { Dispatch, useContext } from 'react';
import { SettingsContext, SettingsDispatchContext } from '~components/providers/SettingsProvider';
import Type from '~enums/Types';
import { MUST_BE_USED_IN_PROVIDER } from '~const/log';
import { SettingsContextActionType } from '~types/action';

export const useSettingsContext = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (typeof context === Type.UNDEFINED) {
    throw new Error(MUST_BE_USED_IN_PROVIDER);
  }
  return context;
};

export const useSettingsDispatch = (): Dispatch<SettingsContextActionType> => {
  const context = useContext(SettingsDispatchContext);
  if (typeof context === Type.UNDEFINED) {
    throw new Error(MUST_BE_USED_IN_PROVIDER);
  }
  return context;
};
