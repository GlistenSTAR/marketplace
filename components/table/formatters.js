import React from 'react'
import { Dropdown, Icon } from 'semantic-ui-react'
import { MoreVertical } from 'react-feather'
import { getSafe } from '~/utils/functions'

const getDropdownItems = (actions = [], row) =>
  actions.map((a, i) =>
    'hidden' in a && typeof a.hidden === 'function' && a.hidden(row) ? null : (
      <Dropdown.Item
        data-test={`action_${row.id}_${i}`}
        key={i}
        text={typeof a.text !== 'function' ? a.text : a.text(row)}
        disabled={getSafe(() => a.disabled(row), false)}
        onClick={() => a.callback(row)}
      />
    )
  )

export function rowActionsCellFormatter({ column: { actions }, row }) {
  const dropdownItems = getDropdownItems(actions, row)

  // Don't display if all dropdownItems are null
  const displayMenu = dropdownItems.findIndex(p => p !== null) >= 0

  return displayMenu ? (
    <Dropdown icon='' trigger={
      <MoreVertical data-text={`action_${row.id}`} />
    }>
      <Dropdown.Menu>{dropdownItems}</Dropdown.Menu>
    </Dropdown>
  ) : null
}

export const dropdownFormatter = ({ column: { options }, row }) => {
  const opts = options.map(p => ({
    text: p.text,
    value: p.value,
    key: p.value,
    callback: p.callback
  }))

  return (
    <Dropdown
      style={{ margin: '-6px' }}
      placeholder='Select permission'
      selection
      fluid
      defaultValue={opts[0].value}
      options={opts}
    />
  )
}
