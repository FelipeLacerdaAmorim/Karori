use tauri::{Manager, PhysicalSize};
use rusqlite::Connection;
use std::path::PathBuf;

// Função para obter o caminho do banco de dados
fn get_db_path() -> PathBuf {
    let mut db_path = PathBuf::from(std::env::var("APPDATA").unwrap_or_else(|_| ".".to_string()));
    db_path.push("CaloriasApp");
    
    // Criar diretório se não existir
    if !db_path.exists() {
        std::fs::create_dir_all(&db_path).unwrap_or_default();
    }
    
    db_path.push("karori_v3.db");
    db_path
}

// Função para inicializar o banco de dados
fn init_database() -> Result<(), rusqlite::Error> {
    let db_path = get_db_path();
    let conn = Connection::open(&db_path)?;
    
    // Criar todas as tabelas
    conn.execute_batch("
        -- Tabela de usuários
        CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha_hash TEXT NOT NULL,
            data_nascimento DATE,
            sexo TEXT CHECK(sexo IN ('M', 'F', 'Outro')),
            altura REAL,
            nivel_atividade TEXT CHECK(nivel_atividade IN ('Sedentário', 'Levemente ativo', 'Moderadamente ativo', 'Muito ativo', 'Extremamente ativo')),
            objetivo TEXT CHECK(objetivo IN ('Perder peso', 'Manter peso', 'Ganhar peso', 'Ganhar massa muscular')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabela de medições corporais
        CREATE TABLE IF NOT EXISTS medicoes_corporais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            peso REAL NOT NULL,
            percentual_gordura REAL,
            massa_muscular REAL,
            data_medicao DATE NOT NULL,
            observacoes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        );

        -- Tabela de categorias de alimentos
        CREATE TABLE IF NOT EXISTS categoria_alimento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            descricao TEXT,
            cor_hex TEXT,
            icone TEXT,
            ativo BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabela de alimentos
        CREATE TABLE IF NOT EXISTS alimento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            categoria_id INTEGER NOT NULL,
            unidade TEXT NOT NULL,
            default_value REAL DEFAULT 100,
            calorias_por_unidade REAL NOT NULL,
            proteina_por_unidade REAL NOT NULL,
            gordura_por_unidade REAL NOT NULL,
            carboidrato_por_unidade REAL NOT NULL,
            ativo BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoria_id) REFERENCES categoria_alimento(id)
        );

        -- Tabela de dias
        CREATE TABLE IF NOT EXISTS dia (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            data DATE NOT NULL,
            peso_do_dia REAL,
            observacoes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id),
            UNIQUE(usuario_id, data)
        );

        -- Tabela de tipos de refeição
        CREATE TABLE IF NOT EXISTS tipo_refeicao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            descricao TEXT,
            ordem INTEGER NOT NULL,
            ativo BOOLEAN DEFAULT 1
        );

        -- Tabela de refeições do dia
        CREATE TABLE IF NOT EXISTS refeicao_dia (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dia_id INTEGER NOT NULL,
            tipo_refeicao_id INTEGER NOT NULL,
            horario TIME,
            observacoes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (dia_id) REFERENCES dia(id),
            FOREIGN KEY (tipo_refeicao_id) REFERENCES tipo_refeicao(id)
        );

        -- Tabela de alimentos por refeição
        CREATE TABLE IF NOT EXISTS alimento_refeicao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            refeicao_dia_id INTEGER NOT NULL,
            alimento_id INTEGER NOT NULL,
            quantidade REAL NOT NULL,
            calorias_consumidas REAL NOT NULL,
            proteina_consumida REAL NOT NULL,
            gordura_consumida REAL NOT NULL,
            carboidrato_consumido REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (refeicao_dia_id) REFERENCES refeicao_dia(id),
            FOREIGN KEY (alimento_id) REFERENCES alimento(id)
        );

        -- Tabela de resumos semanais
        CREATE TABLE IF NOT EXISTS resumo_semanal (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            ano INTEGER NOT NULL,
            semana INTEGER NOT NULL,
            data_inicio DATE NOT NULL,
            data_fim DATE NOT NULL,
            total_calorias REAL NOT NULL,
            total_proteina REAL NOT NULL,
            total_gordura REAL NOT NULL,
            total_carboidrato REAL NOT NULL,
            peso_inicial REAL,
            peso_final REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id),
            UNIQUE(usuario_id, ano, semana)
        );

        -- Tabela de resumos mensais
        CREATE TABLE IF NOT EXISTS resumo_mensal (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            ano INTEGER NOT NULL,
            mes INTEGER NOT NULL,
            total_calorias REAL NOT NULL,
            total_proteina REAL NOT NULL,
            total_gordura REAL NOT NULL,
            total_carboidrato REAL NOT NULL,
            peso_inicial REAL,
            peso_final REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id),
            UNIQUE(usuario_id, ano, mes)
        );

        -- Tabela de resumos anuais
        CREATE TABLE IF NOT EXISTS resumo_anual (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            ano INTEGER NOT NULL,
            total_calorias REAL NOT NULL,
            total_proteina REAL NOT NULL,
            total_gordura REAL NOT NULL,
            total_carboidrato REAL NOT NULL,
            peso_inicial REAL,
            peso_final REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id),
            UNIQUE(usuario_id, ano)
        );

        -- Tabela de metas nutricionais
        CREATE TABLE IF NOT EXISTS meta_nutricional (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            calorias_diarias REAL NOT NULL,
            proteina_diaria REAL NOT NULL,
            carboidrato_diario REAL NOT NULL,
            gordura_diaria REAL NOT NULL,
            objetivo TEXT NOT NULL,
            data_inicio DATE NOT NULL,
            data_fim DATE,
            ativo BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        );
    ")?;
    
    // Inserir dados iniciais
    conn.execute_batch("
        -- Inserir categorias padrão
        INSERT OR IGNORE INTO categoria_alimento (nome, descricao, cor_hex, icone) VALUES
        ('Frutas', 'Frutas frescas e secas', '#FF6B6B', '🍎'),
        ('Vegetais', 'Vegetais e verduras', '#4ECDC4', '🥬'),
        ('Proteínas', 'Carnes, peixes, ovos e leguminosas', '#45B7D1', '🍖'),
        ('Grãos', 'Cereais, pães e massas', '#96CEB4', '🌾'),
        ('Laticínios', 'Leite, queijos e derivados', '#FFEAA7', '🥛'),
        ('Gorduras', 'Óleos, manteigas e oleaginosas', '#DDA0DD', '🥑'),
        ('Bebidas', 'Sucos, refrigerantes e bebidas', '#74B9FF', '🥤'),
        ('Doces', 'Açúcares, chocolates e sobremesas', '#FD79A8', '🍰');

        -- Inserir tipos de refeição padrão
        INSERT OR IGNORE INTO tipo_refeicao (nome, descricao, ordem) VALUES
        ('Café da Manhã', 'Primeira refeição do dia', 1),
        ('Lanche da Manhã', 'Lanche entre café e almoço', 2),
        ('Almoço', 'Refeição principal do meio-dia', 3),
        ('Lanche da Tarde', 'Lanche entre almoço e jantar', 4),
        ('Jantar', 'Refeição principal da noite', 5),
        ('Ceia', 'Lanche noturno', 6);

        -- Inserir alguns alimentos padrão
        INSERT OR IGNORE INTO alimento (nome, categoria_id, unidade, default_value, calorias_por_unidade, proteina_por_unidade, gordura_por_unidade, carboidrato_por_unidade) VALUES
        ('Arroz branco cozido', 4, 'g', 100, 130, 2.7, 0.3, 28),
        ('Feijão carioca cozido', 3, 'g', 100, 76, 4.8, 0.5, 13.6),
        ('Peito de frango grelhado', 3, 'g', 100, 165, 31, 3.6, 0),
        ('Banana', 1, 'unidade', 1, 87, 1.1, 0.3, 22.8),
        ('Maçã', 1, 'unidade', 1, 52, 0.3, 0.2, 13.8),
        ('Pão francês', 4, 'unidade', 1, 135, 4.5, 1.2, 26),
        ('Leite integral', 5, 'ml', 200, 124, 6.4, 6.8, 9.6),
        ('Ovo de galinha', 3, 'unidade', 1, 70, 6, 5, 0.6);
    ")?;
    
    Ok(())
}

// Estruturas de dados baseadas no diagrama ER
#[derive(serde::Serialize, serde::Deserialize)]
struct Usuario {
    id: i32,
    nome: String,
    email: String,
    senha: String,
    data_nascimento: String,
    sexo: String,
    created_at: String,
    updated_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct MedicoesCorporais {
    id: i32,
    usuario_id: i32,
    peso: f64,
    altura: f64,
    imc: f64,
    percentual_gordura: Option<f64>,
    massa_muscular: Option<f64>,
    circunferencia_cintura: Option<f64>,
    circunferencia_quadril: Option<f64>,
    data_medicao: String,
    created_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct CategoriaAlimento {
    id: i32,
    nome: String,
    descricao: Option<String>,
    cor_hex: Option<String>,
    icone: Option<String>,
    ativo: bool,
    created_at: String,
    updated_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct Alimento {
    id: i32,
    nome: String,
    categoria_id: i32,
    unidade: String,
    default_value: f64,
    calorias_por_unidade: f64,
    proteina_por_unidade: f64,
    gordura_por_unidade: f64,
    carboidrato_por_unidade: f64,
    ativo: bool,
    created_at: String,
    updated_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct Dia {
    id: i32,
    usuario_id: i32,
    data: String,
    meta_calorias: f64,
    meta_proteina: f64,
    meta_carboidrato: f64,
    meta_gordura: f64,
    created_at: String,
    updated_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct TipoRefeicao {
    id: i32,
    nome: String,
    descricao: Option<String>,
    ordem: i32,
    ativo: bool,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct RefeicaoDia {
    id: i32,
    dia_id: i32,
    tipo_refeicao_id: i32,
    observacoes: Option<String>,
    horario_refeicao: String,
    created_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct AlimentoRefeicao {
    id: i32,
    refeicao_dia_id: i32,
    alimento_id: i32,
    quantidade_gramas: f64,
    calorias_calculadas: f64,
    proteina_calculada: f64,
    gordura_calculada: f64,
    carboidrato_calculado: f64,
    created_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct ResumoSemanal {
    id: i32,
    usuario_id: i32,
    ano: i32,
    semana: i32,
    data_inicio: String,
    data_fim: String,
    total_calorias: f64,
    media_calorias_dia: f64,
    total_proteina: f64,
    total_carboidrato: f64,
    total_gordura: f64,
    peso_inicial: Option<f64>,
    peso_final: Option<f64>,
    created_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct ResumoMensal {
    id: i32,
    usuario_id: i32,
    ano: i32,
    mes: i32,
    data_inicio: String,
    data_fim: String,
    total_calorias: f64,
    media_calorias_dia: f64,
    total_proteina: f64,
    total_carboidrato: f64,
    total_gordura: f64,
    peso_inicial: Option<f64>,
    peso_final: Option<f64>,
    dias_registrados: i32,
    created_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct ResumoAnual {
    id: i32,
    usuario_id: i32,
    ano: i32,
    total_calorias: f64,
    media_calorias_dia: f64,
    total_proteina: f64,
    total_carboidrato: f64,
    total_gordura: f64,
    peso_inicial: Option<f64>,
    peso_final: Option<f64>,
    dias_registrados: i32,
    created_at: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct MetaNutricional {
    id: i32,
    usuario_id: i32,
    calorias_diarias: f64,
    proteina_diaria: f64,
    carboidrato_diario: f64,
    gordura_diaria: f64,
    objetivo: String,
    data_inicio: String,
    data_fim: Option<String>,
    ativo: bool,
    created_at: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn get_alimentos() -> Result<Vec<Alimento>, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT id, nome, categoria_id, unidade, default_value, calorias_por_unidade, proteina_por_unidade, gordura_por_unidade, carboidrato_por_unidade, ativo, created_at, updated_at FROM alimento WHERE ativo = 1 ORDER BY nome ASC"
    ).map_err(|e| e.to_string())?;
    
    let alimento_iter = stmt.query_map([], |row| {
        Ok(Alimento {
            id: row.get(0)?,
            nome: row.get(1)?,
            categoria_id: row.get(2)?,
            unidade: row.get(3)?,
            default_value: row.get(4)?,
            calorias_por_unidade: row.get(5)?,
            proteina_por_unidade: row.get(6)?,
            gordura_por_unidade: row.get(7)?,
            carboidrato_por_unidade: row.get(8)?,
            ativo: row.get(9)?,
            created_at: row.get(10)?,
            updated_at: row.get(11)?,
        })
    }).map_err(|e| e.to_string())?;
    
    let mut alimentos = Vec::new();
    for alimento in alimento_iter {
        alimentos.push(alimento.map_err(|e| e.to_string())?);
    }
    
    Ok(alimentos)
}

#[tauri::command]
fn get_tipos_refeicao() -> Result<Vec<TipoRefeicao>, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT id, nome, descricao, ordem, ativo FROM tipo_refeicao WHERE ativo = 1 ORDER BY ordem ASC"
    ).map_err(|e| e.to_string())?;
    
    let tipo_iter = stmt.query_map([], |row| {
        Ok(TipoRefeicao {
            id: row.get(0)?,
            nome: row.get(1)?,
            descricao: row.get(2)?,
            ordem: row.get(3)?,
            ativo: row.get(4)?,
        })
    }).map_err(|e| e.to_string())?;
    
    let mut tipos = Vec::new();
    for tipo in tipo_iter {
        tipos.push(tipo.map_err(|e| e.to_string())?);
    }
    
    Ok(tipos)
}

#[tauri::command]
fn get_categorias_alimento() -> Result<Vec<CategoriaAlimento>, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT id, nome, descricao, cor_hex, icone, ativo, created_at, updated_at FROM categoria_alimento WHERE ativo = 1 ORDER BY nome ASC"
    ).map_err(|e| e.to_string())?;
    
    let categoria_iter = stmt.query_map([], |row| {
        Ok(CategoriaAlimento {
            id: row.get(0)?,
            nome: row.get(1)?,
            descricao: row.get(2)?,
            cor_hex: row.get(3)?,
            icone: row.get(4)?,
            ativo: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?;
    
    let mut categorias = Vec::new();
    for categoria in categoria_iter {
        categorias.push(categoria.map_err(|e| e.to_string())?);
    }
    
    Ok(categorias)
}

// Comandos para USUARIO
#[tauri::command]
fn criar_usuario(nome: String, email: String, senha: String, data_nascimento: String, sexo: String) -> Result<i64, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "INSERT INTO usuario (nome, email, senha, data_nascimento, sexo) VALUES (?1, ?2, ?3, ?4, ?5)"
    ).map_err(|e| e.to_string())?;
    
    stmt.execute([&nome, &email, &senha, &data_nascimento, &sexo])
        .map_err(|e| e.to_string())?;
    
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn get_usuario_by_email(email: String) -> Result<Option<Usuario>, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT id, nome, email, senha, data_nascimento, sexo, created_at, updated_at FROM usuario WHERE email = ?1"
    ).map_err(|e| e.to_string())?;
    
    let mut rows = stmt.query_map([email], |row| {
        Ok(Usuario {
            id: row.get(0)?,
            nome: row.get(1)?,
            email: row.get(2)?,
            senha: row.get(3)?,
            data_nascimento: row.get(4)?,
            sexo: row.get(5)?,
            created_at: row.get(6)?,
            updated_at: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?;
    
    match rows.next() {
        Some(row) => Ok(Some(row.map_err(|e| e.to_string())?)),
        None => Ok(None),
    }
}

// Comandos para MEDICOES_CORPORAIS
#[tauri::command]
fn criar_medicao_corporal(
    usuario_id: i64,
    peso: f64,
    altura: f64,
    imc: f64,
    percentual_gordura: Option<f64>,
    massa_muscular: Option<f64>,
    circunferencia_cintura: Option<f64>,
    circunferencia_quadril: Option<f64>,
    data_medicao: String
) -> Result<i64, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "INSERT INTO medicoes_corporais (usuario_id, peso, altura, imc, percentual_gordura, massa_muscular, circunferencia_cintura, circunferencia_quadril, data_medicao) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)"
    ).map_err(|e| e.to_string())?;
    
    stmt.execute(rusqlite::params![
        usuario_id, peso, altura, imc, percentual_gordura, massa_muscular, circunferencia_cintura, circunferencia_quadril, data_medicao
    ]).map_err(|e| e.to_string())?;
    
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn get_medicoes_usuario(usuario_id: i64) -> Result<Vec<MedicoesCorporais>, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT id, usuario_id, peso, altura, imc, percentual_gordura, massa_muscular, circunferencia_cintura, circunferencia_quadril, data_medicao, created_at FROM medicoes_corporais WHERE usuario_id = ?1 ORDER BY data_medicao DESC"
    ).map_err(|e| e.to_string())?;
    
    let medicao_iter = stmt.query_map([usuario_id], |row| {
        Ok(MedicoesCorporais {
            id: row.get(0)?,
            usuario_id: row.get(1)?,
            peso: row.get(2)?,
            altura: row.get(3)?,
            imc: row.get(4)?,
            percentual_gordura: row.get(5)?,
            massa_muscular: row.get(6)?,
            circunferencia_cintura: row.get(7)?,
            circunferencia_quadril: row.get(8)?,
            data_medicao: row.get(9)?,
            created_at: row.get(10)?,
        })
    }).map_err(|e| e.to_string())?;
    
    let mut medicoes = Vec::new();
    for medicao in medicao_iter {
        medicoes.push(medicao.map_err(|e| e.to_string())?);
    }
    
    Ok(medicoes)
}

// Comandos para DIA
#[tauri::command]
fn criar_dia(
    usuario_id: i64,
    data: String,
    meta_calorias: f64,
    meta_proteina: f64,
    meta_carboidrato: f64,
    meta_gordura: f64
) -> Result<i64, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "INSERT OR REPLACE INTO dia (usuario_id, data, meta_calorias, meta_proteina, meta_carboidrato, meta_gordura) VALUES (?1, ?2, ?3, ?4, ?5, ?6)"
    ).map_err(|e| e.to_string())?;
    
    stmt.execute([&usuario_id.to_string(), &data, &meta_calorias.to_string(), &meta_proteina.to_string(), &meta_carboidrato.to_string(), &meta_gordura.to_string()])
        .map_err(|e| e.to_string())?;
    
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn get_dia_usuario(usuario_id: i64, data: String) -> Result<Option<Dia>, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT id, usuario_id, data, meta_calorias, meta_proteina, meta_carboidrato, meta_gordura, created_at, updated_at FROM dia WHERE usuario_id = ?1 AND data = ?2"
    ).map_err(|e| e.to_string())?;
    
    let mut rows = stmt.query_map([usuario_id.to_string(), data], |row| {
        Ok(Dia {
            id: row.get(0)?,
            usuario_id: row.get(1)?,
            data: row.get(2)?,
            meta_calorias: row.get(3)?,
            meta_proteina: row.get(4)?,
            meta_carboidrato: row.get(5)?,
            meta_gordura: row.get(6)?,
            created_at: row.get(7)?,
            updated_at: row.get(8)?,
        })
    }).map_err(|e| e.to_string())?;
    
    match rows.next() {
        Some(row) => Ok(Some(row.map_err(|e| e.to_string())?)),
        None => Ok(None),
    }
}

// Comandos para REFEICAO_DIA
#[tauri::command]
fn criar_refeicao_dia(
    dia_id: i64,
    tipo_refeicao_id: i64,
    observacoes: Option<String>,
    horario_refeicao: String
) -> Result<i64, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "INSERT INTO refeicao_dia (dia_id, tipo_refeicao_id, observacoes, horario_refeicao) VALUES (?1, ?2, ?3, ?4)"
    ).map_err(|e| e.to_string())?;
    
    stmt.execute(rusqlite::params![dia_id, tipo_refeicao_id, observacoes, horario_refeicao])
        .map_err(|e| e.to_string())?;
    
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn get_refeicoes_dia(dia_id: i64) -> Result<Vec<RefeicaoDia>, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT rd.id, rd.dia_id, rd.tipo_refeicao_id, rd.observacoes, rd.horario_refeicao, rd.created_at, tr.nome, tr.ordem FROM refeicao_dia rd JOIN tipo_refeicao tr ON rd.tipo_refeicao_id = tr.id WHERE rd.dia_id = ?1 ORDER BY tr.ordem"
    ).map_err(|e| e.to_string())?;
    
    let refeicao_iter = stmt.query_map([dia_id], |row| {
        Ok(RefeicaoDia {
            id: row.get(0)?,
            dia_id: row.get(1)?,
            tipo_refeicao_id: row.get(2)?,
            observacoes: row.get(3)?,
            horario_refeicao: row.get(4)?,
            created_at: row.get(5)?,
        })
    }).map_err(|e| e.to_string())?;
    
    let mut refeicoes = Vec::new();
    for refeicao in refeicao_iter {
        refeicoes.push(refeicao.map_err(|e| e.to_string())?);
    }
    
    Ok(refeicoes)
}

// Comandos para ALIMENTO_REFEICAO
#[tauri::command]
fn adicionar_alimento_refeicao(
    refeicao_dia_id: i64,
    alimento_id: i64,
    quantidade_gramas: f64,
    calorias_calculadas: f64,
    proteina_calculada: f64,
    gordura_calculada: f64,
    carboidrato_calculado: f64
) -> Result<i64, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "INSERT INTO alimento_refeicao (refeicao_dia_id, alimento_id, quantidade_gramas, calorias_calculadas, proteina_calculada, gordura_calculada, carboidrato_calculado) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)"
    ).map_err(|e| e.to_string())?;
    
    stmt.execute(rusqlite::params![
        refeicao_dia_id, alimento_id, quantidade_gramas, calorias_calculadas, proteina_calculada, gordura_calculada, carboidrato_calculado
    ]).map_err(|e| e.to_string())?;
    
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn get_alimentos_refeicao(refeicao_dia_id: i64) -> Result<Vec<AlimentoRefeicao>, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT ar.id, ar.refeicao_dia_id, ar.alimento_id, ar.quantidade_gramas, ar.calorias_calculadas, ar.proteina_calculada, ar.gordura_calculada, ar.carboidrato_calculado, ar.created_at, a.nome FROM alimento_refeicao ar JOIN alimento a ON ar.alimento_id = a.id WHERE ar.refeicao_dia_id = ?1"
    ).map_err(|e| e.to_string())?;
    
    let alimento_iter = stmt.query_map([refeicao_dia_id], |row| {
        Ok(AlimentoRefeicao {
            id: row.get(0)?,
            refeicao_dia_id: row.get(1)?,
            alimento_id: row.get(2)?,
            quantidade_gramas: row.get(3)?,
            calorias_calculadas: row.get(4)?,
            proteina_calculada: row.get(5)?,
            gordura_calculada: row.get(6)?,
            carboidrato_calculado: row.get(7)?,
            created_at: row.get(8)?,
        })
    }).map_err(|e| e.to_string())?;
    
    let mut alimentos = Vec::new();
    for alimento in alimento_iter {
        alimentos.push(alimento.map_err(|e| e.to_string())?);
    }
    
    Ok(alimentos)
}

// Comandos para META_NUTRICIONAL
#[tauri::command]
fn criar_meta_nutricional(
    usuario_id: i64,
    calorias_diarias: f64,
    proteina_diaria: f64,
    carboidrato_diario: f64,
    gordura_diaria: f64,
    objetivo: String,
    data_inicio: String,
    data_fim: Option<String>
) -> Result<i64, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    // Desativar metas anteriores
    let mut stmt_update = conn.prepare(
        "UPDATE meta_nutricional SET ativo = 0 WHERE usuario_id = ?1 AND ativo = 1"
    ).map_err(|e| e.to_string())?;
    stmt_update.execute([usuario_id]).map_err(|e| e.to_string())?;
    
    // Criar nova meta
    let mut stmt = conn.prepare(
        "INSERT INTO meta_nutricional (usuario_id, calorias_diarias, proteina_diaria, carboidrato_diario, gordura_diaria, objetivo, data_inicio, data_fim, ativo) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 1)"
    ).map_err(|e| e.to_string())?;
    
    stmt.execute(rusqlite::params![
        usuario_id, calorias_diarias, proteina_diaria, carboidrato_diario, gordura_diaria, objetivo, data_inicio, data_fim
    ]).map_err(|e| e.to_string())?;
    
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn get_meta_ativa_usuario(usuario_id: i64) -> Result<Option<MetaNutricional>, String> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT id, usuario_id, calorias_diarias, proteina_diaria, carboidrato_diario, gordura_diaria, objetivo, data_inicio, data_fim, ativo, created_at FROM meta_nutricional WHERE usuario_id = ?1 AND ativo = 1"
    ).map_err(|e| e.to_string())?;
    
    let mut rows = stmt.query_map([usuario_id], |row| {
        Ok(MetaNutricional {
            id: row.get(0)?,
            usuario_id: row.get(1)?,
            calorias_diarias: row.get(2)?,
            proteina_diaria: row.get(3)?,
            carboidrato_diario: row.get(4)?,
            gordura_diaria: row.get(5)?,
            objetivo: row.get(6)?,
            data_inicio: row.get(7)?,
            data_fim: row.get(8)?,
            ativo: row.get(9)?,
            created_at: row.get(10)?,
        })
    }).map_err(|e| e.to_string())?;
    
    match rows.next() {
        Some(row) => Ok(Some(row.map_err(|e| e.to_string())?)),
        None => Ok(None),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())

        .invoke_handler(tauri::generate_handler![
            get_alimentos,
            get_tipos_refeicao,
            get_categorias_alimento,
            criar_usuario,
            get_usuario_by_email,
            criar_medicao_corporal,
            get_medicoes_usuario,
            criar_dia,
            get_dia_usuario,
            criar_refeicao_dia,
            get_refeicoes_dia,
            adicionar_alimento_refeicao,
            get_alimentos_refeicao,
            criar_meta_nutricional,
            get_meta_ativa_usuario
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Obter o monitor principal
            if let Ok(monitor) = window.primary_monitor() {
                if let Some(monitor) = monitor {
                    let screen_size = monitor.size();
                    
                    // Definir tamanhos mínimos razoáveis (400x300 pixels)
                    let min_width = 400u32;
                    let min_height = 300u32;
                    
                    // Tamanho inicial padrão (70% da largura, 70% da altura)
                    let default_width = (screen_size.width as f64 * 0.70) as u32;
                    let default_height = (screen_size.height as f64 * 0.70) as u32;
                    
                    // Definir tamanho mínimo razoável
                    let _ = window.set_min_size(Some(PhysicalSize::new(min_width, min_height)));
                    
                    // Redimensionar a janela para o tamanho padrão inicial
                    let _ = window.set_size(PhysicalSize::new(default_width, default_height));
                    
                    // Centralizar a janela
                    let _ = window.center();
                }
            }
            
            // Inicializar banco de dados
            init_database().map_err(|e| format!("Database initialization error: {}", e))?;
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
