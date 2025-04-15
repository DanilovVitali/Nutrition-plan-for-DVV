import React from 'react';
import styles from './DayItem.module.css';
import nikeIcon from '../assets/images/nike-icon.jpg';

interface DayItemProps {
  day: string;
  isActive: boolean;
  distance: number;
}

const DayItem: React.FC<DayItemProps> = ({ day, isActive, distance }) => {
  return (
    <div className={`${styles.dayItem} ${isActive ? styles.active : ''}`}>
      <div className={styles.nikeIcon}>
        <img 
          src={nikeIcon} 
          alt="Nike Icon" 
          width="40" 
          height="40"
          style={{ 
            opacity: isActive ? 1 : 0.7,
            filter: isActive ? 'drop-shadow(0px 0px 2px #FF0000)' : 'none'
          }} 
        />
      </div>
      <div className={styles.dayName}>
        {day}
      </div>
    </div>
  );
};

export default DayItem; 