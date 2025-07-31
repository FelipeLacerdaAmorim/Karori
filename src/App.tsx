import { useState } from 'react'
import { Menu, Search, Bell, User, Home, Calendar, Utensils, Settings } from 'lucide-react'
import './App.css'
import { Dashboard } from './components/Dashboard'
import { DayDetail } from './components/DayDetail'
import { Foods } from './components/foods'
import { Calendar as CalendarComponent } from './components/Calendar'
import { Settings as SettingsComponent } from './components/Settings'
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
    
    switch (activeNav) {
      case 'dashboard':
        return <Dashboard onDayClick={handleDayClick} />
      case 'calendar':
        return <CalendarComponent />
      case 'foods':
        return <Foods />
      case 'settings':
        return <SettingsComponent />
      default:
        return <Dashboard onDayClick={handleDayClick} />
    }
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
            <div className="nav-main">
              <div className="nav-item" 
                   onClick={() => setActiveNav('dashboard')}
                   data-active={activeNav === 'dashboard'}>
                <Home size={20} />
                <span>Dashboard</span>
              </div>
              <div className="nav-item" 
                   onClick={() => setActiveNav('calendar')}
                   data-active={activeNav === 'calendar'}>
                <Calendar size={20} />
                <span>Calendário</span>
              </div>
              <div className="nav-item" 
                   onClick={() => setActiveNav('foods')}
                   data-active={activeNav === 'foods'}>
                <Utensils size={20} />
                <span>Alimentos</span>
              </div>
            </div>
            <div className="nav-bottom">
              <div className="nav-item" 
                   onClick={() => setActiveNav('settings')}
                   data-active={activeNav === 'settings'}>
                <Settings size={20} />
                <span>Configurações</span>
              </div>
            </div>
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
