import { Table as TableSUI } from 'semantic-ui-react'

export const TableHeaderCell = ({
  column,
  tableColumn,
  showGroupingControls,
  onGroup,
  groupingEnabled,
  draggingEnabled,
  onWidthDraftCancel,
  resizingEnabled,
  onWidthChange,
  onWidthDraft,
  tableRow,
  showSortingControls,
  sortingDirection,
  sortingEnabled,
  onSort,
  before,
  style,
  ...restProps
}) => (
  <TableSUI.HeaderCell
    textAlign={tableColumn.align}
    singleLine={!tableColumn.wordWrapEnabled}
    style={{
      ...style,
      width: column.width || 'auto',
      overflow: column.dropdown ? 'unset' : 'hidden'
    }}
    {...restProps}
  />
)
