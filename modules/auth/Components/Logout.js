import React, {Component} from 'react'
import {connect} from 'react-redux'
import {logout} from '~/modules/auth/actions'

class Logout extends Component {
  componentDidMount() {
    const {logout, router} = this.props
    console.log('router.query:', router.query)
    logout(router.query.autoLogout)
  }

  render() { return null }
}

export default connect(() => ({}), {logout})(Logout)