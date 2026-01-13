export interface ChatbotRequest {
  message: string;
  languageCode: string;
  latitude: number;
  longitude: number;
}

export interface ChatbotResponse {
  response?: string;
  message?: string;
  success?: boolean;
  error?: string;
}

export class ChatbotApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ChatbotApiError';
  }
}

export const chatbotApi = {
  /**
   * Send a message to the chatbot API
   */
  async sendMessage(request: ChatbotRequest): Promise<ChatbotResponse> {
    const API_BASE_URL = 'http://localhost:8080';
    const TIMEOUT_MS = 30000; // 30 seconds
    
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If parsing fails, use the status message
        }
        
        throw new ChatbotApiError(errorMessage, response.status, response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ChatbotApiError) {
        throw error;
      }

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ChatbotApiError(
          'Request timeout. The server is taking too long to respond. Please try again.'
        );
      }

      // Handle network errors, CORS issues, etc.
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ChatbotApiError(
          'Cannot connect to backend server. Please ensure the server is running on port 8080.'
        );
      }

      throw new ChatbotApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  },

};
