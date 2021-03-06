import CasProductsSidebarContent from './CasProductsSidebarContent'
import { connect } from 'react-redux'
// Actions
import { getHazardClasses } from '../../../../global-data/actions'
import { makeGetHazardClasses } from '../../../selectors'
import { makeGetHazardClassesLoading } from '../../../../global-data/selectors'

const makeMapStateToProps = () => {
  const getHazardClasses = makeGetHazardClasses()
  const getHazardClassesLoading = makeGetHazardClassesLoading()

  const mapStateToProps = (state) => {
    return {
      hazardClasses: getHazardClasses(state),
      hazardClassesLoading: getHazardClassesLoading(state)
    }
  }
  return mapStateToProps
}

export default connect(makeMapStateToProps, { getHazardClasses })(CasProductsSidebarContent)