import {connect} from 'react-redux'
import Router from 'next/router'
import AddInventoryForm from './AddInventoryForm'
import * as Actions from '../actions'

function mapStateToProps(store) {
    return {
        ...store.simpleAdd,
        edit: (Router.router && Router.router.query.type === 'edit' ? Router.router.query.id : false)
    }
}

export default connect(mapStateToProps, Actions)(AddInventoryForm)