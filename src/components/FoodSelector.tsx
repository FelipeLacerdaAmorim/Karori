import { useState } from "react";
import { X, ArrowLeft, Search, Info } from 'lucide-react';
import { Food, FoodDatabase } from '../types';

interface FoodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: Food) => void;
}

const foodDatabase: FoodDatabase[] = [
  { id: '1', name: 'Arroz branco cozido', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, unit: '100g' },
  { id: '2', name: 'Feijão preto cozido', calories: 77, protein: 4.5, carbs: 14, fat: 0.5, unit: '100g' },
  { id: '3', name: 'Peito de frango grelhado', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
  { id: '4', name: 'Ovo cozido', calories: 155, protein: 13, carbs: 1.1, fat: 11, unit: '1 unidade' },
  { id: '5', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, unit: '1 unidade' },
  { id: '6', name: 'Aveia em flocos', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, unit: '100g' },
  { id: '7', name: 'Leite integral', calories: 61, protein: 3.2, carbs: 4.6, fat: 3.2, unit: '100ml' },
  { id: '8', name: 'Pão francês', calories: 300, protein: 9.4, carbs: 58, fat: 3.1, unit: '1 unidade' },
  { id: '9', name: 'Queijo mussarela', calories: 280, protein: 25, carbs: 2.2, fat: 19, unit: '100g' },
  { id: '10', name: 'Maçã', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, unit: '1 unidade' }
];

export function FoodSelector({ isOpen, onClose, onAddFood }: FoodSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodDatabase | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFoodSelect = (food: FoodDatabase) => {
    setSelectedFood(food);
    setShowDetails(true);
    setQuantity(1);
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    const multiplier = selectedFood.unit.includes('100') ? quantity / 100 : quantity;
    
    const foodToAdd: Food = {
      id: Date.now().toString(),
      name: selectedFood.name,
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
      quantity: quantity,
      unit: selectedFood.unit
    };

    onAddFood(foodToAdd);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedFood(null);
    setShowDetails(false);
    setQuantity(1);
    onClose();
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedFood(null);
    setQuantity(1);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content food-selector-modal">
        {!showDetails ? (
          // Fase 1: Lista de alimentos
          <>
            <div className="modal-header">
              <h3>Selecionar Alimento</h3>
              <button className="close-btn" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>
            
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar alimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="food-list">
              {filteredFoods.map(food => (
                <div 
                  key={food.id} 
                  className="food-list-item"
                  onClick={() => handleFoodSelect(food)}
                >
                  <div className="food-list-info">
                    <span className="food-list-name">{food.name}</span>
                    <span className="food-list-unit">por {food.unit}</span>
                  </div>
                  <div className="food-list-nutrition">
                    <span>{food.calories} cal</span>
                    <span>{food.protein}g prot</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Fase 2: Detalhes e quantidade
          <>
            <div className="modal-header">
              <div className="modal-header-left">
                <button className="back-btn" onClick={handleBackToList}>
                  <ArrowLeft size={16} />
                  Voltar
                </button>
                <h3>Adicionar Alimento</h3>
              </div>
              <button className="close-btn" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>

            {selectedFood && (
              <div className="food-details">
                <div className="food-details-header">
                  <h4>{selectedFood.name}</h4>
                  <span className="food-unit">Valores por {selectedFood.unit}</span>
                </div>

                <div className="nutrition-info">
                  <div className="nutrition-item">
                    <span className="nutrition-label">Calorias:</span>
                    <span className="nutrition-value">{Math.round(selectedFood.calories * (selectedFood.unit.includes('100') ? quantity / 100 : quantity))} kcal</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Proteína:</span>
                    <span className="nutrition-value">{Math.round(selectedFood.protein * (selectedFood.unit.includes('100') ? quantity / 100 : quantity) * 10) / 10}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Carboidratos:</span>
                    <span className="nutrition-value">{Math.round(selectedFood.carbs * (selectedFood.unit.includes('100') ? quantity / 100 : quantity) * 10) / 10}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Gordura:</span>
                    <span className="nutrition-value">{Math.round(selectedFood.fat * (selectedFood.unit.includes('100') ? quantity / 100 : quantity) * 10) / 10}g</span>
                  </div>
                </div>

                <div className="quantity-section">
                  <label className="quantity-label">
                    Quantidade ({selectedFood.unit.includes('100') ? 'gramas' : 'unidades'}):
                  </label>
                  <div className="quantity-input-container">
                    <button 
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - (selectedFood.unit.includes('100') ? 10 : 1)))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="quantity-input"
                      min="1"
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => setQuantity(quantity + (selectedFood.unit.includes('100') ? 10 : 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn-primary" onClick={handleAddFood}>
                    Adicionar à Refeição
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}