import { BaseCategoryView } from './BaseCategoryView';

export function NetworkOptimization({ onBack }: { onBack: () => void }) {
  return <BaseCategoryView categoryId="network" onBack={onBack} />;
}
