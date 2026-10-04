const SAVED_KEY =
  "ai-creator-os:explore:saved";

const RECENT_KEY =
  "ai-creator-os:explore:recent";

const CHANGE_EVENT =
  "ai-creator-os:explore-library-change";

const MAX_RECENT_ITEMS = 12;

interface RecentExploreItem {
  id: string;
  usedAt: string;
}

function isBrowser() {
  return (
    typeof window !==
    "undefined"
  );
}

function readStringArray(
  key: string
): string[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        key
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(
        parsed
      )
    ) {
      return [];
    }

    return parsed.filter(
      (
        value
      ): value is string =>
        typeof value ===
        "string"
    );
  } catch {
    return [];
  }
}

function writeStringArray(
  key: string,
  values: string[]
) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    key,
    JSON.stringify(
      values
    )
  );

  emitChange();
}

function readRecentItems(): RecentExploreItem[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        RECENT_KEY
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(
        parsed
      )
    ) {
      return [];
    }

    return parsed.filter(
      (
        value
      ): value is RecentExploreItem => {
        if (
          !value ||
          typeof value !==
            "object"
        ) {
          return false;
        }

        const candidate =
          value as Partial<RecentExploreItem>;

        return (
          typeof candidate.id ===
            "string" &&
          typeof candidate.usedAt ===
            "string"
        );
      }
    );
  } catch {
    return [];
  }
}

function emitChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new Event(
      CHANGE_EVENT
    )
  );
}

export function getSavedExploreIds() {
  return readStringArray(
    SAVED_KEY
  );
}

export function isExploreSaved(
  id: string
) {
  return getSavedExploreIds().includes(
    id
  );
}

export function toggleSavedExplore(
  id: string
) {
  const current =
    getSavedExploreIds();

  const alreadySaved =
    current.includes(
      id
    );

  const next =
    alreadySaved
      ? current.filter(
          (
            savedId
          ) =>
            savedId !==
            id
        )
      : [
          id,
          ...current,
        ];

  writeStringArray(
    SAVED_KEY,
    next
  );

  return !alreadySaved;
}

export function clearSavedExplore() {
  writeStringArray(
    SAVED_KEY,
    []
  );
}

export function markExploreRecent(
  id: string
) {
  if (!isBrowser()) {
    return;
  }

  const current =
    readRecentItems();

  const next: RecentExploreItem[] =
    [
      {
        id,
        usedAt:
          new Date().toISOString(),
      },

      ...current.filter(
        (
          item
        ) =>
          item.id !==
          id
      ),
    ].slice(
      0,
      MAX_RECENT_ITEMS
    );

  window.localStorage.setItem(
    RECENT_KEY,
    JSON.stringify(
      next
    )
  );

  emitChange();
}

export function getRecentExploreItems() {
  return readRecentItems();
}

export function getRecentExploreIds() {
  return readRecentItems().map(
    (
      item
    ) =>
      item.id
  );
}

export function clearRecentExplore() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(
    RECENT_KEY
  );

  emitChange();
}

export function subscribeExploreLibrary(
  callback: () => void
) {
  if (!isBrowser()) {
    return () => {};
  }

  function handleChange() {
    callback();
  }

  function handleStorage(
    event: StorageEvent
  ) {
    if (
      event.key ===
        SAVED_KEY ||
      event.key ===
        RECENT_KEY
    ) {
      callback();
    }
  }

  window.addEventListener(
    CHANGE_EVENT,
    handleChange
  );

  window.addEventListener(
    "storage",
    handleStorage
  );

  return () => {
    window.removeEventListener(
      CHANGE_EVENT,
      handleChange
    );

    window.removeEventListener(
      "storage",
      handleStorage
    );
  };
}