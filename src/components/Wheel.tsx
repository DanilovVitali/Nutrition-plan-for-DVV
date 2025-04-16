import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Wheel.module.css';

interface WheelProps<T> {
  items: T[];
  renderItem: (item: T, isActive: boolean, distance: number) => React.ReactNode;
  onSelect?: (item: T) => void;
  initialIndex?: number;
  hideCenterLineForLastItem?: boolean;
}

function Wheel<T>({ items, renderItem, onSelect, initialIndex = 0, hideCenterLineForLastItem = false }: WheelProps<T>) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const itemHeight = 80; // Висота одного елемента
  const visibleItems = items.length;
  const containerHeight = itemHeight * visibleItems;
  
  // Додаємо стан для визначення, чи відображати centerLine
  const [showCenterLine, setShowCenterLine] = useState(true);
  
  // Оновлюємо активний індекс, коли змінюється initialIndex
  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);
  
  // Змінюємо логіку відображення centerLine
  useEffect(() => {
    // Показуємо centerLine під час прокрутки (коли dragStartY не null)
    // або коли активний елемент не є останнім, або коли не потрібно ховати лінію
    const shouldShowLine = 
      dragStartY !== null || 
      !hideCenterLineForLastItem || 
      activeIndex !== items.length - 1;
    
    setShowCenterLine(shouldShowLine);
  }, [activeIndex, items.length, hideCenterLineForLastItem, dragStartY]);
  
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
      zIndex: wrappedDiff === 0 ? 10 : 1, // Додано z-index для активного елемента
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
      // Завжди показуємо centerLine при початку перетягування
      setShowCenterLine(true);
    } else if (dragType === 'end') {
      setDragStartY(null);
      // Приховуємо centerLine після закінчення перетягування, якщо активний елемент - останній
      if (hideCenterLineForLastItem && activeIndex === items.length - 1) {
        setShowCenterLine(false);
      }
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
        
        // Під час перетягування завжди показуємо centerLine
        // Логіка приховування centerLine буде застосована в useEffect
        
        // Скидаємо початкову точку для наступного руху
        setDragStartY(clientY);
      }
    }
  };
  
  // Обробник вибору елемента
  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    
    // Оновлюємо стан centerLine тільки для DayPage і тільки для останнього елемента
    if (hideCenterLineForLastItem && index === items.length - 1) {
      setShowCenterLine(false);
    } else {
      setShowCenterLine(true);
    }
    
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
      {/* Видаляємо стандартну centerLine */}
      {/* {showCenterLine && <div className={styles.centerLine} />} */}
      
      {items.map((item, index) => {
        const transform = getItemTransform(index);
        const isActive = index === activeIndex;
        const distance = Math.abs(index - activeIndex);
        
        // Додаємо видиму centerLine для активного елемента, якщо це не останній елемент
        // або під час перетягування
        const showSelectionLine = isActive && (
          dragStartY !== null || 
          !hideCenterLineForLastItem || 
          index !== items.length - 1
        );
        
        return (
          <motion.div
            key={index}
            className={`${styles.wheelItem} ${isActive ? styles.active : ''}`}
            animate={transform}
            initial={transform}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => handleItemClick(index)}
          >
            {/* Додаємо селекційну лінію для поточного елемента якщо потрібно */}
            {showSelectionLine && <div className={styles.customSelectionLine} />}
            
            {renderItem(item, isActive, distance)}
          </motion.div>
        );
      })}
    </div>
  );
}

export default Wheel; 