import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { cn } from '../lib/utils';

interface LottieWrapperProps {
  url: string;
  className?: string;
}

export function LottieWrapper({ url, className }: LottieWrapperProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie yüklenemedi:", err));
  }, [url]);

  if (!animationData) {
    return <div className={cn("animate-pulse bg-sapphire-blue/10 rounded-full", className)} />;
  }

  return (
    <div className={className}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}
