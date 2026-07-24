"use client";

import { Badge } from "@/features/cms/components/ui/Badge";
import { Button } from "@/features/cms/components/ui/Button";
import { Modal } from "@/features/cms/components/ui/Modal";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { useCmsTopicSubscribers } from "@/features/cms/hooks/useCmsTopicSubscriptionStats";
import { formatAbsoluteDateTime } from "@/shared/utils/format";

interface TopicSubscribersModalProps {
  topicId: string | null;
  topicName: string;
  onClose: () => void;
}

export function TopicSubscribersModal({
  topicId,
  topicName,
  onClose,
}: TopicSubscribersModalProps) {
  const { data, isLoading, isError } = useCmsTopicSubscribers(topicId);
  const items = data?.items ?? [];

  return (
    <Modal
      open={Boolean(topicId)}
      onClose={onClose}
      title={`Subscribers · ${topicName}`}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {isLoading ? <LoadingState /> : null}
      {isError ? <ErrorState /> : null}
      {!isLoading && !isError && items.length === 0 ? (
        <EmptyState title="No subscribers yet" />
      ) : null}
      {!isLoading && !isError && items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800">
              <tr>
                <th className="px-2 py-2 font-semibold">Email</th>
                <th className="px-2 py-2 font-semibold">Name</th>
                <th className="px-2 py-2 font-semibold">Role</th>
                <th className="px-2 py-2 font-semibold">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {items.map((item) => (
                <tr key={item.userId}>
                  <td className="px-2 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                    {item.email}
                  </td>
                  <td className="px-2 py-2 text-neutral-600 dark:text-neutral-300">
                    {item.fullName || "—"}
                  </td>
                  <td className="px-2 py-2">
                    <Badge tone="muted">{item.role}</Badge>
                  </td>
                  <td className="px-2 py-2 text-neutral-500">
                    {item.subscribedAt
                      ? formatAbsoluteDateTime(item.subscribedAt)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Modal>
  );
}
