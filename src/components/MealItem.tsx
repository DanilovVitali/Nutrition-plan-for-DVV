import React from 'react';
import styles from './MealItem.module.css';
import { MealItem } from '../types';

interface MealItemProps {
  meal: MealItem;
  isActive: boolean;
  distance: number;
}

const MealItemComponent: React.FC<MealItemProps> = ({ meal, isActive, distance }) => {
  // Перевіряємо, чи це блок загальної інформації
  const isSummary = meal.name === 'Загальна інформація';
  
  return (
    <div className={`${styles.mealItem} ${isActive ? styles.active : ''} ${isSummary ? styles.summaryItem : ''}`}>
      <h3 className={styles.mealHeader}>
        {meal.time && <span className={styles.mealTime}>{meal.time}</span>}
        <span className={styles.mealTitle}>{meal.name}</span>
      </h3>
      
      <div className={styles.mealContent}>
        <ul className={styles.dishesList}>
          {meal.dishes.map((dish, index) => (
            <li key={index} className={styles.dishItem}>{dish}</li>
          ))}
        </ul>
        
        {!isSummary && (
          <div className={styles.nutrition}>
            <em>Всього: {meal.nutrition.calories} ккал (Б: {meal.nutrition.protein}г, Ж: {meal.nutrition.fat}г, В: {meal.nutrition.carbs}г)</em>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealItemComponent; 