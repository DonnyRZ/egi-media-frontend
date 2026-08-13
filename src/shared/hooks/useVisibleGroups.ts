"use client";

import { useMemo, useState } from "react";

interface UseVisibleGroupsResult<T> {
  visibleGroups: T[];
  hiddenCount: number;
  revealAll: () => void;
}

/**
 * Caps how many grouped sections render up front so a taxonomy index page
 * doesn't grow unbounded as more topics/categories accumulate. The rest can
 * be revealed client-side without a refetch since the groups are already
 * loaded.
 */
export function useVisibleGroups<T>(
  groups: T[],
  initialCount = 8,
): UseVisibleGroupsResult<T> {
  const [showAll, setShowAll] = useState(false);

  const visibleGroups = useMemo(
    () => (showAll ? groups : groups.slice(0, initialCount)),
    [groups, showAll, initialCount],
  );

  return {
    visibleGroups,
    hiddenCount: groups.length - visibleGroups.length,
    revealAll: () => setShowAll(true),
  };
}
