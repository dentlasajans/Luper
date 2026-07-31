import { BaseCategoryView } from './BaseCategoryView';

export function KeyboardOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="keyboard" onBack={onBack} />;
}
