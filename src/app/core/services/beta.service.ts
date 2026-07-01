import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export interface BetaApplicant {
  name: string;
  phone?: string;
  email: string;
  createdAt: firebase.firestore.FieldValue;
  status: 'pending';
  registrationNumber: number;
}

@Injectable({ providedIn: 'root' })
export class BetaService {
  async apply(data: { name: string; email: string; phone?: string }): Promise<void> {
    const db = firebase.firestore();
    const counterRef = db.collection('counters').doc('betaCount');

    await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      const currentCount = counterDoc.exists ? counterDoc.data()!['count'] : 0;
      const newCount = currentCount + 1;

      transaction.set(counterRef, { count: newCount });
      transaction.set(db.collection('betaApplicants').doc(), {
        name: data.name,
        email: data.email,
        ...(data.phone ? { phone: data.phone } : {}),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
        registrationNumber: newCount
      });
    });
  }
}
