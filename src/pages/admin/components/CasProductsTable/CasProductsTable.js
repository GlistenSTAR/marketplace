import React, {Component} from "react"
import {connect} from "react-redux"
import { Label } from 'semantic-ui-react'
import ProdexTable from '~/components/table'
import {
  getCasProductByFilter,
  openEditCasPopup,
  casDeleteItem,
  getHazardClassesDataRequest, getPackagingGroupsDataRequest
} from '../../actions'


class CasProductsTable extends Component {
  componentDidMount() {
    this.props.getCasProductByFilter(this.props.casListDataRequest)
    this.props.getHazardClassesDataRequest()
    this.props.getPackagingGroupsDataRequest()
  }

  render() {
    const {
      config,
      loading,
      rows,
      filterValue,
      currentTab,
      openEditCasPopup,
      casDeleteItem,
      reloadFilter
    } = this.props

    const { columns } = config.display

    return (
      <React.Fragment>
        <ProdexTable
          //filterValue={filterValue}
          loading={loading}
          columns={columns}
          groupBy={['packagingGroup']}
          rows={rows}
          rowActions={[
            {text: 'Edit', callback: (row) => openEditCasPopup(row)},
            {text: 'Delete', callback: (row) => casDeleteItem(row.id, reloadFilter)}
          ]}
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  getCasProductByFilter,
  openEditCasPopup,
  casDeleteItem,
  getHazardClassesDataRequest,
  getPackagingGroupsDataRequest,
}

const transformHazardClasses = classes => (
  <Label.Group color='blue'>
    {classes.map((b,i) => <Label size='tiny' key={i} title={b.description}>{b.classCode}</Label>)}
  </Label.Group>
)

const mapStateToProps = state => {
  let cfg = state.admin.config[state.admin.currentTab]
  return {
    config: cfg,
    filterValue: state.admin.filterValue,
    currentTab: state.admin.currentTab,
    casListDataRequest: state.admin.casListDataRequest,
    loading: state.admin.loading,
    rows: state.admin.casProductsRows.map(d => {
      return {
        id: d.id,
        casIndexName: d.casIndexName,
        casNumber: d.casNumber,
        chemicalName: d.chemicalName,
        packagingGroup: !!d.packagingGroup ? d.packagingGroup.groupCode : '',
        unNumberCode: !!d.unNumber ? d.unNumber.unNumberCode : '',
        unNumberId: !!d.unNumber ? d.unNumber.id : '',
        unNumberDescription: !!d.unNumber ? d.unNumber.description : '',
        hazardClasses: transformHazardClasses(d.hazardClasses),
        // Prepare initial values for editing form
        packagingGroupId: !!d.packagingGroup ? d.packagingGroup.id : '',
        hazardClassesId: !!d.hazardClasses ? (d.hazardClasses.map(a => a.id)) : [],
      }
    }),
    // reloadFilter is used to reload CAS Product list after Edit / Add new CAS Product
    reloadFilter: {props: {
        currentTab: state.admin.currentTab,
        casListDataRequest: state.admin.casListDataRequest},
      value: state.admin.filterValue},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CasProductsTable)