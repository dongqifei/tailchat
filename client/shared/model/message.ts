import { request } from '../api/request';
import type { ChatMessageReaction, ChatMessage } from 'tailchat-types';

export { ChatMessageReaction, ChatMessage };

export interface LocalChatMessage extends ChatMessage {
  /**
   * 本地添加消息的标识，用于标记该条消息尚未确定已经发送到服务端
   */
  isLocal?: boolean;
  /**
   * 判断是否发送失败
   */
  sendFailed?: boolean;
}

export interface SimpleMessagePayload {
  groupId?: string;
  converseId: string;
  content: string;
}

export interface SendMessagePayloadMeta {
  mentions?: string[];
}

export interface SendMessagePayload extends SimpleMessagePayload {
  /**
   * content的plain内容
   * 用于inbox
   */
  plain?: string;
  meta?: SendMessagePayloadMeta;
}

/**
 * 获取会话消息
 * @param converseId 会话ID
 * @param startId 开始ID
 */
export async function fetchConverseMessage(
  converseId: string,
  startId?: string
): Promise<ChatMessage[]> {
  const { data } = await request.get('/api/chat/message/fetchConverseMessage', {
    params: {
      converseId,
      startId,
    },
  });

  return data;
}

/**
 * 发送消息
 * @param payload 消息体
 */
export async function sendMessage(
  payload: SendMessagePayload
): Promise<ChatMessage> {
  const { data } = await request.post('/api/chat/message/sendMessage', payload);

  return data;
}

/**
 * 撤回消息
 * @param messageId 消息ID
 */
export async function recallMessage(messageId: string): Promise<ChatMessage> {
  const { data } = await request.post('/api/chat/message/recallMessage', {
    messageId,
  });

  return data;
}

export async function deleteMessage(messageId: string): Promise<boolean> {
  const { data } = await request.post('/api/chat/message/deleteMessage', {
    messageId,
  });

  return data;
}

/**
 * 基于会话id获取会话最后一条消息的id
 */
export async function fetchConverseLastMessages(
  converseIds: string[]
): Promise<{ converseId: string; lastMessageId: string }[]> {
  const { data } = await request.post(
    '/api/chat/message/fetchConverseLastMessages',
    {
      converseIds,
    }
  );

  return data;
}

/**
 * @param converseId 会话ID
 * @param messageId 消息ID
 * @returns 消息附近的信息
 */
export async function fetchNearbyMessage(params: {
  groupId?: string;
  converseId: string;
  messageId: string;
}): Promise<ChatMessage[]> {
  const { data } = await request.post(
    '/api/chat/message/fetchNearbyMessage',
    params
  );

  return data;
}

/**
 * 增加表情行为
 */
export async function addReaction(
  messageId: string,
  emoji: string
): Promise<boolean> {
  const { data } = await request.post('/api/chat/message/addReaction', {
    messageId,
    emoji,
  });

  return data;
}

/**
 * 移除表情行为
 */
export async function removeReaction(
  messageId: string,
  emoji: string
): Promise<boolean> {
  const { data } = await request.post('/api/chat/message/removeReaction', {
    messageId,
    emoji,
  });

  return data;
}
