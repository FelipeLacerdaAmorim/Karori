use tauri::{Manager, PhysicalSize};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
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
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
