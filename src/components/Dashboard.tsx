import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { WarningCircle } from '@/src/components/ui/Icons';
import { motion } from 'motion/react';
import { memo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { useWidgetStore } from '../store/widgetStore';
import { HeroSection } from './dashboard/HeroSection';
import { QuickActions } from './dashboard/QuickActions';
import { RecommendedOptimizations } from './dashboard/RecommendedOptimizations';
import { SortableWidget } from './dashboard/SortableWidget';

export const Dashboard = memo(function Dashboard() {
  const { lowQualityMode } = useSettings();
  const { error } = useSystemStatus();
  
  const widgetIds = useWidgetStore((state) => state.widgetIds);
  const reorderWidgets = useWidgetStore((state) => state.reorderWidgets);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = widgetIds.indexOf(active.id as string);
      const newIndex = widgetIds.indexOf(over.id as string);
      reorderWidgets(oldIndex, newIndex);
    }
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'hero':
        return <HeroSection lowQualityMode={lowQualityMode} />;
      case 'quick-actions':
        return <QuickActions lowQualityMode={lowQualityMode} />;
      case 'recommended':
        return <RecommendedOptimizations lowQualityMode={lowQualityMode} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 w-full h-full flex flex-col relative" style={{ WebkitAppRegion: 'no-drag' }}>
      {/* Deneme Etiketi */}
      <div className="absolute top-4 right-8 bg-red-500/20 text-red-500 px-3 py-1 rounded-full font-bold text-sm border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
        DENEME
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
          className="mb-8 p-4 bg-[#ff453a]/10 border border-[#ff453a]/20 rounded-2xl flex items-start space-x-3"
        >
          <WarningCircle size={20} weight="duotone" className="text-[#ff453a] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-[#ff453a] font-medium text-[15px] tracking-tight mb-1">Sistem Verisi Alınamadı</h4>
            <p className="text-[#ff453a]/80 text-[13px] leading-relaxed">
              Sistem verileri canlı IPC üzerinden yüklenemiyor. Geçici demo verileri gösteriliyor.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 pb-8 custom-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap gap-8 items-stretch w-full">
              {widgetIds.map((id) => (
                <SortableWidget 
                  key={id} 
                  id={id} 
                  className={id === 'hero' ? 'w-full' : 'w-full lg:w-[calc(50%-1rem)]'}
                >
                  {renderWidget(id)}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
});
