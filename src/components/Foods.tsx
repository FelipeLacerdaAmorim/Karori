import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Alimento, CategoriaAlimento } from '../types';

export const Foods: React.FC = () => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [categorias, setCategorias] = useState<CategoriaAlimento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState<Alimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    categoria_id: '',
    unidade: '',
    default_value: 100,
    calorias_por_unidade: 0,
    proteina_por_unidade: 0,
    gordura_por_unidade: 0,
    carboidrato_por_unidade: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [alimentosData, categoriasData] = await Promise.all([
        invoke<Alimento[]>('get_alimentos'),
        invoke<CategoriaAlimento[]>('get_categorias_alimento')
      ]);
      setAlimentos(alimentosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlimentos = alimentos.filter(alimento =>
    alimento.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoriaStats = () => {
    const stats = categorias.map(categoria => {
      const count = alimentos.filter(alimento => alimento.categoria_id === categoria.id).length;
      return {
        ...categoria,
        count
      };
    });
    return stats;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação básica
    if (!formData.nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    
    if (!formData.categoria_id || formData.categoria_id === '') {
      alert('Categoria é obrigatória');
      return;
    }
    
    if (!formData.unidade.trim()) {
      alert('Unidade é obrigatória');
      return;
    }
    
    try {
      if (editingFood) {
        const editData = {
          id: editingFood.id,
          nome: formData.nome,
          categoriaId: Number(formData.categoria_id),
          unidade: formData.unidade,
          defaultValue: formData.default_value,
          caloriasPorUnidade: formData.calorias_por_unidade,
          proteinaPorUnidade: formData.proteina_por_unidade,
          gorduraPorUnidade: formData.gordura_por_unidade,
          carboidratoPorUnidade: formData.carboidrato_por_unidade
        };
        await invoke('editar_alimento', editData);
        setSuccessMessage('Alimento atualizado com sucesso!');
      } else {
        const createData = {
          nome: formData.nome,
          categoriaId: Number(formData.categoria_id),
          unidade: formData.unidade,
          defaultValue: formData.default_value,
          caloriasPorUnidade: formData.calorias_por_unidade,
          proteinaPorUnidade: formData.proteina_por_unidade,
          gorduraPorUnidade: formData.gordura_por_unidade,
          carboidratoPorUnidade: formData.carboidrato_por_unidade
        };
        const result = await invoke('criar_alimento', createData);
        setSuccessMessage('Alimento adicionado com sucesso!');
      }
      await loadData();
      handleCloseModal();
      
      // Remove a mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao salvar alimento:', error);
      alert(`Erro ao salvar alimento: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este alimento?')) {
      try {
        await invoke('deletar_alimento', { id });
        await loadData();
      } catch (error) {
        console.error('Erro ao deletar alimento:', error);
      }
    }
  };

  const handleEdit = (alimento: Alimento) => {
    setEditingFood(alimento);
    setFormData({
      nome: alimento.nome,
      categoria_id: alimento.categoria_id.toString(),
      unidade: alimento.unidade,
      default_value: alimento.default_value,
      calorias_por_unidade: alimento.calorias_por_unidade,
      proteina_por_unidade: alimento.proteina_por_unidade,
      gordura_por_unidade: alimento.gordura_por_unidade,
      carboidrato_por_unidade: alimento.carboidrato_por_unidade
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFood(null);
    setFormData({
      nome: '',
      categoria_id: '',
      unidade: '',
      default_value: 100,
      calorias_por_unidade: 0,
      proteina_por_unidade: 0,
      gordura_por_unidade: 0,
      carboidrato_por_unidade: 0
    });
  };

  const getCategoriaById = (id: number) => {
    return categorias.find(cat => cat.id === id);
  };

  if (loading) {
    return (
      <div className="foods-page">
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="foods-page">
      {/* Header com degradê */}
      <div className="foods-header">
        <div className="foods-header-content">
          <div className="foods-title">
            <h1>Alimentos</h1>
            <p>Gerencie sua base de dados de alimentos</p>
          </div>
          
          {/* Cards de categorias */}
          <div className="category-cards">
            {getCategoriaStats().map(categoria => (
              <div key={categoria.id} className="category-card">
                <span className="category-card-icon">{categoria.icone}</span>
                <div className="category-card-info">
                  <span className="category-card-count">{categoria.count}</span>
                  <span className="category-card-label">{categoria.nome}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Botão adicionar */}
          <button 
            className="add-food-btn"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Adicionar
          </button>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="foods-search">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Pesquisar alimentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabela de alimentos */}
      <div className="foods-table-container">
        <table className="foods-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Unidade</th>
              <th>Calorias</th>
              <th>Proteína</th>
              <th>Carboidratos</th>
              <th>Gordura</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlimentos.map(alimento => {
              const categoria = getCategoriaById(alimento.categoria_id);
              return (
                <tr key={alimento.id}>
                  <td className="food-name">
                    <span className="category-icon">{categoria?.icone}</span>
                    {alimento.nome}
                  </td>
                  <td>{categoria?.nome}</td>
                  <td>{alimento.default_value} {alimento.unidade}</td>
                  <td>{alimento.calorias_por_unidade.toFixed(1)} kcal</td>
                  <td>{alimento.proteina_por_unidade.toFixed(1)}g</td>
                  <td>{alimento.carboidrato_por_unidade.toFixed(1)}g</td>
                  <td>{alimento.gordura_por_unidade.toFixed(1)}g</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(alimento)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(alimento.id)}
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredAlimentos.length === 0 && (
          <div className="empty-state">
            <p>Nenhum alimento encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de adicionar/editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingFood ? 'Editar Alimento' : 'Adicionar Alimento'}</h3>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit} className="food-form" id="food-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nome do Alimento</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                  <select
                    value={formData.categoria_id}
                    onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.icone} {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Unidade</label>
                  <select
                    value={formData.unidade}
                    onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma unidade</option>
                    <option value="g">Gramas (g)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="unidade">Unidade</option>
                    <option value="fatia">Fatia</option>
                    <option value="xícara">Xícara</option>
                    <option value="colher de sopa">Colher de sopa</option>
                    <option value="colher de chá">Colher de chá</option>
                    <option value="porção">Porção</option>
                    <option value="pedaço">Pedaço</option>
                    <option value="copo">Copo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Valor Padrão</label>
                  <input
                    type="number"
                    value={formData.default_value}
                    onChange={(e) => setFormData({...formData, default_value: Number(e.target.value)})}
                    min="0"
                    step="5"
                    required
                  />
                </div>
              </div>

              <div className="nutrition-section">
                <h4>Informações Nutricionais (por {formData.default_value || 100} {formData.unidade || 'unidade'})</h4>
                <div className="nutrition-grid">
                  <div className="form-group">
                    <label>Calorias (kcal)</label>
                    <input
                      type="number"
                      value={formData.calorias_por_unidade}
                      onChange={(e) => setFormData({...formData, calorias_por_unidade: Number(e.target.value)})}
                      min="0"
                      step="1"
                      required
                      placeholder="Ex: 250"
                    />
                  </div>
                  <div className="form-group">
                    <label>Proteína (g)</label>
                    <input
                      type="number"
                      value={formData.proteina_por_unidade}
                      onChange={(e) => setFormData({...formData, proteina_por_unidade: Number(e.target.value)})}
                      min="0"
                      step="1"
                      required
                      placeholder="Ex: 15"
                    />
                  </div>
                  <div className="form-group">
                    <label>Carboidratos (g)</label>
                    <input
                      type="number"
                      value={formData.carboidrato_por_unidade}
                      onChange={(e) => setFormData({...formData, carboidrato_por_unidade: Number(e.target.value)})}
                      min="0"
                      step="1"
                      required
                      placeholder="Ex: 30"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gordura (g)</label>
                    <input
                      type="number"
                      value={formData.gordura_por_unidade}
                      onChange={(e) => setFormData({...formData, gordura_por_unidade: Number(e.target.value)})}
                      min="0"
                      step="1"
                      required
                      placeholder="Ex: 8"
                    />
                  </div>
                </div>
              </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" form="food-form" className="submit-btn">
                  {editingFood ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notificação de sucesso */}
      {successMessage && (
        <div className="success-notification">
          {successMessage}
        </div>
      )}
    </div>
  );
};