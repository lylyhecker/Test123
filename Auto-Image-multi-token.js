; (async () => {
  // CONFIGURATION CONSTANTS
  const CONFIG = {
    COOLDOWN_DEFAULT: 31000,
    TRANSPARENCY_THRESHOLD: 100,
    WHITE_THRESHOLD: 250,
    LOG_INTERVAL: 10,
    PAINTING_SPEED: {
      MIN: 1,          // Minimum 1 pixel batch size
      MAX: 1000,       // Maximum 1000 pixels batch size
      DEFAULT: 5,      // Default 5 pixels batch size
    },
    BATCH_MODE: "normal", // "normal" or "random" - default to normal
    RANDOM_BATCH_RANGE: {
      MIN: 3,          // Random range minimum
      MAX: 20,         // Random range maximum
    },
    PAINTING_SPEED_ENABLED: false, // Off by default
    AUTO_CAPTCHA_ENABLED: true, // Turnstile generator enabled by default
    TOKEN_SOURCE: "generator", // "generator", "manual", or "hybrid" - default to generator
    TOKEN_POOL_SIZE: 5, // New: Number of tokens to maintain in the pool (run multiple tokens concurrently)
    TOKEN_REFRESH_INTERVAL: 300000, // New: Refresh tokens every 5 minutes (in ms) to prevent expiration
    MAX_TOKEN_RETRIES: 3, // New: Max retries for token generation per request
    COOLDOWN_CHARGE_THRESHOLD: 1, // Default wait threshold
    // Desktop Notifications (defaults)
    NOTIFICATIONS: {
        ENABLED: true,
        ON_CHARGES_REACHED: true,
        ONLY_WHEN_UNFOCUSED: true,
        REPEAT_MINUTES: 5, // repeat reminder while threshold condition holds
    },
    OVERLAY: {
      OPACITY_DEFAULT: 0.6,
      BLUE_MARBLE_DEFAULT: false,
      ditheringEnabled: false,
    },
    // --- START: Color data from colour-converter.js ---
    // New color structure with proper ID mapping
    COLOR_MAP: {
      0: { id: 1, name: 'Black', rgb: { r: 0, g: 0, b: 0 } },
      1: { id: 2, name: 'Dark Gray', rgb: { r: 60, g: 60, b: 60 } },
      2: { id: 3, name: 'Gray', rgb: { r: 120, g: 120, b: 120 } },
      3: { id: 4, name: 'Light Gray', rgb: { r: 210, g: 210, b: 210 } },
      4: { id: 5, name: 'White', rgb: { r: 255, g: 255, b: 255 } },
      5: { id: 6, name: 'Deep Red', rgb: { r: 96, g: 0, b: 24 } },
      6: { id: 7, name: 'Red', rgb: { r: 237, g: 28, b: 36 } },
      7: { id: 8, name: 'Orange', rgb: { r: 255, g: 127, b: 39 } },
      8: { id: 9, name: 'Gold', rgb: { r: 246, g: 170, b: 9 } },
      9: { id: 10, name: 'Yellow', rgb: { r: 249, g: 221, b: 59 } },
      10: { id: 11, name: 'Light Yellow', rgb: { r: 255, g: 250, b: 188 } },
      11: { id: 12, name: 'Dark Green', rgb: { r: 14, g: 185, b: 104 } },
      12: { id: 13, name: 'Green', rgb: { r: 19, g: 230, b: 123 } },
      13: { id: 14, name: 'Light Green', rgb: { r: 135, g: 255, b: 94 } },
      14: { id: 15, name: 'Dark Teal', rgb: { r: 12, g: 129, b: 110 } },
      15: { id: 16, name: 'Teal', rgb: { r: 16, g: 174, b: 166 } },
      16: { id: 17, name: 'Light Teal', rgb: { r: 19, g: 225, b: 190 } },
      17: { id: 20, name: 'Cyan', rgb: { r: 96, g: 247, b: 242 } },
      18: { id: 44, name: 'Light Cyan', rgb: { r: 187, g: 250, b: 242 } },
      19: { id: 18, name: 'Dark Blue', rgb: { r: 40, g: 80, b: 158 } },
      20: { id: 19, name: 'Blue', rgb: { r: 64, g: 147, b: 228 } },
      21: { id: 21, name: 'Indigo', rgb: { r: 107, g: 80, b: 246 } },
      22: { id: 22, name: 'Light Indigo', rgb: { r: 153, g: 177, b: 251 } },
      23: { id: 23, name: 'Dark Purple', rgb: { r: 120, g: 12, b: 153 } },
      24: { id: 24, name: 'Purple', rgb: { r: 170, g: 56, b: 185 } },
      25: { id: 25, name: 'Light Purple', rgb: { r: 224, g: 159, b: 249 } },
      26: { id: 26, name: 'Dark Pink', rgb: { r: 203, g: 0, b: 122 } },
      27: { id: 27, name: 'Pink', rgb: { r: 236, g: 31, b: 128 } },
      28: { id: 28, name: 'Light Pink', rgb: { r: 243, g: 141, b: 169 } },
      29: { id: 29, name: 'Dark Brown', rgb: { r: 104, g: 70, b: 52 } },
      30: { id: 30, name: 'Brown', rgb: { r: 149, g: 104, b: 42 } },
      31: { id: 31, name: 'Beige', rgb: { r: 248, g: 178, b: 119 } },
      32: { id: 52, name: 'Light Beige', rgb: { r: 255, g: 197, b: 165 } },
      33: { id: 32, name: 'Medium Gray', rgb: { r: 170, g: 170, b: 170 } },
      34: { id: 33, name: 'Dark Red', rgb: { r: 165, g: 14, b: 30 } },
      35: { id: 34, name: 'Light Red', rgb: { r: 250, g: 128, b: 114 } },
      36: { id: 35, name: 'Dark Orange', rgb: { r: 228, g: 92, b: 26 } },
      37: { id: 37, name: 'Dark Goldenrod', rgb: { r: 156, g: 132, b: 49 } },
      38: { id: 38, name: 'Goldenrod', rgb: { r: 197, g: 173, b: 49 } },
      39: { id: 39, name: 'Light Goldenrod', rgb: { r: 232, g: 212, b: 95 } },
      40: { id: 40, name: 'Dark Olive', rgb: { r: 74, g: 107, b: 58 } },
      41: { id: 41, name: 'Olive', rgb: { r: 90, g: 148, b: 74 } },
      42: { id: 42, name: 'Light Olive', rgb: { r: 132, g: 197, b: 115 } },
      43: { id: 43, name: 'Dark Cyan', rgb: { r: 15, g: 121, b: 159 } },
      44: { id: 45, name: 'Light Blue', rgb: { r: 125, g: 199, b: 255 } },
      45: { id: 46, name: 'Dark Indigo', rgb: { r: 77, g: 49, b: 184 } },
      46: { id: 47, name: 'Dark Slate Blue', rgb: { r: 74, g: 66, b: 132 } },
      47: { id: 48, name: 'Slate Blue', rgb: { r: 122, g: 113, b: 196 } },
      48: { id: 49, name: 'Light Slate Blue', rgb: { r: 181, g: 174, b: 241 } },
      49: { id: 53, name: 'Dark Peach', rgb: { r: 155, g: 82, b: 73 } },
      50: { id: 54, name: 'Peach', rgb: { r: 209, g: 128, b: 120 } },
      51: { id: 55, name: 'Light Peach', rgb: { r: 250, g: 182, b: 164 } },
      52: { id: 50, name: 'Light Brown', rgb: { r: 219, g: 164, b: 99 } },
      53: { id: 56, name: 'Dark Tan', rgb: { r: 123, g: 99, b: 82 } },
      54: { id: 57, name: 'Tan', rgb: { r: 156, g: 132, b: 107 } },
      55: { id: 36, name: 'Light Tan', rgb: { r: 214, g: 181, b: 148 } },
      56: { id: 51, name: 'Dark Beige', rgb: { r: 209, g: 128, b: 81 } },
      57: { id: 61, name: 'Dark Stone', rgb: { r: 109, g: 100, b: 63 } },
      58: { id: 62, name: 'Stone', rgb: { r: 148, g: 140, b: 107 } },
      59: { id: 63, name: 'Light Stone', rgb: { r: 205, g: 197, b: 158 } },
      60: { id: 58, name: 'Dark Slate', rgb: { r: 51, g: 57, b: 65 } },
      61: { id: 59, name: 'Slate', rgb: { r: 109, g: 117, b: 141 } },
      62: { id: 60, name: 'Light Slate', rgb: { r: 179, g: 185, b: 209 } },
      63: { id: 0, name: 'Transparent', rgb: null }
    },
    // --- END: Color data ---
    // Optimized CSS Classes for reuse
    CSS_CLASSES: {
      BUTTON_PRIMARY: `
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white; border: none; border-radius: 8px; padding: 10px 16px;
        cursor: pointer; font-weight: 500; transition: all 0.3s ease;
        display: flex; align-items: center; gap: 8px;
      `,
      BUTTON_SECONDARY: `
        background: rgba(255,255,255,0.1); color: white;
        border: 1px solid rgba(255,255,255,0.2); border-radius: 8px;
        padding: 8px 12px; cursor: pointer; transition: all 0.3s ease;
      `,
      MODERN_CARD: `
        background: rgba(255,255,255,0.1); border-radius: 12px;
        padding: 18px; border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(5px);
      `,
      GRADIENT_TEXT: `
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; font-weight: bold;
      `
    },
    THEMES: {
      "Classic Autobot": {
        primary: "#000000",
        secondary: "#111111",
        accent: "#222222",
        text: "#ffffff",
        highlight: "#775ce3",
        success: "#00ff00",
        error: "#ff0000",
        warning: "#ffaa00",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        borderRadius: "12px",
        borderStyle: "solid",
        borderWidth: "1px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        animations: {
          glow: false,
          scanline: false,
          pixelBlink: false,
        },
      },
      "Neon Retro": {
        primary: "#1a1a2e",
        secondary: "#16213e",
        accent: "#0f3460",
        text: "#00ff41",
        highlight: "#ff6b35",
        success: "#39ff14",
        error: "#ff073a",
        warning: "#ffff00",
        neon: "#00ffff",
        purple: "#bf00ff",
        pink: "#ff1493",
        fontFamily: "'Press Start 2P', monospace",
        borderRadius: "0",
        borderStyle: "solid",
        borderWidth: "3px",
        boxShadow: "0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1)",
        backdropFilter: "none",
        animations: {
          glow: true,
          scanline: true,
          pixelBlink: true,
        },
      },
    },
    currentTheme: "Classic Autobot",
  }

  const getCurrentTheme = () => CONFIG.THEMES[CONFIG.currentTheme]

  const switchTheme = (themeName) => {
    if (CONFIG.THEMES[themeName]) {
      CONFIG.currentTheme = themeName
      saveThemePreference()

      // Remove existing theme styles
      const existingStyle = document.querySelector('style[data-wplace-theme="true"]')
      if (existingStyle) {
        existingStyle.remove()
      }

      // Recreate UI with new theme (cleanup is handled in createUI)
      createUI()
    }
  }

  const saveThemePreference = () => {
    try {
      localStorage.setItem("wplace-theme", CONFIG.currentTheme)
    } catch (e) {
      console.warn("Could not save theme preference:", e)
    }
  }

  const loadThemePreference = () => {
    try {
      const saved = localStorage.getItem("wplace-theme")
      if (saved && CONFIG.THEMES[saved]) {
        CONFIG.currentTheme = saved
      }
    } catch (e) {
      console.warn("Could not load theme preference:", e)
    }
  }

  const loadLanguagePreference = () => {
    try {
      const saved = localStorage.getItem("wplace_language")
      if (saved && TEXT[saved]) {
        state.language = saved
      }
    } catch (e) {
      console.warn("Could not load language preference:", e)
    }
  }

  // BILINGUAL TEXT STRINGS:)
  const TEXT = {
    en: {
      title: "WPlace Auto-Image",
      toggleOverlay: "Toggle Overlay",
      scanColors: "Scan Colors",
      uploadImage: "Upload Image",
      resizeImage: "Resize Image",
      selectPosition: "Select Position",
      startPainting: "Start Painting",
      stopPainting: "Stop Painting",
      checkingColors: "🔍 Checking available colors...",
      noColorsFound: "❌ Open the color palette on the site and try again!",
      colorsFound: "✅ {count} available colors found. Ready to upload.",
      loadingImage: "🖼️ Loading image...",
      imageLoaded: "✅ Image loaded with {count} valid pixels",
      imageError: "❌ Error loading image",
      selectPositionAlert: "Paint the first pixel at the location where you want the art to start!",
      waitingPosition: "👆 Waiting for you to paint the reference pixel...",
      positionSet: "✅ Position set successfully!",
      positionTimeout: "❌ Timeout for position selection",
      startPaintingMsg: "🎨 Starting painting...",
      paintingProgress: "🧱 Progress: {painted}/{total} pixels...",
      noCharges: "⌛ No charges. Waiting {time}...",
      paintingStopped: "⏹️ Painting stopped by user",
      paintingComplete: "✅ Painting complete! {count} pixels painted.",
      paintingError: "❌ Error during painting",
      missingRequirements: "❌ Load an image and select a position first",
      progress: "Progress",
      pixels: "Pixels",
      charges: "Charges",
      estimatedTime: "Estimated time",
      initMessage: "Click 'Upload Image' to begin",
      waitingInit: "Waiting for initialization...",
      initializingToken: "🔧 Initializing Turnstile token generator...",
      tokenReady: "✅ Token generator ready - you can now start painting!",
      tokenRetryLater: "⚠️ Token generator will retry when needed",
      resizeSuccess: "✅ Image resized to {width}x{height}",
      paintingPaused: "⏸️ Painting paused at position X: {x}, Y: {y}",
      captchaNeeded: "❗ Token generation failed. Please try again in a moment.",
      saveData: "Save Progress",
      loadData: "Load Progress",
      saveToFile: "Save to File",
      loadFromFile: "Load from File",
      dataManager: "Data Manager",
      autoSaved: "✅ Progress saved automatically",
      dataLoaded: "✅ Progress loaded successfully",
      fileSaved: "✅ Progress saved to file successfully",
      fileLoaded: "✅ Progress loaded from file successfully",
      noSavedData: "❌ No saved progress found",
      savedDataFound: "✅ Saved progress found! Load to continue?",
      savedDate: "Saved on: {date}",
      clickLoadToContinue: "Click 'Load Progress' to continue.",
      fileError: "❌ Error processing file",
      invalidFileFormat: "❌ Invalid file format",
      paintingSpeed: "Painting Speed",
      pixelsPerSecond: "pixels/second",
      speedSetting: "Speed: {speed} pixels/sec",
      settings: "Settings",
      botSettings: "Bot Settings",
      close: "Close",
      language: "Language",
      themeSettings: "Theme Settings",
      themeSettingsDesc: "Choose your preferred color theme for the interface.",
      languageSelectDesc: "Select your preferred language. Changes will take effect immediately.",
      autoCaptcha: "Auto-CAPTCHA Solver (Turnstile)",
      autoCaptchaDesc: "Automatically generates Turnstile tokens using integrated generator. Falls back to browser automation if needed.",
      applySettings: "Apply Settings",
      settingsSaved: "✅ Settings saved successfully!",
      cooldownSettings: "Cooldown Settings",
      waitCharges: "Wait until charges reach",
      captchaSolving: "🔑 Generating Turnstile token...",
      captchaFailed: "❌ Turnstile token generation failed. Trying fallback method...",
      automation: "Automation",
      noChargesThreshold: "⌛ Waiting for charges to reach {threshold}. Currently {current}. Next in {time}...",
    },
    ru: {
      title: "WPlace Авто-Изображение",
      scanColors: "Сканировать цвета",
      uploadImage: "Загрузить изображение",
      resizeImage: "Изменить размер изображения",
      selectPosition: "Выбрать позицию",
      startPainting: "Начать рисование",
      stopPainting: "Остановить рисование",
      checkingColors: "🔍 Проверка доступных цветов...",
      noColorsFound: "❌ Откройте палитру цветов на сайте и попробуйте снова!",
      colorsFound: "✅ Найдено доступных цветов: {count}. Готово к загрузке.",
      loadingImage: "🖼️ Загрузка изображения...",
      imageLoaded: "✅ Изображение загружено, валидных пикселей: {count}",
      imageError: "❌ Ошибка при загрузке изображения",
      selectPositionAlert: "Нарисуйте первый пиксель в месте, откуда начнётся рисунок!",
      waitingPosition: "👆 Ожидание, пока вы нарисуете опорный пиксель...",
      positionSet: "✅ Позиция успешно установлена!",
      positionTimeout: "❌ Время ожидания выбора позиции истекло",
      startPaintingMsg: "🎨 Начинаем рисование...",
      paintingProgress: "🧱 Прогресс: {painted}/{total} пикселей...",
      noCharges: "⌛ Нет зарядов. Ожидание {time}...",
      paintingStopped: "⏹️ Рисование остановлено пользователем",
      paintingComplete: "✅ Рисование завершено! Нарисовано пикселей: {count}.",
      paintingError: "❌ Ошибка во время рисования",
      missingRequirements: "❌ Сначала загрузите изображение и выберите позицию",
      progress: "Прогресс",
      pixels: "Пиксели",
      charges: "Заряды",
      estimatedTime: "Примерное время",
      initMessage: "Нажмите 'Загрузить изображение', чтобы начать",
      waitingInit: "Ожидание инициализации...",
      initializingToken: "🔧 Инициализация генератора Turnstile токенов...",
      tokenReady: "✅ Генератор токенов готов - можете начинать рисование!",
      tokenRetryLater: "⚠️ Генератор токенов повторит попытку при необходимости",
      resizeSuccess: "✅ Изображение изменено до {width}x{height}",
      paintingPaused: "⏸️ Рисование приостановлено на позиции X: {x}, Y: {y}",
      captchaNeeded: "❗ Генерация токена не удалась. Пожалуйста, попробуйте через некоторое время.",
      saveData: "Сохранить прогресс",
      loadData: "Загрузить прогресс",
      saveToFile: "Сохранить в файл",
      loadFromFile: "Загрузить из файла",
      dataManager: "Менеджер данных",
      autoSaved: "✅ Прогресс сохранён автоматически",
      dataLoaded: "✅ Прогресс успешно загружен",
      fileSaved: "✅ Прогресс успешно сохранён в файл",
      fileLoaded: "✅ Прогресс успешно загружен из файла",
      noSavedData: "❌ Сохранённый прогресс не найден",
      savedDataFound: "✅ Найден сохранённый прогресс! Загрузить, чтобы продолжить?",
      savedDate: "Сохранено: {date}",
      clickLoadToContinue: "Нажмите 'Загрузить прогресс', чтобы продолжить.",
      fileError: "❌ Ошибка при обработке файла",
      invalidFileFormat: "❌ Неверный формат файла",
      paintingSpeed: "Скорость рисования",
      pixelsPerSecond: "пикселей/сек",
      speedSetting: "Скорость: {speed} пикс./сек",
      settings: "Настройки",
      botSettings: "Настройки бота",
      close: "Закрыть",
      language: "Язык",
      themeSettings: "Настройки темы",
      themeSettingsDesc: "Выберите предпочтительную цветовую тему интерфейса.",
      languageSelectDesc: "Выберите предпочтительный язык. Изменения вступят в силу немедленно.",
      autoCaptcha: "Авто-решение CAPTCHA (Turnstile)",
      autoCaptchaDesc: "Автоматически генерирует Turnstile токены используя встроенный генератор. Возвращается к автоматизации браузера при необходимости.",
      applySettings: "Применить настройки",
      settingsSaved: "✅ Настройки успешно сохранены!",
      cooldownSettings: "Настройки перезарядки",
      waitCharges: "Ждать до накопления зарядов",
      captchaSolving: "🔑 Генерирую Turnstile токен...",
      captchaFailed: "❌ Не удалось сгенерировать Turnstile токен. Пробую резервный метод...",
      automation: "Автоматизация",
      noChargesThreshold: "⌛ Ожидание зарядов до {threshold}. Сейчас {current}. Следующий через {time}...",
    },
    pt: {
      title: "WPlace Auto-Image",
      scanColors: "Escanear Cores",
      uploadImage: "Upload da Imagem",
      resizeImage: "Redimensionar Imagem",
      selectPosition: "Selecionar Posição",
      startPainting: "Iniciar Pintura",
      stopPainting: "Parar Pintura",
      checkingColors: "🔍 Verificando cores disponíveis...",
      noColorsFound: "❌ Abra a paleta de cores no site e tente novamente!",
      colorsFound: "✅ {count} cores encontradas. Pronto para upload.",
      loadingImage: "🖼️ Carregando imagem...",
      imageLoaded: "✅ Imagem carregada com {count} pixels válidos",
      imageError: "❌ Erro ao carregar imagem",
      selectPositionAlert: "Pinte o primeiro pixel на localização onde deseja que a arte comece!",
      waitingPosition: "👆 Aguardando você pintar o pixel de referência...",
      positionSet: "✅ Posição definida com sucesso!",
      positionTimeout: "❌ Tempo esgotado para selecionar posição",
      startPaintingMsg: "🎨 Iniciando pintura...",
      paintingProgress: "🧱 Progresso: {painted}/{total} pixels...",
      noCharges: "⌛ Sem cargas. Aguardando {time}...",
      paintingStopped: "⏹️ Pintura interromпида pelo usuário",
      paintingComplete: "✅ Pintura concluída! {count} pixels pintados.",
      paintingError: "❌ Erro durante a pintura",
      missingRequirements: "❌ Carregue uma imagem e selecione uma posição primeiro",
      progress: "Progresso",
      pixels: "Pixels",
      charges: "Cargas",
      estimatedTime: "Tempo estimado",
      initMessage: "Clique em 'Upload da Imagem' para começar",
      waitingInit: "Aguardando inicialização...",
      initializingToken: "🔧 Inicializando gerador de tokens Turnstile...",
      tokenReady: "✅ Gerador de tokens pronto - você pode começar a pintar!",
      tokenRetryLater: "⚠️ Gerador de tokens tentará novamente quando necessário",
      resizeSuccess: "✅ Imagem redimensionada для {width}x{height}",
      paintingPaused: "⏸️ Pintura pausada na posição X: {x}, Y: {y}",
      captchaNeeded: "❗ Falha na geração de token. Tente novamente em alguns instantes.",
      saveData: "Salvar Progresso",
      loadData: "Carregar Progresso",
      saveToFile: "Salvar em Arquivo",
      loadFromFile: "Carregar de Arquivo",
      dataManager: "Dados",
      autoSaved: "✅ Progresso salvo automaticamente",
      dataLoaded: "✅ Progresso carregado com sucesso",
      fileSaved: "✅ Salvo em arquivo com sucesso",
      fileLoaded: "✅ Carregado de arquivo com sucesso",
      noSavedData: "❌ Nenhum progresso salvo encontrado",
      savedDataFound: "✅ Progresso salvo encontrado! Carregar para continuar?",
      savedDate: "Salvo em: {date}",
      clickLoadToContinue: "Clique em 'Carregar Progresso' para continuar.",
      fileError: "❌ Erro ao processar arquivo",
      invalidFileFormat: "❌ Formato de arquivo inválido",
      paintingSpeed: "Velocidade de Pintura",
      pixelsPerSecond: "pixels/segundo",
      speedSetting: "Velocidade: {speed} pixels/seg",
      settings: "Configurações",
      botSettings: "Configurações do Bot",
      close: "Fechar",
      language: "Idioma",
      themeSettings: "Configurações de Tema",
      themeSettingsDesc: "Escolha seu tema de cores preferido para a interface.",
      languageSelectDesc: "Selecione seu idioma preferido. As alterações terão efeito imediatamente.",
      autoCaptcha: "Resolvedor de CAPTCHA Automático",
      autoCaptchaDesc: "Tenta resolver o CAPTCHA automaticamente simulando a colocação manual de um pixel quando o token expira.",
      applySettings: "Aplicar Configurações",
      settingsSaved: "✅ Configurações salvas com sucesso!",
      cooldownSettings: "Configurações de Cooldown",
      waitCharges: "Aguardar até as cargas atingirem",
      captchaSolving: "🤖 Tentando resolver o CAPTCHA...",
      captchaFailed: "❌ Falha ao resolver CAPTCHA. Pinte um pixel manualmente.",
      automation: "Automação",
      noChargesThreshold: "⌛ Aguardando cargas atingirem {threshold}. Atual: {current}. Próxima em {time}...",
    },
    vi: {
      title: "WPlace Auto-Image",
      scanColors: "Quét màu",
      uploadImage: "Tải lên hình ảnh",
      resizeImage: "Thay đổi kích thước",
      selectPosition: "Chọn vị trí",
      startPainting: "Bắt đầu vẽ",
      stopPainting: "Dừng vẽ",
      checkingColors: "🔍 Đang kiểm tra màu sắc có sẵn...",
      noColorsFound: "❌ Hãy mở bảng màu trên trang web và thử lại!",
      colorsFound: "✅ Tìm thấy {count} màu. Sẵn sàng để tải lên.",
      loadingImage: "🖼️ Đang tải hình ảnh...",
      imageLoaded: "✅ Đã tải hình ảnh với {count} pixel hợp lệ",
      imageError: "❌ Lỗi khi tải hình ảnh",
      selectPositionAlert: "Vẽ pixel đầu tiên tại vị trí bạn muốn tác phẩm nghệ thuật bắt đầu!",
      waitingPosition: "👆 Đang chờ bạn vẽ pixel tham chiếu...",
      positionSet: "✅ Đã đặt vị trí thành công!",
      positionTimeout: "❌ Hết thời gian chọn vị trí",
      startPaintingMsg: "🎨 Bắt đầu vẽ...",
      paintingProgress: "🧱 Tiến trình: {painted}/{total} pixel...",
      noCharges: "⌛ Không có điện tích. Đang chờ {time}...",
      paintingStopped: "⏹️ Người dùng đã dừng vẽ",
      paintingComplete: "✅ Hoàn thành vẽ! Đã vẽ {count} pixel.",
      paintingError: "❌ Lỗi trong quá trình vẽ",
      missingRequirements: "❌ Hãy tải lên hình ảnh và chọn vị trí trước",
      progress: "Tiến trình",
      pixels: "Pixel",
      charges: "Điện tích",
      estimatedTime: "Thời gian ước tính",
      initMessage: "Nhấp 'Tải lên hình ảnh' để bắt đầu",
      waitingInit: "Đang chờ khởi tạo...",
      initializingToken: "🔧 Đang khởi tạo bộ tạo token Turnstile...",
      tokenReady: "✅ Bộ tạo token đã sẵn sàng - bạn có thể bắt đầu vẽ!",
      tokenRetryLater: "⚠️ Bộ tạo token sẽ thử lại khi cần thiết",
      resizeSuccess: "✅ Đã thay đổi kích thước hình ảnh thành {width}x{height}",
      paintingPaused: "⏸️ Tạm dừng vẽ tại vị trí X: {x}, Y: {y}",
      captchaNeeded: "❗ Tạo token thất bại. Vui lòng thử lại sau.",
      saveData: "Lưu tiến trình",
      loadData: "Tải tiến trình",
      saveToFile: "Lưu vào tệp",
      loadFromFile: "Tải từ tệp",
      dataManager: "Dữ liệu",
      autoSaved: "✅ Đã tự động lưu tiến trình",
      dataLoaded: "✅ Đã tải tiến trình thành công",
      fileSaved: "✅ Đã lưu vào tệp thành công",
      fileLoaded: "✅ Đã tải từ tệp thành công",
      noSavedData: "❌ Không tìm thấy tiến trình đã lưu",
      savedDataFound: "✅ Tìm thấy tiến trình đã lưu! Tải để tiếp tục?",
      savedDate: "Đã lưu vào: {date}",
      clickLoadToContinue: "Nhấp 'Tải tiến trình' để tiếp tục.",
      fileError: "❌ Lỗi khi xử lý tệp",
      invalidFileFormat: "❌ Định dạng tệp không hợp lệ",
      paintingSpeed: "Tốc độ vẽ",
      pixelsPerSecond: "pixel/giây",
      speedSetting: "Tốc độ: {speed} pixel/giây",
      settings: "Cài đặt",
      botSettings: "Cài đặt Bot",
      close: "Đóng",
      language: "Ngôn ngữ",
      themeSettings: "Cài đặt Giao diện",
      themeSettingsDesc: "Chọn chủ đề màu sắc yêu thích cho giao diện.",
      languageSelectDesc: "Chọn ngôn ngữ ưa thích. Thay đổi sẽ có hiệu lực ngay lập tức.",
      autoCaptcha: "Tự động giải CAPTCHA",
      autoCaptchaDesc: "Tự động cố gắng giải CAPTCHA bằng cách mô phỏng việc đặt pixel thủ công khi token hết hạn.",
      applySettings: "Áp dụng cài đặt",
      settingsSaved: "✅ Đã lưu cài đặt thành công!",
      cooldownSettings: "Cài đặt thời gian chờ",
      waitCharges: "Chờ cho đến khi số lần sạc đạt",
      captchaSolving: "🤖 Đang cố gắng giải CAPTCHA...",
      captchaFailed: "❌ Giải CAPTCHA tự động thất bại. Vui lòng vẽ một pixel thủ công.",
      automation: "Tự động hóa",
      noChargesThreshold: "⌛ Đang chờ số lần sạc đạt {threshold}. Hiện tại {current}. Lần tiếp theo trong {time}...",
    },
    fr: {
      title: "WPlace Auto-Image",
      scanColors: "Scanner les couleurs",
      uploadImage: "Télécharger l'image",
      resizeImage: "Redimensionner l'image",
      selectPosition: "Sélectionner la position",
      startPainting: "Commencer à peindre",
      stopPainting: "Arrêter de peindre",
      checkingColors: "🔍 Vérification des couleurs disponibles...",
      noColorsFound: "❌ Ouvrez la palette de couleurs sur le site et réessayez!",
      colorsFound: "✅ {count} couleurs trouvées. Prêt à télécharger.",
      loadingImage: "🖼️ Chargement de l'image...",
      imageLoaded: "✅ Image chargée avec {count} pixels valides",
      imageError: "❌ Erreur lors du chargement de l'image",
      selectPositionAlert: "Peignez le premier pixel à l'endroit où vous voulez que l'art commence!",
      waitingPosition: "👆 En attente que vous peigniez le pixel de référence...",
      positionSet: "✅ Position définie avec succès!",
      positionTimeout: "❌ Délai d'attente pour la sélection de position",
      startPaintingMsg: "🎨 Début de la peinture...",
      paintingProgress: "🧱 Progrès: {painted}/{total} pixels...",
      noCharges: "⌛ Aucune charge. En attente {time}...",
      paintingStopped: "⏹️ Peinture arrêtée par l'utilisateur",
      paintingComplete: "✅ Peinture terminée! {count} pixels peints.",
      paintingError: "❌ Erreur pendant la peinture",
      missingRequirements: "❌ Veuillez charger une image et sélectionner une position d'abord",
      progress: "Progrès",
      pixels: "Pixels",
      charges: "Charges",
      estimatedTime: "Temps estimé",
      initMessage: "Cliquez sur 'Télécharger l'image' pour commencer",
      waitingInit: "En attente d'initialisation...",
      initializingToken: "🔧 Initialisation du générateur de tokens Turnstile...",
      tokenReady: "✅ Générateur de tokens prêt - vous pouvez commencer à peindre!",
      tokenRetryLater: "⚠️ Le générateur de tokens réessaiera si nécessaire",
      resizeSuccess: "✅ Image redimensionnée en {width}x{height}",
      paintingPaused: "⏸️ Peinture en pause à la position X: {x}, Y: {y}",
      captchaNeeded: "❗ Échec de la génération de token. Veuillez réessayer dans un moment.",
      saveData: "Sauvegarder le progrès",
      loadData: "Charger le progrès",
      saveToFile: "Sauvegarder dans un fichier",
      loadFromFile: "Charger depuis un fichier",
      dataManager: "Données",
      autoSaved: "✅ Progrès sauvegardé automatiquement",
      dataLoaded: "✅ Progrès chargé avec succès",
      fileSaved: "✅ Sauvegardé dans un fichier avec succès",
      fileLoaded: "✅ Chargé depuis un fichier avec succès",
      noSavedData: "❌ Aucun progrès sauvegardé trouvé",
      savedDataFound: "✅ Progrès sauvegardé trouvé! Charger pour continuer?",
      savedDate: "Sauvegardé le: {date}",
      clickLoadToContinue: "Cliquez sur 'Charger le progrès' pour continuer.",
      fileError: "❌ Erreur lors du traitement du fichier",
      invalidFileFormat: "❌ Format de fichier invalide",
      paintingSpeed: "Vitesse de peinture",
      pixelsPerSecond: "pixels/seconde",
      speedSetting: "Vitesse: {speed} pixels/sec",
      settings: "Paramètres",
      botSettings: "Paramètres du Bot",
      close: "Fermer",
      language: "Langue",
      themeSettings: "Paramètres de Thème",
      themeSettingsDesc: "Choisissez votre thème de couleurs préféré pour l'interface.",
      languageSelectDesc: "Sélectionnez votre langue préférée. Les changements prendront effet immédiatement.",
      autoCaptcha: "Résolveur de CAPTCHA automatique",
      autoCaptchaDesc: "Tente automatiquement de résoudre le CAPTCHA en simulant un placement manuel de pixel lorsque le jeton expire.",
      applySettings: "Appliquer les paramètres",
      settingsSaved: "✅ Paramètres enregistrés avec succès !",
      cooldownSettings: "Paramètres de recharge",
      waitCharges: "Attendre que les charges atteignent",
      captchaSolving: "🤖 Tentative de résolution du CAPTCHA...",
      captchaFailed: "❌ Échec de l'Auto-CAPTCHA. Peignez un pixel manuellement.",
      automation: "Automatisation",
      noChargesThreshold: "⌛ En attente que les charges atteignent {threshold}. Actuel: {current}. Prochaine dans {time}...",
    },
    id: {
      title: "WPlace Auto-Image",
      scanColors: "Pindai Warna",
      uploadImage: "Unggah Gambar",
      resizeImage: "Ubah Ukuran Gambar",
      selectPosition: "Pilih Posisi",
      startPainting: "Mulai Melukis",
      stopPainting: "Berhenti Melukis",
      checkingColors: "🔍 Memeriksa warna yang tersedia...",
      noColorsFound: "❌ Buka palet warna di situs dan coba lagi!",
      colorsFound: "✅ {count} warna ditemukan. Siap untuk diunggah.",
      loadingImage: "🖼️ Memuat gambar...",
      imageLoaded: "✅ Gambar dimuat dengan {count} piksel valid",
      imageError: "❌ Kesalahan saat memuat gambar",
      selectPositionAlert: "Lukis piksel pertama di lokasi tempat karya seni akan dimulai!",
      waitingPosition: "👆 Menunggu Anda melukis piksel referensi...",
      positionSet: "✅ Posisi berhasil diatur!",
      positionTimeout: "❌ Waktu habis untuk memilih posisi",
      startPaintingMsg: "🎨 Mulai melukis...",
      paintingProgress: "🧱 Progres: {painted}/{total} piksel...",
      noCharges: "⌛ Tidak ada muatan. Menunggu {time}...",
      paintingStopped: "⏹️ Melukis dihentikan oleh pengguna",
      paintingComplete: "✅ Melukis selesai! {count} piksel telah dilukis.",
      paintingError: "❌ Kesalahan selama melukis",
      missingRequirements: "❌ Unggah gambar dan pilih posisi terlebih dahulu",
      progress: "Progres",
      pixels: "Piksel",
      charges: "Muatan",
      estimatedTime: "Perkiraan waktu",
      initMessage: "Klik 'Unggah Gambar' untuk memulai",
      waitingInit: "Menunggu inisialisasi...",
      initializingToken: "🔧 Menginisialisasi generator token Turnstile...",
      tokenReady: "✅ Generator token siap - Anda bisa mulai melukis!",
      tokenRetryLater: "⚠️ Generator token akan mencoba lagi saat diperlukan",
      resizeSuccess: "✅ Gambar berhasil diubah ukurannya menjadi {width}x{height}",
      paintingPaused: "⏸️ Melukis dijeda di posisi X: {x}, Y: {y}",
      captchaNeeded: "❗ Pembuatan token gagal. Silakan coba lagi sebentar lagi.",
      saveData: "Simpan Progres",
      loadData: "Muat Progres",
      saveToFile: "Simpan ke File",
      loadFromFile: "Muat dari File",
      dataManager: "Data",
      autoSaved: "✅ Progres disimpan secara otomatis",
      dataLoaded: "✅ Progres berhasil dimuat",
      fileSaved: "✅ Berhasil disimpan ke file",
      fileLoaded: "✅ Berhasil dimuat dari file",
      noSavedData: "❌ Tidak ditemukan progres yang disimpan",
      savedDataFound: "✅ Progres yang disimpan ditemukan! Muat untuk melanjutkan?",
      savedDate: "Disimpan pada: {date}",
      clickLoadToContinue: "Klik 'Muat Progres' untuk melanjutkan.",
      fileError: "❌ Kesalahan saat memproses file",
      invalidFileFormat: "❌ Format file tidak valid",
      paintingSpeed: "Kecepatan Melukis",
      pixelsPerSecond: "piksel/detik",
      speedSetting: "Kecepatan: {speed} piksel/detik",
      settings: "Pengaturan",
      botSettings: "Pengaturan Bot",
      close: "Tutup",
      language: "Bahasa",
      themeSettings: "Pengaturan Tema",
      themeSettingsDesc: "Pilih tema warna favorit Anda untuk antarmuka.",
      languageSelectDesc: "Pilih bahasa yang Anda inginkan. Perubahan akan berlaku segera.",
      autoCaptcha: "Penyelesai CAPTCHA Otomatis",
      autoCaptchaDesc: "Mencoba menyelesaikan CAPTCHA secara otomatis dengan mensimulasikan penempatan piksel manual saat token kedaluwarsa.",
      applySettings: "Terapkan Pengaturan",
      settingsSaved: "✅ Pengaturan berhasil disimpan!",
      cooldownSettings: "Pengaturan Cooldown",
      waitCharges: "Tunggu hingga muatan mencapai",
      captchaSolving: "🤖 Mencoba menyelesaikan CAPTCHA...",
      captchaFailed: "❌ Gagal menyelesaikan CAPTCHA. Lukis satu piksel secara manual.",
      automation: "Automasi",
      noChargesThreshold: "⌛ Menunggu muatan mencapai {threshold}. Saat ini: {current}. Berikutnya dalam {time}...",
    },
    tr: {
      title: "WPlace Otomatik-Resim",
      toggleOverlay: "Katmanı Aç/Kapat",
      scanColors: "Renkleri Tara",
      uploadImage: "Resim Yükle",
      resizeImage: "Resmi Yeniden Boyutlandır",
      selectPosition: "Konum Seç",
      startPainting: "Boyamayı Başlat",
      stopPainting: "Boyamayı Durdur",
      checkingColors: "🔍 Uygun renkler kontrol ediliyor...",
      noColorsFound: "❌ Sitede renk paletini açın ve tekrar deneyin!",
      colorsFound: "✅ {count} uygun renk bulundu. Yüklemeye hazır.",
      loadingImage: "🖼️ Resim yükleniyor...",
      imageLoaded: "✅ Resim {count} geçerli piksel ile yüklendi",
      imageError: "❌ Resim yüklenirken hata oluştu",
      selectPositionAlert: "Sanatı başlatmak istediğiniz ilk pikseli boyayın!",
      waitingPosition: "👆 Referans pikseli boyamanız bekleniyor...",
      positionSet: "✅ Konum başarıyla ayarlandı!",
      positionTimeout: "❌ Konum seçme süresi doldu",
      startPaintingMsg: "🎨 Boyama başlatılıyor...",
      paintingProgress: "🧱 İlerleme: {painted}/{total} piksel...",
      noCharges: "⌛ Yeterli hak yok. Bekleniyor {time}...",
      paintingStopped: "⏹️ Boyama kullanıcı tarafından durduruldu",
      paintingComplete: "✅ Boyama tamamlandı! {count} piksel boyandı.",
      paintingError: "❌ Boyama sırasında hata oluştu",
      missingRequirements: "❌ Önce resim yükleyip konum seçmelisiniz",
      progress: "İlerleme",
      pixels: "Pikseller",
      charges: "Haklar",
      estimatedTime: "Tahmini süre",
      initMessage: "Başlamak için 'Resim Yükle'ye tıklayın",
      waitingInit: "Başlatma bekleniyor...",
      resizeSuccess: "✅ Resim {width}x{height} boyutuna yeniden boyutlandırıldı",
      paintingPaused: "⏸️ Boyama duraklatıldı, Konum X: {x}, Y: {y}",
      captchaNeeded: "❗ CAPTCHA gerekli. Devam etmek için bir pikseli manuel olarak boyayın.",
      saveData: "İlerlemeyi Kaydet",
      loadData: "İlerlemeyi Yükle",
      saveToFile: "Dosyaya Kaydet",
      loadFromFile: "Dosyadan Yükle",
      dataManager: "Veri Yöneticisi",
      autoSaved: "✅ İlerleme otomatik olarak kaydedildi",
      dataLoaded: "✅ İlerleme başarıyla yüklendi",
      fileSaved: "✅ İlerleme dosyaya başarıyla kaydedildi",
      fileLoaded: "✅ İlerleme dosyadan başarıyla yüklendi",
      noSavedData: "❌ Kayıtlı ilerleme bulunamadı",
      savedDataFound: "✅ Kayıtlı ilerleme bulundu! Devam etmek için yükleyin.",
      savedDate: "Kaydedilme tarihi: {date}",
      clickLoadToContinue: "Devam etmek için 'İlerlemeyi Yükle'ye tıklayın.",
      fileError: "❌ Dosya işlenirken hata oluştu",
      invalidFileFormat: "❌ Geçersiz dosya formatı",
      paintingSpeed: "Boyama Hızı",
      pixelsPerSecond: "piksel/saniye",
      speedSetting: "Hız: {speed} piksel/sn",
      settings: "Ayarlar",
      botSettings: "Bot Ayarları",
      close: "Kapat",
      language: "Dil",
      themeSettings: "Tema Ayarları",
      themeSettingsDesc: "Arayüz için tercih ettiğiniz renk temasını seçin.",
      languageSelectDesc: "Tercih ettiğiniz dili seçin. Değişiklikler hemen uygulanacaktır.",
      autoCaptcha: "Oto-CAPTCHA Çözücü",
      autoCaptchaDesc: "CAPTCHA süresi dolduğunda manuel piksel yerleştirmeyi taklit ederek otomatik çözmeyi dener.",
      applySettings: "Ayarları Uygula",
      settingsSaved: "✅ Ayarlar başarıyla kaydedildi!",
      cooldownSettings: "Bekleme Süresi Ayarları",
      waitCharges: "Haklar şu seviyeye ulaşana kadar bekle",
      captchaSolving: "🤖 CAPTCHA çözülmeye çalışılıyor...",
      captchaFailed: "❌ Oto-CAPTCHA başarısız oldu. Bir pikseli manuel boyayın.",
      automation: "Otomasyon",
      noChargesThreshold: "⌛ Hakların {threshold} seviyesine ulaşması bekleniyor. Şu anda {current}. Sonraki {time} içinde...",
    },
    zh: {
      title: "WPlace 自动图像",
      toggleOverlay: "切换覆盖层",
      scanColors: "扫描颜色",
      uploadImage: "上传图像",
      resizeImage: "调整大小",
      selectPosition: "选择位置",
      startPainting: "开始绘制",
      stopPainting: "停止绘制",
      checkingColors: "🔍 正在检查可用颜色...",
      noColorsFound: "❌ 请在网站上打开调色板后再试！",
      colorsFound: "✅ 找到 {count} 个可用颜色，准备上传。",
      loadingImage: "🖼️ 正在加载图像...",
      imageLoaded: "✅ 图像已加载，包含 {count} 个有效像素",
      imageError: "❌ 加载图像时出错",
      selectPositionAlert: "请在你想让作品开始的位置绘制第一个像素！",
      waitingPosition: "👆 正在等待你绘制参考像素...",
      positionSet: "✅ 位置设置成功！",
      positionTimeout: "❌ 选择位置超时",
      startPaintingMsg: "🎨 开始绘制...",
      paintingProgress: "🧱 进度: {painted}/{total} 像素...",
      noCharges: "⌛ 无可用次数，等待 {time}...",
      paintingStopped: "⏹️ 已被用户停止",
      paintingComplete: "✅ 绘制完成！共绘制 {count} 个像素。",
      paintingError: "❌ 绘制过程中出错",
      missingRequirements: "❌ 请先加载图像并选择位置",
      progress: "进度",
      pixels: "像素",
      charges: "次数",
      estimatedTime: "预计时间",
      initMessage: "点击“上传图像”开始",
      waitingInit: "正在等待初始化...",
      initializingToken: "🔧 正在初始化 Turnstile 令牌生成器...",
      tokenReady: "✅ 令牌生成器已就绪 - 可以开始绘制！",
      tokenRetryLater: "⚠️ 令牌生成器稍后将重试",
      resizeSuccess: "✅ 图像已调整为 {width}x{height}",
      paintingPaused: "⏸️ 在位置 X: {x}, Y: {y} 暂停",
      captchaNeeded: "❗ 令牌生成失败，请稍后再试。",
      saveData: "保存进度",
      loadData: "加载进度",
      saveToFile: "保存到文件",
      loadFromFile: "从文件加载",
      dataManager: "数据管理",
      autoSaved: "✅ 进度已自动保存",
      dataLoaded: "✅ 进度加载成功",
      fileSaved: "✅ 已成功保存到文件",
      fileLoaded: "✅ 已成功从文件加载",
      noSavedData: "❌ 未找到已保存进度",
      savedDataFound: "✅ 找到已保存进度！是否加载继续？",
      savedDate: "保存时间: {date}",
      clickLoadToContinue: "点击“加载进度”继续。",
      fileError: "❌ 处理文件时出错",
      invalidFileFormat: "❌ 文件格式无效",
      paintingSpeed: "绘制速度",
      pixelsPerSecond: "像素/秒",
      speedSetting: "速度: {speed} 像素/秒",
      settings: "设置",
      botSettings: "机器人设置",
      close: "关闭",
      language: "语言",
      themeSettings: "主题设置",
      themeSettingsDesc: "为界面选择你喜欢的配色主题。",
      languageSelectDesc: "选择你偏好的语言，变更立即生效。",
      autoCaptcha: "自动 CAPTCHA 解决",
      autoCaptchaDesc: "使用集成的生成器自动生成 Turnstile 令牌。必要时回退到浏览器自动化。",
      applySettings: "应用设置",
      settingsSaved: "✅ 设置保存成功！",
      speedOn: "开启",
      speedOff: "关闭",
      cooldownSettings: "冷却设置",
      waitCharges: "等待次数达到",
      captchaSolving: "🔑 正在生成 Turnstile 令牌...",
      captchaFailed: "❌ 令牌生成失败。尝试回退方法...",
      automation: "自动化",
      noChargesThreshold: "⌛ 等待次数达到 {threshold}。当前 {current}。下次在 {time}...",
    },
    "zh-tw": {
      title: "WPlace 自動圖像",
      toggleOverlay: "切換覆蓋層",
      scanColors: "掃描顏色",
      uploadImage: "上傳圖像",
      resizeImage: "調整大小",
      selectPosition: "選擇位置",
      startPainting: "開始繪製",
      stopPainting: "停止繪製",
      checkingColors: "🔍 正在檢查可用顏色...",
      noColorsFound: "❌ 請在網站上打開調色板後再試！",
      colorsFound: "✅ 找到 {count} 個可用顏色，準備上傳。",
      loadingImage: "🖼️ 正在載入圖像...",
      imageLoaded: "✅ 圖像已載入，包含 {count} 個有效像素",
      imageError: "❌ 載入圖像時出錯",
      selectPositionAlert: "請在你想讓作品開始的位置繪製第一個像素！",
      waitingPosition: "👆 正在等待你繪製參考像素...",
      positionSet: "✅ 位置設定成功！",
      positionTimeout: "❌ 選擇位置逾時",
      startPaintingMsg: "🎨 開始繪製...",
      paintingProgress: "🧱 進度: {painted}/{total} 像素...",
      noCharges: "⌛ 無可用次數，等待 {time}...",
      paintingStopped: "⏹️ 已被使用者停止",
      paintingComplete: "✅ 繪製完成！共繪製 {count} 個像素。",
      paintingError: "❌ 繪製過程中出錯",
      missingRequirements: "❌ 請先載入圖像並選擇位置",
      progress: "進度",
      pixels: "像素",
      charges: "次數",
      estimatedTime: "預計時間",
      initMessage: "點擊「上傳圖像」開始",
      waitingInit: "正在等待初始化...",
      initializingToken: "🔧 正在初始化 Turnstile 令牌產生器...",
      tokenReady: "✅ 令牌產生器已就緒 - 可以開始繪製！",
      tokenRetryLater: "⚠️ 令牌產生器稍後將重試",
      resizeSuccess: "✅ 圖像已調整為 {width}x{height}",
      paintingPaused: "⏸️ 在位置 X: {x}, Y: {y} 暫停",
      captchaNeeded: "❗ 令牌產生失敗，請稍後再試。",
      saveData: "儲存進度",
      loadData: "載入進度",
      saveToFile: "儲存至檔案",
      loadFromFile: "從檔案載入",
      dataManager: "資料管理",
      autoSaved: "✅ 進度已自動儲存",
      dataLoaded: "✅ 進度載入成功",
      fileSaved: "✅ 已成功儲存至檔案",
      fileLoaded: "✅ 已成功從檔案載入",
      noSavedData: "❌ 未找到已儲存進度",
      savedDataFound: "✅ 找到已儲存進度！是否載入以繼續？",
      savedDate: "儲存時間: {date}",
      clickLoadToContinue: "點擊「載入進度」繼續。",
      fileError: "❌ 處理檔案時出錯",
      invalidFileFormat: "❌ 檔案格式無效",
      paintingSpeed: "繪製速度",
      pixelsPerSecond: "像素/秒",
      speedSetting: "速度: {speed} 像素/秒",
      settings: "設定",
      botSettings: "機器人設定",
      close: "關閉",
      language: "語言",
      themeSettings: "主題設定",
      themeSettingsDesc: "為介面選擇你喜歡的配色主題。",
      languageSelectDesc: "選擇你偏好的語言，變更立即生效。",
      autoCaptcha: "自動 CAPTCHA 解決",
      autoCaptchaDesc: "使用整合的產生器自動產生 Turnstile 令牌，必要時回退到瀏覽器自動化。",
      applySettings: "套用設定",
      settingsSaved: "✅ 設定儲存成功！",
      speedOn: "開啟",
      speedOff: "關閉",
      cooldownSettings: "冷卻設定",
      waitCharges: "等待次數達到",
      captchaSolving: "🔑 正在產生 Turnstile 令牌...",
      captchaFailed: "❌ 令牌產生失敗。嘗試回退方法...",
      automation: "自動化",
      noChargesThreshold: "⌛ 等待次數達到 {threshold}。目前 {current}。下次在 {time}...",
    },
    ja: {
      title: "WPlace 自動画像",
      toggleOverlay: "オーバーレイ切替",
      scanColors: "色をスキャン",
      uploadImage: "画像をアップロード",
      resizeImage: "画像サイズ変更",
      selectPosition: "位置を選択",
      startPainting: "描画開始",
      stopPainting: "描画停止",
      checkingColors: "🔍 利用可能な色を確認中...",
      noColorsFound: "❌ サイトでカラーパレットを開いて再試行してください！",
      colorsFound: "✅ 利用可能な色 {count} 件を検出。アップロード可能。",
      loadingImage: "🖼️ 画像を読み込み中...",
      imageLoaded: "✅ 画像を読み込みました。有効なピクセル {count}",
      imageError: "❌ 画像の読み込みエラー",
      selectPositionAlert: "作品を開始したい位置に最初のピクセルを置いてください！",
      waitingPosition: "👆 参照ピクセルの描画を待っています...",
      positionSet: "✅ 位置を設定しました！",
      positionTimeout: "❌ 位置選択のタイムアウト",
      startPaintingMsg: "🎨 描画を開始...",
      paintingProgress: "🧱 進捗: {painted}/{total} ピクセル...",
      noCharges: "⌛ チャージなし。{time} 待機...",
      paintingStopped: "⏹️ ユーザーにより停止されました",
      paintingComplete: "✅ 描画完了！ {count} ピクセル描画。",
      paintingError: "❌ 描画中にエラー",
      missingRequirements: "❌ 先に画像を読み込み位置を選択してください",
      progress: "進捗",
      pixels: "ピクセル",
      charges: "チャージ",
      estimatedTime: "推定時間",
      initMessage: "「画像をアップロード」をクリックして開始",
      waitingInit: "初期化待機中...",
      initializingToken: "🔧 Turnstile トークン生成器を初期化中...",
      tokenReady: "✅ トークン生成器準備完了 - 描画できます！",
      tokenRetryLater: "⚠️ 必要に応じて再試行します",
      resizeSuccess: "✅ 画像を {width}x{height} にリサイズ",
      paintingPaused: "⏸️ X: {x}, Y: {y} で一時停止",
      captchaNeeded: "❗ トークン生成に失敗。少ししてから再試行してください。",
      saveData: "進捗を保存",
      loadData: "進捗を読み込み",
      saveToFile: "ファイルへ保存",
      loadFromFile: "ファイルから読み込み",
      dataManager: "データ管理",
      autoSaved: "✅ 自動保存しました",
      dataLoaded: "✅ 進捗を読み込みました",
      fileSaved: "✅ ファイルに保存しました",
      fileLoaded: "✅ ファイルから読み込みました",
      noSavedData: "❌ 保存された進捗がありません",
      savedDataFound: "✅ 保存された進捗が見つかりました。続行しますか？",
      savedDate: "保存日時: {date}",
      clickLoadToContinue: "「進捗を読み込み」をクリックして続行。",
      fileError: "❌ ファイル処理エラー",
      invalidFileFormat: "❌ 無効なファイル形式",
      paintingSpeed: "描画速度",
      pixelsPerSecond: "ピクセル/秒",
      speedSetting: "速度: {speed} ピクセル/秒",
      settings: "設定",
      botSettings: "ボット設定",
      close: "閉じる",
      language: "言語",
      themeSettings: "テーマ設定",
      themeSettingsDesc: "インターフェースの好きなカラーテーマを選択。",
      languageSelectDesc: "希望言語を選択。変更は即時反映されます。",
      autoCaptcha: "自動 CAPTCHA ソルバー",
      autoCaptchaDesc: "統合ジェネレーターで Turnstile トークンを自動生成し必要に応じてブラウザ自動化にフォールバック。",
      applySettings: "設定を適用",
      settingsSaved: "✅ 設定を保存しました！",
      speedOn: "オン",
      speedOff: "オフ",
      cooldownSettings: "クールダウン設定",
      waitCharges: "チャージ数が次に達するまで待機",
      captchaSolving: "🔑 Turnstile トークン生成中...",
      captchaFailed: "❌ トークン生成失敗。フォールバックを試行...",
      automation: "自動化",
      noChargesThreshold: "⌛ チャージ {threshold} を待機中。現在 {current}。次は {time} 後...",
    },
    ko: {
      title: "WPlace 자동 이미지",
      toggleOverlay: "오버레이 전환",
      scanColors: "색상 스캔",
      uploadImage: "이미지 업로드",
      resizeImage: "크기 조정",
      selectPosition: "위치 선택",
      startPainting: "그리기 시작",
      stopPainting: "그리기 중지",
      checkingColors: "🔍 사용 가능한 색상 확인 중...",
      noColorsFound: "❌ 사이트에서 색상 팔레트를 연 후 다시 시도하세요!",
      colorsFound: "✅ 사용 가능한 색상 {count}개 발견. 업로드 준비 완료.",
      loadingImage: "🖼️ 이미지 불러오는 중...",
      imageLoaded: "✅ 이미지 로드 완료. 유효 픽셀 {count}개",
      imageError: "❌ 이미지 로드 오류",
      selectPositionAlert: "작품을 시작할 위치에 첫 픽셀을 칠하세요!",
      waitingPosition: "👆 기준 픽셀을 칠할 때까지 대기 중...",
      positionSet: "✅ 위치 설정 완료!",
      positionTimeout: "❌ 위치 선택 시간 초과",
      startPaintingMsg: "🎨 그리기 시작...",
      paintingProgress: "🧱 진행: {painted}/{total} 픽셀...",
      noCharges: "⌛ 사용 가능 횟수 없음. {time} 대기...",
      paintingStopped: "⏹️ 사용자에 의해 중지됨",
      paintingComplete: "✅ 그리기 완료! {count} 픽셀 그렸습니다.",
      paintingError: "❌ 그리는 중 오류",
      missingRequirements: "❌ 먼저 이미지를 불러오고 위치를 선택하세요",
      progress: "진행",
      pixels: "픽셀",
      charges: "횟수",
      estimatedTime: "예상 시간",
      initMessage: "'이미지 업로드'를 클릭하여 시작",
      waitingInit: "초기화 대기 중...",
      initializingToken: "🔧 Turnstile 토큰 생성기 초기화 중...",
      tokenReady: "✅ 토큰 생성 준비 완료 - 그리기를 시작할 수 있습니다!",
      tokenRetryLater: "⚠️ 필요 시 다시 시도합니다",
      resizeSuccess: "✅ 이미지가 {width}x{height} 크기로 조정됨",
      paintingPaused: "⏸️ 위치 X: {x}, Y: {y} 에서 일시 중지",
      captchaNeeded: "❗ 토큰 생성 실패. 잠시 후 다시 시도하세요.",
      saveData: "진행 저장",
      loadData: "진행 불러오기",
      saveToFile: "파일로 저장",
      loadFromFile: "파일에서 불러오기",
      dataManager: "데이터",
      autoSaved: "✅ 진행 자동 저장됨",
      dataLoaded: "✅ 진행 불러오기 성공",
      fileSaved: "✅ 파일 저장 성공",
      fileLoaded: "✅ 파일 불러오기 성공",
      noSavedData: "❌ 저장된 진행 없음",
      savedDataFound: "✅ 저장된 진행 발견! 계속하려면 불러오시겠습니까?",
      savedDate: "저장 시각: {date}",
      clickLoadToContinue: "'진행 불러오기'를 클릭하여 계속.",
      fileError: "❌ 파일 처리 오류",
      invalid...(truncated 215528 characters)...n(255, Math.max(0, work[base] + er * factor));
            work[base + 1] = Math.min(255, Math.max(0, work[base + 1] + eg * factor));
            work[base + 2] = Math.min(255, Math.max(0, work[base + 2] + eb * factor));
          };

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = y * w + x;
              if (!eligible[idx]) continue;
              const base = idx * 3;
              const r0 = work[base], g0 = work[base + 1], b0 = work[base + 2];
              const [nr, ng, nb] = Utils.findClosestPaletteColor(r0, g0, b0, state.activeColorPalette);
              const i4 = idx * 4;
              data[i4] = nr;
              data[i4 + 1] = ng;
              data[i4 + 2] = nb;
              data[i4 + 3] = 255;
              totalValidPixels++;

              const er = r0 - nr;
              const eg = g0 - ng;
              const eb = b0 - nb;

              diffuse(x + 1, y, er, eg, eb, 7 / 16);
              diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
              diffuse(x, y + 1, er, eg, eb, 5 / 16);
              diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
            }
            // Yield every row to reduce jank
            await Promise.resolve();
          }
        };

        if (state.ditheringEnabled) {
          await applyFSDitherFinal();
        } else {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
            const masked = mask && mask[(i>>2)];
            const isTransparent = a < tThresh2 || masked;
            const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(r, g, b);
            if (isTransparent || isWhiteAndSkipped) {
              data[i + 3] = 0; // overlay transparency
              continue;
            }
            totalValidPixels++;
            const [nr, ng, nb] = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
            data[i] = nr;
            data[i + 1] = ng;
            data[i + 2] = nb;
            data[i + 3] = 255;
          }
        }
        tempCtx.putImageData(imgData, 0, 0);

        // Save the final pixel data for painting
        // Persist the paletted (and possibly dithered) pixels so painting uses the same output seen in overlay
        const palettedPixels = new Uint8ClampedArray(imgData.data);
        state.imageData.pixels = palettedPixels;
        state.imageData.width = newWidth;
        state.imageData.height = newHeight;
        state.imageData.totalPixels = totalValidPixels;
        state.totalPixels = totalValidPixels;
        state.paintedPixels = 0;

  state.resizeSettings = { baseWidth: width, baseHeight: height, width: newWidth, height: newHeight };
        saveBotSettings();

        const finalImageBitmap = await createImageBitmap(tempCanvas);
        await overlayManager.setImage(finalImageBitmap);
  overlayManager.enable();
  toggleOverlayBtn.classList.add('active');
  toggleOverlayBtn.setAttribute('aria-pressed', 'true');

  // Keep state.imageData.processor as the original-based source; painting uses paletted pixels already stored

        updateStats();
        updateUI("resizeSuccess", "success", { width: newWidth, height: newHeight });
        closeResizeDialog();
      };

      downloadPreviewBtn.onclick = () => {
        try {
          const w = baseCanvas.width, h = baseCanvas.height;
          const out = document.createElement('canvas');
          out.width = w; out.height = h;
          const octx = out.getContext('2d');
          octx.imageSmoothingEnabled = false;
          octx.drawImage(baseCanvas, 0, 0);
          octx.drawImage(maskCanvas, 0, 0);
          const link = document.createElement('a');
          link.download = 'wplace-preview.png';
          link.href = out.toDataURL();
          link.click();
        } catch (e) { console.warn('Failed to download preview:', e); }
      };

      cancelResize.onclick = closeResizeDialog;

      resizeOverlay.style.display = "block";
      resizeContainer.style.display = "block";

      // Reinitialize color palette with current available colors
      initializeColorPalette(resizeContainer);

      _updateResizePreview();
      _resizeDialogCleanup = () => {
        try { zoomSlider.replaceWith(zoomSlider.cloneNode(true)); } catch {}
        try { if (zoomInBtn) zoomInBtn.replaceWith(zoomInBtn.cloneNode(true)); } catch {}
        try { if (zoomOutBtn) zoomOutBtn.replaceWith(zoomOutBtn.cloneNode(true)); } catch {}
      };
      setTimeout(() => {
        if (typeof computeFitZoom === 'function') {
          const z = computeFitZoom();
          if (!isNaN(z) && isFinite(z)) {
            applyZoom(z);
            centerInView();
          }
        } else {
          centerInView();
        }
      }, 0);
    }

    function closeResizeDialog() {
  try { if (typeof _resizeDialogCleanup === 'function') { _resizeDialogCleanup(); } } catch {}
      resizeOverlay.style.display = "none";
      resizeContainer.style.display = "none";
      _updateResizePreview = () => { };
      try { if (typeof cancelAnimationFrame === 'function' && _panRaf) { cancelAnimationFrame(_panRaf); } } catch {}
      try { if (_previewTimer) { clearTimeout(_previewTimer); _previewTimer = null; } } catch {}
      _maskImageData = null; _maskData = null; _dirty = null;
      _ditherWorkBuf = null; _ditherEligibleBuf = null;
  _resizeDialogCleanup = null;
    }

    if (uploadBtn) {
      uploadBtn.addEventListener("click", async () => {
        const availableColors = Utils.extractAvailableColors();
        if (availableColors.length < 10) {
          updateUI("noColorsFound", "error");
          Utils.showAlert(Utils.t("noColorsFound"), "error");
          return;
        }

        if (!state.colorsChecked) {
          state.availableColors = availableColors;
          state.colorsChecked = true;
          updateUI("colorsFound", "success", { count: availableColors.length });
          updateStats();
          selectPosBtn.disabled = false;
          // Only enable resize button if image is also loaded
          if (state.imageLoaded) {
            resizeBtn.disabled = false;
          }
        }

        try {
          updateUI("loadingImage", "default")
          const imageSrc = await Utils.createImageUploader()
          if (!imageSrc) {
            updateUI("colorsFound", "success", { count: state.availableColors.length });
            return;
          }

          const processor = new ImageProcessor(imageSrc)
          await processor.load()

          const { width, height } = processor.getDimensions()
          const pixels = processor.getPixelData()

          let totalValidPixels = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            const isTransparent = pixels[i + 3] < (state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD);
            const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(pixels[i], pixels[i + 1], pixels[i + 2]);
            if (!isTransparent && !isWhiteAndSkipped) {
              totalValidPixels++;
            }
          }

          state.imageData = {
            width,
            height,
            pixels,
            totalPixels: totalValidPixels,
            processor,
          }

          state.totalPixels = totalValidPixels
          state.paintedPixels = 0
          state.imageLoaded = true
          state.lastPosition = { x: 0, y: 0 }
          // New image: clear previous resize settings
          state.resizeSettings = null;
          // Also clear any previous ignore mask
          state.resizeIgnoreMask = null;
          // Save original image for this browser (dataUrl + dims)
          state.originalImage = { dataUrl: imageSrc, width, height };
          saveBotSettings();
          saveBotSettings();

          // Use the original image for the overlay initially
          const imageBitmap = await createImageBitmap(processor.img);
          await overlayManager.setImage(imageBitmap);
          overlayManager.enable();
          toggleOverlayBtn.disabled = false;
          toggleOverlayBtn.classList.add('active');
          toggleOverlayBtn.setAttribute('aria-pressed', 'true');

          // Only enable resize button if colors have also been captured
          if (state.colorsChecked) {
            resizeBtn.disabled = false;
          }
          saveBtn.disabled = false

          if (state.startPosition) {
            startBtn.disabled = false
          }

          updateStats()
          updateDataButtons()
          updateUI("imageLoaded", "success", { count: totalValidPixels })
        } catch {
          updateUI("imageError", "error")
        }
      })
    }

    if (resizeBtn) {
      resizeBtn.addEventListener("click", () => {
        if (state.imageLoaded && state.imageData.processor && state.colorsChecked) {
          showResizeDialog(state.imageData.processor)
        } else if (!state.colorsChecked) {
          Utils.showAlert("Please upload an image first to capture available colors", "warning")
        }
      })
    }

    if (selectPosBtn) {
      selectPosBtn.addEventListener("click", async () => {
        if (state.selectingPosition) return

        state.selectingPosition = true
        state.startPosition = null
        state.region = null
        startBtn.disabled = true

        Utils.showAlert(Utils.t("selectPositionAlert"), "info")
        updateUI("waitingPosition", "default")

        const tempFetch = async (url, options) => {
          if (
            typeof url === "string" &&
            url.includes("https://backend.wplace.live/s0/pixel/") &&
            options?.method?.toUpperCase() === "POST"
          ) {
            try {
              const response = await originalFetch(url, options)
              const clonedResponse = response.clone()
              const data = await clonedResponse.json()

              if (data?.painted === 1) {
                const regionMatch = url.match(/\/pixel\/(\d+)\/(\d+)/)
                if (regionMatch && regionMatch.length >= 3) {
                  state.region = {
                    x: Number.parseInt(regionMatch[1]),
                    y: Number.parseInt(regionMatch[2]),
                  }
                }

                const payload = JSON.parse(options.body)
                if (payload?.coords && Array.isArray(payload.coords)) {
                  state.startPosition = {
                    x: payload.coords[0],
                    y: payload.coords[1],
                  }
                  state.lastPosition = { x: 0, y: 0 }

                  await overlayManager.setPosition(state.startPosition, state.region);

                  if (state.imageLoaded) {
                    startBtn.disabled = false
                  }

                  window.fetch = originalFetch
                  state.selectingPosition = false
                  updateUI("positionSet", "success")
                }
              }

              return response
            } catch {
              return originalFetch(url, options)
            }
          }
          return originalFetch(url, options)
        }

        const originalFetch = window.fetch;
        window.fetch = tempFetch;

        setTimeout(() => {
          if (state.selectingPosition) {
            window.fetch = originalFetch
            state.selectingPosition = false
            updateUI("positionTimeout", "error")
            Utils.showAlert(Utils.t("positionTimeout"), "error")
          }
        }, 120000)
      })
    }

    // New: Token pool management
    let tokenPool = [];
    let tokenRefreshTimer = null;

    async function maintainTokenPool() {
      while (tokenPool.length < CONFIG.TOKEN_POOL_SIZE) {
        try {
          const token = await handleCaptchaWithRetry(CONFIG.MAX_TOKEN_RETRIES);
          if (token) {
            tokenPool.push(token);
            console.log(`✅ Added new token to pool. Current size: ${tokenPool.length}/${CONFIG.TOKEN_POOL_SIZE}`);
          }
        } catch (error) {
          console.warn("⚠️ Failed to generate token for pool:", error);
          await Utils.sleep(5000); // Backoff on failure
        }
      }
    }

    function startTokenRefresh() {
      if (tokenRefreshTimer) clearInterval(tokenRefreshTimer);
      tokenRefreshTimer = setInterval(async () => {
        console.log("🔄 Refreshing token pool...");
        tokenPool = []; // Clear old tokens
        await maintainTokenPool();
      }, CONFIG.TOKEN_REFRESH_INTERVAL);
    }

    async function getTokenFromPool() {
      if (tokenPool.length === 0) {
        console.warn("⚠️ Token pool empty, generating new one...");
        await maintainTokenPool();
      }
      const token = tokenPool.shift(); // Use FIFO to rotate tokens
      // Immediately generate a new one to maintain pool size
      setTimeout(maintainTokenPool, 0);
      return token;
    }

    async function startPainting() {
      if (!state.imageLoaded || !state.startPosition || !state.region) {
        updateUI("missingRequirements", "error")
        return false
      }

      // Ensure token pool is ready before starting
      await maintainTokenPool();
      startTokenRefresh();

      state.running = true
      state.stopFlag = false
      startBtn.disabled = true
      stopBtn.disabled = false
      uploadBtn.disabled = true
      selectPosBtn.disabled = true
      resizeBtn.disabled = true
      saveBtn.disabled = true
      toggleOverlayBtn.disabled = true;

      updateUI("startPaintingMsg", "success")

      try {
        await processImage()
        return true
      } catch {
        updateUI("paintingError", "error")
        return false
      } finally {
        state.running = false
        stopBtn.disabled = true
        saveBtn.disabled = false

        if (!state.stopFlag) {
          startBtn.disabled = true
          uploadBtn.disabled = false
          selectPosBtn.disabled = false
          resizeBtn.disabled = false
        } else {
          startBtn.disabled = false
        }
        toggleOverlayBtn.disabled = false;
      }
    }

    if (startBtn) {
      startBtn.addEventListener("click", startPainting)
    }

    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        state.stopFlag = true
        state.running = false
        stopBtn.disabled = true
        updateUI("paintingStopped", "warning")

        if (state.imageLoaded && state.paintedPixels > 0) {
          Utils.saveProgress()
          Utils.showAlert(Utils.t("autoSaved"), "success")
        }
      })
    }

    const checkSavedProgress = () => {
      const savedData = Utils.loadProgress()
      if (savedData && savedData.state.paintedPixels > 0) {
        const savedDate = new Date(savedData.timestamp).toLocaleString()
        const progress = Math.round((savedData.state.paintedPixels / savedData.state.totalPixels) * 100)

        Utils.showAlert(
          `${Utils.t("savedDataFound")}\n\n` +
          `Saved: ${savedDate}\n` +
          `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels (${progress}%)\n` +
          `${Utils.t("clickLoadToContinue")}`,
          "info",
        )
      }
    }

    setTimeout(checkSavedProgress, 1000)

    if (cooldownSlider && cooldownValue) {
      cooldownSlider.addEventListener("input", (e) => {
        const threshold = parseInt(e.target.value);
        state.cooldownChargeThreshold = threshold;
        cooldownValue.textContent = threshold;
        saveBotSettings();
        NotificationManager.resetEdgeTracking(); // prevent spurious notify after threshold change
      });
    }

    loadBotSettings();
    // Ensure notification poller reflects current settings
    NotificationManager.syncFromState();
  }

  async function processImage() {
    const { width, height, pixels } = state.imageData
    const { x: startX, y: startY } = state.startPosition
    const { x: regionX, y: regionY } = state.region

    const tThresh2 = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
    const isEligibleAt = (x, y) => {
      const idx = (y * width + x) * 4;
      const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2], a = pixels[idx + 3];
      if (a < tThresh2) return false;
      if (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b)) return false;
      return true;
    };

    let startRow = 0;
    let startCol = 0;
    let foundStart = false;
    let seen = 0;
    const target = Math.max(0, Math.min(state.paintedPixels || 0, width * height));
    for (let y = 0; y < height && !foundStart; y++) {
      for (let x = 0; x < width; x++) {
        if (!isEligibleAt(x, y)) continue;
        if (seen === target) { startRow = y; startCol = x; foundStart = true; break; }
        seen++;
      }
    }
    if (!foundStart) { startRow = height; startCol = 0; }

    let pixelBatch = null;
    let skippedPixels = { transparent: 0, white: 0, alreadyPainted: 0 };

    try {
      outerLoop: for (let y = startRow; y < height; y++) {
        for (let x = y === startRow ? startCol : 0; x < width; x++) {
          if (state.stopFlag) {
            if (pixelBatch && pixelBatch.pixels.length > 0) {
              console.log(`🎯 Sending final batch before stop with ${pixelBatch.pixels.length} pixels`);
              const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);
              if (success) {
                pixelBatch.pixels.forEach(() => { state.paintedPixels++; });
                state.currentCharges -= pixelBatch.pixels.length;
                updateStats();
              }
            }
            state.lastPosition = { x, y }
            updateUI("paintingPaused", "warning", { x, y })
            break outerLoop
          }

          
          const idx = (y * width + x) * 4
          const r = pixels[idx]
          const g = pixels[idx + 1]
          const b = pixels[idx + 2]
          const alpha = pixels[idx + 3]

          const tThresh2 = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
          if (alpha < tThresh2 || (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b))) {
            if (alpha < tThresh2) {
              skippedPixels.transparent++;
            } else {
              skippedPixels.white++;
            }
            continue;
          }

          let targetRgb;
          if (Utils.isWhitePixel(r, g, b)) {
            targetRgb = [255, 255, 255];
          } else {
            targetRgb = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
          }

          const colorId = findClosestColor([r, g, b], state.availableColors);

          let absX = startX + x;
          let absY = startY + y;

          let adderX = Math.floor(absX / 1000);
          let adderY = Math.floor(absY / 1000);
          let pixelX = absX % 1000;
          let pixelY = absY % 1000;

          if (!pixelBatch ||
            pixelBatch.regionX !== regionX + adderX ||
            pixelBatch.regionY !== regionY + adderY) {

            if (pixelBatch && pixelBatch.pixels.length > 0) {
              console.log(`🌍 Sending region-change batch with ${pixelBatch.pixels.length} pixels (switching to region ${regionX + adderX},${regionY + adderY})`);
              const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);
              
              if (success) {
                pixelBatch.pixels.forEach((p) => { state.paintedPixels++; });
                state.currentCharges -= pixelBatch.pixels.length;
                updateUI("paintingProgress", "default", {
                  painted: state.paintedPixels,
                  total: state.totalPixels,
                })

                if (state.paintedPixels % 50 === 0) {
                  Utils.saveProgress()
                }

                if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.pixels.length > 0) {
                  // paintingSpeed now represents batch size, so add a small delay based on batch size
                  const batchDelayFactor = Math.max(1, 100 / state.paintingSpeed); // Larger batches = less delay
                  const totalDelay = Math.max(100, batchDelayFactor * pixelBatch.pixels.length);
                  await Utils.sleep(totalDelay)
                }
                updateStats();
              } else {
                // If batch failed after all retries, stop painting to prevent infinite loops
                console.error(`❌ Batch failed permanently after retries. Stopping painting.`);
                state.stopFlag = true;
                break outerLoop;
              }
            }

            pixelBatch = {
              regionX: regionX + adderX,
              regionY: regionY + adderY,
              pixels: []
            };
          }

          
          try {
            const tileRegionX = pixelBatch ? (pixelBatch.regionX) : (regionX + adderX);
            const tileRegionY = pixelBatch ? (pixelBatch.regionY) : (regionY + adderY);
            const tileKeyParts = [(regionX + adderX), (regionY + adderY)];
            const existingColorRGBA = await overlayManager.getTilePixelColor(tileKeyParts[0], tileKeyParts[1], pixelX, pixelY).catch(() => null);
            if (existingColorRGBA && Array.isArray(existingColorRGBA)) {
              const [er, eg, eb] = existingColorRGBA;
              const existingColorId = findClosestColor([er, eg, eb], state.availableColors);
              // console.log(`pixel at (${pixelX}, ${pixelY}) has color ${existingColorId} it should be ${colorId}`);
              if (existingColorId === colorId) {
                skippedPixels.alreadyPainted++;
                console.log(`Skipped already painted pixel at (${pixelX}, ${pixelY})`);
                continue; // Skip
              }
            }
          } catch (e) {
            /* ignore */
          }

          pixelBatch.pixels.push({
            x: pixelX,
            y: pixelY,
            color: colorId,
            localX: x,
            localY: y,
          });

          // Calculate batch size based on mode (normal/random)
          const maxBatchSize = calculateBatchSize();
          if (pixelBatch.pixels.length >= maxBatchSize) {
            const modeText = state.batchMode === 'random' ? `random (${state.randomBatchMin}-${state.randomBatchMax})` : 'normal';
            console.log(`📦 Sending batch with ${pixelBatch.pixels.length} pixels (mode: ${modeText}, target: ${maxBatchSize})`);
            const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);

            if (success) {
              pixelBatch.pixels.forEach((pixel) => {
                state.paintedPixels++;
              })

              state.currentCharges -= pixelBatch.pixels.length;
              updateStats()
              updateUI("paintingProgress", "default", {
                painted: state.paintedPixels,
                total: state.totalPixels,
              })

              if (state.paintedPixels % 50 === 0) {
                Utils.saveProgress()
              }

              if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.pixels.length > 0) {
                const delayPerPixel = 1000 / state.paintingSpeed // ms per pixel
                const totalDelay = Math.max(100, delayPerPixel * pixelBatch.pixels.length) // minimum 100ms
                await Utils.sleep(totalDelay)
              }
            } else {
              // If batch failed after all retries, stop painting to prevent infinite loops
              console.error(`❌ Batch failed permanently after retries. Stopping painting.`);
              state.stopFlag = true;
              break outerLoop;
            }

            pixelBatch.pixels = [];
          }

          while (state.currentCharges < state.cooldownChargeThreshold && !state.stopFlag) {
            const { charges, cooldown } = await WPlaceService.getCharges();
            state.currentCharges = Math.floor(charges);
            state.cooldown = cooldown;

            if (state.currentCharges >= state.cooldownChargeThreshold) {
              // Edge-trigger a notification the instant threshold is crossed
              NotificationManager.maybeNotifyChargesReached(true);
              updateStats();
              break;
            }

            updateUI("noChargesThreshold", "warning", {
              time: Utils.formatTime(state.cooldown),
              threshold: state.cooldownChargeThreshold,
              current: state.currentCharges
            });
            await updateStats();
            await Utils.sleep(state.cooldown);
          }
          if (state.stopFlag) break outerLoop;

        }
      }

      if (pixelBatch && pixelBatch.pixels.length > 0 && !state.stopFlag) {
        console.log(`🏁 Sending final batch with ${pixelBatch.pixels.length} pixels`);
        const success = await sendBatchWithRetry(pixelBatch.pixels, pixelBatch.regionX, pixelBatch.regionY);
        if (success) {
          pixelBatch.pixels.forEach((pixel) => {
            state.paintedPixels++
          })
          state.currentCharges -= pixelBatch.pixels.length;
          if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.pixels.length > 0) {
            const delayPerPixel = 1000 / state.paintingSpeed // ms per pixel
            const totalDelay = Math.max(100, delayPerPixel * pixelBatch.pixels.length) // minimum 100ms
            await Utils.sleep(totalDelay)
          }
        } else {
          // If final batch failed after retries, log it
          console.warn(`⚠️ Final batch failed with ${pixelBatch.pixels.length} pixels after all retries.`);
        }
      }
    } finally {
      if (window._chargesInterval) clearInterval(window._chargesInterval)
      window._chargesInterval = null
    }

    if (state.stopFlag) {
      updateUI("paintingStopped", "warning")
      Utils.saveProgress()
    } else {
      updateUI("paintingComplete", "success", { count: state.paintedPixels })
      state.lastPosition = { x: 0, y: 0 }
      state.paintedMap = null
      Utils.clearProgress()
      overlayManager.clear();
      const toggleOverlayBtn = document.getElementById('toggleOverlayBtn');
      if (toggleOverlayBtn) {
        toggleOverlayBtn.classList.remove('active');
        toggleOverlayBtn.disabled = true;
      }
    }

    // Log skip statistics
    console.log(`📊 Pixel Statistics:`);
    console.log(`   Painted: ${state.paintedPixels}`);
    console.log(`   Skipped - Transparent: ${skippedPixels.transparent}`);
    console.log(`   Skipped - White (disabled): ${skippedPixels.white}`);
    console.log(`   Skipped - Already painted: ${skippedPixels.alreadyPainted}`);
    console.log(`   Total processed: ${state.paintedPixels + skippedPixels.transparent + skippedPixels.white + skippedPixels.alreadyPainted}`);

    updateStats()
  }

  // Helper function to calculate batch size based on mode
  function calculateBatchSize() {
    let targetBatchSize;
    
    if (state.batchMode === 'random') {
      // Generate random batch size within the specified range
      const min = Math.max(1, state.randomBatchMin);
      const max = Math.max(min, state.randomBatchMax);
      targetBatchSize = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log(`🎲 Random batch size generated: ${targetBatchSize} (range: ${min}-${max})`);
    } else {
      // Normal mode - use the fixed paintingSpeed value
      targetBatchSize = state.paintingSpeed;
    }
    
    // Always limit by available charges
    const maxAllowed = Math.floor(state.currentCharges);
    const finalBatchSize = Math.min(targetBatchSize, maxAllowed);
    
    return finalBatchSize;
  }

  // Helper function to retry batch until success with exponential backoff
  async function sendBatchWithRetry(pixels, regionX, regionY, maxRetries = MAX_BATCH_RETRIES) {
    let attempt = 0;
    while (attempt < maxRetries && !state.stopFlag) {
      attempt++;
      console.log(`🔄 Attempting to send batch (attempt ${attempt}/${maxRetries}) for region ${regionX},${regionY} with ${pixels.length} pixels`);
      
      const result = await sendPixelBatch(pixels, regionX, regionY);
      
      if (result === true) {
        console.log(`✅ Batch succeeded on attempt ${attempt}`);
        return true;
      } else if (result === "token_error") {
        console.log(`🔑 Token error on attempt ${attempt}, regenerating...`);
        updateUI("captchaSolving", "warning");
        try {
          await maintainTokenPool(); // Refresh pool on token error
          // Don't count token regeneration as a failed attempt
          attempt--;
          continue;
        } catch (e) {
          console.error(`❌ Token regeneration failed on attempt ${attempt}:`, e);
          updateUI("captchaFailed", "error");
          // Wait longer before retrying after token failure
          await Utils.sleep(5000);
        }
      } else {
        console.warn(`⚠️ Batch failed on attempt ${attempt}, retrying...`);
        // Exponential backoff with jitter
        const baseDelay = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30s
        const jitter = Math.random() * 1000; // Add up to 1s random delay
        await Utils.sleep(baseDelay + jitter);
      }
    }
    
    if (attempt >= maxRetries) {
      console.error(`❌ Batch failed after ${maxRetries} attempts (MAX_BATCH_RETRIES=${MAX_BATCH_RETRIES}). This will stop painting to prevent infinite loops.`);
      updateUI("paintingError", "error");
      return false;
    }
    
    return false;
  }

  async function sendPixelBatch(pixelBatch, regionX, regionY) {
    let token = await getTokenFromPool(); // Get from pool instead of single token
    
    // Generate new token if we don't have one (fallback, though pool should handle it)
    if (!token) {
      try {
        console.log("🔑 Generating Turnstile token for pixel batch...");
        token = await handleCaptchaWithRetry(CONFIG.MAX_TOKEN_RETRIES);
        if (token) {
          tokenPool.push(token); // Add back to pool
        } else {
          return "token_error";
        }
      } catch (error) {
        console.error("❌ Failed to generate Turnstile token:", error);
        return "token_error";
      }
    }

    const coords = new Array(pixelBatch.length * 2)
    const colors = new Array(pixelBatch.length)
    for (let i = 0; i < pixelBatch.length; i++) {
      const pixel = pixelBatch[i]
      coords[i * 2] = pixel.x
      coords[i * 2 + 1] = pixel.y
      colors[i] = pixel.color
    }

    try {
      const payload = { coords, colors, t: token }

      const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (res.status === 403) {
        let data = null
        try { data = await res.json() } catch (_) { }
        console.error("❌ 403 Forbidden. Turnstile token might be invalid or expired.")
        
        // Try to generate a new token and retry once
        try {
          console.log("🔄 Regenerating Turnstile token after 403...");
          token = await getTokenFromPool(); // Get fresh from pool
          
          // Retry the request with new token
          const retryPayload = { coords, colors, t: token };
          const retryRes = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            credentials: "include",
            body: JSON.stringify(retryPayload),
          });
          
          if (retryRes.status === 403) {
            return "token_error";
          }
          
          const retryData = await retryRes.json();
          return retryData?.painted === pixelBatch.length;
          
        } catch (retryError) {
          console.error("❌ Token regeneration failed:", retryError);
          return "token_error";
        }
      }
      
      const data = await res.json()
      return data?.painted === pixelBatch.length
    } catch (e) {
      console.error("Batch paint request failed:", e)
      return false
    }
  }

  function saveBotSettings() {
    try {
      const settings = {
        paintingSpeed: state.paintingSpeed,
        paintingSpeedEnabled: document.getElementById('enableSpeedToggle')?.checked,
        batchMode: state.batchMode, // "normal" or "random"
        randomBatchMin: state.randomBatchMin,
        randomBatchMax: state.randomBatchMax,
        cooldownChargeThreshold: state.cooldownChargeThreshold,
        tokenSource: state.tokenSource, // "generator", "hybrid", or "manual"
        minimized: state.minimized,
        overlayOpacity: state.overlayOpacity,
        blueMarbleEnabled: document.getElementById('enableBlueMarbleToggle')?.checked,
  ditheringEnabled: state.ditheringEnabled,
  colorMatchingAlgorithm: state.colorMatchingAlgorithm,
  enableChromaPenalty: state.enableChromaPenalty,
  chromaPenaltyWeight: state.chromaPenaltyWeight,
  customTransparencyThreshold: state.customTransparencyThreshold,
  customWhiteThreshold: state.customWhiteThreshold,
  paintWhitePixels: state.paintWhitePixels,
  resizeSettings: state.resizeSettings,
  originalImage: state.originalImage,
  // Save ignore mask (as base64) with its dimensions
  resizeIgnoreMask: (state.resizeIgnoreMask && state.resizeSettings && state.resizeSettings.width * state.resizeSettings.height === state.resizeIgnoreMask.length)
    ? { w: state.resizeSettings.width, h: state.resizeSettings.height, data: btoa(String.fromCharCode(...state.resizeIgnoreMask)) }
    : null,
        // Notifications
        notificationsEnabled: state.notificationsEnabled,
        notifyOnChargesReached: state.notifyOnChargesReached,
        notifyOnlyWhenUnfocused: state.notifyOnlyWhenUnfocused,
        notificationIntervalMinutes: state.notificationIntervalMinutes,
      };
      CONFIG.PAINTING_SPEED_ENABLED = settings.paintingSpeedEnabled;
      // AUTO_CAPTCHA_ENABLED is always true - no need to save/load

      localStorage.setItem("wplace-bot-settings", JSON.stringify(settings));
    } catch (e) {
      console.warn("Could not save bot settings:", e);
    }
  }

  function loadBotSettings() {
    try {
      const saved = localStorage.getItem("wplace-bot-settings");
      if (!saved) return;
      const settings = JSON.parse(saved);

      state.paintingSpeed = settings.paintingSpeed || CONFIG.PAINTING_SPEED.DEFAULT;
      state.batchMode = settings.batchMode || CONFIG.BATCH_MODE; // Default to "normal"
      state.randomBatchMin = settings.randomBatchMin || CONFIG.RANDOM_BATCH_RANGE.MIN;
      state.randomBatchMax = settings.randomBatchMax || CONFIG.RANDOM_BATCH_RANGE.MAX;
      state.cooldownChargeThreshold = settings.cooldownChargeThreshold || CONFIG.COOLDOWN_CHARGE_THRESHOLD;
      state.tokenSource = settings.tokenSource || CONFIG.TOKEN_SOURCE; // Default to "generator"
      state.minimized = settings.minimized ?? false;
      CONFIG.PAINTING_SPEED_ENABLED = settings.paintingSpeedEnabled ?? false;
      CONFIG.AUTO_CAPTCHA_ENABLED = settings.autoCaptchaEnabled ?? false;
      state.overlayOpacity = settings.overlayOpacity ?? CONFIG.OVERLAY.OPACITY_DEFAULT;
      state.blueMarbleEnabled = settings.blueMarbleEnabled ?? CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT;
  state.ditheringEnabled = settings.ditheringEnabled ?? false;
  state.colorMatchingAlgorithm = settings.colorMatchingAlgorithm || 'lab';
  state.enableChromaPenalty = settings.enableChromaPenalty ?? true;
  state.chromaPenaltyWeight = settings.chromaPenaltyWeight ?? 0.15;
  state.customTransparencyThreshold = settings.customTransparencyThreshold ?? CONFIG.TRANSPARENCY_THRESHOLD;
  state.customWhiteThreshold = settings.customWhiteThreshold ?? CONFIG.WHITE_THRESHOLD;
  state.paintWhitePixels = settings.paintWhitePixels ?? true;
  state.resizeSettings = settings.resizeSettings ?? null;
  state.originalImage = settings.originalImage ?? null;
      // Notifications
      state.notificationsEnabled = settings.notificationsEnabled ?? CONFIG.NOTIFICATIONS.ENABLED;
      state.notifyOnChargesReached = settings.notifyOnChargesReached ?? CONFIG.NOTIFICATIONS.ON_CHARGES_REACHED;
      state.notifyOnlyWhenUnfocused = settings.notifyOnlyWhenUnfocused ?? CONFIG.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED;
      state.notificationIntervalMinutes = settings.notificationIntervalMinutes ?? CONFIG.NOTIFICATIONS.REPEAT_MINUTES;
  // Restore ignore mask if dims match current resizeSettings
  if (settings.resizeIgnoreMask && settings.resizeIgnoreMask.data && state.resizeSettings && settings.resizeIgnoreMask.w === state.resizeSettings.width && settings.resizeIgnoreMask.h === state.resizeSettings.height) {
    try {
      const bin = atob(settings.resizeIgnoreMask.data);
      const arr = new Uint8Array(bin.length);
      for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
      state.resizeIgnoreMask = arr;
    } catch { state.resizeIgnoreMask = null; }
  } else {
    state.resizeIgnoreMask = null;
  }

      const speedSlider = document.getElementById('speedSlider');
      if (speedSlider) speedSlider.value = state.paintingSpeed;
      const speedValue = document.getElementById('speedValue');
      if (speedValue) speedValue.textContent = `${state.paintingSpeed} (batch size)`;

      const enableSpeedToggle = document.getElementById('enableSpeedToggle');
      if (enableSpeedToggle) enableSpeedToggle.checked = CONFIG.PAINTING_SPEED_ENABLED;

      // Batch mode UI initialization
      const batchModeSelect = document.getElementById('batchModeSelect');
      if (batchModeSelect) batchModeSelect.value = state.batchMode;
      
      const normalBatchControls = document.getElementById('normalBatchControls');
      const randomBatchControls = document.getElementById('randomBatchControls');
      
      // Show/hide appropriate controls based on batch mode
      if (normalBatchControls && randomBatchControls) {
        if (state.batchMode === 'random') {
          normalBatchControls.style.display = 'none';
          randomBatchControls.style.display = 'block';
        } else {
          normalBatchControls.style.display = 'block';
          randomBatchControls.style.display = 'none';
        }
      }
      
      const randomBatchMin = document.getElementById('randomBatchMin');
      if (randomBatchMin) randomBatchMin.value = state.randomBatchMin;
      
      const randomBatchMax = document.getElementById('randomBatchMax');
      if (randomBatchMax) randomBatchMax.value = state.randomBatchMax;

      // AUTO_CAPTCHA_ENABLED is always true - no toggle to set

      const cooldownSlider = document.getElementById('cooldownSlider');
      if (cooldownSlider) cooldownSlider.value = state.cooldownChargeThreshold;
      const cooldownValue = document.getElementById('cooldownValue'); 
      if (cooldownValue) cooldownValue.textContent = state.cooldownChargeThreshold;

      const overlayOpacitySlider = document.getElementById('overlayOpacitySlider');
      if (overlayOpacitySlider) overlayOpacitySlider.value = state.overlayOpacity;
      const overlayOpacityValue = document.getElementById('overlayOpacityValue');
      if (overlayOpacityValue) overlayOpacityValue.textContent = `${Math.round(state.overlayOpacity * 100)}%`;
      const enableBlueMarbleToggle = document.getElementById('enableBlueMarbleToggle');
      if (enableBlueMarbleToggle) enableBlueMarbleToggle.checked = state.blueMarbleEnabled;
  
      const tokenSourceSelect = document.getElementById('tokenSourceSelect');
      if (tokenSourceSelect) tokenSourceSelect.value = state.tokenSource;
  
  const colorAlgorithmSelect = document.getElementById('colorAlgorithmSelect');
  if (colorAlgorithmSelect) colorAlgorithmSelect.value = state.colorMatchingAlgorithm;
  const enableChromaPenaltyToggle = document.getElementById('enableChromaPenaltyToggle');
  if (enableChromaPenaltyToggle) enableChromaPenaltyToggle.checked = state.enableChromaPenalty;
  const chromaPenaltyWeightSlider = document.getElementById('chromaPenaltyWeightSlider');
  if (chromaPenaltyWeightSlider) chromaPenaltyWeightSlider.value = state.chromaPenaltyWeight;
  const chromaWeightValue = document.getElementById('chromaWeightValue');
  if (chromaWeightValue) chromaWeightValue.textContent = state.chromaPenaltyWeight.toFixed(2);
  const transparencyThresholdInput = document.getElementById('transparencyThresholdInput');
  if (transparencyThresholdInput) transparencyThresholdInput.value = state.customTransparencyThreshold;
  const whiteThresholdInput = document.getElementById('whiteThresholdInput');
  if (whiteThresholdInput) whiteThresholdInput.value = state.customWhiteThreshold;
  const ditherToggle = document.getElementById('enableDitheringToggle');
  if (ditherToggle) ditherToggle.checked = state.ditheringEnabled;
      // Notifications UI
      const notifEnabledToggle = document.getElementById('notifEnabledToggle');
      if (notifEnabledToggle) notifEnabledToggle.checked = state.notificationsEnabled;
      const notifOnChargesToggle = document.getElementById('notifOnChargesToggle');
      if (notifOnChargesToggle) notifOnChargesToggle.checked = state.notifyOnChargesReached;
      const notifOnlyUnfocusedToggle = document.getElementById('notifOnlyUnfocusedToggle');
      if (notifOnlyUnfocusedToggle) notifOnlyUnfocusedToggle.checked = state.notifyOnlyWhenUnfocused;
      const notifIntervalInput = document.getElementById('notifIntervalInput');
      if (notifIntervalInput) notifIntervalInput.value = state.notificationIntervalMinutes;
      NotificationManager.resetEdgeTracking();

    } catch (e) {
      console.warn("Could not load bot settings:", e);
    }
  }

  // Initialize Turnstile generator integration
  console.log("🚀 WPlace Auto-Image with Turnstile Token Generator loaded");
  console.log("🔑 Turnstile token generator: ALWAYS ENABLED (Background mode)");
  console.log("🎯 Manual pixel captcha solving: Available as fallback/alternative");
  console.log("📱 Turnstile widgets: DISABLED - pure background token generation only!");

  // Function to enable file operations after initial startup setup is complete
  function enableFileOperations() {
    state.initialSetupComplete = true;
    
    const loadBtn = document.querySelector("#loadBtn");
    const loadFromFileBtn = document.querySelector("#loadFromFileBtn");
    const uploadBtn = document.querySelector("#uploadBtn");
    
    if (loadBtn) {
      loadBtn.disabled = false;
      loadBtn.title = "";
      // Add a subtle animation to indicate the button is now available
      loadBtn.style.animation = "pulse 0.6s ease-in-out";
      setTimeout(() => {
        if (loadBtn) loadBtn.style.animation = "";
      }, 600);
      console.log("✅ Load Progress button enabled after initial setup");
    }
    
    if (loadFromFileBtn) {
      loadFromFileBtn.disabled = false;
      loadFromFileBtn.title = "";
      // Add a subtle animation to indicate the button is now available
      loadFromFileBtn.style.animation = "pulse 0.6s ease-in-out";
      setTimeout(() => {
        if (loadFromFileBtn) loadFromFileBtn.style.animation = "";
      }, 600);
      console.log("✅ Load from File button enabled after initial setup");
    }
    
    if (uploadBtn) {
      uploadBtn.disabled = false;
      uploadBtn.title = "";
      // Add a subtle animation to indicate the button is now available
      uploadBtn.style.animation = "pulse 0.6s ease-in-out";
      setTimeout(() => {
        if (uploadBtn) uploadBtn.style.animation = "";
      }, 600);
      console.log("✅ Upload Image button enabled after initial setup");
    }
    
    // Show a notification that file operations are now available
    Utils.showAlert("📂 File operations (Load/Upload) are now available!", "success");
  }

  // Optimized token initialization with better timing and error handling
  async function initializeTokenGenerator() {
    // Skip if already have valid token
    if (isTokenValid()) {
      console.log("✅ Valid token already available, skipping initialization");
      updateUI("tokenReady", "success");
      enableFileOperations(); // Enable file operations since initial setup is complete
      return;
    }

    try {
      console.log("🔧 Initializing Turnstile token generator...");
      updateUI("initializingToken", "default");
      
      // Pre-load Turnstile script first to avoid delays later
      await Utils.loadTurnstile();
      
      await maintainTokenPool(); // Initialize pool instead of single token
      startTokenRefresh(); // Start periodic refresh
      
      console.log("✅ Token pool initialized successfully");
      updateUI("tokenReady", "success");
      Utils.showAlert("🔑 Token generator ready!", "success");
      enableFileOperations(); // Enable file operations since initial setup is complete
    } catch (error) {
      console.warn("⚠️ Startup token generation failed:", error);
      updateUI("tokenRetryLater", "warning");
      // Still enable file operations even if initial token generation fails
      // Users can load progress and use manual/hybrid modes
      enableFileOperations();
      // Don't show error alert for initialization failures, just log them
    }
  }

  // Load theme preference immediately on startup before creating UI
  loadThemePreference()

  createUI().then(() => {
    // Generate token automatically after UI is ready
    setTimeout(initializeTokenGenerator, 1000);

    // Attach advanced color matching listeners (resize dialog)
    const advancedInit = () => {
      const chromaSlider = document.getElementById('chromaPenaltyWeightSlider');
      const chromaValue = document.getElementById('chromaWeightValue');
      const resetBtn = document.getElementById('resetAdvancedColorBtn');
      const algoSelect = document.getElementById('colorAlgorithmSelect');
      const chromaToggle = document.getElementById('enableChromaPenaltyToggle');
  const transInput = document.getElementById('transparencyThresholdInput');
      const whiteInput = document.getElementById('whiteThresholdInput');
  const ditherToggle = document.getElementById('enableDitheringToggle');
      if (algoSelect) algoSelect.addEventListener('change', e => { state.colorMatchingAlgorithm = e.target.value; saveBotSettings(); _updateResizePreview(); });
      if (chromaToggle) chromaToggle.addEventListener('change', e => { state.enableChromaPenalty = e.target.checked; saveBotSettings(); _updateResizePreview(); });
      if (chromaSlider && chromaValue) chromaSlider.addEventListener('input', e => { state.chromaPenaltyWeight = parseFloat(e.target.value)||0.15; chromaValue.textContent = state.chromaPenaltyWeight.toFixed(2); saveBotSettings(); _updateResizePreview(); });
      if (transInput) transInput.addEventListener('change', e => { const v=parseInt(e.target.value,10); if(!isNaN(v)&&v>=0&&v<=255){ state.customTransparencyThreshold=v; CONFIG.TRANSPARENCY_THRESHOLD=v; saveBotSettings(); _updateResizePreview(); }});
      if (whiteInput) whiteInput.addEventListener('change', e => { const v=parseInt(e.target.value,10); if(!isNaN(v)&&v>=200&&v<=255){ state.customWhiteThreshold=v; CONFIG.WHITE_THRESHOLD=v; saveBotSettings(); _updateResizePreview(); }});
  if (ditherToggle) ditherToggle.addEventListener('change', e => { state.ditheringEnabled = e.target.checked; saveBotSettings(); _updateResizePreview(); });
      if (resetBtn) resetBtn.addEventListener('click', () => {
        state.colorMatchingAlgorithm='lab'; state.enableChromaPenalty=true; state.chromaPenaltyWeight=0.15; state.customTransparencyThreshold=CONFIG.TRANSPARENCY_THRESHOLD=100; state.customWhiteThreshold=CONFIG.WHITE_THRESHOLD=250; saveBotSettings(); const a=document.getElementById('colorAlgorithmSelect'); if(a) a.value='lab'; const ct=document.getElementById('enableChromaPenaltyToggle'); if(ct) ct.checked=true; if(chromaSlider) chromaSlider.value=0.15; if(chromaValue) chromaValue.textContent='0.15'; if(transInput) transInput.value=100; if(whiteInput) whiteInput.value=250; _updateResizePreview(); Utils.showAlert('Advanced color settings reset.', 'success'); });
    };
    // Delay to ensure resize UI built
    setTimeout(advancedInit, 500);
    
    // Add cleanup on page unload
    window.addEventListener('beforeunload', () => {
      Utils.cleanupTurnstile();
      if (tokenRefreshTimer) clearInterval(tokenRefreshTimer);
    });
  })
})()
