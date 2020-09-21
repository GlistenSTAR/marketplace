import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Popup, Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { getSafe } from '~/utils/functions'

const DivRectangleForm = styled.div`
  padding: 0px !important;
  width: 740px;
  overflow: auto;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.06);
  border: solid 1px #dee2e6;
  background-color: #ffffff;
  text-align: initial;
  position: relative;
  margin-bottom: 20px;
`

const DivTitleRectangleForm = styled.div`
  border-bottom: solid 1px #dee2e6;
  height: 50px;
  display: flex;
  justify-content: space-between;
`
const DivTitleText = styled.div`
  font-weight: bold;
  padding: 16px 30px;
  height: 50px;
`

const DivButtonsBottom = styled.div`
  overflow: auto;
  color: #ffffff;
  margin: 0 30px 30px 0;
`

const ButtonSubmit = styled(Button)`
  float: right !important;
  background: #2599d5 !important;
  margin-left: 10px !important;
  margin-right: 0px !important;
`

const ButtonBack = styled(Button)`
  float: right !important;
  margin-left: 10px !important;
`

const DivSubtitleText = styled.div`
  text-align: right;
  color: #848893;
  font-size: 12px;
  padding: 16px 30px;
`

const SpanSubtitleValue = styled.span`
  font-weight: bold;
  color: #84c225;
`
const RightAlignedDiv = styled.div`
  text-align: right !important;
  margin: 0 30px 10px 0;
`

function FormRectangle({
  children,
  formikProps,
  title,
  subtitle,
  prevStep,
  activeStep,
  submitForm,
  countBeneficialOwners,
  numberBeneficialOwners
}) {
  //if user is not beneficial owner, is on last form (Term and Conditions) and pressed button Back then must skip Beneficial form. That means activeStep minus 2
  const step = !getSafe(() => formikProps.values.ownerInformation.isBeneficialOwner, false) && activeStep === 5 ? 2 : 1
  return (
    <DivRectangleForm height={activeStep === 3 || activeStep === 4 ? '1000px' : activeStep === 5 ? '400px' : '860px'}>
      <DivTitleRectangleForm>
        <DivTitleText>
          <FormattedMessage id={title} defaultMessage='Title'>
            {text => text}
          </FormattedMessage>
        </DivTitleText>
        {subtitle ? (
          <DivSubtitleText>
            <FormattedMessage
              id={subtitle}
              defaultMessage={`Subtitle`}
              values={{
                percentage: (
                  <SpanSubtitleValue>
                    <FormattedMessage id='global.25percentage' defaultMessage={'25%'} />
                  </SpanSubtitleValue>
                )
              }}
            />
          </DivSubtitleText>
        ) : null}
      </DivTitleRectangleForm>
      {children}
      {activeStep === 4 && (
        <RightAlignedDiv>
          {numberBeneficialOwners > 0 && (
            <Popup
              trigger={
                <a href={`#form${numberBeneficialOwners}`}>
                  <Button
                    style={{ float: 'right !important', marginLeft: '10px !important', marginRight: '0px !important' }}
                    type='button'
                    negative
                    onClick={() => {
                      countBeneficialOwners(numberBeneficialOwners - 1)
                    }}
                    icon>
                    <Icon name='minus' />
                  </Button>
                </a>
              }
              content={
                <FormattedMessage id='settings.removeBeneficialOwner' defaultMessage='Remove beneficial owner' />
              }
            />
          )}

          <Popup
            trigger={
              <a href={`#form${numberBeneficialOwners}`}>
                <Button
                  type='button'
                  style={{ marginLeft: '10px !important', marginRight: '0px !important' }}
                  positive
                  onClick={() => {
                    countBeneficialOwners(numberBeneficialOwners + 1)
                  }}
                  icon>
                  <Icon name='plus' />
                </Button>
              </a>
            }
            content={<FormattedMessage id='settings.addBeneficialOwner' defaultMessage='Add beneficial owner' />}
          />
        </RightAlignedDiv>
      )}

      <DivButtonsBottom>
        <ButtonSubmit type='button' onClick={() => submitForm(formikProps)} primary>
          <FormattedMessage
            id={activeStep === 5 ? 'velloci.submitApplication' : 'global.next'}
            defaultMessage={activeStep === 5 ? 'Submit Application' : 'Next'}>
            {text => text}
          </FormattedMessage>
        </ButtonSubmit>
        {activeStep > 0 ? (
          <ButtonBack type='button' onClick={() => prevStep(activeStep - step)} basic>
            <FormattedMessage id='global.back' defaultMessage='Back'>
              {text => text}
            </FormattedMessage>
          </ButtonBack>
        ) : null}
        {activeStep === 3 ? (
          <ButtonBack type='button' onClick={() => console.log('email')} basic>
            <FormattedMessage id='global.email' defaultMessage='Email'>
              {text => text}
            </FormattedMessage>
          </ButtonBack>
        ) : null}
      </DivButtonsBottom>
    </DivRectangleForm>
  )
}

FormRectangle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  formikProps: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  prevStep: PropTypes.func,
  submitForm: PropTypes.func,
  activeStep: PropTypes.number,
  countBeneficialOwners: PropTypes.func,
  numberBeneficialOwners: PropTypes.number
}

FormRectangle.defaultProps = {
  formikProps: {},
  title: 'Title',
  subtitle: '',
  prevStep: () => {},
  submitForm: () => {},
  activeStep: 0,
  countBeneficialOwners: () => {},
  numberBeneficialOwners: 0
}

export default FormRectangle