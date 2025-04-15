import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Wheel.module.css';

interface WheelProps<T> {
  items: T[];
  renderItem: (item: T, isActive: boolean, distance: number) => React.ReactNode;
  onSelect?: (item: T) => void;
}

function Wheel<T>({ items, renderItem, onSelect }: WheelProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const itemHeight = 80; // Висота одного елемента
  const visibleItems = items.length;
  const containerHeight = itemHeight * visibleItems;
  
  // Блокуємо скрол сторінки під час взаємодії з колесом
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      // Перевіряємо, чи подія відбувається в контейнері колеса
      if (containerRef.current?.contains(target)) {
        e.preventDefault();
      }
    };
    
    // Додаємо блокування скролу сторінки
    document.addEventListener('touchmove', preventDefault, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);
  
  // Функція для отримання позиції елемента відносно активного
  const getItemTransform = (index: number) => {
    // Нормалізуємо індекс відносно активного елемента
    const diff = index - activeIndex;
    const wrappedDiff = ((diff + visibleItems / 2) % visibleItems + visibleItems) % visibleItems - visibleItems / 2;
    
    const yTranslate = wrappedDiff * itemHeight;
    const scale = 1 - Math.abs(wrappedDiff) * 0.15; // Зменшення розміру з відстанню
    const opacity = 1 - Math.abs(wrappedDiff) * 0.2; // Прозорість з відстанню
    
    return {
      y: yTranslate,
      scale,
      opacity,
    };
  };
  
  // Функція для обробки жесту драгу
  const handleDrag = (e: React.MouseEvent | React.TouchEvent, dragType: 'start' | 'end' | 'move') => {
    // Блокуємо скрол сторінки під час перетягування
    if (dragType === 'start' || dragType === 'move') {
      e.preventDefault();
    }
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    if (dragType === 'start') {
      setDragStartY(clientY);
    } else if (dragType === 'end') {
      setDragStartY(null);
    } else if (dragStartY !== null) {
      const deltaY = clientY - dragStartY;
      
      // Різні пороги для свайпу вгору і вниз для більш природньої взаємодії
      const thresholdUp = itemHeight * 0.4;   // Для свайпу вгору (меньший поріг)
      const thresholdDown = itemHeight * 0.6;  // Для свайпу вниз (більший поріг)
      
      // Перевіряємо, чи перевищено поріг у відповідному напрямку
      if ((deltaY < 0 && Math.abs(deltaY) > thresholdUp) || (deltaY > 0 && Math.abs(deltaY) > thresholdDown)) {
        // Визначаємо напрямок руху
        const direction = deltaY > 0 ? 1 : -1;
        
        // Оновлюємо активний індекс, змінюючи тільки на один елемент за раз
        const newIndex = (activeIndex - direction + items.length) % items.length;
        setActiveIndex(newIndex);
        
        // Скидаємо початкову точку для наступного руху
        setDragStartY(clientY);
      }
    }
  };
  
  // Обробник вибору елемента
  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    if (onSelect) {
      onSelect(items[index]);
    }
  };
  
  // Анімація прокрутки при зміні активного елемента
  useEffect(() => {
    if (onSelect) {
      onSelect(items[activeIndex]);
    }
  }, [activeIndex, items, onSelect]);
  
  return (
    <div 
      className={styles.wheelContainer}
      ref={containerRef}
      style={{ height: `${containerHeight}px` }}
      onMouseDown={(e) => handleDrag(e, 'start')}
      onMouseMove={(e) => handleDrag(e, 'move')}
      onMouseUp={(e) => handleDrag(e, 'end')}
      onMouseLeave={(e) => handleDrag(e, 'end')}
      onTouchStart={(e) => handleDrag(e, 'start')}
      onTouchMove={(e) => handleDrag(e, 'move')}
      onTouchEnd={(e) => handleDrag(e, 'end')}
    >
      <div className={styles.centerLine} />
      
      {items.map((item, index) => {
        const transform = getItemTransform(index);
        const isActive = index === activeIndex;
        const distance = Math.abs(index - activeIndex);
        
        return (
          <motion.div
            key={index}
            className={`${styles.wheelItem} ${isActive ? styles.active : ''}`}
            animate={transform}
            initial={transform}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => handleItemClick(index)}
          >
            {renderItem(item, isActive, distance)}
          </motion.div>
        );
      })}
    </div>
  );
}

export default Wheel; 