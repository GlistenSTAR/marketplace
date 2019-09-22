import React, { Component } from 'react'
import { Grid, GridColumn, GridRow, Segment, Header, Form, Button, List } from 'semantic-ui-react'
import styled from 'styled-components'
import { Formik } from 'formik'
import { Input, Dropdown, Checkbox } from 'formik-semantic-ui-fixed-validation'
import { FormattedMessage, injectIntl } from 'react-intl'

import * as Yup from 'yup'
import Router from 'next/router'

import { errorMessages, addressValidationSchema, beneficialOwnersValidation, dwollaControllerValidation, einValidation, websiteValidation } from '~/constants/yupValidation'
import { BeneficialOwnersForm } from '~/components/custom-formik'
import { getSafe } from '~/utils/functions'

import { beneficialOwner, USA, ownersToPayload } from '~/constants/beneficialOwners'

import { AddressForm } from '~/modules/address-form'
import { ControllerForm } from '~/components/custom-formik'

import { postNewDwollaAccount } from '~/modules/admin/api'


const BiggerTextColumn = styled(GridColumn)`
  font-size: 18px;
  line-height: 1.78em;
`


const Wrapper = styled.div`
  background-color: rgba(208, 224, 240, 0.3);
  overflow-y: auto;
  height: 100%;
`

const Container = styled.div`
  margin: 50px;
  overflow-y: auto;
`

const FormColumn = styled(GridColumn)`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 90vh;
  padding-bottom: 50px;
`

const RightAlignedDiv = styled.div`
  text-align: right;
  margin-top: 20px;
`


const numberOfSteps = 7

class DwollaRegister extends Component {

  state = {
    step: 1,
    beneficialOwnersCount: 1,
    submitting: false,
    initialFormValues: {
      beneficialOwners: [beneficialOwner],
    }
  }

  async componentDidMount() {
    const { businessTypes, getBusinessTypes, getBusinessClassifications,
      businessClassifications, getCompanyDetails, companyId } = this.props

    if (companyId) await getCompanyDetails(companyId)
    if (businessTypes.data.length === 0) getBusinessTypes()
    if (businessClassifications.length === 0) getBusinessClassifications()
  }


  getValidationSchema = () => {
    const { requiredMessage, invalidString, invalidEmail, minLength } = errorMessages
    const minLengthValue = 3
    const minLengthErr = minLength(minLengthValue)

    let validationSchema = {}

    const commonValidations = {
      basicString: Yup.string(invalidString).typeError(invalidString).min(minLengthValue, minLengthErr).required(requiredMessage),
      basicNumber: Yup.number(requiredMessage).typeError(requiredMessage).required(requiredMessage),
      email: Yup.string(invalidEmail).email(invalidEmail).required(requiredMessage)
    }

    const validation = [
      {
        firstName: commonValidations.basicString,
        lastName: commonValidations.basicString,
        email: commonValidations.email,
        website: websiteValidation()
      },
      {
        businessName: commonValidations.basicString,
        businessType: commonValidations.basicNumber,
        address: addressValidationSchema(),
        businessClassification: Yup.string(requiredMessage).required(requiredMessage),
        industryClassification: Yup.string(requiredMessage).required(requiredMessage),
        ein: einValidation()
      },
      {},
      { beneficialOwners: beneficialOwnersValidation() },
      { dwollaController: dwollaControllerValidation() }
    ]


    for (let i = 0; i < this.state.step; i++) {
      if (validation[i]) {
        validationSchema = { ...validationSchema, ...validation[i] }
      }
    }


    return Yup.object().shape(validationSchema)

  }

  getContent = (formikProps) => {
    const { values, setFieldValue, resetForm, submitForm } = formikProps
    const { intl: { formatMessage }, businessClassifications, businessClassificationsLoading } = this.props

    let selectedBusiness = businessClassifications.find((el) => el.id === values.businessClassification)
    let industryOptions = selectedBusiness ? selectedBusiness.industryClassifications.map((el) => ({
      key: el.id,
      value: el.id,
      text: el.name
    })) : []


    switch (this.state.step) {
      case 1: {
        return (
          <>
            <GridRow>
              <GridColumn computer={9} tablet={8}>
                <Grid textAlign='center'>
                  <GridRow>
                    <GridColumn computer={16}>
                      <Header as='h2'>
                        <FormattedMessage id='dwolla.paymentPoweredBy' defaultMessage='Echo Global Chemical Exchange payment gateway is powered by:' />
                      </Header>
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    {/* <GridColumn>
                      LOGO
                </GridColumn> */}
                  </GridRow>

                </Grid>
              </GridColumn>

              <GridColumn computer={2} only='computer' />

              <FormColumn computer={5} tablet={8}>
                <Segment padded>

                  <Header as='h4'><FormattedMessage id='dwolla.dwolla.confirmAcc' defaultMessage='Confirm Dwolla Account Admin Information' /></Header>
                  <Header as='h5'><FormattedMessage id='global.step' defaultMessage='Step' /> {' '} {this.state.step} / {numberOfSteps}</Header>
                  <Input label={<FormattedMessage id='global.legalFirstName' defaultMessage='Legal First Name' />} inputProps={{ fluid: true }} name='firstName' />
                  <Input label={<FormattedMessage id='global.legalLastName' defaultMessage='Legal Last Name' />} inputProps={{ fluid: true }} name='lastName' />
                  <Input label={<FormattedMessage id='global.email' defaultMessage='E-Mail' />} inputProps={{ fluid: true }} name='email' />
                  <Input label={<FormattedMessage id='global.websiteURL' defaultMessage='Website URL' />} inputProps={{ fluid: true }} name='website' />

                  <RightAlignedDiv>
                    <Button onClick={() => this.nextStep(formikProps)} primary>
                    <FormattedMessage id='global.saveAndContinue' defaultMessage='Save and Continue'>{text => text}</FormattedMessage>
                  </Button>
                  </RightAlignedDiv>
                </Segment>
              </FormColumn>
          </GridRow>
          </>
        )
      }


      case 2: {
        return (
          <>
            <GridRow>
              <GridColumn computer={10} tablet={3} mobile={2} />
              <FormColumn largeScreen={6} computer={8} tablet={9} mobile={10}>
                <Segment padded>
                  <Header as='h4'><FormattedMessage id='dwolla.confirmCompanyInfo' defaultMessage='Confirm Company Information' /></Header>
                  <Header as='h5'><FormattedMessage id='global.step' defaultMessage='Step' /> {' '} {this.state.step} / {numberOfSteps}</Header>
                  <Input label={<FormattedMessage id='global.businessName' defaultMessage='Business Name' />} inputProps={{ fluid: true }} name='businessName' />
                  <Dropdown
                    loading={this.props.businessTypes.loading}
                    name='businessType'
                    label={<FormattedMessage id='global.businessType' defaultMessage='Business Type' />}
                    options={this.props.businessTypes.data.map((el) => ({
                      key: el.id,
                      value: el.id,
                      text: el.name
                    }))}
                  />

                  <AddressForm
                    values={values}
                    setFieldValue={setFieldValue}
                    displayHeader={false} />

                  <Dropdown
                    name='businessClassification'
                    label={<FormattedMessage id='global.businessClassification' defaultMessage='Business Classification' />}
                    inputProps={{ loading: businessClassificationsLoading, search: true }}
                    options={businessClassifications.map((el) => ({
                      key: el.id,
                      value: el.id,
                      text: el.name
                    }))} />

                  <Dropdown
                    name='industryClassification'
                    label={<FormattedMessage id='global.industryClassification' defaultMessage='Industry Classification' />}
                    inputProps={{ disabled: values.businessClassification === '', loading: businessClassificationsLoading, search: true }}
                    options={industryOptions}
                  />

                  <Input name='ein' label={<FormattedMessage id='global.ein' defaultMessage='EIN' />} />

                  <RightAlignedDiv>

                    <Button type='button' onClick={() => this.setState({ step: this.state.step - 1 })}>
                      <FormattedMessage id='global.back' defaultMessage='Back'>{text => text}</FormattedMessage>
                    </Button>

                    <Button onClick={() => this.nextStep(formikProps)} primary>
                      <FormattedMessage id='global.saveAndContinue' defaultMessage='Save and Continue'>{text => text}</FormattedMessage>
                    </Button>
                  </RightAlignedDiv>
                </Segment>
              </FormColumn>
            </GridRow>
          </>
        )

      }

      case 3: {
        return (
          <>
            <GridRow centered>
              <GridColumn computer={10}>
                <Segment padded>

                  <Grid>
                    <GridRow>
                      <GridColumn>
                        <Header as='h2'>
                          <FormattedMessage id='global.beneficialOwners' defaultMessage='Beneficial Owners' />
                        </Header>
                      </GridColumn>
                    </GridRow>

                    <GridRow>
                      <BiggerTextColumn>
                        <FormattedMessage id='dwolla.beneficialOwnersDesc1' defaultMessage={`To help the government fight financial crime, Federal regulation requires our financial institution partners to obtain, verify, and record information about the beneficial owners of legal entity customers. Legal entities can be abused to disguise involvement in terrorist financing, money laundering, tax evasion, corruption, fraud, and other financial crimes. Requiring the disclosure of key individuals who ultimately own or control a legal entity (e.g. the beneficial owners) helps law enforcement investigate and prosecute these crimes.`} />
                      </BiggerTextColumn>
                    </GridRow>

                    <GridRow>
                      <BiggerTextColumn>
                        <FormattedMessage id='dwolla.beneficialOwnersDesc2' defaultMessage={`The following information must be collected for each individual, if any, who, directly or indirectly, through any contract, arrangement, understanding, relationship or otherwise, owns 25 percent or more of the equity interests of the legal entity listed above. If no individual meets this definition or if the company is publicly traded, please check “Beneficial Owner Not Applicable” below and skip this section.`} />
                      </BiggerTextColumn>
                    </GridRow>

                    <GridRow>
                      <GridColumn>
                        <Checkbox
                          label={formatMessage({ id: 'dwolla.noBeneficialOwner', defaultMessage: 'Beneficial Owner Not Applicable' })}
                          name='beneficialOwnersNotApplicable' />
                      </GridColumn>
                    </GridRow>

                    <GridRow>
                      <GridColumn>
                        <RightAlignedDiv>

                          <Button type='button' onClick={() => this.setState({ step: this.state.step - 1 })}>
                            <FormattedMessage id='global.back' defaultMessage='Back'>{text => text}</FormattedMessage>
                          </Button>

                          <Button onClick={() => this.setState({ step: this.state.step + 1 })} primary>
                            <FormattedMessage id='global.acceptAndContinue' defaultMessage='Accept and Continue'>{text => text}</FormattedMessage>
                          </Button>
                        </RightAlignedDiv>
                      </GridColumn>
                    </GridRow>
                  </Grid>
                </Segment>
              </GridColumn>
            </GridRow>
          </>
        )
      }
      case 4: {
        if (!values.beneficialOwnersNotApplicable) {
          return (
            <>
              <GridRow>
                <FormColumn computer={8} tablet={12}>
                  <Segment padded>
                    <BeneficialOwnersForm
                      handleOwnerCountChange={(values) => {
                        this.setState({
                          initialFormValues: {
                            ...this.state.initialFormValues,
                            beneficialOwners: values.beneficialOwners
                          },
                          beneficialOwnersCount: values.beneficialOwners.length
                        }, () => resetForm(values))
                      }}
                      beneficialOwnersCount={this.state.beneficialOwnersCount}
                      values={values}
                      setFieldValue={setFieldValue} />


                    <RightAlignedDiv>

                      <Button type='button' onClick={() => this.setState({ step: this.state.step - 1 })}>
                        <FormattedMessage id='global.back' defaultMessage='Back'>{text => text}</FormattedMessage>
                      </Button>

                      <Button onClick={() => this.nextStep(formikProps)} primary>
                        <FormattedMessage id='global.saveAndContinue' defaultMessage='Save and Continue'>{text => text}</FormattedMessage>
                      </Button>
                    </RightAlignedDiv>

                  </Segment>

                </FormColumn>

              </GridRow>
            </>
          )
        }

        // Dont break so case 5 happens if no beneficial owners
      }

      case 5: {
        return (
          <>
            <GridColumn computer={9} tablet={8}>
              <Segment padded>
                <Grid>
                  <GridRow>
                    <GridColumn>
                      <Header as='h2'><FormattedMessage id='dwolla.controller' defaultMessage='Controller' /></Header>
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <BiggerTextColumn>
                      <FormattedMessage id='dwolla.controllerDesc1' defaultMessage='To assure compliance with US financial institution policies, Echo must collect the information of at least one individual with significant responsibility for managing the legal entity listed above, such as:' />
                    </BiggerTextColumn>
                  </GridRow>
                  <GridRow>
                    <BiggerTextColumn>
                      <FormattedMessage id='dwolla.controllerDesc2' defaultMessage='* An executive officer or senior manager (e.g., Chief Executive Officer, Chief Financial Officer, Chief Operating Officer, Managing Member, General Partner, President, Vice President, Treasurer); or' />
                    </BiggerTextColumn>
                  </GridRow>

                  <GridRow>
                    <BiggerTextColumn>
                      <FormattedMessage id='dwolla.controllerDesc3' defaultMessage='* Any other individual who regularly performs similar functions.' />
                    </BiggerTextColumn>

                  </GridRow>

                </Grid>
              </Segment>

            </GridColumn>
            <GridColumn computer={1} only='computer'/>

            <FormColumn computer={6} tablet={8}>
              <Segment padded>
                <GridRow>
                  <GridColumn>
                    <Header as='h2'><FormattedMessage id='global.controllerInfo' defaultMessage='Controller Information' /></Header>
                  </GridColumn>
                </GridRow>
                <ControllerForm setFieldValue={setFieldValue} values={values} />
                <GridRow>
                  <GridColumn>
                    <RightAlignedDiv>
                      <Button type='button' onClick={() => this.setState({ step: this.state.step - 1 })}>
                        <FormattedMessage id='global.back' defaultMessage='Back'>{text => text}</FormattedMessage>
                      </Button>

                      <Button onClick={() => this.nextStep(formikProps)} primary>
                        <FormattedMessage id='global.saveAndContinue' defaultMessage='Save and Continue'>{text => text}</FormattedMessage>
                      </Button>

                    </RightAlignedDiv>
                  </GridColumn>

                </GridRow>
              </Segment>

            </FormColumn>
          </>
        )
      }

      case 6: {
        return (
          <GridRow>
            <GridColumn computer={11} />
            <GridColumn computer={5}>
              <Segment loading={this.state.submitting} padded>
                <Grid>
                  <GridRow>
                    <GridColumn>
                      <Header as='h2'><FormattedMessage id='global.certifiedBy' defaultMessage='Certified/Agreed To By:' /> </Header>
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <GridColumn>
                      <Header as='h3'><FormattedMessage id='dwolla.personOpeningAcc' defaultMessage='Person Opening the Account:' /></Header>
                    </GridColumn>
                  </GridRow>
                  <GridRow>
                    <GridColumn>
                      <Input label={<FormattedMessage id='global.legalFirstName' defaultMessage='Legal First Name' />} inputProps={{ fluid: true }} name='firstName' />
                    </GridColumn>
                  </GridRow>
                  <GridRow>
                    <GridColumn>
                      <Input label={<FormattedMessage id='global.legalLastName' defaultMessage='Legal Last Name' />} inputProps={{ fluid: true }} name='lastName' />
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <GridColumn>
                      <Input label={<FormattedMessage id='global.title' defaultMessage='Title' />} inputProps={{ fluid: true }} name='dwollaController.jobTitle' />
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <GridColumn>
                      <Checkbox
                        name='acceptance'
                        label={formatMessage({
                          id: 'dwolla.acceptance',
                          defaultMessage: `I, ${getSafe(() => values.firstName, '') + ' ' + getSafe(() => values.lastName, '')}, hereby certify, to the best of my knowledge, that the information provided above is complete and correct.`
                        }, { name: getSafe(() => values.firstName, '') + ' ' + getSafe(() => values.lastName, '') })}
                      />
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <GridColumn>
                      <RightAlignedDiv>
                        <Button type='button' onClick={() => this.setState({ step: this.state.step - 1 })}>
                          <FormattedMessage id='global.back' defaultMessage='Back'>{text => text}</FormattedMessage>
                        </Button>

                        <Button disabled={!values.acceptance} onClick={() => submitForm()} primary>
                          <FormattedMessage id='global.complete' defaultMessage='Complete'>{text => text}</FormattedMessage>
                        </Button>

                      </RightAlignedDiv>
                    </GridColumn>
                  </GridRow>

                </Grid>
              </Segment>
            </GridColumn>
          </GridRow>
        )
      }


      case 7: {
        return (
          <>
            <GridRow>
              <GridColumn computer={10}>
                <Segment padded>
                  <Grid>
                    <GridRow>
                      <GridColumn>
                        <Header as='h2'><FormattedMessage id='dwolla.registrationComplete' defaultMessage='Registration Completed' /></Header>
                      </GridColumn>
                    </GridRow>

                    <GridRow>
                      <BiggerTextColumn>
                        <FormattedMessage id='dwolla.registrationCompleteDesc1' defaultMessage='Thanks for registering for your Dwolla Account. The verification process can take 24-48 hours. In the meantime you can add your Products, Warehouses, Branches, and other information in the Settings section of (web app name).' />
                      </BiggerTextColumn>
                    </GridRow>

                    <GridRow>
                      <BiggerTextColumn>
                        <FormattedMessage id='dwolla.registrationCompleteDesc2' defaultMessage='Once Dwolla sends you the verification e-mail you can then add your Bank Accounts and Logisitics details. If you don’t receive a verification e-mail please contact support@echoexchange.net or call (833) 321 3246.' />
                      </BiggerTextColumn>
                    </GridRow>

                    <GridRow>
                      <GridColumn>
                        <RightAlignedDiv>
                          <Button onClick={() => Router.push('/settings')} primary>
                            <FormattedMessage id='global.complete' defaultMessage='Complete'>{text => text}</FormattedMessage>
                          </Button>
                        </RightAlignedDiv>
                      </GridColumn>
                    </GridRow>

                  </Grid>
                </Segment>
              </GridColumn>
            </GridRow>
          </>
        )
      }

      default: return null
    }
  }

  nextStep = ({ validateForm, setTouched }) => {
    validateForm()
      .then((errors) => {
        if (Object.keys(errors).length === 0) this.setState({ step: this.state.step + 1 })
        setTouched(errors)
      })
      .catch((err) => console.log('catch', err))
  }



  render() {
    let initialValues = {}
    const { identity, postDwollaAccount, companyId } = this.props

    if (identity && identity.company) {
      const { primaryBranch } = identity.company

      let [firstName, ...lastName] = identity.name ? identity.name.split(' ') : getSafe(() => identity.company.name.split(' '))

      initialValues = {

        firstName,
        lastName: lastName.toString().replace(',', ' '),
        email: identity.email,
        website: getSafe(() => identity.company.website, ''),
        businessName: getSafe(() => identity.company.name),
        businessType: getSafe(() => identity.company.businessType.id),
        address: {
          streetAddress: getSafe(() => primaryBranch.address.streetAddress, ''),
          country: JSON.stringify({
            countryId: getSafe(() => primaryBranch.address.country.id),
            hasProvinces: getSafe(() => primaryBranch.address.country.hasProvinces)
          }),
          province: getSafe(() => primaryBranch.address.province.id),
          zip: getSafe(() => primaryBranch.address.zip.zip, false),
          city: getSafe(() => primaryBranch.address.city,'')
        },
        businessClassification: '9ed35a3b-7d6f-11e3-83c8-5404a6144203',
        industryClassification: '9ed38136-7d6f-11e3-bd75-5404a6144203',
        ein: getSafe(() => identity.company.tin, ''),

        dwollaController: {
          address: {
            streetAddress: '',
            city: '',
            country: USA,
            zip: '',
            province: ''
          },
          dateOfBirth: '',
          firstName: '',
          lastName: '',
          ssn: '',
          jobTitle: ''
        },
        beneficialOwnersNotApplicable: false,
        beneficialOwners: this.state.initialFormValues.beneficialOwners,
        acceptance: false
      }
    }

    return (
      <Wrapper>
        <Container>
          <Formik
            onSubmit={async (values) => {
              this.setState({ submitting: true })

              let payload = {
                ...values,
                beneficialOwners: ownersToPayload(values.beneficialOwners),
                city: values.address.city,
                dwollaController: {
                  ...values.dwollaController,
                  ...values.address,
                  country: JSON.parse(values.dwollaController.address.country).countryId,
                  // zip: JSON.parse(values.dwollaController.address.zip).zip
                },
                // postalCode: JSON.parse(values.address.zip).zip,
                postalCode: values.address.zip,
                address: values.address.streetAddress,
              }

              delete payload.dwollaController.address
              delete payload.acceptance
              delete payload.beneficialOwnersNotApplicable
              try {
                if (payload.beneficialOwners.length === 0) delete payload.beneficialOwners
                if (companyId) await postNewDwollaAccount(payload, companyId)
                else await postDwollaAccount(payload)
                this.setState({ step: this.state.step + 1 })
              }
              catch { }
              finally { this.setState({ submitting: false }) }

            }}
            enableReinitialize
            initialValues={initialValues}
            validationSchema={this.getValidationSchema()}
            render={(formikProps) => {
              return (
                <Form>
                  <Grid verticalAlign={this.state.step === 1 ? 'middle' : 'top'} padded='very' centered>
                    {this.getContent(formikProps)}
                  </Grid>
                </Form>
              )
            }} />

        </Container>
      </Wrapper>
    )
  }
}




export default injectIntl(DwollaRegister)