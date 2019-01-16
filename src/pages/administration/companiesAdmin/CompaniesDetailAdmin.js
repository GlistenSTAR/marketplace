import React, { Component } from 'react';
import './companiesAdmin.css';
import { connect } from "react-redux";
import { postNewOffice, putCompanyEdit, putOfficeEdit, fetchDetail, deleteCompany, postNewCompany, deleteOffice, getOffices } from "../../../modules/companies";
import { bindActionCreators } from "redux";
import Office from "./components/Office";
import { fetchLocations } from "../../../modules/location";
import Spinner from "../../../components/Spinner/Spinner";
import InputControlled from '../../../components/InputControlled/InputControlled'
import Button from '../../../components/Button/Button'
import Dropdown from '../../../components/Dropdown/Dropdown'

class CompaniesDetailAdmin extends Component {
  state = {
    name: "",
    officeId: ""
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  componentDidMount() {
    new Promise((resolve) => {
      this.props.fetchDetail(this.props.match.params.id, resolve)
    }).then(() => {
      this.setState({ name: this.props.company.name })
    })
    this.props.getOffices(this.props.match.params.id)
  }

  renderOffices() {
    //TODO: map only office of certain company
    return this.props.isFetching || !Object.keys(this.props.offices).length
      ? <Spinner />
      : this.props.offices.map(office => (
        <Office
          deleteOffice={(id) => this.props.deleteOffice(id, this.props.company)}
          key={office.id}
          id={office.id}
          office={office}
          history={this.props.history}
        />
      ));
  }

  getOfficePayload = (officeId) => {
    const { offices } = this.props;
    const selectedOffice = offices.find(i => i.id === officeId)
    return ({
      id: parseInt(officeId),
      name: selectedOffice.name,
      company: this.props.match.params.id
    })
  }

  render() {
    return (
      <div className="admin-companies">
        <h1 className='header'>Companies administration - {this.props.company.name}</h1>
        <div className="list-companies">
          <h4>Company Detail</h4>
          <div className="company-detail">
            <InputControlled
              value={this.state.name}
              handleChange={this.handleChange}
              name="name"
            />
            <Button color="red" onClick={() => this.props.deleteCompany(this.props.company.id, () => this.props.history.push('/administration/companies/'))}>
              Delete
            </Button>
            <Button color="blue" onClick={() => this.props.putCompanyEdit(Object.assign({}, this.props.company, { name: this.state.name }))}>
              Edit
            </Button>
          </div>
          <h4>Company Offices</h4>
          <table className="company-table">
            <thead>
              <tr><th>Name</th><th></th></tr>
            </thead>
            <tbody>
              {this.renderOffices()}
            </tbody>
          </table>
        </div>

        <div className="add-new-company">
          <Dropdown
            opns={this.props.offices} //TODO: only offices without company
            placeholder="Add new office to company"
            onChange={value => {
              this.setState({ officeId: value })
            }}
          />

          <Button
            color="green"
            onClick={() => this.props.putOfficeEdit(this.getOfficePayload(this.state.officeId), () => { })}
          >Add New</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    isFetching: store.companies.isFetching,
    company: store.companies.detail,
    isFetchingLocation: store.location.locationFetching,
    locations: store.location.locations,
    offices: store.companies.offices,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchDetail, getOffices, putOfficeEdit, putCompanyEdit, postNewCompany, fetchLocations, postNewOffice, deleteOffice, deleteCompany }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesDetailAdmin);