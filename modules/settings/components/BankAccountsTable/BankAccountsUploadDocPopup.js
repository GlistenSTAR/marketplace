import { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Grid, GridRow, FormGroup, FormField } from 'semantic-ui-react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Dropdown, Form } from 'formik-semantic-ui-fixed-validation'
import { UploadCloud } from 'react-feather'
import styled from 'styled-components'
//import { closeUploadDocumentsPopup, dwollaGetVerificationDocumentTypes } from "../../actions";
import * as Actions from '../../actions'
import UploadVerifyFiles from './UploadVerifyFiles'
import { getIdentity } from '~/modules/auth/actions'
import { getSafe } from '~/utils/functions'

export const CustomDiv = styled.div`
  padding: 1em;
`

export const CustomA = styled.a`
  font-weight: bold;
  color: #2599d5;
`

export const DivIcon = styled.div`
  display: block;
  height: 10px;
  position: relative;
`

export const CustomButton = styled(Button.Submit)`
  background-color: #2599d5 !important;
  color: #ffffff !important;
`

export const CustomSpan = styled.span`
  display: block;
  margin-top: -0.75em;
  font-size: 12px !important;
  line-height: 1.17 !important;
  color: #848893 !important;
`

export const CustomSpanFiles = styled.span`
  font-weight: bold !important;
  font-style: italic !important;
`

class BankAccountsUploadDocPopup extends Component {
  componentDidMount() {
    if (!this.props.verificationDocumentTypes.length) this.props.dwollaGetVerificationDocumentTypes()
  }

  getInitialFormValues = () => {
    let initialValues = {
      attachments: [],
      attachmentType: ''
    }
    return initialValues
  }

  closeUploadDocumentsPopup = async () => {
    try {
      this.props.getBankAccountsDataRequest()
      const resp = await this.props.getIdentity()
      const hasDwollaAccount = getSafe(() => resp.value.identity.company.dwollaAccountStatus, '') === 'verified'
      if (hasDwollaAccount) this.props.getDwollaAccBalance()
    } catch (e) {
      console.error(e)
    } finally {
      if (this.setSubmitting) this.setSubmitting(false)
      this.props.closeUploadDocumentsPopup()
    }
  }

  render() {
    const {
      verificationDocumentTypes,
      intl: { formatMessage },
      documentsOwner,
      addVerificationDocumentsOwner,
      getDwollaBeneficiaryOwners,
      dwollaAccountStatus
    } = this.props

    return (
      <Modal closeIcon onClose={() => this.props.closeUploadDocumentsPopup()} open centered={false}>
        <Modal.Header>
          <FormattedMessage id='addDocuments.addDocuments' defaultMessage='ADD DOCUMENTS' />
        </Modal.Header>
        <Modal.Content>
          <Form
            initialValues={this.getInitialFormValues()}
            onReset={this.closeUploadDocumentsPopup}
            validateOnBlur={false}
            onSubmit={this.closeUploadDocumentsPopup}>
            {({ values, setFieldValue, setSubmitting, isSubmitting }) => {
              this.setSubmitting = setSubmitting
              this.isSubmitting = isSubmitting
              return (
                <>
                  <Grid>
                    <FormField width={8}>
                      <label>
                        <FormattedMessage id='addInventory.documentType' defaultMessage={'Document Type'} />
                      </label>
                      <Dropdown
                        className={'custom-dropdown'}
                        name={`attachmentType`}
                        options={verificationDocumentTypes}
                        inputProps={{ 'data-test': 'new_inventory_doc_type_drpdn' }}
                      />
                      <CustomSpan>
                        Supported files: <CustomSpanFiles>.jpg</CustomSpanFiles>,{' '}
                        <CustomSpanFiles>.jpeg</CustomSpanFiles> or <CustomSpanFiles>.png</CustomSpanFiles>
                      </CustomSpan>
                    </FormField>
                    <FormField width={8}></FormField>
                    <GridRow>
                      <UploadVerifyFiles
                        {...this.props}
                        attachments={values.attachments}
                        name='attachments'
                        type={values.attachmentType}
                        unspecifiedTypes={['']}
                        documentsOwner={documentsOwner}
                        addVerificationDocumentsOwner={addVerificationDocumentsOwner}
                        getDwollaBeneficiaryOwners={getDwollaBeneficiaryOwners}
                        dwollaAccountStatus={dwollaAccountStatus}
                        fileMaxSize={10}
                        onChange={files =>
                          setFieldValue(
                            `attachments[${
                              values.attachments && values.attachments.length ? values.attachments.length : 0
                            }]`,
                            {
                              id: files.id,
                              name: files.name,
                              type: files.type
                            }
                          )
                        }
                        data-test='settings_bank_account_upload_doc_import_attachments'
                        emptyContent={
                          <CustomDiv>
                            <div>
                              <UploadCloud size='40' color='#dee2e6' />
                            </div>

                            {formatMessage({ id: 'addInventory.dragDrop' })}
                            <br />

                            <FormattedMessage
                              id='addInventory.dragDropOr'
                              defaultMessage={'or {link} to select from computer'}
                              values={{
                                link: (
                                  <CustomA>
                                    <FormattedMessage id='global.clickHere' defaultMessage={'click here'} />
                                  </CustomA>
                                )
                              }}
                            />
                          </CustomDiv>
                        }
                        uploadedContent={
                          <CustomDiv>
                            <div>
                              <UploadCloud size='40' color='#dee2e6' />
                            </div>
                            <FormattedMessage
                              id='addInventory.dragDrop'
                              defaultMessage={'Drag and drop to add file here'}
                            />
                            <br />
                            <FormattedMessage
                              id='addInventory.dragDropOr'
                              defaultMessage={'or {link} to select from computer'}
                              values={{
                                link: (
                                  <CustomA>
                                    <FormattedMessage id='global.clickHere' defaultMessage={'click here'} />
                                  </CustomA>
                                )
                              }}
                            />
                          </CustomDiv>
                        }
                      />
                    </GridRow>
                  </Grid>
                  <div style={{ textAlign: 'right' }}>
                    <Button
                      basic
                      type='button'
                      onClick={() => this.props.closeUploadDocumentsPopup()}
                      data-test='settings_bank_account_upload_doc_popup_close_btn'>
                      <FormattedMessage id='global.cancel' defaultMessage='Cancel'>
                        {text => text}
                      </FormattedMessage>
                    </Button>
                    <CustomButton data-test='settings_bank_account_upload_doc_popup_save_btn'>
                      <FormattedMessage id='global.save' defaultMessage='Save'>
                        {text => text}
                      </FormattedMessage>
                    </CustomButton>
                  </div>
                </>
              )
            }}
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  ...Actions,
  getIdentity
}
const mapStateToProps = state => {
  return {
    //verificationDocumentTypes: state.settings.verificationDocumentTypes,

    verificationDocumentTypes: state.settings.verificationDocumentTypes.map((docType, index) => {
      return {
        key: index,
        text: (
          <FormattedMessage id={`settings.bankAccounts.uploadDoc.${docType}`} defaultMessage={docType}>
            {text => text}
          </FormattedMessage>
        ),
        value: docType
      }
    }),
    documentsOwner: getSafe(() => state.settings.documentsOwner, ''),
    dwollaAccountStatus: getSafe(() => state.auth.identity.company.dwollaAccountStatus, '')
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BankAccountsUploadDocPopup))
