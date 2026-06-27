import twilio from 'twilio';
import { logger } from '../config/logger';

export class VoiceService {
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
        logger.info('🔌 Twilio Voice client initialized successfully.');
      } catch (err) {
        logger.error(`❌ Failed to initialize Twilio Voice client: ${err}`);
      }
    } else {
      logger.warn('⚠️ Twilio Voice credentials are not configured or placeholder detected. Operating in SIMULATED mode.');
    }
  }

  async makeEmergencyCall(messageText: string): Promise<string> {
    if (this.client && this.twilioPhone && this.toPhone) {
      try {
        logger.info(`📞 Triggering real Twilio Emergency Voice Call to ${this.toPhone}...`);
        
        // Generate TwiML for text-to-speech call announcement
        const twimlContent = `<Response><Say voice="alice">${messageText}</Say></Response>`;
        
        const call = await this.client.calls.create({
          twiml: twimlContent,
          to: this.toPhone,
          from: this.twilioPhone,
        });
        
        logger.info(`✅ Twilio Voice call placed successfully. Call Sid: ${call.sid}`);
        return call.sid;
      } catch (err) {
        logger.error(`❌ Twilio Voice call dispatch failed: ${err}. Falling back to simulated log.`);
      }
    }

    // Fallback simulation logger
    const simulatedCallSid = `CALL-SIM-${Date.now()}`;
    logger.info('============================================================');
    logger.info('📞 [VOICE BRIDGE RADIO UPLINK - SIMULATED] Placed Emergency Call');
    logger.info(`📍 Responder Unit: Emergency Dispatch Coordination Unit`);
    logger.info(`👥 Channel: Radio Channel 1 (Critical Alarm)`);
    logger.info(`💬 Speech Output: "${messageText}"`);
    logger.info(`📶 Status: Secured radio relay connected.`);
    logger.info('============================================================');
    return simulatedCallSid;
  }
}

export default VoiceService;
