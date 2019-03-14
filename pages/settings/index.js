
import React, {Component} from 'react'
import Layout from 'components/Layout'
import securePage from '~/hocs/securePage'
import SettingsPage from '../../src/pages/settings'
class Index extends Component {

  render() {
    return (
      <Layout title="Dashboard">
        <h1>Settings</h1>
        <SettingsPage />
      </Layout>
    )
  }
}

export default securePage(Index)