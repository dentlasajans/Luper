import { AudioOptimization } from './categories/AudioOptimization';
import { BaseCategoryView } from './categories/BaseCategoryView';
import { BrowserOptimization } from './categories/BrowserOptimization';
import { CpuOptimization } from './categories/CpuOptimization';
import { GpuOptimization } from './categories/GpuOptimization';
import { KeyboardOptimization } from './categories/KeyboardOptimization';
import { MouseOptimization } from './categories/MouseOptimization';
import { NetworkOptimization } from './categories/NetworkOptimization';
import { PersonalizationOptimization } from './categories/PersonalizationOptimization';
import { PowerOptimization } from './categories/PowerOptimization';
import { PrivacyOptimization } from './categories/PrivacyOptimization';
import { SecurityOptimization } from './categories/SecurityOptimization';
import { StorageOptimization } from './categories/StorageOptimization';
import { TelemetryOptimization } from './categories/TelemetryOptimization';

export function CategoryOptimization({ categoryId, onBack }: { categoryId: string; onBack: () => void }) {
  switch (categoryId) {
    case 'network':
      return <NetworkOptimization onBack={onBack} />;
    case 'cpu':
      return <CpuOptimization onBack={onBack} />;
    case 'storage':
      return <StorageOptimization onBack={onBack} />;
    case 'mouse':
      return <MouseOptimization onBack={onBack} />;
    case 'privacy':
      return <PrivacyOptimization onBack={onBack} />;
    case 'gpu':
      return <GpuOptimization onBack={onBack} />;
    case 'power':
      return <PowerOptimization onBack={onBack} />;
    case 'security':
      return <SecurityOptimization onBack={onBack} />;
    case 'personalization':
      return <PersonalizationOptimization onBack={onBack} />;
    case 'keyboard':
      return <KeyboardOptimization onBack={onBack} />;
    case 'audio':
      return <AudioOptimization onBack={onBack} />;
    case 'browser':
      return <BrowserOptimization onBack={onBack} />;
    case 'telemetry':
      return <TelemetryOptimization onBack={onBack} />;
    default:
      return <BaseCategoryView categoryId={categoryId} onBack={onBack} />;
  }
}
