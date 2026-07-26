import { BaseCategoryView } from './BaseCategoryView';

export function PersonalizationOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="personalization" onBack={onBack} />;
}
