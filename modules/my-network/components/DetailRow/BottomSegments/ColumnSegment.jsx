import PropTypes from 'prop-types'
import { Grid, Segment } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
//Styles
import { DivTitleBottomSegment, DivValue, GridColumnDetail, SegmentBottom } from '../DetailRow.style'
/**
 * Segment shows Legal, Marketing and Verified Data
 * @component
 */
const ColumnSegment = ({ data, titleId }) => (
  <SegmentBottom textAlign='left'>
    <Grid.Row>
      <GridColumnDetail>
        <DivTitleBottomSegment>
          <FormattedMessage id={`myNetworks.detailRow.${titleId}`} defaultMessage='Title' />
        </DivTitleBottomSegment>
      </GridColumnDetail>
    </Grid.Row>
    {Object.keys(data).map((key, i) => {
      return (
        <Grid.Row key={i}>
          <GridColumnDetail>
            <FormattedMessage id={`myNetworks.detailRow.${key}`} defaultMessage='Title' />
            <DivValue fontSize='14px'> {data[key]}</DivValue>
          </GridColumnDetail>
        </Grid.Row>
      )
    })}
  </SegmentBottom>
)

ColumnSegment.propTypes = {
  titleId: PropTypes.string,
  data: PropTypes.object
}

ColumnSegment.defaultProps = {
  titleId: '',
  data: null
}

export default ColumnSegment
