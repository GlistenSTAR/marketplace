import React, { Component } from 'react'
import { func, array } from 'prop-types'
import { connect } from 'react-redux'

import { Icon, Grid, GridColumn } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'


import { FilterTag, PopupRow, WiderPopup } from '../constants/layout'
import { groupFilters } from '../constants/filter'


const TAGS_TO_DISPLAY = 3
const MAX_TAG_ENTITIES = 2

class FilterTags extends Component {

  removeFilter = filter => {
    filter.indexes.forEach((index, i) => this.props.onClick(index - i))
  }

  tagMarkup = (filters) => {
    return filters.map((filter, i) => {
      let { valuesDescription } = filter

      if (valuesDescription instanceof Array && valuesDescription.length > MAX_TAG_ENTITIES) {
        return (
          <WiderPopup position='bottom center' trigger={
            <FilterTag key={i} >
              <span>{filter.description}: ({valuesDescription.length})...
                  <Icon onClick={() => this.removeFilter(filter)}
                  name='delete' />
              </span>
            </FilterTag>
          }>
            <Grid verticalAlign='middle'>
              <PopupRow>
                <GridColumn>
                  {valuesDescription.toString().replace(/,/g, ', ')}
                </GridColumn>
              </PopupRow>
            </Grid>
          </WiderPopup>
        )
      } else {
        return <FilterTag key={i}>
          <span>{filter.description}: {valuesDescription.toString().replace(/,/g, ', ')}
            <Icon onClick={() => this.removeFilter(filter)}
              name='delete' />
          </span>
        </FilterTag>
      }
    })

  }


  render() {
    let { appliedFilter } = this.props
    if (!appliedFilter.filters || appliedFilter.filters.length === 0) return null
    let filters = groupFilters(appliedFilter.filters)

    if (!filters || filters.length === 0) return null
    let tagsToDisplay = []

    if (filters instanceof Array && filters.length > TAGS_TO_DISPLAY) {
      tagsToDisplay = this.tagMarkup(filters.slice(0, TAGS_TO_DISPLAY))

      tagsToDisplay.push(
        <WiderPopup disabled={!!!filters[0].description} trigger={
          <FilterTag key={TAGS_TO_DISPLAY} >
            <span><FormattedMessage id='filterTags.andMore' values={{ count: filters.length - TAGS_TO_DISPLAY }} /></span>
          </FilterTag>
        }>
          <Grid verticalAlign='middle'>
            {filters.slice(TAGS_TO_DISPLAY).map((el) => {
              if (el.description && el.valuesDescription)
                return (
                  <PopupRow>
                    <GridColumn computer={8}>
                      {el.description}:
                </GridColumn>
                    <GridColumn computer={8}>
                      {el.valuesDescription.toString().replace(/,/g, ', ')}
                    </GridColumn>
                  </PopupRow>
                )
            }
            )}
          </Grid>
        </WiderPopup>
      )

    } else tagsToDisplay = this.tagMarkup(filters)

    return (
      <>
        {tagsToDisplay}
      </>
    )
  }
}

FilterTags.propTypes = {
  filter: array,
  onClick: func
}

FilterTags.defaultProps = {
  filters: []
}

function mapStateToProps(store) {
  return {
    appliedFilter: store.filter.filter.appliedFilter
  }
}

export default connect(mapStateToProps, null)(FilterTags)