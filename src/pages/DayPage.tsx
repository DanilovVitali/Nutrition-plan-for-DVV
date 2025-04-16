import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Wheel from '../components/Wheel';
import MealItemComponent from '../components/MealItem';
import styles from './DayPage.module.css';
import { MealItem } from '../types';
import { mealsData } from '../data/mealsData';
import { AppContext } from '../App';

// Повні назви днів для сторінки дня
const daysOfWeek = [
  'ПОНЕДІЛОК (День силового тренування)',
  'ВІВТОРОК (День футбольного тренування)',
  'СЕРЕДА (День силового тренування)',
  'ЧЕТВЕР (День футбольного тренування)',
  'П\'ЯТНИЦЯ (День силового тренування)',
  'СУБОТА (День індивідуального футбольного тренування)',
  'НЕДІЛЯ (День відновлення)'
];

// Прості назви днів для порівняння з даними
const simpleDaysOfWeek = [
  'Понеділок',
  'Вівторок',
  'Середа',
  'Четвер',
  'П\'ятниця',
  'Субота',
  'Неділя'
];

const DayPage: React.FC = () => {
  const params = useParams();
  const dayId = params.dayId;
  const navigate = useNavigate();
  const dayIndex = parseInt(dayId || '0');
  const dayName = daysOfWeek[dayIndex] || daysOfWeek[0];
  const simpleDayName = simpleDaysOfWeek[dayIndex] || simpleDaysOfWeek[0];
  const { setActiveDay } = useContext(AppContext);
  
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [totalNutrition, setTotalNutrition] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });
  const [hydration, setHydration] = useState('');
  const [wheelItems, setWheelItems] = useState<(MealItem | { isSummary: true, hydration: string, totalNutrition: any })[]>([]);
  
  useEffect(() => {
    // Зберігаємо поточний день при завантаженні компонента
    setActiveDay(dayIndex);
    
    // Завантаження даних про прийоми їжі для обраного дня
    const dayData = mealsData.find(day => 
      day.day === simpleDayName || 
      day.day.toLocaleLowerCase() === simpleDayName.toLocaleLowerCase()
    );
    
    if (dayData) {
      // Додаємо всі прийоми їжі
      setMeals(dayData.meals);
      setTotalNutrition(dayData.totalNutrition);
      setHydration(dayData.hydration);
      
      // Додаємо блок з підсумками в кінець списку
      const summaryItem = {
        isSummary: true as true,
        hydration: dayData.hydration,
        totalNutrition: dayData.totalNutrition
      };
      
      setWheelItems([...dayData.meals, summaryItem]);
    } else {
      console.error('День не знайдено:', simpleDayName);
    }
  }, [simpleDayName, dayIndex, setActiveDay]);
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  const renderWheelItem = (item: any, isActive: boolean, distance: number) => {
    // Якщо це блок з підсумками
    if (item.isSummary) {
      return (
        <div 
          className={`${styles.summaryBlock} ${isActive ? styles.active : ''}`} 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 1)', // Повністю непрозорий чорний фон
            position: 'relative',
            zIndex: isActive ? 30 : 5 // Ще вищий z-index
          }}
        >
          <h3>Загальна інформація</h3>
          <div className={styles.hydration}>{item.hydration}</div>
          <div className={styles.totals}>
            Загальні показники за день: ~{item.totalNutrition.calories} ккал 
            <br />(Б: {item.totalNutrition.protein}г, Ж: {item.totalNutrition.fat}г, В: {item.totalNutrition.carbs}г)
          </div>
        </div>
      );
    }
    
    // Якщо це звичайний прийом їжі
    return <MealItemComponent meal={item} isActive={isActive} distance={distance} />;
  };
  
  // Розділяємо назву дня та інформацію про тренування для кращого відображення
  const formatDayName = (name: string) => {
    const parts = name.split('(');
    if (parts.length < 2) return name;
    
    return (
      <>
        {parts[0].trim()}
        <br />
        <span style={{ fontSize: '16px', fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.9)' }}>
          ({parts[1]}
        </span>
      </>
    );
  };
  
  return (
    <div className={styles.dayPage}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick} aria-label="Повернутися на головну">
          &larr;
        </button>
        <h1>{formatDayName(dayName)}</h1>
      </header>
      
      <main className={styles.main}>
        <Wheel
          items={wheelItems}
          renderItem={renderWheelItem}
          onSelect={() => {}}
        />
      </main>
      
      <footer className={styles.footer}>
        {/* Прибираємо інформаційний блок, бо тепер він є в колесі */}
      </footer>
    </div>
  );
};

export default DayPage; 