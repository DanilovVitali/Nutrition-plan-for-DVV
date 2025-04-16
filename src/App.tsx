import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DayPage from './pages/DayPage'
import './App.css'

// Створення контексту для зберігання активного дня
interface AppContextType {
  activeDay: number;
  setActiveDay: (day: number) => void;
}

export const AppContext = createContext<AppContextType>({
  activeDay: 0,
  setActiveDay: () => {}
});

function App() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <AppContext.Provider value={{ activeDay, setActiveDay }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/day/:dayId" element={<DayPage />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  )
}

export default App
