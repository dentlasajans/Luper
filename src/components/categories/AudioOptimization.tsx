import { BaseCategoryView } from './BaseCategoryView';

export function AudioOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="audio" onBack={onBack} />;
}
