import './code-cell.css';
import React, { useEffect } from 'react';
import { CodeEditor } from './code-editor';
import { Preview } from './preview';
import { Resizable } from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useCumulativeCode } from '../hooks/use-cumulative-code';

const CodeCell: React.FC<{ cell: Cell }> = ({ cell }) => {
  const bundlingCell = useTypedSelector((state) => state.bundles[cell.id]);

  const { updateCell, createBundler } = useActions();
  const cumulativeCode = useCumulativeCode(cell.id);
  useEffect(() => {
    if (!bundlingCell) {
      createBundler(cell.id, cumulativeCode);
      return;
    }

    const timer = setTimeout(async () => {
      createBundler(cell.id, cumulativeCode);
    }, 750);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundler]);

  return (
    <Resizable direction="vertical">
      <div className={'cell-wrapper'}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundlingCell || bundlingCell.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max={'100'}>
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundlingCell.code} error={bundlingCell.error} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
