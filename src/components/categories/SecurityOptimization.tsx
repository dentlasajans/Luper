import { BaseCategoryView } from './BaseCategoryView';

export function SecurityOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="security" onBack={onBack} />;
}
