import axios from 'axios';

const api = {
  //TODO after backend is done, add search var into params (fetchRegions, fetchStates)
  fetchRegions: (search) => axios.get('/api/r1prnp/regions/', { params: {} }).then(response => response.data.data.regions),
  fetchRegionDetail: (id) => axios.get(`/api/eq0kii/countries/?regionId=${id}`).then(response => response.data.data),
  fetchStates: (search) => axios.get(`/api/eq0kii/countries/`, { params: {} }).then(response => response.data.data.countries),
  fetchStateDetail: (id) => axios.get(`/api/9o9w90/companies/?entityId=${id}&entityType=country`).then(response => response.data.data),
  fetchBroadcast: () => fakeBroadcast,
};

export default api;


const fakeBroadcast = {
  root: {
    type: "root", 
    broadcast: 2, 
    anonymous: 1, 
    priceAddition: null, 
    priceMultiplier: null,
    regions: [
      { 
        type: "region", 
        id: 1, 
        name: "Europe", 
        broadcast: 2, 
        anonymous: 1, 
        priceAddition: 150, 
        priceMultiplier: null, 
        states: [
          {
            type: "country", 
            id: 1, 
            name: "Czech Republic", 
            broadcast: 2, 
            anonymous: 1, 
            priceAddition: 150, 
            priceMultiplier: null,
            companies: [
              {
                type: "company", 
                id: 1, 
                name: "Company A", 
                broadcast: 0, 
                anonymous: 1, 
                priceAddition: 150, 
                priceMultiplier: null,
                offices: [
                  {
                    type: "office", 
                    id: 1, 
                    name: "Office AA", 
                    broadcast: 0, 
                    anonymous: 1, 
                    priceAddition: 150, 
                    priceMultiplier: null,
                  }
                ]
              },
              {
                type: "company", 
                id: 2, 
                name: "Company B", 
                broadcast: 1, 
                anonymous: 1, 
                priceAddition: 150, 
                priceMultiplier: null,
                offices: [
                  {
                    type: "office", 
                    id: 2, 
                    name: "Office BA", 
                    broadcast: 1, 
                    anonymous: 1, 
                    priceAddition: 150, 
                    priceMultiplier: null,
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

