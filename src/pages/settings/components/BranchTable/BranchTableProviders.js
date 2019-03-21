import React from 'react' 

import { DataTypeProvider } from '@devexpress/dx-react-grid' 
import { editDeleteCellFormatter } from './BranchTableFormatters' 

const makeFormatterComponent = component => props => (
	<DataTypeProvider
			formatterComponent={ component }			
    	{...props}	
		/>
)
export const EditDeleteFormatterProvider = makeFormatterComponent( editDeleteCellFormatter ) 
