import twilio from 'twilio';
import { logger } from '../config/logger';

export class SmsService {
  private client?: twilio.Twilio;
  private twilioPhone?: string;
  private toPhone?: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    this.toPhone = process.env.TO_PHONE_NUMBER || process.env.ALERT_PHONE_NUMBER;

    if (accountSid && authToken && accountSid !== 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') {
      try {
        this.client = twilio(accountSid, authToken);
        logger.info('🔌 Twilio SMS client initialized successfully.');
      } catch (err) {
        logger.error(`❌ Failed to initialize Twilio client: ${err}`);
      }
    } else {
      logger.warn('⚠️ Twilio SMS credentials are not configured or placeholder detected. Operating in SIMULATED mode.');
    }
  }

  async sendSmsBroadcast(sector: string, message: string, audienceCount: number): Promise<boolean> {
    if (!this.client || !this.twilioPhone || !this.toPhone) {
      const errorMsg = '❌ Twilio SMS service is not initialized properly (missing credentials or phone numbers).';
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      logger.info(`📱 Sending real Twilio SMS to ${this.toPhone}...`);
      const response = await this.client.messages.create({
        body: message,
        from: this.twilioPhone,
        to: this.toPhone,
      });
      logger.info(`✅ Twilio SMS sent successfully. Message Sid: ${response.sid}`);
      return true;
    } catch (err) {
      logger.error(`❌ Twilio SMS dispatch failed: ${err}`);
      throw err;
    }
  }
}

export default SmsService;
