import { DayData } from '../types';
import { ChevronRight, Scale, Ruler, Flame } from 'lucide-react';
import { useEffect } from 'react';

interface DashboardProps {
  onDayClick: (dayData: DayData) => void;
}

export function Dashboard({ onDayClick }: DashboardProps) {
  // Dados para o gráfico de peso x mês
  const weightData = [
    { month: 'Set', weight: 75.2 },
    { month: 'Out', weight: 74.1 },
    { month: 'Nov', weight: 73.5 },
    { month: 'Dez', weight: 72.8 },
    { month: 'Jan', weight: 72.5 }
  ];

  const minWeight = Math.min(...weightData.map(d => d.weight));
  const maxWeight = Math.max(...weightData.map(d => d.weight));
  const weightRange = maxWeight - minWeight;

  // Dados para o gráfico circular de calorias
  const caloriesData = {
    current: 1950,
    goal: 2500,
    percentage: 78
  };

  useEffect(() => {
    // Tooltip para gráfico donut
    const donutSections = document.querySelectorAll('.donut-section');
    const donutTooltip = document.getElementById('donut-tooltip');

    const handleDonutMouseEnter = (event: Event) => {
      const target = event.target as SVGElement;
      const tooltipText = target.getAttribute('data-tooltip');
      if (donutTooltip && tooltipText) {
        donutTooltip.textContent = tooltipText;
        donutTooltip.classList.add('show');
      }
    };

    const handleDonutMouseMove = (event: MouseEvent) => {
      if (donutTooltip) {
        const rect = (event.target as SVGElement).closest('.donut-chart-container')?.getBoundingClientRect();
        if (rect) {
          donutTooltip.style.left = `${event.clientX - rect.left}px`;
          donutTooltip.style.top = `${event.clientY - rect.top - 10}px`;
        }
      }
    };

    const handleDonutMouseLeave = () => {
      if (donutTooltip) {
        donutTooltip.classList.remove('show');
      }
    };

    // Tooltip para gráfico de barras de peso
    const weightBars = document.querySelectorAll('.weight-bar-rect');
    const weightTooltip = document.getElementById('weight-chart-tooltip');

    const handleWeightMouseEnter = (event: Event) => {
      const target = event.target as SVGElement;
      const tooltipText = target.getAttribute('data-tooltip');
      if (weightTooltip && tooltipText) {
        weightTooltip.textContent = tooltipText;
        weightTooltip.classList.add('show');
      }
    };

    const handleWeightMouseMove = (event: MouseEvent) => {
      if (weightTooltip) {
        const rect = (event.target as SVGElement).closest('.weight-bar-chart-wrapper')?.getBoundingClientRect();
        if (rect) {
          weightTooltip.style.left = `${event.clientX - rect.left}px`;
          weightTooltip.style.top = `${event.clientY - rect.top - 10}px`;
        }
      }
    };

    const handleWeightMouseLeave = () => {
      if (weightTooltip) {
        weightTooltip.classList.remove('show');
      }
    };

    // Event listeners para donut
    donutSections.forEach(section => {
      section.addEventListener('mouseenter', handleDonutMouseEnter);
      section.addEventListener('mousemove', handleDonutMouseMove as EventListener);
      section.addEventListener('mouseleave', handleDonutMouseLeave);
    });

    // Event listeners para barras de peso
    weightBars.forEach(bar => {
      bar.addEventListener('mouseenter', handleWeightMouseEnter);
      bar.addEventListener('mousemove', handleWeightMouseMove as EventListener);
      bar.addEventListener('mouseleave', handleWeightMouseLeave);
    });

    return () => {
      donutSections.forEach(section => {
        section.removeEventListener('mouseenter', handleDonutMouseEnter);
        section.removeEventListener('mousemove', handleDonutMouseMove as EventListener);
        section.removeEventListener('mouseleave', handleDonutMouseLeave);
      });
      
      weightBars.forEach(bar => {
        bar.removeEventListener('mouseenter', handleWeightMouseEnter);
        bar.removeEventListener('mousemove', handleWeightMouseMove as EventListener);
        bar.removeEventListener('mouseleave', handleWeightMouseLeave);
      });
    };
  }, []);

  const daysData: DayData[] = [
    { 
      date: '15/01', 
      day: 'Segunda-feira', 
      calories: 1850, 
      protein: 95, 
      status: 'completed',
      meals: []
    },
    { 
      date: '16/01', 
      day: 'Terça-feira', 
      calories: 2100, 
      protein: 110, 
      status: 'completed',
      meals: []
    },
    { 
      date: '17/01', 
      day: 'Quarta-feira', 
      calories: 1950, 
      protein: 88, 
      status: 'completed',
      meals: []
    },
    { 
      date: '18/01', 
      day: 'Quinta-feira', 
      calories: 2200, 
      protein: 125, 
      status: 'completed',
      meals: []
    },
    { 
      date: '19/01', 
      day: 'Sexta-feira', 
      calories: 1750, 
      protein: 82, 
      status: 'completed',
      meals: []
    },
    { 
      date: '20/01', 
      day: 'Sábado', 
      calories: 2350, 
      protein: 140, 
      status: 'completed',
      meals: []
    },
    { 
      date: '21/01', 
      day: 'Domingo', 
      calories: 1900, 
      protein: 92, 
      status: 'completed',
      meals: []
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="metrics-grid">
        <div className="metric-card weight">
          <div className="metric-icon">
            <Scale size={24} />
          </div>
          <div className="metric-content">
            <h3>72.5 kg</h3>
            <p>Peso Atual</p>
          </div>
        </div>
        <div className="metric-card imc">
          <div className="metric-icon">
            <Ruler size={24} />
          </div>
          <div className="metric-content">
            <h3>23.8</h3>
            <p>IMC</p>
          </div>
        </div>
        <div className="metric-card calories">
          <div className="metric-icon">
            <Flame size={24} />
          </div>
          <div className="metric-content">
            <h3>1,950</h3>
            <p>Calorias Hoje</p>
          </div>
        </div>

      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Peso nos Últimos 5 Meses</h3>
          <div className="weight-bar-chart-wrapper">
            <svg className="weight-bar-chart" viewBox="0 0 600 320">
              <defs>
                <linearGradient id="weightBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="50%" stopColor="#764ba2" />
                  <stop offset="100%" stopColor="#667eea" />
                </linearGradient>
                <filter id="barShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                </filter>
              </defs>
              
              {/* Grid lines */}
              <g className="grid-lines">
                {[0, 1, 2, 3, 4].map(i => {
                  // Calcular posição Y baseada no peso correspondente
                  const weight = maxWeight - (i * weightRange / 4);
                  const barHeight = weightRange > 0 
                    ? ((weight - minWeight) / weightRange) * 200 + 30
                    : 100;
                  const gridY = 240 - barHeight;
                  
                  return (
                    <line
                      key={i}
                      x1="70"
                      y1={gridY}
                      x2="530"
                      y2={gridY}
                      stroke="#f0f0f0"
                      strokeWidth="1"
                    />
                  );
                })}
              </g>
              
              {/* Y-axis labels */}
              <g className="y-axis-labels">
                {[0, 1, 2, 3, 4].map(i => {
                  const weight = maxWeight - (i * weightRange / 4);
                  // Calcular posição Y para alinhar com o topo das barras
                  const barHeight = weightRange > 0 
                    ? ((weight - minWeight) / weightRange) * 200 + 30
                    : 100;
                  const labelY = 240 - barHeight + 5;
                  
                  return (
                    <text
                      key={i}
                      x="65"
                      y={labelY}
                      textAnchor="end"
                      fontSize="12"
                      fill="#666"
                    >
                      {weight.toFixed(1)}
                    </text>
                  );
                })}
              </g>
              
              {/* Bars */}
              <g className="bars">
                {weightData.map((data, index) => {
                  const barHeight = weightRange > 0 
                    ? ((data.weight - minWeight) / weightRange) * 200 + 30
                    : 100;
                  const x = 100 + (index * 100);
                  const y = 240 - barHeight;
                  const monthAbbr = data.month.substring(0, 3);
                  
                  return (
                    <g key={data.month} className="bar-group">
                      <rect
                        x={x}
                        y={y}
                        width="60"
                        height={barHeight}
                        fill="url(#weightBarGradient)"
                        rx="4"
                        ry="4"
                        filter="url(#barShadow)"
                        className="weight-bar-rect"
                        data-tooltip={`${monthAbbr}: ${data.weight}kg`}
                      />
                      
                      {/* Month label */}
                      <text
                        x={x + 30}
                        y="260"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="500"
                        fill="#6b7280"
                      >
                        {data.month}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
            <div className="weight-chart-tooltip" id="weight-chart-tooltip"></div>
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Calorias Diárias</h3>
          <div className="donut-chart-wrapper">
            <div className="donut-chart-container">
              <svg width="200" height="200" viewBox="0 0 200 200" className="donut-chart">
                <defs>
                  <linearGradient id="consumedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="remainingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f3f4f6" />
                    <stop offset="100%" stopColor="#e5e7eb" />
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1"/>
                  </filter>
                </defs>
                
                {/* Círculo de fundo */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="url(#remainingGradient)"
                  strokeWidth="20"
                  filter="url(#shadow)"
                />
                
                {/* Círculo de progresso */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="url(#consumedGradient)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 70 * (caloriesData.percentage / 100)} ${2 * Math.PI * 70}`}
                  transform="rotate(-90 100 100)"
                  className="donut-progress"
                  filter="url(#shadow)"
                />
                
                {/* Seção consumida (invisível para tooltip) */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="transparent"
                  strokeWidth="20"
                  strokeDasharray={`${2 * Math.PI * 70 * (caloriesData.percentage / 100)} ${2 * Math.PI * 70}`}
                  transform="rotate(-90 100 100)"
                  className="donut-section consumed"
                  data-tooltip={`Consumidas: ${caloriesData.current} kcal`}
                />
                
                {/* Seção restante (invisível para tooltip) */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="transparent"
                  strokeWidth="20"
                  strokeDasharray={`${2 * Math.PI * 70 * ((100 - caloriesData.percentage) / 100)} ${2 * Math.PI * 70}`}
                  strokeDashoffset={`-${2 * Math.PI * 70 * (caloriesData.percentage / 100)}`}
                  transform="rotate(-90 100 100)"
                  className="donut-section remaining"
                  data-tooltip={`Restantes: ${caloriesData.goal - caloriesData.current} kcal`}
                />
              </svg>
              
              <div className="donut-center">
                <span className="donut-percentage">{caloriesData.percentage}%</span>
              </div>
              
              <div className="donut-tooltip" id="donut-tooltip"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="days-section">
        <div className="days-header">
          <h3>Últimos 7 dias</h3>
          <button className="see-all-btn">
            Ver todos
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="days-scroll">
          {daysData.slice().reverse().map((day, index) => {
            const isToday = index === 0; // Primeiro item após reverse é o dia mais recente
            return (
            <div 
              key={index} 
              className={`day-card ${isToday ? 'today' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <div className="day-header">
                <span className="day-name">{day.day}</span>
              </div>
              <span className="day-date">{day.date}</span>
              <div className="day-metrics">
                <div className="day-metric">
                  <span className="metric-value">{day.calories}</span>
                  <span className="metric-label">cal</span>
                </div>
                <div className="day-metric">
                  <span className="metric-value">{day.protein}</span>
                  <span className="metric-label">prot</span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}