import { FilterBuffer } from '~types/filter';
import { Dispatch, SetStateAction } from 'react';
import produce from 'immer';
import { DefaultState } from '~types/state';

export const handleUpdateFilter = <T extends DefaultState> (
  key: string,
  value: string | boolean,
  setFilter: Dispatch<SetStateAction<T>>,
  setBuffer?: Dispatch<SetStateAction<FilterBuffer<T>>>
): void => {
  setFilter((prevState) => produce(prevState, (draft: T) => {
    draft[key] = value;
  }));
  setBuffer && setBuffer({});
};
