import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wheel from '../components/Wheel';
import DayItem from '../components/DayItem';
import styles from './HomePage.module.css';
import { AppContext } from '../App';

// Прості назви днів для головного екрана
const daysOfWeek = [
  'Понеділок',
  'Вівторок',
  'Середа',
  'Четвер',
  'П\'ятниця',
  'Субота',
  'Неділя'
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeDay } = useContext(AppContext);
  const [initialIndex, setInitialIndex] = useState(0);
  
  // Встановлюємо початковий індекс для колеса при завантаженні
  useEffect(() => {
    setInitialIndex(activeDay);
  }, [activeDay]);
  
  const handleDaySelect = (day: string) => {
    // При натисканні на день переходимо на сторінку з деталями
  };
  
  const handleDayClick = (day: string) => {
    // Перехід на сторінку з деталями дня
    const dayIndex = daysOfWeek.indexOf(day);
    navigate(`/day/${dayIndex}`);
  };
  
  const renderDayItem = (day: string, isActive: boolean, distance: number) => (
    <div onClick={() => isActive && handleDayClick(day)}>
      <DayItem day={day} isActive={isActive} distance={distance} />
    </div>
  );
  
  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <h1>DVV Meal Plan</h1>
      </header>
      
      <main className={styles.main}>
        <Wheel
          items={daysOfWeek}
          renderItem={renderDayItem}
          onSelect={handleDaySelect}
          initialIndex={initialIndex}
        />
      </main>
      
      <footer className={styles.footer}>
        {/* Підказку прибрано */}
      </footer>
    </div>
  );
};

export default HomePage; 