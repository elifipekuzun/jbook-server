import { Dispatch } from 'react';
import axios from 'axios';
import { ActionTypes } from '../action-types';
import {
  UpdateCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  MoveCellAction,
  Direction,
  Actions,
} from '../actions';
import { CellTypes, Cell } from '../cell';
import bundle from '../../bundler';
import { RootState } from '../reducers';

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionTypes.UPDATE_CELL,
    payload: { id, content },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionTypes.DELETE_CELL,
    payload: { id },
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionTypes.MOVE_CELL,
    payload: { id, direction },
  };
};

export const insertCellAfter = (
  id: string | null,
  type: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionTypes.INSERT_CELL_AFTER,
    payload: { id, type },
  };
};

export const createBundler = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Actions>) => {
    dispatch({
      type: ActionTypes.BUNDLE_START,
      payload: { cellId },
    });
    const result = await bundle(input);
    dispatch({
      type: ActionTypes.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: result,
      },
    });
  };
};

export const fetchCells = () => {
  return async (dispatch: Dispatch<Actions>) => {
    dispatch({ type: ActionTypes.FETCH_CELLS });

    try {
      const { data } = await axios.get('/cells');
      const cells: Cell[] = data.cells;

      dispatch({ type: ActionTypes.FETCH_CELLS_COMPLETE, payload: { cells } });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({
          type: ActionTypes.FETCH_CELLS_ERROR,
          payload: { error: error.message },
        });
      }
    }
  };
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Actions>, getState: () => RootState) => {
    const {
      cells: { data, order },
    } = getState();
    const cells = order.map((id) => data[id]);

    try {
      await axios.post('/cells', { cells });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({
          type: ActionTypes.SAVE_CELLS_ERROR,
          payload: { error: error.message },
        });
      }
    }
  };
};
