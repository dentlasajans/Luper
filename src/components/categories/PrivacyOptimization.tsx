import { BaseCategoryView } from './BaseCategoryView';

export function PrivacyOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="privacy" onBack={onBack} />;
}
