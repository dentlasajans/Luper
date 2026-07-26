import { BaseCategoryView } from './BaseCategoryView';

export function GpuOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="gpu" onBack={onBack} />;
}
