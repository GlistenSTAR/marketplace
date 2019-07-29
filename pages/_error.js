import React from 'react'
import BackgroundImage from '~/images/background.svg'
import Layout from '~/components/LayoutUnauthorized'
import { Button } from 'semantic-ui-react'
import styled from 'styled-components'
import Router from 'next/router'
import { FormattedMessage } from 'react-intl'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return { statusCode }
  }

  render() {
    return (
      <Layout>
        <PageWrapper>
          <Background src={BackgroundImage} />
          <Message>
            <h1>
              {this.props.statusCode
                ? <FormattedMessage id="error.server" values={{ error: this.props.statusCode || 'unexpected' }} />
                : <FormattedMessage id="error.client" />}<br />
              <FormattedMessage id="error.apologize" />
            </h1><br />
            <Button size="massive" primary onClick={() => Router.push('/')}>
              <FormattedMessage id="error.backButtonText" />
            </Button>
          </Message>
          <Footer>
            <FormattedMessage id="error.footer" values={{ email: <a href="mailto:support@echoechange.com">support@echoechange.com</a> }} />
          </Footer>
        </PageWrapper>
      </Layout>
    )
  }
}

const PageWrapper = styled.div`
  position: relative;
  min-height: 50vh;
  color: #5B5E63;
`
const Message = styled.div`
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  text-align: center;

  h1 {
    padding: 20px;
    background-color: #FFF;
    display: inline-block;
    font-weight: lighter;
  }
`
const Background = styled.img`
  width: 100%;
`
const Footer = styled.p`
  text-align: center;
  font-size: 120%;
  margin: 40px 0 30px 0 !important;
`