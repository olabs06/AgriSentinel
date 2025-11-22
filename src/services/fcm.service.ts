import { messaging } from '../config/firebase';
import logger from '../config/logger';

export class FCMService {
  async sendNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<number> {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        tokens,
      };

      const response = await messaging.sendEachForMulticast(message);
      
      logger.info(`FCM sent: ${response.successCount}/${tokens.length}`);
      
      return response.successCount;
    } catch (error) {
      logger.error('FCM error:', error);
      return 0;
    }
  }

  async sendToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ) {
    try {
      await messaging.send({
        topic,
        notification: { title, body },
        data: data || {},
      });

      logger.info(`FCM sent to topic: ${topic}`);
    } catch (error) {
      logger.error('FCM topic error:', error);
    }
  }
}

export default new FCMService();
