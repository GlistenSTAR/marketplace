import {connect} from 'react-redux'
import LoginForm from './LoginForm'
import * as Actions from '../actions'

const stateToProps = ({identity}) => identity

export default connect(stateToProps, Actions)(LoginForm)