import { MiddlewareAPI, Dispatch } from 'redux';
import { Actions } from '../actions';
import { RootState } from '../reducers';
import { ActionTypes } from '../action-types';
import { saveCells } from '../action-creators';

export const persistMiddleware = (
  store: MiddlewareAPI<Dispatch<Actions>, RootState>
) => {
  let timer: any;

  return (next: (action: Actions) => void) => {
    return (action: Actions) => {
      next(action);

      if (
        [
          ActionTypes.MOVE_CELL,
          ActionTypes.UPDATE_CELL,
          ActionTypes.INSERT_CELL_AFTER,
          ActionTypes.DELETE_CELL,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          saveCells()(store.dispatch, store.getState);
        }, 250);
      }
    };
  };
};
