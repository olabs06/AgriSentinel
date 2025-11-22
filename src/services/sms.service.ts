import axios from 'axios';
import env from '../config/env';
import logger from '../config/logger';

export class SMSService {
  private apiKey: string;
  private baseURL = 'https://api.ng.termii.com/api';

  constructor() {
    this.apiKey = env.TERMII_API_KEY;
  }

  async sendSMS(phone: string, message: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseURL}/sms/send`, {
        to: this.formatPhone(phone),
        from: 'AgriSentinl',
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: this.apiKey,
      });

      logger.info(`SMS sent to ${phone}`);
      return response.data.message === 'Successfully Sent';
    } catch (error: any) {
      logger.error('SMS error:', error.response?.data || error.message);
      return false;
    }
  }

  private formatPhone(phone: string): string {
    // Ensure Nigerian format +234...
    phone = phone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      return `+234${phone.substring(1)}`;
    }
    if (!phone.startsWith('234')) {
      return `+234${phone}`;
    }
    return `+${phone}`;
  }
}

export default new SMSService();
