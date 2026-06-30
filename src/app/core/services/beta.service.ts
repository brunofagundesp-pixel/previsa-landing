import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

export interface BetaApplicant {
  name: string;
  phone?: string;
  email: string;
  createdAt: firebase.firestore.FieldValue;
  status: 'pending';
}

@Injectable({ providedIn: 'root' })
export class BetaService {
  constructor(private firestore: AngularFirestore) {}

  async apply(data: { name: string; email: string; phone?: string }): Promise<void> {
    await this.firestore.collection('betaApplicants').add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    });
  }
}
