import { Component } from 'react'
import Layout from 'components/Layout'
import securePage from '~/hocs/securePage'
import ProfilePage from '~/modules/profile'
import { withRouter } from 'next/router'

class Index extends Component {
  render() {
    return (
      <Layout title='Profile'>
        <ProfilePage type={this.props.router.query.type} />
      </Layout>
    )
  }
}

export default withRouter(securePage(Index))
