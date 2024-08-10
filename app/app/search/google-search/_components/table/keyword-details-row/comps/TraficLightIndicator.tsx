import { cn } from '@/presentation/components/utils';
import React from 'react'

type TraficLightIndicatorProps = {
  maxValue: number
  currentValue: number
  flip?: boolean
}

const getBgColor = (index: number, isSelected: boolean) => {
  if (index < 3) return isSelected ? 'bg-red-600 inner-border border-red-900' : 'bg-red-600 opacity-35  inner-border border-red-900';
  if (index < 7) return isSelected ? 'bg-yellow-600' : 'bg-yellow-600/35';
  if (index < 10) return isSelected ? 'bg-green-600' : 'bg-green-600/35'; 
  return 'lightgray'; // Default color if none of the above conditions match
};

const TraficLightIndicator: React.FC<TraficLightIndicatorProps> = ({ maxValue, currentValue, flip }) => {
  const percentage = (currentValue / maxValue) * 100;
  let litSquares = Math.round((percentage / 100) * 10);
  if (currentValue > maxValue) litSquares = 1;

  if (flip) {
    litSquares = 11 - litSquares;
  }

  return (
    <div className='flex w-fit'>
      <p className='px-3 text-slate-500 dark:text-slate-300/50'><span>{currentValue}</span>/<span>{maxValue}</span></p>
      <div className='w-fit flex gap-1 p-1  rounded-[4px] bg-white dark:bg-[#DFE5FA]/10'>
        {Array.from({ length: 10 }, (_, index) => (
          <div
            className={cn(
              getBgColor(index, index < litSquares),
              'h-4 w-2 rounded-sm'
            )}
            style={{
              boxShadow: 'inset 0 0 0 1px rgba(223, 229, 250, 0.1) ',
            }}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default TraficLightIndicator;