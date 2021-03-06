import Enzyme from 'enzyme'
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17'

// Utils
import { findByTestAttr, mountWithIntl, checkProps, storeFactory } from '../../../test/testUtils'
//Components
import Broadcast from './Broadcast'

/**
 * @description Helper console.log view to see in each test what exactly is rendered in test.
 * console.log(component.debug()) // see what is exactly rendered
 */

Enzyme.configure({ adapter: new EnzymeAdapter() })

const defaultProps = {
  asModal: false,
  additionalGridProps: {},
  hideFobPrice: false,
  isOpenTemplateModal: false,
  saveSidebar: 0,
  detailValues: {},
  inventoryGrid: {},
  dataType: ''
}

describe('`Broadcast` render component', () => {

  test('does not throw warning with expected props', () => {
    //It checks components with default props.
    checkProps(Broadcast, defaultProps)
  })

})
