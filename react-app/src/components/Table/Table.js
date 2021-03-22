import React from 'react';

// ui components
import { HTMLTable } from '@blueprintjs/core';

// import Typography from 'components/Typography/Typography';

const Rows = ({ numRows, numCols, renderIntoCell = () => {}, loading }) => {
  const rendered = [];

  for (let i = 0; i < numRows; i += 1) {
    rendered.push(
      <tr key={i}>
        {(() => {
          const renderedCells = [];
          for (let j = 0; j < numCols; j += 1) {
            renderedCells.push(
              <td key={j}>
                {loading ? (
                  <span className={loading ? 'bp3-skeleton' : ''}>loading</span>
                ) : (
                  renderIntoCell(i, j)
                )}
              </td>,
            );
          }
          return renderedCells;
        })()}
      </tr>,
    );
  }
  return rendered;
};

export default function Table({
  numRows,
  numCols,
  headerLabels = [],
  keys = [],
  items = {},
  loading = false,
  transformData = {},
  tableProps = {},
  overwriteColRenderIntoCell = {}, // allows user to overwrite rendering for a specific column
}) {
  const renderIntoCell = (rowIndex, colIndex) => {
    if (overwriteColRenderIntoCell[colIndex]) {
      return overwriteColRenderIntoCell[colIndex](rowIndex);
    }
    const itemsToRender = items || [];

    const rowData = itemsToRender[rowIndex] ? itemsToRender[rowIndex] : [];
    const cellValue = rowData ? rowData[keys[colIndex]] : '';

    const transformFn = transformData[keys[colIndex]];
    return transformFn ? transformFn(cellValue) : cellValue;
  };

  return (
    <HTMLTable striped {...tableProps}>
      <thead>
        <tr>
          {headerLabels.map((label) => (
            <th key={label}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <Rows
          numRows={numRows}
          numCols={numCols}
          renderIntoCell={renderIntoCell}
          loading={loading}
        />
      </tbody>
    </HTMLTable>
  );
}
