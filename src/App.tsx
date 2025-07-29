import { useState } from 'react'
import { Menu, Search, Bell, User, Home, Calendar, TrendingUp, Settings } from 'lucide-react'
import './App.css'
import { Dashboard } from './components/Dashboard'
import { DayDetail } from './components/DayDetail'
import { DayData } from './types'

function App() {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [showDayDetail, setShowDayDetail] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')

  const handleDayClick = (dayData: DayData) => {
    setSelectedDay(dayData)
    setShowDayDetail(true)
  }

  const handleBackToDashboard = () => {
    setShowDayDetail(false)
    setSelectedDay(null)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const renderContent = () => {
    if (showDayDetail && selectedDay) {
      return (
        <DayDetail 
          dayData={selectedDay} 
          onBack={handleBackToDashboard}
        />
      )
    }
    
    return <Dashboard onDayClick={handleDayClick} />
  }

  return (
    <div className="app">
      {/* Header Global */}
      <header className="app-header">
        <div className="header-left">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
          <h1 className="app-title">CaloriasApp</h1>
        </div>
        
        <div className="header-center">
          <div className="search-bar">
            <Search size={16} />
            <input type="text" placeholder="Buscar alimentos, receitas..." />
          </div>
        </div>
        
        <div className="header-right">
          <button className="notification-btn">
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </button>
          
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">João Silva</span>
              <span className="user-role">Usuário</span>
            </div>
          </div>
        </div>
      </header>

      {/* Body da Aplicação */}
      <div className="app-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('dashboard')
                setShowDayDetail(false)
                setSelectedDay(null)
              }}
            >
              <Home size={24} />
              <span>Dashboard</span>
            </button>
            
            <button 
              className={`nav-item ${activeNav === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveNav('calendar')}
            >
              <Calendar size={24} />
              <span>Calendário</span>
            </button>
            
            <button 
              className={`nav-item ${activeNav === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveNav('progress')}
            >
              <TrendingUp size={24} />
              <span>Progresso</span>
            </button>
            
            <button 
              className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveNav('settings')}
            >
              <Settings size={24} />
              <span>Configurações</span>
            </button>
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App;
