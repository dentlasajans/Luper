import { BaseCategoryView } from './BaseCategoryView';

export function BrowserOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="browser" onBack={onBack} />;
}
