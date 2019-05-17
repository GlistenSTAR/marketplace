import {Checkbox} from 'semantic-ui-react'
import styled from 'styled-components'

export const RuleRow = styled.div`
  position: relative;
  flex: 0 0 45px;
  line-height: 45px;
  border-bottom: 1px solid #e7e7e7;
  padding-left: ${({depth}) => (depth*25)-25}px;
  cursor: pointer;

  &:hover {
    background-color: #EEE;
  }
`

export const RulesRoot = styled.div`
  display: flex;
  flex: 1 0 300px;
  flex-direction: column;
  overflow: auto;
`
export const RulesHeader = styled(RuleRow)`
  font-weight: bold;
  flex: 0 0 45px;
`
export const RulesContent = styled.div`
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
`
export const RuleToggle = styled(Checkbox)`
  position: absolute !important;
  right: 100px;
  top: 14px;
`
export const RuleCheckbox = styled(Checkbox)`
  position: absolute !important;
  right: 30px;
  top: 14px;
`