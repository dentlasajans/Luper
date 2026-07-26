import { BaseCategoryView } from './BaseCategoryView';

export function MouseOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="mouse" onBack={onBack} />;
}
