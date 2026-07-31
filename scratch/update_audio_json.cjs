const fs = require('fs');

const databaseFile = 'C:\\Luper\\docs\\database\\audio.json';

const newTweaks = [
  {
    "id": "audio_audiodg_priority_affinity",
    "title": "AudioDG.exe Öncelik ve Çekirdek Atama Optimizasyonu",
    "description": "audiodg.exe işlemini belirli bir CPU çekirdeğine atar ve yüksek öncelik verir. Ses çatlamalarını, DPC gecikmelerini ve kesintileri önler.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "none",
      "latency": "positive_high",
      "reliability": "positive_medium"
    },
    "ai_confidence": 95,
    "risk_level": "medium",
    "tags": ["audio", "latency", "audiodg", "cpu", "priority"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "New-Item -Path \"HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\audiodg.exe\\PerfOptions\" -Force | Out-Null; Set-ItemProperty -Path \"HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\audiodg.exe\\PerfOptions\" -Name \"CpuPriorityClass\" -Value 3 -Type DWord; Set-ItemProperty -Path \"HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\audiodg.exe\\PerfOptions\" -Name \"IOPriority\" -Value 3 -Type DWord; $p = Get-Process audiodg -ErrorAction SilentlyContinue; if($p){ $p.PriorityClass = 'High'; $p.ProcessorAffinity = [IntPtr]4 }"
      }
    ]
  },
  {
    "id": "audio_mmcss_pro_audio_optimization",
    "title": "Pro Audio Görev Profili Optimizasyonu",
    "description": "MMCSS 'Pro Audio' profili için maksimum thread önceliği, yüksek SFIO disk I/O ve GPU önceliği atayarak düşük gecikmeli ses akışları sağlar.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "none",
      "latency": "positive_high",
      "reliability": "none"
    },
    "ai_confidence": 98,
    "risk_level": "low",
    "tags": ["audio", "mmcss", "latency", "priority"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "$Path = \"HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Pro Audio\"; New-Item -Path $Path -Force | Out-Null; Set-ItemProperty -Path $Path -Name \"Priority\" -Value 8 -Type DWord; Set-ItemProperty -Path $Path -Name \"Scheduling Category\" -Value \"High\" -Type String; Set-ItemProperty -Path $Path -Name \"SFIO Priority\" -Value \"High\" -Type String; Set-ItemProperty -Path $Path -Name \"Background Only\" -Value \"False\" -Type String; Set-ItemProperty -Path $Path -Name \"GPU Priority\" -Value 8 -Type DWord; Set-ItemProperty -Path $Path -Name \"Clock Rate\" -Value 10000 -Type DWord"
      }
    ]
  },
  {
    "id": "audio_device_power_idle_timeout_override",
    "title": "Ses Sürücüsü Güç Tasarrufu ve Uyku Zaman Aşımını Devre Dışı Bırakma",
    "description": "Ses sürücülerindeki agresif güç tasarrufu zaman aşımlarını kapatarak ses kesilmelerini ve sesin geç gelmesini önler.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "none",
      "latency": "none",
      "reliability": "positive_high"
    },
    "ai_confidence": 95,
    "risk_level": "low",
    "tags": ["audio", "power", "driver"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "$ClassKey = \"HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e96c-e325-11ce-bfc1-08002be10318}\"; Get-ChildItem -Path $ClassKey -ErrorAction SilentlyContinue | ForEach-Object { $PowerPath = Join-Path -Path $_.PSPath -ChildPath \"PowerSettings\"; if (Test-Path -Path $PowerPath) { Set-ItemProperty -Path $PowerPath -Name \"ConservationIdleTime\" -Value ([byte[]](0xFF,0xFF,0xFF,0xFF)) -Type Binary; Set-ItemProperty -Path $PowerPath -Name \"PerformanceIdleTime\" -Value ([byte[]](0xFF,0xFF,0xFF,0xFF)) -Type Binary; Set-ItemProperty -Path $PowerPath -Name \"IdlePowerState\" -Value ([byte[]](0x00,0x00,0x00,0x00)) -Type Binary } }"
      }
    ]
  },
  {
    "id": "audio_msi_mode_optimization",
    "title": "HD Audio Denetleyicisi MSI Modu ve Öncelik Optimizasyonu",
    "description": "Ses denetleyicisini MSI-X moduna geçirerek IRQ çakışmalarını, DPC gecikmesini ve oyun içi takılmaları giderir.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "positive_low",
      "latency": "positive_high",
      "reliability": "positive_medium"
    },
    "ai_confidence": 95,
    "risk_level": "medium",
    "tags": ["audio", "msi", "irq", "latency"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "$PciAudio = Get-PnpDevice -Class \"System\" -FriendlyName \"*Audio Controller*\" -ErrorAction SilentlyContinue | Where-Object {$_.InstanceId -like \"PCI\\*\"}; if (-not $PciAudio) { $PciAudio = Get-PnpDevice -Class \"MEDIA\" -ErrorAction SilentlyContinue | Where-Object {$_.InstanceId -like \"PCI\\*\"} } foreach ($Dev in $PciAudio) { $MsiPath = \"HKLM:\\SYSTEM\\CurrentControlSet\\Enum\\$($Dev.InstanceId)\\Device Parameters\\Interrupt Management\\MessageSignaledInterruptProperties\"; $AffPath = \"HKLM:\\SYSTEM\\CurrentControlSet\\Enum\\$($Dev.InstanceId)\\Device Parameters\\Interrupt Management\\Affinity Policy\"; New-Item -Path $MsiPath -Force | Out-Null; New-Item -Path $AffPath -Force | Out-Null; Set-ItemProperty -Path $MsiPath -Name \"MSISupported\" -Value 1 -Type DWord; Set-ItemProperty -Path $AffPath -Name \"DevicePriority\" -Value 3 -Type DWord }"
      }
    ]
  },
  {
    "id": "audio_decouple_mmcss_service",
    "title": "Windows Audio Hizmetini MMCSS Bağımlılığından Ayırma",
    "description": "Windows Audio hizmetinden MMCSS bağımlılığını kaldırarak CPU darboğazlarında ses kitlenmelerini çözer.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "none",
      "latency": "positive_medium",
      "reliability": "positive_high"
    },
    "ai_confidence": 90,
    "risk_level": "low",
    "tags": ["audio", "service", "mmcss"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "$ServicePath = \"HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Audiosrv\"; $CurrentDeps = (Get-ItemProperty -Path $ServicePath).DependOnService; $NewDeps = $CurrentDeps | Where-Object { $_ -ne \"MMCSS\" }; Set-ItemProperty -Path $ServicePath -Name \"DependOnService\" -Value $NewDeps -Type MultiString"
      }
    ]
  },
  {
    "id": "audio_bluetooth_aac_disable",
    "title": "Bluetooth AAC Devre Dışı Bırakma ve SBC Düşük Gecikme Modu",
    "description": "Windows 11'de yüksek gecikmeli AAC kodeğini devre dışı bırakıp, düşük gecikmeli SBC/aptX kodeğine zorlar.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "none",
      "latency": "positive_high",
      "reliability": "none"
    },
    "ai_confidence": 95,
    "risk_level": "low",
    "tags": ["audio", "bluetooth", "codec", "latency"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "$BthPath = \"HKLM:\\SYSTEM\\CurrentControlSet\\Services\\BthA2dp\\Parameters\"; New-Item -Path $BthPath -Force | Out-Null; Set-ItemProperty -Path $BthPath -Name \"BluetoothAacEnable\" -Value 0 -Type DWord"
      }
    ]
  },
  {
    "id": "audio_usb_selective_suspend_disable",
    "title": "USB Ses Cihazları Güç Tasarrufu ve Asılı Kalmayı Devre Dışı Bırakma",
    "description": "USB ses cihazları için Seçmeli Askıya Alma özelliğini devre dışı bırakarak mikrofon bağlantı kopmalarını ve başlatma gecikmelerini çözer.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "none",
      "latency": "positive_low",
      "reliability": "positive_high"
    },
    "ai_confidence": 98,
    "risk_level": "low",
    "tags": ["audio", "usb", "power", "reliability"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "Get-CimInstance -ClassName MSPower_DeviceEnable -Namespace root\\wmi -ErrorAction SilentlyContinue | Where-Object {$_.InstanceName -like \"*USB*\"} | Set-CimInstance -Property @{Enable = $false}; $UsbAudioDevices = Get-ChildItem -Path \"HKLM:\\SYSTEM\\CurrentControlSet\\Enum\\USB\" -Recurse -ErrorAction SilentlyContinue | Where-Object {$_.PSChildName -eq \"Device Parameters\"}; foreach ($DevParam in $UsbAudioDevices) { Set-ItemProperty -Path $DevParam.PSPath -Name \"SelectiveSuspendEnabled\" -Value 0 -Type DWord -ErrorAction SilentlyContinue; Set-ItemProperty -Path $DevParam.PSPath -Name \"EnhancedPowerManagementEnabled\" -Value 0 -Type DWord -ErrorAction SilentlyContinue }"
      }
    ]
  },
  {
    "id": "audio_global_apo_disable",
    "title": "Ses İşleme Nesneleri ve Geliştirmeleri Küresel Olarak Kapatma",
    "description": "Yazılım tabanlı ses geliştirmelerini kapatarak (APO) oyun içi 3B konumsal ses netliğini artırır ve gecikmeyi düşürür.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "none",
      "latency": "positive_high",
      "reliability": "none"
    },
    "ai_confidence": 90,
    "risk_level": "medium",
    "tags": ["audio", "apo", "latency", "signal"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "$RenderDevices = Get-ChildItem -Path \"HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\MMDevices\\Audio\\Render\" -ErrorAction SilentlyContinue; foreach ($Dev in $RenderDevices) { $FxPath = Join-Path -Path $Dev.PSPath -ChildPath \"FxProperties\"; if (Test-Path -Path $FxPath) { Set-ItemProperty -Path $FxPath -Name \"{d3544d22-8234-428d-a514-c600771c9f77},2\" -Value 1 -Type DWord; Set-ItemProperty -Path $FxPath -Name \"Disable_Mixer_APO\" -Value 1 -Type DWord } }"
      }
    ]
  },
  {
    "id": "audio_mmcss_games_optimization",
    "title": "MMCSS Oyun Görev Profili Ses Optimizasyonu",
    "description": "Oyun görev profili için GPU önceliğini 8'e yükselterek sistem kaynakları tam yükteyken ses kesintilerini önler.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "positive_low",
      "latency": "positive_medium",
      "reliability": "positive_high"
    },
    "ai_confidence": 98,
    "risk_level": "low",
    "tags": ["audio", "mmcss", "games", "priority", "gpu"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "$GamesPath = \"HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\"; New-Item -Path $GamesPath -Force | Out-Null; Set-ItemProperty -Path $GamesPath -Name \"Priority\" -Value 2 -Type DWord; Set-ItemProperty -Path $GamesPath -Name \"Scheduling Category\" -Value \"High\" -Type String; Set-ItemProperty -Path $GamesPath -Name \"SFIO Priority\" -Value \"High\" -Type String; Set-ItemProperty -Path $GamesPath -Name \"Background Only\" -Value \"False\" -Type String; Set-ItemProperty -Path $GamesPath -Name \"GPU Priority\" -Value 8 -Type DWord"
      }
    ]
  },
  {
    "id": "audio_gpu_deep_sleep_disable",
    "title": "HDMI ve DisplayPort Ses Derin Uyku Modunu Kapatma",
    "description": "Ekran kartı ses denetleyicilerinin D3Cold derin uyku durumuna girmesini engelleyerek monitör ses uyanma gecikmelerini ortadan kaldırır.",
    "category_id": "audio",
    "is_optimized": false,
    "status": "idle",
    "impact": {
      "fps": "none",
      "latency": "positive_low",
      "reliability": "positive_high"
    },
    "ai_confidence": 95,
    "risk_level": "low",
    "tags": ["audio", "hdmi", "displayport", "power", "gpu"],
    "script_payloads": [
      {
        "type": "powershell",
        "command": "$ClassKey = \"HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e96c-e325-11ce-bfc1-08002be10318}\"; Get-ChildItem -Path $ClassKey -ErrorAction SilentlyContinue | ForEach-Object { $Desc = (Get-ItemProperty -Path $_.PSPath -Name \"DriverDesc\" -ErrorAction SilentlyContinue).DriverDesc; if ($Desc -like \"*NVIDIA*\" -or $Desc -like \"*AMD*\" -or $Desc -like \"*Display Audio*\") { Set-ItemProperty -Path $_.PSPath -Name \"EnableD3Cold\" -Value 0 -Type DWord; Set-ItemProperty -Path $_.PSPath -Name \"PowerGating\" -Value 0 -Type DWord; Set-ItemProperty -Path $_.PSPath -Name \"EnableD3\" -Value 0 -Type DWord } }"
      }
    ]
  }
];

let database = [];
try {
  database = JSON.parse(fs.readFileSync(databaseFile, 'utf8'));
} catch (err) {
  console.error("Error reading database:", err);
  process.exit(1);
}

const finalDatabase = [...database, ...newTweaks];
fs.writeFileSync(databaseFile, JSON.stringify(finalDatabase, null, 2), 'utf8');
console.log("Database updated successfully with " + newTweaks.length + " new tweaks.");
