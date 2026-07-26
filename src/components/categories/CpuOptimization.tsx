import { BaseCategoryView } from './BaseCategoryView';

export function CpuOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="cpu" onBack={onBack} />;
}
