import { Timestamp } from 'firebase-admin/firestore';
import { db } from '../config/firebase';
import {
  Conversation,
  ConversationSummary,
  CreateConversationResponse,
  Message,
  Role,
} from '../types';

const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGES_SUBCOLLECTION = 'messages';

/**
 * Creates a new conversation document in Firestore for a given user.
 */
export async function createConversation(
  userId: string,
): Promise<CreateConversationResponse> {
  const now = Timestamp.now();
  const docRef = db.collection(CONVERSATIONS_COLLECTION).doc();

  const conversationData = {
    userId,
    title: 'New Conversation',
    createdAt: now,
    updatedAt: now,
  };

  await docRef.set(conversationData);

  return {
    id: docRef.id,
    title: conversationData.title,
    createdAt: now.toMillis(),
  };
}

/**
 * Returns all conversations belonging to a user, sorted by updatedAt desc.
 */
export async function getConversationsByUser(
  userId: string,
): Promise<ConversationSummary[]> {
  const snapshot = await db
    .collection(CONVERSATIONS_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('updatedAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || 'Untitled Conversation',
      createdAt: (data.createdAt as Timestamp)?.toMillis() || Date.now(),
      updatedAt: (data.updatedAt as Timestamp)?.toMillis() || Date.now(),
    };
  });
}

/**
 * Retrieves a single conversation by ID.
 */
export async function getConversationById(
  conversationId: string,
): Promise<Conversation | null> {
  const doc = await db.collection(CONVERSATIONS_COLLECTION).doc(conversationId).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data()!;
  return {
    id: doc.id,
    userId: data.userId,
    title: data.title || 'Untitled Conversation',
    createdAt: (data.createdAt as Timestamp)?.toMillis() || Date.now(),
    updatedAt: (data.updatedAt as Timestamp)?.toMillis() || Date.now(),
  };
}

/**
 * Updates a conversation's title and/or updatedAt timestamp.
 */
export async function updateConversation(
  conversationId: string,
  updates: { title?: string },
): Promise<void> {
  const now = Timestamp.now();
  const updateData: Record<string, unknown> = {
    updatedAt: now,
  };

  if (updates.title) {
    updateData.title = updates.title;
  }

  await db.collection(CONVERSATIONS_COLLECTION).doc(conversationId).update(updateData);
}

/**
 * Retrieves messages for a conversation, sorted by createdAt asc.
 * If limitCount is provided, fetches the most recent limitCount messages.
 */
export async function getMessagesByConversation(
  conversationId: string,
  limitCount?: number,
): Promise<Message[]> {
  let query = db
    .collection(CONVERSATIONS_COLLECTION)
    .doc(conversationId)
    .collection(MESSAGES_SUBCOLLECTION);

  if (limitCount) {
    const snapshot = await query.orderBy('createdAt', 'desc').limit(limitCount).get();
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        role: data.role as Role,
        content: data.content || '',
        createdAt: (data.createdAt as Timestamp)?.toMillis() || Date.now(),
      };
    });
    // Reverse back to ascending order for LLM context
    return messages.reverse();
  }

  const snapshot = await query.orderBy('createdAt', 'asc').get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      role: data.role as Role,
      content: data.content || '',
      createdAt: (data.createdAt as Timestamp)?.toMillis() || Date.now(),
    };
  });
}

/**
 * Adds a new message document to the subcollection and updates parent conversation updatedAt.
 */
export async function addMessage(
  conversationId: string,
  role: Role,
  content: string,
): Promise<Message> {
  const now = Timestamp.now();
  const messagesRef = db
    .collection(CONVERSATIONS_COLLECTION)
    .doc(conversationId)
    .collection(MESSAGES_SUBCOLLECTION);

  const docRef = messagesRef.doc();
  const messageData = {
    role,
    content,
    createdAt: now,
  };

  await docRef.set(messageData);

  // Touch the parent conversation's updatedAt timestamp
  await db
    .collection(CONVERSATIONS_COLLECTION)
    .doc(conversationId)
    .update({ updatedAt: now })
    .catch(() => {
      /* ignore if conversation doc timestamp update fails */
    });

  return {
    id: docRef.id,
    role,
    content,
    createdAt: now.toMillis(),
  };
}

/**
 * Deletes a conversation document and all of its subcollection message documents.
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  const messagesRef = db
    .collection(CONVERSATIONS_COLLECTION)
    .doc(conversationId)
    .collection(MESSAGES_SUBCOLLECTION);

  // Batch delete all message documents
  const snapshot = await messagesRef.get();
  if (!snapshot.empty) {
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  // Delete parent conversation document
  await db.collection(CONVERSATIONS_COLLECTION).doc(conversationId).delete();
}
