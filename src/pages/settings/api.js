// import api from "axios";
import api from '../../../api/_base'

export default {
    getUsers: () => api.get("/prodex/api/users").then(response => response.data),
    getCurrentUser: () => api.get("/prodex/api/users/me").then(response => response.data),    
    getWarehouses: () => api.get('/prodex/api/branches/warehouses/').then(response => response.data),
    getBranches: () => api.get('/prodex/api/branches').then(response => response.data),
    getCreditCardsData: () => api.get('/prodex/api/payments/cards').then(response => response.data),
    getBankAccountsData: () => api.get('/prodex/api/payments/bank-accounts').then(response => response.data),

    postNewWarehouse: body => api.post("/prodex/api/branches/", body),
    postNewCreditCard: body => api.post('/prodex/api/payments/cards/add', body),
    postNewBankAccount: body => api.post('/prodex/api/payments/bank-accounts/add', body),

    putWarehouse: (branchId, body) => api.put(`/prodex/api/branches/${branchId}`, body ),

    deleteWarehouse: branchId => api.delete(`/prodex/api/branches/${branchId}`),
    deleteCreditCard: cardId => api.delete(`/api/payments/cards/${cardId}`),
    deleteBankAccount: bankAccountId => api.delete(`/api/payments/bank-accounts/${bankAccountId}`)
}