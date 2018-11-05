import React from 'react';
import BroadcastField from "./BroadcastField";
import RegionBroadcastField from "./RegionBroadcastField";
import CompanyBroadcastField from "./CompanyBroadcastField";

const RootBroadcastField = ({
  rootData, 
  handleExpanded, 
  storedRegions, 
  handleRuleClick, 
  statesExpanded, 
  regionsExpanded, 
  dispatch, 
  isClientList, 
  storedRoot,
  storedStates,
  filterInput,
  categoryFilter
}) => {
  const partlyBrc = storedRoot && storedRoot["1"].broadcastPartly
  const partlyAnonym = storedRoot && storedRoot["1"].anonymousPartly

  const statessData =  rootData.regions.map(i => i.states)
  const companiesData =  statessData.flat().map(i => i.companies)
  const flattenCompanies = companiesData.flat()

  return (
    <>
      <BroadcastField
        name="Root"
        type="root"
        dispatch={dispatch}
        isClientList={isClientList}
        id={rootData.id}
        isExpanded={true}
        hasChildren={rootData.regions.length > 0}
        partlyBrc={partlyBrc}
        partlyAnonym={partlyAnonym}
        handleExpanded={handleExpanded}
        handleRuleClick={handleRuleClick}
      />

      {categoryFilter==="allregions" && rootData.regions.map(i => {
        return <RegionBroadcastField
        type="region"
        dispatch={dispatch}
        isClientList={isClientList}
        key={i.id}
        regionsExpanded={regionsExpanded}
        statesExpanded={statesExpanded}
        regionData={i}
        storedRegion={storedRegions && storedRegions.find(j => j.id === i.id)}
        storedStates={storedStates}
        filterInput={filterInput}
        handleExpanded={handleExpanded}
        handleRuleClick={handleRuleClick}
      />
      })}
      {categoryFilter==="allcompanies" && flattenCompanies.map(i => {
        return <CompanyBroadcastField
        type="comapny"
        dispatch={dispatch}
        isClientList={isClientList}
        key={i.id}
        companyData={i}
        filterInput={filterInput}
        handleExpanded={handleExpanded}
        handleRuleClick={handleRuleClick}
      />
      })}
    </>
  );
};

export default RootBroadcastField;
