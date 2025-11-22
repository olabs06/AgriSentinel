import { db } from '../config/firebase';
import { Detection } from '../types/models';
import logger from '../config/logger';

export class DetectionRepository {
  private collection = db.collection('detections');

  async create(detection: Omit<Detection, 'id'>): Promise<Detection> {
    try {
      const docRef = await this.collection.add({
        ...detection,
        timestamp: new Date(),
      });

      return {
        id: docRef.id,
        ...detection,
      } as Detection;
    } catch (error) {
      logger.error('Detection create error:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Detection | null> {
    try {
      const doc = await this.collection.doc(id).get();
      
      if (!doc.exists) return null;

      return {
        id: doc.id,
        ...doc.data(),
      } as Detection;
    } catch (error) {
      logger.error('Detection find error:', error);
      throw error;
    }
  }

  async findByUserId(
    userId: string,
    limit = 50
  ): Promise<Detection[]> {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Detection[];
    } catch (error) {
      logger.error('Detection query error:', error);
      throw error;
    }
  }

  async findRecent(
    cropType: string,
    disease: string,
    location: { state: string; lga?: string },
    days = 7
  ): Promise<Detection[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      let query = this.collection
        .where('cropType', '==', cropType)
        .where('disease', '==', disease)
        .where('location.state', '==', location.state)
        .where('timestamp', '>=', cutoffDate);

      if (location.lga) {
        query = query.where('location.lga', '==', location.lga);
      }
      const snapshot = await query.get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Detection[];
    } catch (error) {
      logger.error('Detection recent query error:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Detection>): Promise<void> {
    try {
      await this.collection.doc(id).update({
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      logger.error('Detection update error:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (error) {
      logger.error('Detection delete error:', error);
      throw error;
    }
  }
}

export default new DetectionRepository();
