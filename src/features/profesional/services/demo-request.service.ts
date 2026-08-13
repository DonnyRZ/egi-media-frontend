import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";

export interface DemoRequestPayload {
  full_name: string;
  company_name: string;
  job_title: string;
  work_email: string;
  phone?: string;
  message?: string;
  website?: string;
}

export async function submitDemoRequest(payload: DemoRequestPayload): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.profesionalDemoRequests, payload);
}
