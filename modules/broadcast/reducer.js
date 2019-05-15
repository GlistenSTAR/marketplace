import typeToReducer from 'type-to-reducer'
import {openBroadcast, closeBroadcast} from './actions'

const initialState = {
  open: false,
  loading: false,
  data: null
}

export default typeToReducer({
  [openBroadcast.pending]: (state, action) => {
    return {...state,
      open: true,
      loading: true
    }
  },

  [openBroadcast.fulfilled]: (state, {payload}) => {
    return {...state,
      loading: false,
      data: payload
    }
  },

  [closeBroadcast]: (state) => {
    return {...state,
      open: false,
      data: null,
      loading: false  
    }
  }
}, initialState)