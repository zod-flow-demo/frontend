import { createApiClient } from './api.client'

export const apiClient = createApiClient(import.meta.env.VITE_API_URL)
