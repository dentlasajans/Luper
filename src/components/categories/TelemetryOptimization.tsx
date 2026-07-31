import { BaseCategoryView } from './BaseCategoryView';

export function TelemetryOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="telemetry" onBack={onBack} />;
}
