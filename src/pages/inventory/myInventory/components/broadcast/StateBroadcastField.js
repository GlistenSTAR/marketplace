import React from 'react';
import BroadcastField from "./BroadcastField";

const StateBroadcastField = ({dispatch, storedState, stateData, statesExpanded, handleExpanded, handleRuleClick, isClientList}) => {
  const offices = stateData.companies.map(i => i.offices)
  const flattenOffices = offices.flat()
  const isExpanded = statesExpanded.includes(stateData.id)
  const partlyBrc = storedState && storedState.broadcastPartly
  const partlyAnonym = storedState && storedState.anonymousPartly
  return (
    <React.Fragment>
      <BroadcastField
        name={stateData.name}
        type="state"
        dispatch={dispatch}
        isClientList={isClientList}
        id={stateData.id}
        partlyBrc={partlyBrc}
        isExpanded={isExpanded}
        handleExpanded={handleExpanded}
        hasChildren={flattenOffices.length > 0}
        handleRuleClick={handleRuleClick}
        partlyAnonym={partlyAnonym}
      />

      {isExpanded && flattenOffices.map(i => {
        return <BroadcastField
        name={i.name}
        type="office"
        dispatch={dispatch}
        isClientList={isClientList}
        id={i.id}
        key={i.id}
        handleRuleClick={handleRuleClick}
        handleExpanded={handleExpanded}
      />
      })}
    </React.Fragment>
  );
};

export default StateBroadcastField;