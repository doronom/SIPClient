import React, { createContext, useContext, useState } from 'react';
import AgentServiceStore from './AgentServiceStore';

const AgentContext = createContext();

export const useAgent = () => {
  return useContext(AgentContext);
};

export const AgentProvider = ({ children }) => {
  const [agentServiceStore] = useState(new AgentServiceStore());

  return (
    <AgentContext.Provider value={agentServiceStore}>
      {children}
    </AgentContext.Provider>
  );
};
