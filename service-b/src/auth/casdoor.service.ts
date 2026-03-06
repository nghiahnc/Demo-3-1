import { Injectable } from '@nestjs/common';
import { SDK } from 'casdoor-nodejs-sdk';

@Injectable()
export class CasdoorService {
  private sdk: SDK;

  constructor() {
    this.sdk = new SDK({
      endpoint: 'http://localhost:8000',
        clientId: 'eed4b793455055225474',
        clientSecret: 'ae8687aa5da43ca77110cff135c8e4896aad354c',
      certificate: 'YOUR_CERTIFICATE',
      orgName: 'built-in',
    });
  }

  getLoginUrl() {
    return this.sdk.getSignInUrl('http://localhost:3001/auth/callback');
  }

  async handleCallback(code: string) {
    return this.sdk.getAuthToken(code);
  }
}
