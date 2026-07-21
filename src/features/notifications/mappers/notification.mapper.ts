import type {
  Notification,
  NotificationChannel,
  NotificationListResult,
  NotificationStatus,
} from "@/features/notifications/types/notification.types";
import type { PaginatedMeta } from "@/shared/types/api.types";

export interface NotificationDto {
  id: string;
  user_id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  sent_at?: string | null;
  read_at?: string | null;
  created_at: string;
}

export interface NotificationListDto {
  items: NotificationDto[];
  meta: PaginatedMeta;
  unread_count: number;
}

export function mapNotification(dto: NotificationDto): Notification {
  return {
    id: dto.id,
    userId: dto.user_id,
    title: dto.title,
    message: dto.message,
    channel: dto.channel,
    status: dto.status,
    sentAt: dto.sent_at ?? null,
    readAt: dto.read_at ?? null,
    createdAt: dto.created_at,
  };
}

export function mapNotificationList(
  dto: NotificationListDto,
): NotificationListResult {
  return {
    items: dto.items.map(mapNotification),
    unreadCount: dto.unread_count,
    total: dto.meta.total,
    page: dto.meta.page,
    totalPages: dto.meta.total_pages,
  };
}
