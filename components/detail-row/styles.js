import { Grid, Segment, List, GridColumn, Table } from 'semantic-ui-react'
import styled from 'styled-components'

export const StyledGrid = styled(Grid)`
  &.ui.grid {
    margin: 0 5px;

    .row {
      margin: 0;
      padding: 5px 0;
    }

    .column {
      margin: 0;
      padding: 0 5px;
    }
  }
`

export const TableSegment = styled(Segment)`
  margin: 0;
  background-color: #f5f7fa !important;

  &.ui.segment {
    padding: 10px 15px;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
`

export const StyledList = styled(List)`
  &.horizontal.divided:not(.celled) {
    display: flex !important;
    flex-flow: row;
    justify-content: space-between;
    margin: 0;
    &:nth-child(n + 2) {
      border-top: 1px solid rgba(34, 36, 38, 0.15);
    }

    > .item {
      padding: 0px 10px !important;
      max-width: fit-content !important;

      .header {
        margin: 0;
        padding: 0 0 3px;
        font-size: 12px;
        font-weight: 400;
        color: #848893;
        line-height: 1.1666667;
      }

      .description {
        font-size: 14px;
        color: #20273a;
        line-height: 1.2142857;
      }
    }
  }
`

export const DetailMessage = styled.div`
  text-align: left;
  font-size: 14px;
  color: #20273a;
  padding: 0 5px 5px 5px;
`

export const HeaderColumn = styled(GridColumn)`
  padding: 0px !important;
`

export const DivTable = styled.div`
  background-color: #ffffff;
  width: 100%;
`

export const DivHeaderTable = styled.div`
  width: 100%;
  text-align: left;
  color: #848893;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  display: flex;
`

export const DivHeaderColumnTable = styled.div`
  width: ${props => (props.widthProp ? props.widthProp : '15%')};
  padding: 9px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
`

export const DivBodyTable = styled.div`
  width: 100%;
  text-align: left;
  color: #20273a;
  font-size: 14px;
  border-radius: 4px;
  border: solid 1px #dee2e6;
`
export const DivBodyRowTable = styled.div`
  width: 100%;
  display: flex;
  border-bottom: ${props => (props.isLastRow ? 'none' : 'solid 1px #dee2e6;')};
`

export const DivBodyColumnTable = styled.div`
  width: ${props => (props.widthProp ? props.widthProp : '15%')};
  padding: 9px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
`