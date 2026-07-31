import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';

export interface WidgetStore {
  widgetIds: string[];
  setWidgetIds: (ids: string[]) => void;
  reorderWidgets: (oldIndex: number, newIndex: number) => void;
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      widgetIds: ['hero', 'quick-actions', 'recommended'],
      setWidgetIds: (ids) => set({ widgetIds: ids }),
      reorderWidgets: (oldIndex, newIndex) =>
        set((state) => ({
          widgetIds: arrayMove(state.widgetIds, oldIndex, newIndex),
        })),
    }),
    {
      name: 'luper-widget-store',
    }
  )
);
