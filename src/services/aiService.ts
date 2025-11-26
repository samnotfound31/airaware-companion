import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/api';
import { AIAdviceRequest, AIAdviceResponse } from '@/types/api';

export const aiService = {
  /**
   * Get AI-powered advice based on current conditions
   * @param request - Context data for AI advice
   */
  async getAdvice(request: AIAdviceRequest): Promise<AIAdviceResponse> {
    return apiClient.post<AIAdviceResponse>(
      API_CONFIG.ENDPOINTS.AI_ADVICE,
      request
    );
  },
};
