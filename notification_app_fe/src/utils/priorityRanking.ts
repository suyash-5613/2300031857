import { appLog } from "@/middleware/logging";
import type { NotificationItem, NotificationType } from "@/types/notification";

type RankedNotification = NotificationItem & {
  rankScore: number;
};

function getTypeScore(notificationType: NotificationType): number {
  switch (notificationType) {
    case "Placement":
      return 3;
    case "Result":
      return 2;
    case "Event":
      return 1;
    default:
      return 0;
  }
}

function compareNotifications(left: RankedNotification, right: RankedNotification): number {
  if (left.rankScore !== right.rankScore) {
    return left.rankScore - right.rankScore;
  }

  return Date.parse(left.createdAt) - Date.parse(right.createdAt);
}

function swap(heap: RankedNotification[], leftIndex: number, rightIndex: number): void {
  const temp = heap[leftIndex];
  heap[leftIndex] = heap[rightIndex];
  heap[rightIndex] = temp;
}

function bubbleUp(heap: RankedNotification[], startIndex: number): void {
  let index = startIndex;

  while (index > 0) {
    const parentIndex = Math.floor((index - 1) / 2);

    if (compareNotifications(heap[index], heap[parentIndex]) >= 0) {
      break;
    }

    swap(heap, index, parentIndex);
    index = parentIndex;
  }
}

function bubbleDown(heap: RankedNotification[], startIndex: number): void {
  let index = startIndex;

  while (true) {
    const leftChildIndex = index * 2 + 1;
    const rightChildIndex = index * 2 + 2;
    let smallestIndex = index;

    if (leftChildIndex < heap.length && compareNotifications(heap[leftChildIndex], heap[smallestIndex]) < 0) {
      smallestIndex = leftChildIndex;
    }

    if (rightChildIndex < heap.length && compareNotifications(heap[rightChildIndex], heap[smallestIndex]) < 0) {
      smallestIndex = rightChildIndex;
    }

    if (smallestIndex === index) {
      break;
    }

    swap(heap, index, smallestIndex);
    index = smallestIndex;
  }
}

function heapPush(heap: RankedNotification[], notification: RankedNotification): void {
  heap.push(notification);
  bubbleUp(heap, heap.length - 1);
}

function heapPopMin(heap: RankedNotification[]): RankedNotification | undefined {
  if (heap.length === 0) {
    return undefined;
  }

  const root = heap[0];
  const lastItem = heap.pop();

  if (heap.length > 0 && lastItem) {
    heap[0] = lastItem;
    bubbleDown(heap, 0);
  }

  return root;
}

export async function getTopPriorityNotifications(
  notifications: NotificationItem[],
  limit: number,
): Promise<NotificationItem[]> {
  try {
    await appLog("frontend", "info", "utils", "Priority ranking algorithm started");

    if (!Number.isFinite(limit) || limit <= 0) {
      throw new Error("Invalid priority limit");
    }

    const heap: RankedNotification[] = [];

    for (const notification of notifications) {
      await appLog("frontend", "debug", "utils", `Processing notification: ${notification.id}`);

      if (notification.status !== "unread") {
        continue;
      }

      const rankScore = getTypeScore(notification.type);
      await appLog("frontend", "debug", "utils", `Priority calculated: ${notification.id} => ${rankScore}`);

      const rankedNotification: RankedNotification = {
        ...notification,
        rankScore,
      };

      heapPush(heap, rankedNotification);

      if (heap.length > limit) {
        heapPopMin(heap);
      }
    }

    const result = [...heap].sort((left, right) => compareNotifications(right, left));
    await appLog("frontend", "info", "utils", `Final output generated with ${result.length} notifications`);
    return result.map(({ rankScore, ...notification }) => notification);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ranking error";
    await appLog("frontend", "error", "utils", `Priority ranking failed: ${message}`);
    return [];
  }
}