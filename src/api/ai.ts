import apiClient from './client'

export interface ChatResponse {
  reply: string
}

export const aiApi = {
  chat: (message: string) =>
    apiClient.post<ChatResponse>('/ai/chat', { message }).then(r => r.data),

  recommend: (message: string) =>
    apiClient.post<ChatResponse>('/ai/recommend', { message }).then(r => r.data),
}
