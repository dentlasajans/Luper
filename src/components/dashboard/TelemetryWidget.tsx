import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSystemStatus } from '../../hooks/useSystemStatus';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// We keep a max of 30 data points for a smooth chart
const MAX_DATA_POINTS = 30;

export const TelemetryWidget: React.FC = () => {
  const { metrics, status, loading } = useSystemStatus(1000); // 1-second polling

  // Historical data arrays
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(MAX_DATA_POINTS).fill(0));
  const [ramHistory, setRamHistory] = useState<number[]>(Array(MAX_DATA_POINTS).fill(0));
  const [diskHistory, setDiskHistory] = useState<number[]>(Array(MAX_DATA_POINTS).fill(0));

  useEffect(() => {
    if (metrics) {
      setCpuHistory(prev => {
        const next = [...prev, metrics.cpuUsage || 0];
        return next.length > MAX_DATA_POINTS ? next.slice(-MAX_DATA_POINTS) : next;
      });

      setRamHistory(prev => {
        const next = [...prev, metrics.ramUsagePercent || 0];
        return next.length > MAX_DATA_POINTS ? next.slice(-MAX_DATA_POINTS) : next;
      });
    }

    if (status?.storage?.drives && status.storage.drives.length > 0) {
      // Calculate average disk usage percentage across drives
      const drives = status.storage.drives;
      let totalUsed = 0;
      let totalCapacity = 0;
      drives.forEach(drive => {
         if (drive.total && drive.free) {
             totalUsed += (drive.total - drive.free);
             totalCapacity += drive.total;
         }
      });
      const diskUsagePercent = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;
      
      setDiskHistory(prev => {
        const next = [...prev, diskUsagePercent];
        return next.length > MAX_DATA_POINTS ? next.slice(-MAX_DATA_POINTS) : next;
      });
    }
  }, [metrics, status]);

  const labels = Array(MAX_DATA_POINTS).fill('');

  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: cpuHistory,
        borderColor: '#1a5efd', // Luper Sapphire Blue
        backgroundColor: 'rgba(26, 94, 253, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'RAM Usage (%)',
        data: ramHistory,
        borderColor: '#00c853', // Green
        backgroundColor: 'rgba(0, 200, 83, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Disk Usage (%)',
        data: diskHistory,
        borderColor: '#ff9100', // Orange
        backgroundColor: 'rgba(255, 145, 0, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: 'linear'
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          stepSize: 25,
          font: {
            family: 'Inter, sans-serif'
          }
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          usePointStyle: true,
          boxWidth: 8,
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(18, 18, 20, 0.9)',
        titleColor: '#fff',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
            family: 'Inter, sans-serif'
        },
        titleFont: {
            family: 'Inter, sans-serif'
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <motion.div 
      className="bg-[#161618] rounded-2xl p-6 border border-white/5 flex flex-col gap-4 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: '350px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1a5efd]/10 rounded-lg">
            <Activity className="w-5 h-5 text-[#1a5efd]" />
          </div>
          <h3 className="text-lg font-medium text-white/90 font-['Inter']">Real-Time Telemetry</h3>
        </div>
        
        {loading && (
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#1a5efd] animate-pulse" />
             <span className="text-xs text-white/50">Polling metrics...</span>
          </div>
        )}
      </div>
      
      <div className="relative flex-1 w-full mt-2 min-h-[200px]">
        <Line data={data} options={options} />
      </div>
      
      {/* Current values footer */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 mt-auto">
         <div className="flex flex-col">
            <span className="text-xs text-white/40 mb-1">CPU</span>
            <span className="text-sm font-semibold text-white/90">
                {metrics?.cpuUsage ? metrics.cpuUsage.toFixed(1) : 0}%
            </span>
         </div>
         <div className="flex flex-col">
            <span className="text-xs text-white/40 mb-1">RAM</span>
            <span className="text-sm font-semibold text-white/90">
                {metrics?.ramUsagePercent ? metrics.ramUsagePercent.toFixed(1) : 0}%
            </span>
         </div>
         <div className="flex flex-col">
            <span className="text-xs text-white/40 mb-1">Disk</span>
            <span className="text-sm font-semibold text-white/90">
                {diskHistory[diskHistory.length - 1] ? diskHistory[diskHistory.length - 1].toFixed(1) : 0}%
            </span>
         </div>
      </div>
    </motion.div>
  );
};
