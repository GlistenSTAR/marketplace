import { Grid, Segment } from 'semantic-ui-react'
import styled from 'styled-components'

export const DivPageWrapper = styled.div`
  margin: 30px 30px 50px;
  padding: 20px 20px 18px;
  border-radius: 4px;
  border: solid 1px #dee2e6;
  background-color: #ffffff;
`

export const StyledGrid = styled(Grid)`
  &.ui.grid {
    margin: -5px -5px;

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

export const SegmentGroupHeader = styled(Segment.Group)`
  margin: 0 !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  ${({ $noneBorder }) => $noneBorder && 'border: none !important'};
  ${({ $alignItems }) => $alignItems && $alignItems};
`

export const DivGreyText = styled.div`
  color: #848893;
`

export const SegmentCustom = styled(Segment)`
  border-left: none !important;
`

export const DivCollectionStat = styled.div`
  border: solid 1px #dee2e6;
  border-radius: 4px;
  display: flex;
`

export const DivLeftAligned = styled.div`
  text-align: left;
  ${({ $leftBorder }) => ($leftBorder && 'border-left: solid 1px #dee2e6')};
  flex: ${({ $flexWidth }) => ($flexWidth)};
  padding: 17px 17px 13px;
  color: #848893;
`

export const DivValue = styled.div`
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '14px')};
  font-weight: bold;
  color: #282820;
`

export const DivTitleTradeCriteria = styled.div`
  color: #282828;
  font-size: 18px;
  font-weight: 600;
  text-align: left;
`

export const DivValueTradeCriteria = styled.div`
  display: flex;
  align-items: center;
`

export const DivTextValueTradeCriteria = styled.div`
  font-weight: bold;
  margin-right: 6px;
`