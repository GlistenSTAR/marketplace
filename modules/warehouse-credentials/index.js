import WarehouseCredentialsContainer from './WarehouseCredentials/WarehouseCredentials'
import { DatagridProvider } from '../datagrid'

const WarehouseCredentials = () => {
  return (
    <>
      {type ? (
        <DatagridProvider
          apiConfig={{
            url: `/prodex/api/branches/warehouses/${type}/datagrid`,
            searchToFilter: v => {
              let filters = { or: [], and: [] }
              /*if (v && v.filterName && v.filterName.length > 0) {
                v.filterName.forEach(
                  name =>
                    (filters.or = filters.or.concat([
                      { operator: 'LIKE', path: 'Branch.company.cfDisplayName', values: [`%${name}%`] },
                      { operator: 'LIKE', path: 'Branch.company.primaryBranch.warehouse', values: [`%${name}%`] },
                      { operator: 'LIKE', path: 'Branch.warehouse', values: [`%${name}%`] }
                    ]))
                )
              }
              if (v && v.filterTags && v.filterTags.length > 0) {
                filters.and = v.filterTags.map(idTag => {
                  return {
                    operator: 'EQUALS',
                    path: 'ProductOffer.companyProduct.companyGenericProduct.productGroup.tags.id',
                    values: [idTag]
                  }
                })
              }*/
              return filters
            }
          }}
          preserveFilters>
          <WarehouseCredentialsContainer type={type} />
        </DatagridProvider>
      ) : null}
    </>
  )
}

export default WarehouseCredentials
