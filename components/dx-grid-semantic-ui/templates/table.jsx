import { Table as TableSUI, Ref } from "semantic-ui-react"

export const Table = ({ tableRef, ...restProps }) => (
  <Ref innerRef={tableRef}>
    <TableSUI fixed {...restProps} />
  </Ref>
)
