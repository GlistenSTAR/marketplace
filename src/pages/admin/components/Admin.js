import React, { Component } from 'react'
import { connect } from 'react-redux'
import TablesHandlers from './TablesHandlers'
import { Container, Grid, Divider } from 'semantic-ui-react'
import Tabs from './Tabs'

import DataTable from './DataTable/DataTable'
import AddNewPopup3Parameters from './DataTable/AddNewPopup3Parameters'


const tables = {
    'Units of Measure': <DataTable />,
    'Units of Packaging': <DataTable />,
    'Manufacturers': <DataTable />,
    'Grades': <DataTable />,
    'Forms': <DataTable />,
    'Conditions': <DataTable />,
}

const editForms = {
}

const addForms = {
    'Units of Measure': <AddNewPopup3Parameters />,
    /*'Units of Packaging': <AddNewPopup />,
    'Manufacturers': <AddNewPopup />,
    'Grades': <AddNewPopup />,
    'Forms': <AddNewPopup />,
    'Conditions': <AddNewPopup />,*/
}

class Admin extends Component {

    renderContent = () => {
        const {
            currentEditForm,
            currentAddForm,
            currentTab,
        } = this.props

        console.log(this.props);
        console.log('currentTab: ', currentTab, '   currentAddForm: ', currentAddForm, '   currentEditForm: ', currentEditForm);

        return (
            <>
                {currentAddForm && addForms[currentTab]}
                {currentEditForm && editForms[currentTab]}
                {tables[currentTab] || <p>This page is still under construction</p>}
            </>
        )

    }

    render() {
        return (
            <Container fluid style={{ marginTop: 20 }}>
                <TablesHandlers />
                <Divider />
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Tabs />
                        </Grid.Column>
                        <Grid.Column key={ this.props.currentTab }>
                            {this.renderContent()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return state.admin
}


export default connect(mapStateToProps, null)(Admin)