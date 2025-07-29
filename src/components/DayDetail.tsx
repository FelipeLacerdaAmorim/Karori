import { useState } from "react";
import { ArrowLeft, Plus, X } from 'lucide-react';
import { DayData, Meal, Food } from '../types';
import { FoodSelector } from './FoodSelector';

interface DayDetailProps {
  dayData: DayData;
  onBack: () => void;
}

export function DayDetail({ dayData, onBack }: DayDetailProps) {
  const [meals, setMeals] = useState<Meal[]>(dayData.meals || []);
  const [showMealDropdown, setShowMealDropdown] = useState(false);
  const [showFoodSelector, setShowFoodSelector] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string>('');

  const mealTypes = [
    'Café da Manhã',
    'Lanche da Manhã', 
    'Almoço',
    'Lanche da Tarde',
    'Janta',
    'Ceia'
  ];

  const addMeal = (mealType: string) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealType,
      foods: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    };
    setMeals([...meals, newMeal]);
    setShowMealDropdown(false);
  };

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const addFoodToMeal = (food: Food) => {
    setMeals(meals.map(meal => {
      if (meal.id === selectedMealId) {
        const updatedFoods = [...meal.foods, food];
        const totals = calculateMealTotals(updatedFoods);
        return { ...meal, foods: updatedFoods, ...totals };
      }
      return meal;
    }));
  };

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    setMeals(meals.map(meal => {
      if (meal.id === mealId) {
        const updatedFoods = meal.foods.filter(food => food.id !== foodId);
        const totals = calculateMealTotals(updatedFoods);
        return { ...meal, foods: updatedFoods, ...totals };
      }
      return meal;
    }));
  };

  const calculateMealTotals = (foods: Food[]) => {
    return foods.reduce((totals, food) => ({
      totalCalories: totals.totalCalories + food.calories,
      totalProtein: Math.round((totals.totalProtein + food.protein) * 10) / 10,
      totalCarbs: Math.round((totals.totalCarbs + food.carbs) * 10) / 10,
      totalFat: Math.round((totals.totalFat + food.fat) * 10) / 10
    }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
  };

  const dayTotals = meals.reduce((totals, meal) => ({
    calories: totals.calories + meal.totalCalories,
    protein: Math.round((totals.protein + meal.totalProtein) * 10) / 10,
    carbs: Math.round((totals.carbs + meal.totalCarbs) * 10) / 10,
    fat: Math.round((totals.fat + meal.totalFat) * 10) / 10
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="day-detail">
      <div className="page-header">
        <div className="day-header-top">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            Voltar
          </button>
          <h2>{dayData.day} - {dayData.date}</h2>
        </div>
        <div className="day-totals">
          <span className="total-item">{dayTotals.calories} cal</span>
          <span className="total-item">{dayTotals.protein}g prot</span>
          <span className="total-item">{dayTotals.carbs}g carb</span>
          <span className="total-item">{dayTotals.fat}g gord</span>
        </div>
      </div>

      <div className="add-meal-section">
        <div className="dropdown-container">
          <button 
            className="btn-primary add-meal-btn"
            onClick={() => setShowMealDropdown(!showMealDropdown)}
          >
            <Plus size={16} />
            Adicionar Refeição
          </button>
          {showMealDropdown && (
            <div className="dropdown-menu">
              {mealTypes.map(mealType => (
                <button
                  key={mealType}
                  className="dropdown-item"
                  onClick={() => addMeal(mealType)}
                >
                  {mealType}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="meals-list">
        {meals.map(meal => (
          <div key={meal.id} className="meal-bar">
            <div className="meal-header">
              <div className="meal-info">
                <h3>{meal.name}</h3>
                <div className="meal-totals">
                  <span>{meal.totalCalories} cal</span>
                  <span>{meal.totalProtein}g prot</span>
                  <span>{meal.totalCarbs}g carb</span>
                  <span>{meal.totalFat}g gord</span>
                </div>
              </div>
              <div className="meal-actions">
                <button 
                  className="btn-secondary add-food-btn"
                  onClick={() => {
                    setSelectedMealId(meal.id);
                    setShowFoodSelector(true);
                  }}
                >
                  <Plus size={14} />
                  Adicionar Alimento
                </button>
                <button 
                  className="btn-danger remove-meal-btn"
                  onClick={() => removeMeal(meal.id)}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            
            <div className="foods-grid">
              {meal.foods.map(food => (
                <div key={food.id} className="food-card">
                  <div className="food-card-header">
                    <span className="food-name">{food.name}</span>
                    <button 
                      className="remove-food-btn"
                      onClick={() => removeFoodFromMeal(meal.id, food.id)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="food-quantity">{food.quantity}{food.unit.replace('100', '')}</div>
                  <div className="food-nutrition">
                    <span>{food.calories} cal</span>
                    <span>{food.protein}g prot</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <FoodSelector 
        isOpen={showFoodSelector}
        onClose={() => setShowFoodSelector(false)}
        onAddFood={addFoodToMeal}
      />
    </div>
  );
}