import { BaseCategoryView } from './BaseCategoryView';

export function PowerOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="power" onBack={onBack} />;
}
