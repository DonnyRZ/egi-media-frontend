"use client";
import { Link } from "@/i18n/navigation";
import { Card, CardBody, CardHeader } from "@/features/cms/components/ui/Card";
import { Button } from "@/features/cms/components/ui/Button";
import { Select } from "@/features/cms/components/ui/Select";
import { ErrorState } from "@/shared/components/common/ErrorState";
import type { useMediaCatalog } from "@/features/cms/hooks/useMediaCatalog";
interface CatalogPanelProps {
  model: ReturnType<typeof useMediaCatalog>;
}
function CatalogHeroRetry({ model }: CatalogPanelProps) {
  const { settings, videos } = model.queries;
  if (!settings.isError && !videos.isError) return null;
  return (
    <ErrorState
      onRetry={() => {
        void settings.refetch();
        void videos.refetch();
      }}
    />
  );
}
export function CatalogHeroPanel({ model }: CatalogPanelProps) {
  const { state, queries, actions } = model;
  const { settings, videos, heroChoices } = queries;
  const options = [
    { value: "", label: "Automatic latest horizontal video" },
    ...heroChoices
      .filter(
        (v) =>
          v.status === "published" && v.isActive && v.format === "horizontal",
      )
      .map((v) => ({ value: v.id, label: v.title })),
  ];
  return (
    <Card>
      <CardHeader title="Video hero" />
      <CardBody className="space-y-3">
        <p className="text-sm">
          Current:{" "}
          {heroChoices.find((v) => v.id === settings.data?.hero_video_id)
            ?.title || "Automatic latest horizontal video"}
        </p>
        <Select
          aria-label="Video hero"
          value={state.hero}
          onChange={(e) => state.setHero(e.target.value)}
          options={options}
        />
        <Button
          loading={actions.saving}
          disabled={settings.isLoading || settings.isError || videos.isLoading}
          onClick={actions.saveHero}
        >
          Save hero selection
        </Button>
        <CatalogHeroRetry model={model} />
      </CardBody>
    </Card>
  );
}
export function CatalogTabs({ model }: CatalogPanelProps) {
  const { state, actions } = model;
  function select(kind: "programs" | "collections") {
    state.setKind(kind);
    state.setForm(null);
  }
  return (
    <div className="my-5 flex flex-wrap gap-3">
      <Button
        disabled={actions.saving}
        variant={state.kind === "programs" ? "primary" : "secondary"}
        onClick={() => select("programs")}
      >
        Programs
      </Button>
      <Button
        disabled={actions.saving}
        variant={state.kind === "collections" ? "primary" : "secondary"}
        onClick={() => select("collections")}
      >
        Collections
      </Button>
      <Button
        disabled={actions.saving}
        className="ml-auto"
        onClick={() => state.setForm({ initial: null })}
      >
        New {state.kind === "programs" ? "program" : "collection"}
      </Button>
    </div>
  );
}
export function CatalogResourceList({ model }: CatalogPanelProps) {
  const { state, queries, actions } = model;
  const catalog = queries.catalog;
  return (
    <Card>
      <CardBody>
        {catalog.isLoading ? <p>Loading…</p> : null}
        {catalog.isError ? (
          <ErrorState onRetry={() => void catalog.refetch()} />
        ) : null}
        {catalog.data?.length === 0 ? <p>No {state.kind} yet.</p> : null}
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {catalog.data?.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-3 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-neutral-500">
                  {item.is_active ? "Active" : "Inactive"} · Order{" "}
                  {item.sort_order} · {item.slug}
                </p>
              </div>
              <Button
                disabled={actions.saving}
                variant="secondary"
                size="sm"
                onClick={() => void actions.edit(item.id)}
              >
                Edit
              </Button>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
export function CatalogSaveFeedback({ model }: CatalogPanelProps) {
  return model.state.saved ? (
    <p role="status" className="my-4">
      Saved.{" "}
      <Link className="underline" href="/videos" target="_blank">
        View Video →
      </Link>
    </p>
  ) : null;
}
