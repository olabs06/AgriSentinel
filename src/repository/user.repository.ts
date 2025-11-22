import { db } from '../config/firebase';
import { User } from '../types/models';
import logger from '../config/logger';
import { firestore } from 'firebase-admin';

export class UserRepository {
  private collection = db.collection('users');

  async create(uid: string, userData: Omit<User, 'uid'>): Promise<User> {
    try {
      await this.collection.doc(uid).set({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { uid, ...userData } as User;
    } catch (error) {
      logger.error('User create error:', error);
      throw error;
    }
  }

  async findById(uid: string): Promise<User | null> {
    try {
      const doc = await this.collection.doc(uid).get();
      
      if (!doc.exists) return null;

      return {
        uid: doc.id,
        ...doc.data(),
      } as User;
    } catch (error) {
      logger.error('User find error:', error);
      throw error;
    }
  }

  async update(uid: string, data: Partial<User>): Promise<void> {
    try {
      await this.collection.doc(uid).update({
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      logger.error('User update error:', error);
      throw error;
    }
  }

  async addFCMToken(uid: string, token: string): Promise<void> {
    try {
      await this.collection.doc(uid).update({
        fcmTokens: firestore.FieldValue.arrayUnion(token),
      });
    } catch (error) {
      logger.error('FCM token add error:', error);
      throw error;
    }
  }

  async removeFCMToken(uid: string, token: string): Promise<void> {
    try {
      await this.collection.doc(uid).update({
        fcmTokens: firestore.FieldValue.arrayRemove(token),
      });
    } catch (error) {
      logger.error('FCM token remove error:', error);
      throw error;
    }
  }
}

export default new UserRepository();
