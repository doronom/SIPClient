import React, { useState, useEffect } from 'react';
import AgentServiceStore from './AgentServiceStore.js';
import './App.css';

const agentService = new AgentServiceStore();

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Automation SIP Client</h1>
        <AgentInterface agentService={agentService} />
      </header>
    </div>
  );
};

const AgentInterface = ({ agentService }) => {
  const [agentData, setAgentData] = useState({
    name: '',
    password: '',
    domain: ''
  });
  const [target, setTarget] = useState('');
  const [registered, setRegistered] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);

  useEffect(() => {
    if (agentService.userAgentSip) {
      agentService.userAgentSip.delegate.onInvite = (invitation) => {
        agentService.currentSession = invitation;
        setIncomingCall(true);
        console.log('Incoming call');

        // Automatically answer the call by simulating a button click
        const answerButton = document.getElementById('answer-call-button');
        if (answerButton) {
          answerButton.click();
        }
      };
    }
  }, [agentService.userAgentSip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgentData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTargetChange = (e) => {
    setTarget(e.target.value);
  };

  const handleRegister = async () => {
    try {
      await agentService.createUserAgentSip(agentData);
      await agentService.registerToSip();
      setRegistered(true);
      alert('Registered successfully');
    } catch (error) {
      alert('Failed to register');
    }
  };

  const handleUnregister = async () => {
    try {
      await agentService.unregisterFromSip();
      setRegistered(false);
      alert('Unregistered successfully');
    } catch (error) {
      alert('Failed to unregister');
    }
  };

  const handleHangup = () => {
    agentService.hangupCall();
    setCallInProgress(false);
    setIncomingCall(false); // Reset incoming call status after hangup
  };

  const handleCall = () => {
    if (target) {
      const sipTarget = `sip:${target}`;
      agentService.makeCall(sipTarget);
      setCallInProgress(true);
    } else {
      alert('Please enter a target SIP address.');
    }
  };

  const handleAnswer = () => {
    agentService.answerCall();
    setIncomingCall(false);
    setCallInProgress(true);
  };

  return (
    <div className="flex-container">
      <div className="flex-row">
        <div className="input-group">
          <label>Name:</label>
          <input type="text" name="name" value={agentData.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input type="password" name="password" value={agentData.password} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Domain:</label>
          <input type="text" name="domain" value={agentData.domain} onChange={handleChange} />
        </div>
      </div>
      <div className="flex-row">
        <button className="button-register" onClick={handleRegister} disabled={registered}>
          <i className="fas fa-user-plus icon"></i>Register
        </button>
        <button className="button-unregister" onClick={handleUnregister} disabled={!registered}>
          <i className="fas fa-user-minus icon"></i>Unregister
        </button>
      </div>
      <div className="flex-row">
        <div className="input-group">
          <label>Target SIP Address:</label>
          <input type="text" value={target} onChange={handleTargetChange} />
        </div>
        <button className="button-answer" onClick={handleCall} disabled={!registered}>
          <i className="fas fa-phone icon"></i>Call
        </button>
      </div>
      <div className="flex-row">
        <button className="button-hangup" onClick={handleHangup} disabled={!callInProgress}>
          <i className="fas fa-phone-slash icon"></i>Hangup
        </button>
        <button id="answer-call-button" className="button-answer-call" onClick={handleAnswer}>
          <i className="fas fa-phone icon"></i>Answer Call
        </button>
        {callInProgress && (
        <div className="call-in-progress">Call in progress...</div> 
        )}
      </div>
      {incomingCall && (
        <div className="incoming-call">Incoming call...</div>
      )}
    </div>
  );
};

export default App;
