export type NotificationChannel = "in_app" | "email";

export type NotificationStatus = "pending" | "sent" | "read" | "failed";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  sentAt: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResult {
  items: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  totalPages: number;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  status?: NotificationStatus;
  channel?: NotificationChannel;
}
