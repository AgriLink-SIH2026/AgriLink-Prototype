import { Notification, UserRole } from '../types';
import { saveNotification } from './storage';

export interface NotificationPayload {
  recipientUserId: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  category: Notification['category'];
  linkUrl?: string;
  sendSms?: boolean;
  sendIvr?: boolean;
  recipientPhone?: string;
}

/**
 * SMS / IVR Integration-Ready Gateway Abstraction
 * Logs and routes outgoing telecommunications alerts to simulated carrier endpoints
 */
class TelecomGatewaySimulator {
  public static sendSms(phone: string, text: string) {
    console.info(`[TELECOM SMS GATEWAY] Dispatching SMS to ${phone}: "${text}"`);
    // Ready for integration with Twilio / Gupshup / Exotel
  }

  public static triggerIvrVoiceCall(phone: string, promptText: string) {
    console.info(`[TELECOM IVR GATEWAY] Initiating automated voice call to ${phone}: "${promptText}"`);
    // Ready for IVR telephony integration
  }
}

export const dispatchNotification = (payload: NotificationPayload): Notification => {
  const notif: Notification = {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recipientUserId: payload.recipientUserId,
    recipientRole: payload.recipientRole,
    title: payload.title,
    message: payload.message,
    category: payload.category,
    isRead: false,
    createdAt: new Date().toISOString(),
    channels: {
      in_app: true,
      sms: !!payload.sendSms,
      ivr: !!payload.sendIvr,
    },
    linkUrl: payload.linkUrl,
  };

  // Save to persistent storage
  saveNotification(notif);

  // Trigger SMS abstraction if requested
  if (payload.sendSms && payload.recipientPhone) {
    TelecomGatewaySimulator.sendSms(payload.recipientPhone, `${payload.title}: ${payload.message}`);
  }

  // Trigger IVR abstraction if requested
  if (payload.sendIvr && payload.recipientPhone) {
    TelecomGatewaySimulator.triggerIvrVoiceCall(
      payload.recipientPhone,
      `Namaste, this is AgriLink automated update. ${payload.title}. ${payload.message}`
    );
  }

  return notif;
};
