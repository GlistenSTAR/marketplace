import { useState } from 'react'
import { Modal, Dimmer, Loader, Input } from 'semantic-ui-react'
import { func, bool, array } from 'prop-types'
import { Trash2 } from 'react-feather'
import { injectIntl, FormattedMessage } from 'react-intl'
// Components
import BasicButton from '../../../../components/buttons/BasicButton'
//Styles
import { ModalCustom, DivConent, DivError } from './InviteModal.styles'

const InviteModal = props => {
  const [value, setValue] = useState('')
  const {
    open,
    intl: { formatMessage },
    onClose,
    search,
    isError,
    loading
  } = props

  return (
    <ModalCustom
      size='tiny'
      open={open}
      onClose={() => {
        onClose()
        setValue('')
      }}
      closeIcon={true}>
      <Dimmer active={loading} inverted>
        <Loader size='large' />
      </Dimmer>
      <Modal.Header>
        <FormattedMessage id='myNetworks.inviteModal.title' defaultMessage='TradePass ID' />
      </Modal.Header>
      <Modal.Content>
        <DivConent>
          <FormattedMessage
            id='myNetworks.inviteModal.content'
            defaultMessage='Sending an invite to a member will allow that member to see your TradePass and allow that member to add you to their network.'
          />
        </DivConent>
        <Input
          fluid
          error={isError}
          placeholder={formatMessage({
            id: 'myNetworks.inviteModal.placeholder',
            defaultMessage: 'Enter TradePass ID'
          })}
          value={value}
          onChange={(e, data) => setValue(data?.value)}
          type='text'
        />
        {isError && (
          <DivError>
            <FormattedMessage
              id='myNetworks.inviteModal.errorLabel'
              defaultMessage='No member was found in this TradePass ID'
            />
          </DivError>
        )}
      </Modal.Content>
      <Modal.Actions>
        <BasicButton
          noBorder
          onClick={() => {
            onClose()
            setValue('')
          }}>
          <b>
            <FormattedMessage id='global.cancel' defaultMessage='Cancel' />
          </b>
        </BasicButton>
        <BasicButton
          noBorder
          textColor='#ffffff !important'
          background='#00c7f9 !important'
          onClick={() => {
            try {
              search(value)
            } catch (err) {
              console.error(err)
            }
          }}>
          <b>
            <FormattedMessage id='global.search' defaultMessage='Search' />
          </b>
        </BasicButton>
      </Modal.Actions>
    </ModalCustom>
  )
}

InviteModal.propTypes = {
  open: bool,
  isError: bool,
  loading: bool,
  onClose: func,
  search: func
}

InviteModal.defaultProps = {
  open: false,
  isError: false,
  loading: false,
  onClose: () => {},
  search: () => {}
}

export default injectIntl(InviteModal)
