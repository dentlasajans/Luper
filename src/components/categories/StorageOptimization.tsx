import { BaseCategoryView } from './BaseCategoryView';

export function StorageOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="storage" onBack={onBack} />;
}
