import React from 'react';

// ui components
import { HTMLTable } from '@blueprintjs/core';

// import Typography from 'components/Typography/Typography';

const Rows = ({ numRows, numCols, renderIntoCell = () => {}, loading }) => {
  const rendered = [];

  for (let i = 0; i < numRows; ++i) {
    rendered.push(
      <tr key={i}>
        {(() => {
          const renderedCells = [];
          for (let j = 0; j < numCols; ++j) {
            renderedCells.push(
              <td key={j}>
                {loading ? (
                  <span className={loading ? 'bp3-skeleton' : ''}>loading</span>
                ) : (
                  renderIntoCell(i, j)
                )}
              </td>
            );
          }
          return renderedCells;
        })()}
      </tr>
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
}) {
  const renderIntoCell = (rowIndex, colIndex) => {
    if (!items) {
      items = [];
    }

    const rowData = items[rowIndex] ? items[rowIndex] : [];
    const cellValue = rowData ? rowData[keys[colIndex]] : '';
    return cellValue;
  };

  return (
    <HTMLTable striped>
      <thead>
        <tr>
          {headerLabels.map((label) => (
            <th key={label}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {
          <Rows
            numRows={numRows}
            numCols={numCols}
            renderIntoCell={renderIntoCell}
            loading={loading}
          />
        }
      </tbody>
    </HTMLTable>
  );
}
