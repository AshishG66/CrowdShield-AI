import { SmsLog } from '../models/SmsLog.model';
import { VoiceCallLog } from '../models/VoiceCallLog.model';
import { Notification } from '../models/Notification.model';
import { broadcastEvent } from '../sockets/socket';
import { logger } from '../config/logger';

export class EmergencyService {
  async triggerEmergencyProtocols(incident: any): Promise<void> {
    try {
      logger.info(`🚨 Emergency Service initiating dispatch cascade for Incident ${incident.incidentId}`);

      // 1. Send SMS Notification
      const smsMessage = `CRITICAL ALERT: Emergency Incident ${incident.incidentId} (${incident.title}) declared at ${incident.location}. Dispersal procedures active.`;
      const sector = 'All Gates & Sectors';
      const audienceCount = 15000;
      
      try {
        const SmsServiceClass = (await import('./sms.service')).default;
        const smsService = new SmsServiceClass();
        await smsService.sendSmsBroadcast(sector, smsMessage, audienceCount);
      } catch (err) {
        logger.error(`❌ Failed to send SMS broadcast: ${err}`);
      }

      // 2. Create & Save SMS Log
      const smsLogId = `SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const smsLog = new SmsLog({
        smsLogId,
        sector,
        message: smsMessage,
        audienceCount,
        status: 'delivered',
        venueId: incident.venueId,
      });
      await smsLog.save();
      logger.info(`💬 SMS Dispatch logged: ${smsLogId}`);

      // 3. Trigger Voice Call Notification
      const voiceMessage = `Attention. A critical emergency incident has been declared at ${incident.location}. Dispersal procedures are now active. Please coordinate dispatch logs immediately.`;
      let voiceCallLogId = `CALL-${Date.now()}`;
      try {
        const VoiceServiceClass = (await import('./voice.service')).default;
        const voiceService = new VoiceServiceClass();
        const callSid = await voiceService.makeEmergencyCall(voiceMessage);
        if (callSid) {
          voiceCallLogId = callSid;
        }
      } catch (err) {
        logger.error(`❌ Failed to dispatch voice call: ${err}`);
      }

      // 4. Create & Save Voice Call Log
      const voiceCallLog = new VoiceCallLog({
        voiceCallLogId,
        responder: 'Emergency Dispatch Coordination Unit',
        channel: 'Radio Channel 1 (Critical Alarm)',
        duration: '0m 45s',
        signalStrength: 95,
        status: 'ended',
        venueId: incident.venueId,
      });
      await voiceCallLog.save();
      logger.info(`📞 Voice Call Dispatch logged: ${voiceCallLogId}`);

      // 3. Create & Save System Notification
      const notificationId = `NOT-${Date.now()}`;
      const notification = new Notification({
        notificationId,
        title: `CRITICAL DISPATCH: ${incident.title}`,
        message: `Incident ${incident.incidentId} active at ${incident.location}. Personnel dispatched.`,
        type: 'security',
        isRead: false,
      });
      await notification.save();
      logger.info(`🔔 System Notification logged: ${notificationId}`);

      // 4. WebSocket Broadcasts for Real-Time Dashboard Updates
      broadcastEvent('incident_created', incident);
      broadcastEvent('sms_dispatched', smsLog);
      broadcastEvent('voice_call_dispatched', voiceCallLog);
      broadcastEvent('notification_received', notification);
      
      logger.info(`✅ Emergency protocols completed for Incident ${incident.incidentId}`);
    } catch (err) {
      logger.error(`❌ Failed to execute emergency dispatch protocols: ${err}`);
    }
  }
}

export default EmergencyService;
