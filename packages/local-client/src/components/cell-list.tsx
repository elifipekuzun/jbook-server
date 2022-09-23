import './cell-list.css';
import React, { Fragment, useEffect } from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { CellListItem } from './cell-list-item';
import { AddCell } from './add-cell';
import { useActions } from '../hooks/use-actions';

export const CellList: React.FC = () => {
  const orderedCells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );
  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cell-list">
      <AddCell
        previousCellId={null}
        forcedVisible={orderedCells.length === 0}
      />
      {orderedCells.map((cell) => {
        return (
          <Fragment key={cell.id}>
            <CellListItem cell={cell} />
            <AddCell previousCellId={cell.id} />
          </Fragment>
        );
      })}
    </div>
  );
};
