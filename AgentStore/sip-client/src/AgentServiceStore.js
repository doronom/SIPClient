import { UserAgent, Registerer, Inviter, SessionState, Invitation } from "sip.js";
import "sip.js/lib/platform/web/index.js";

class AgentServiceStore {
  constructor() {
    this.userAgentSip = null;
    this.currentSession = null;
  }

  async createUserAgentSip(agentSipData) {
    const { name, password, domain } = agentSipData;
    const sipToConnect = `sip:${name}@${domain}`;
    const wsServer = `wss://wss-proxy.omega-telecom.net:443`;

    const uri = UserAgent.makeURI(sipToConnect);
    if (!uri) {
      throw new Error('Failed to create URI');
    }

    const transportOptions = {
      server: wsServer,
      keepAliveInterval: 60,
      reconnectionTimeout: 4,
      maxReconnectionAttempts: 10,
    };

    const userAgentOptions = {
      authorizationPassword: password,
      authorizationUsername: name,
      transportOptions,
      uri,
      logLevel: 'debug',
      delegate: {
        onInvite: (invitation) => {
          this.currentSession = invitation;
          console.log('Incoming call');
          invitation.stateChange.addListener((newState) => {
            switch (newState) {
              case SessionState.Established:
                console.log('Session has been established.');
                break;
              case SessionState.Terminated:
                console.log('Session has terminated');
                this.currentSession = null;
                break;
              default:
                break;
            }
          });

          if (invitation instanceof Invitation) {
            this.answerCall(invitation);
          } else {
            console.log('Incoming session is not an invitation.');
          }
        },
      },
    };

    try {
      const userAgent = new UserAgent(userAgentOptions);
      this.userAgentSip = userAgent;
      await userAgent.start();
      console.log('User agent started');
    } catch (error) {
      console.error('Failed to start user agent:', error);
    }
  }

  async registerToSip() {
    if (!this.userAgentSip) {
      console.error('User agent is not initialized.');
      return;
    }

    try {
      const registerer = new Registerer(this.userAgentSip);
      await registerer.register();
      console.log('User agent registered');
    } catch (error) {
      console.error('Failed to register user agent:', error);
    }
  }

  async unregisterFromSip() {
    if (!this.userAgentSip) {
      console.error('User agent is not initialized.');
      return;
    }

    try {
      const registerer = new Registerer(this.userAgentSip);
      await registerer.unregister();
      console.log('User agent unregistered');
    } catch (error) {
      console.error('Failed to unregister user agent:', error);
    }
  }

  makeCall(target) {
    console.log('Attempting to make a call to:', target);

    if (!this.userAgentSip) {
      console.log('User agent is not initialized.');
      return;
    }

    const targetURI = UserAgent.makeURI(target);
    if (!targetURI) {
      console.error('Failed to create target URI');
      throw new Error('Failed to create target URI');
    }

    const inviter = new Inviter(this.userAgentSip, targetURI);

    inviter.invite().then(() => {
      console.log('Call initiated successfully');
    }).catch((error) => {
      console.error('Failed to initiate call:', error);
    });

    inviter.stateChange.addListener((newState) => {
      switch (newState) {
        case SessionState.Initial:
          console.log('Initial state');
          break;
        case SessionState.Establishing:
          console.log('Establishing session');
          break;
        case SessionState.Established:
          console.log('Session established');
          this.currentSession = inviter;
          break;
        case SessionState.Terminating:
          console.log('Terminating session');
          break;
        case SessionState.Terminated:
          console.log('Session terminated');
          this.currentSession = null;
          break;
        default:
          break;
      }
    });
  }

  answerCall(invitation) {
    if (!invitation || !(invitation instanceof Invitation)) {
      console.log('No incoming call to answer');
      return;
    }

    const options = {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false,
        },
      },
    };

    invitation.accept(options).then(() => {
      console.log('Call answered');
    }).catch((error) => {
      console.error('Failed to answer call:', error);
    });
  }

  hangupCall() {
    if (this.currentSession && this.currentSession.state === SessionState.Established) {
      this.currentSession.bye().then(() => {
        console.log('Call ended');
      }).catch((error) => {
        console.error('Failed to end call:', error);
      });
    }
  }
}

export default AgentServiceStore;
