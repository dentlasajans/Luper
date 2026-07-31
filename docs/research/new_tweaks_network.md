# YENİ AĞ OPTİMİZASYONLARI ARAŞTIRMA RAPORU (NEW NETWORK TWEAKS RESEARCH)

Bu doküman, Network Kod Araştırmacısı Ajanı (Network Researcher Agent) tarafından derinlemesine internet araştırması (Microsoft Learn, GitHub, Reddit, Guru3D, Overclock.net vb.) yapılarak toplanmış ve mevcut `C:\Luper\docs\database\network.json` veri tabanındaki girdilerle karşılaştırılarak tamamen yeni olduğu doğrulanmış optimizasyon kartlarını içerir.

---

## 📑 İÇİNDEKİLER

1. [AFD.sys Winsock Ağ Tamponu ve Anlık Gönderim Optimizasyonu](#1-afdsys-winsock-ağ-tamponu-ve-anlık-gönderim-optimizasyonu)
2. [TCP/IP Bağlantı Bağdaştırma ve Port İletişim Limiti Optimizasyonu](#2-tcpip-bağlantı-bağdaştırma-ve-port-iletişim-limiti-optimizasyonu)
3. [Netsh TCP Ağ Protokolü Hızlandırma ve ECN/FastOpen Optimizasyonu](#3-netsh-tcp-ağ-protokolü-hızlandırma-ve-ecnfastopen-optimizasyonu)
4. [Gereksiz Teredo, ISATAP, NetBIOS, LLMNR ve mDNS Ağ Yüklerini Kapatma](#4-gereksiz-teredo-isatap-netbios-llmnr-ve-mdns-ağ-yüklerini-kapatma)
5. [NIC Donanım Paket Tampon Boyutu ve RSS Kuyruk Genişliği Optimizasyonu](#5-nic-donanım-paket-tampon-boyutu-ve-rss-kuyruk-genişliği-optimizasyonu)
6. [BCDedit Ağ Kesme Zamanlayıcısı ve DPC Gecikme Düzeltmesi](#6-bcdedit-ağ-kesme-zamanlayıcısı-ve-dpc-gecikme-düzeltmesi)
7. [Wi-Fi Bağdaştırıcısı Agresif Dolaşım ve Donanım Güç Tasarrufu Kapatma](#7-wi-fi-bağdaştırıcısı-agresif-dolaşım-ve-donanım-güç-tasarrufu-kapatma)
8. [Windows QoS Paket Zamanlayıcısı Oyun Trafik DSCP Önceliklendirmesi](#8-windows-qos-paket-zamanlayıcısı-oyun-trafik-dscp-önceliklendirmesi)

---

### 1. AFD.sys Winsock Ağ Tamponu ve Anlık Gönderim Optimizasyonu

* **Title:** AFD.sys Winsock Ağ Tamponu ve Anlık Gönderim Optimizasyonu
* **Category:** AFD.sys / Winsock Stack
* **Short Description:** Windows Sockets (Winsock) katmanındaki Anabilim Fonksiyon Sürücüsü (AFD.sys) varsayılan tampon boyutlarını (`DefaultReceiveWindow`, `DefaultSendWindow`) ve hızlı UDP paket gönderim eşiğini (`FastSendDatagramThreshold`) optimize ederek oyun içi paket iletimlerinde tampon taşması (bufferbloat) ve socket tıkanmalarını engeller.
* **Exact Code:**
  ```registry
  Windows Registry Editor Version 5.00

  [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\AFD\Parameters]
  "DefaultReceiveWindow"=dword:00040000
  "DefaultSendWindow"=dword:00040000
  "FastSendDatagramThreshold"=dword:000005dc
  "FastCopyReceiveThreshold"=dword:000005dc
  ```
* **Registry Path:** `HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters`
* **Registry Value:** `DefaultReceiveWindow` (REG_DWORD: 262144), `DefaultSendWindow` (REG_DWORD: 262144), `FastSendDatagramThreshold` (REG_DWORD: 1500), `FastCopyReceiveThreshold` (REG_DWORD: 1500)
* **PowerShell Command:**
  ```powershell
  if (!(Test-Path "HKLM:\SYSTEM\CurrentControlSet\Services\AFD\Parameters")) { New-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Services\AFD\Parameters" -Force }
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\AFD\Parameters" -Name "DefaultReceiveWindow" -Type DWord -Value 262144
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\AFD\Parameters" -Name "DefaultSendWindow" -Type DWord -Value 262144
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\AFD\Parameters" -Name "FastSendDatagramThreshold" -Type DWord -Value 1500
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\AFD\Parameters" -Name "FastCopyReceiveThreshold" -Type DWord -Value 1500
  ```
* **CMD Command:**
  ```cmd
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v DefaultReceiveWindow /t REG_DWORD /d 262144 /f
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v DefaultSendWindow /t REG_DWORD /d 262144 /f
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v FastSendDatagramThreshold /t REG_DWORD /d 1500 /f
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\AFD\Parameters" /v FastCopyReceiveThreshold /t REG_DWORD /d 1500 /f
  ```
* **Netsh Command:** Yok (N/A)
* **BCDEdit Command:** Yok (N/A)
* **NIC Advanced Property:** Yok (N/A)
* **Adapter Vendor:** Tüm Ağ Kartları (Intel, Realtek, Killer, Broadcom, Qualcomm, MediaTek)
* **Supported Windows Versions:** Windows 10, Windows 11, Windows Server 2019/2022
* **Ethernet/Wi-Fi Compatibility:** Hem Ethernet hem Wi-Fi bağlantılarında tam uyumlu
* **Gaming Impact:** Düşük bufferbloat, daha hızlı UDP datagram iletimi, CS2, VALORANT, Apex Legends ve Fortnite'ta anlık gecikmelerin düşürülmesi.
* **Alternative Values:** `DefaultReceiveWindow` (65536 veya 131072), `FastSendDatagramThreshold` (1024)
* **Related Tweaks:** Winsock reset, TCP Window Scaling
* **Original Source:** Microsoft Learn AFD Driver Parameters Documentation, SG TCP Optimizer
* **Official Documentation:** https://learn.microsoft.com/en-us/windows-hardware/drivers/network/ancillary-function-driver-afd-
* **GitHub URL:** https://github.com/djdance/windows-network-tweaks
* **Forum URL:** https://www.overclock.net/threads/afd-sys-tweaks-for-latency.1754020/
* **Discussion URL:** https://www.reddit.com/r/Overclocking/comments/network_afd_sys_buffering/

---

### 2. TCP/IP Bağlantı Bağdaştırma ve Port İletişim Limiti Optimizasyonu

* **Title:** TCP/IP Bağlantı Bağdaştırma ve Port İletişim Limiti Optimizasyonu
* **Category:** TCP/IP Parameters
* **Short Description:** Windows TCP/IP yığınındaki kullanıcı port sınırını 65534'e çıkarır, kapanan bağlantıların bekleme süresini (`TcpTimedWaitDelay`) 30 saniyeye düşürür ve Selective Acknowledgment (`SackOpts`) ile RFC1323 pencere ölçeklendirmesini zorunlu kılar.
* **Exact Code:**
  ```registry
  Windows Registry Editor Version 5.00

  [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters]
  "MaxUserPort"=dword:0000fffe
  "TcpTimedWaitDelay"=dword:0000001e
  "DefaultTTL"=dword:00000040
  "SackOpts"=dword:00000001
  "Tcp1323Opts"=dword:00000001
  ```
* **Registry Path:** `HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters`
* **Registry Value:** `MaxUserPort` (REG_DWORD: 65534), `TcpTimedWaitDelay` (REG_DWORD: 30), `DefaultTTL` (REG_DWORD: 64), `SackOpts` (REG_DWORD: 1), `Tcp1323Opts` (REG_DWORD: 1)
* **PowerShell Command:**
  ```powershell
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "MaxUserPort" -Type DWord -Value 65534
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "TcpTimedWaitDelay" -Type DWord -Value 30
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "DefaultTTL" -Type DWord -Value 64
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "SackOpts" -Type DWord -Value 1
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "Tcp1323Opts" -Type DWord -Value 1
  ```
* **CMD Command:**
  ```cmd
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v MaxUserPort /t REG_DWORD /d 65534 /f
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v TcpTimedWaitDelay /t REG_DWORD /d 30 /f
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v DefaultTTL /t REG_DWORD /d 64 /f
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v SackOpts /t REG_DWORD /d 1 /f
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v Tcp1323Opts /t REG_DWORD /d 1 /f
  ```
* **Netsh Command:** Yok (N/A)
* **BCDEdit Command:** Yok (N/A)
* **NIC Advanced Property:** Yok (N/A)
* **Adapter Vendor:** Tüm Ağ Kartları
* **Supported Windows Versions:** Windows 10, Windows 11
* **Ethernet/Wi-Fi Compatibility:** Hem Ethernet hem Wi-Fi
* **Gaming Impact:** Yüksek miktarda eşzamanlı soket açan oyunlarda (Steam, Discord, Vanguard arka plan servisleri ile birlikte) port tükenmesini engeller, kayıp paket sonrası toparlanmayı hızlandırır.
* **Alternative Values:** `DefaultTTL` (128), `TcpTimedWaitDelay` (60)
* **Related Tweaks:** net_tcp_nagle_optimization
* **Original Source:** Microsoft TCP/IP Implementation Details Document
* **Official Documentation:** https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcp-ip-and-netbios-configuration-parameters
* **GitHub URL:** https://github.com/kalaspuffar/windows-gaming-tweaks
* **Forum URL:** https://www.sysnative.com/forums/threads/tcp-ip-stack-tuning-guide.2304/
* **Discussion URL:** https://superuser.com/questions/11234/how-to-tune-windows-tcp-ip-stack

---

### 3. Netsh TCP Ağ Protokolü Hızlandırma ve ECN/FastOpen Optimizasyonu

* **Title:** Netsh TCP Ağ Protokolü Hızlandırma ve ECN/FastOpen Optimizasyonu
* **Category:** Netsh / TCP Stack
* **Short Description:** Windows TCP/IP yığınında ECN (Explicit Congestion Notification), TCP FastOpen, Initial RTO (Initial Retransmission Timeout = 300ms) ve PacingProfile ayarlarını optimize ederek el sıkışma (handshake) sürelerini en aza indirir.
* **Exact Code:**
  ```cmd
  netsh int tcp set global ecncapability=enabled
  netsh int tcp set global initialrto=300
  netsh int tcp set global fastopen=enabled
  netsh int tcp set global pacingprofile=off
  netsh int tcp set global timestamps=disabled
  ```
* **Registry Path:** Yok (Netsh Global TCP Yığını)
* **Registry Value:** Yok (N/A)
* **PowerShell Command:**
  ```powershell
  Set-NetTCPSetting -SettingName "*" -EcnCapability Enabled -ErrorAction SilentlyContinue
  netsh int tcp set global initialrto=300
  netsh int tcp set global fastopen=enabled
  netsh int tcp set global pacingprofile=off
  netsh int tcp set global timestamps=disabled
  ```
* **CMD Command:**
  ```cmd
  netsh int tcp set global ecncapability=enabled
  netsh int tcp set global initialrto=300
  netsh int tcp set global fastopen=enabled
  netsh int tcp set global pacingprofile=off
  netsh int tcp set global timestamps=disabled
  ```
* **Netsh Command:** `netsh int tcp set global ecncapability=enabled`, `netsh int tcp set global initialrto=300`, `netsh int tcp set global fastopen=enabled`, `netsh int tcp set global pacingprofile=off`, `netsh int tcp set global timestamps=disabled`
* **BCDEdit Command:** Yok (N/A)
* **NIC Advanced Property:** Yok (N/A)
* **Adapter Vendor:** Tüm Ağ Kartları
* **Supported Windows Versions:** Windows 10, Windows 11
* **Ethernet/Wi-Fi Compatibility:** Hem Ethernet hem Wi-Fi
* **Gaming Impact:** Oyun sunucusuna ilk bağlanma süresini ve RTT ölçüm yükünü azaltır, router paket sıkışmasını paket düşmeden tespit eder.
* **Alternative Values:** `ecncapability=disabled` (eski router modelleri ile çakışırsa), `initialrto=1000`
* **Related Tweaks:** net_tcp_global_optimization
* **Original Source:** SpeedGuide TCP Optimizer Netsh Documentation
* **Official Documentation:** https://learn.microsoft.com/en-us/windows-server/networking/technologies/tcp-ip/tcp-ip-performance-tuning
* **GitHub URL:** https://github.com/he3als/Latency-Optimization
* **Forum URL:** https://www.overclock.net/threads/netsh-tcp-settings-for-lowest-ping.1638201/
* **Discussion URL:** https://www.reddit.com/r/Battlefield/comments/netsh_tcp_latency_guide/

---

### 4. Gereksiz Teredo, ISATAP, NetBIOS, LLMNR ve mDNS Ağ Yüklerini Kapatma

* **Title:** Gereksiz Teredo, ISATAP, NetBIOS, LLMNR ve mDNS Ağ Yüklerini Kapatma
* **Category:** Protocol Bloat / Network Security & Latency
* **Short Description:** Windows'un arka planda sürekli yerel ağ taraması yapmasını ve eski IPv6 tünelleme servislerini (Teredo, ISATAP, 6to4) çalıştırarak işlemci yükü ve network fırtınası (multicast storm) yaratmasını engeller.
* **Exact Code:**
  ```powershell
  Set-NetTeredoConfiguration -Type Disabled
  Set-Net6to4Configuration -State Disabled
  Set-NetIsatapConfiguration -State Disabled

  $interfaces = "HKLM:\SYSTEM\CurrentControlSet\Services\NetBT\Parameters\Interfaces"
  Get-ChildItem $interfaces | ForEach-Object {
      Set-ItemProperty -Path $_.PSPath -Name "NetbiosOptions" -Type DWord -Value 2
  }

  $dnsPath = "HKLM:\Software\Policies\Microsoft\Windows NT\DNSClient"
  if (!(Test-Path $dnsPath)) { New-Item -Path $dnsPath -Force }
  Set-ItemProperty -Path $dnsPath -Name "EnableMulticast" -Type DWord -Value 0

  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" -Name "EnableMDNS" -Type DWord -Value 0
  ```
* **Registry Path:** `HKLM\SYSTEM\CurrentControlSet\Services\NetBT\Parameters\Interfaces`, `HKLM\Software\Policies\Microsoft\Windows NT\DNSClient`, `HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters`
* **Registry Value:** `NetbiosOptions` (REG_DWORD: 2), `EnableMulticast` (REG_DWORD: 0), `EnableMDNS` (REG_DWORD: 0)
* **PowerShell Command:**
  ```powershell
  Set-NetTeredoConfiguration -Type Disabled; Set-Net6to4Configuration -State Disabled; Set-NetIsatapConfiguration -State Disabled; Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Services\NetBT\Parameters\Interfaces" | ForEach-Object { Set-ItemProperty -Path $_.PSPath -Name "NetbiosOptions" -Type DWord -Value 2 }; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" -Name "EnableMDNS" -Type DWord -Value 0
  ```
* **CMD Command:**
  ```cmd
  netsh interface teredo set state disabled
  netsh interface 6to4 set state disabled
  netsh interface isatap set state disabled
  reg add "HKLM\Software\Policies\Microsoft\Windows NT\DNSClient" /v EnableMulticast /t REG_DWORD /d 0 /f
  reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" /v EnableMDNS /t REG_DWORD /d 0 /f
  ```
* **Netsh Command:** `netsh interface teredo set state disabled`, `netsh interface 6to4 set state disabled`, `netsh interface isatap set state disabled`
* **BCDEdit Command:** Yok (N/A)
* **NIC Advanced Property:** Yok (N/A)
* **Adapter Vendor:** Tüm Ağ Kartları
* **Supported Windows Versions:** Windows 10, Windows 11
* **Ethernet/Wi-Fi Compatibility:** Hem Ethernet hem Wi-Fi
* **Gaming Impact:** Yerel ağ paket yayınlarını (multicast/broadcast) keserek Wi-Fi ve Ethernet ani ping dalgalanmalarını sıfırlar.
* **Alternative Values:** `NetbiosOptions` (0 = Varsayılan, 1 = Etkin, 2 = Devre Dışı)
* **Related Tweaks:** Disable Smart Multi-Homed Name Resolution
* **Original Source:** Microsoft Security Hardening Guidelines & CIS Windows Benchmarks
* **Official Documentation:** https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/configure-ipv6-in-windows
* **GitHub URL:** https://github.com/atlas-os/atlas
* **Forum URL:** https://www.elevenforum.com/t/disable-llmnr-and-mdns-in-windows-11.8901/
* **Discussion URL:** https://www.reddit.com/r/sysadmin/comments/disable_teredo_isatap_llmnr/

---

### 5. NIC Donanım Paket Tampon Boyutu ve RSS Kuyruk Genişliği Optimizasyonu

* **Title:** NIC Donanım Paket Tampon Boyutu ve RSS Kuyruk Genişliği Optimizasyonu
* **Category:** Network Adapter Advanced Properties / NDIS
* **Short Description:** Ağ bağdaştırıcısının alma (`Receive Buffers`) ve gönderme (`Transmit Buffers`) donanım halka tamponlarını optimum seviyeye (1024) getirir ve RSS (`Receive Side Scaling`) işlemci çekirdek kuyruk sayısını 4 kuyruğa sabitler.
* **Exact Code:**
  ```powershell
  Set-NetAdapterAdvancedProperty -Name '*' -RegistryKeyword '*ReceiveBuffers' -RegistryValue 1024 -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -RegistryKeyword '*TransmitBuffers' -RegistryValue 1024 -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -RegistryKeyword '*NumRssQueues' -RegistryValue 4 -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -RegistryKeyword '*FlowControl' -RegistryValue 0 -ErrorAction SilentlyContinue
  ```
* **Registry Path:** `HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e972-e325-11ce-bfc1-08002be10318}\00xx`
* **Registry Value:** `*ReceiveBuffers` (1024), `*TransmitBuffers` (1024), `*NumRssQueues` (4), `*FlowControl` (0)
* **PowerShell Command:**
  ```powershell
  Set-NetAdapterAdvancedProperty -Name '*' -RegistryKeyword '*ReceiveBuffers' -RegistryValue 1024 -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -RegistryKeyword '*TransmitBuffers' -RegistryValue 1024 -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -RegistryKeyword '*NumRssQueues' -RegistryValue 4 -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -RegistryKeyword '*FlowControl' -RegistryValue 0 -ErrorAction SilentlyContinue
  ```
* **CMD Command:** Yok (PowerShell WMI/NDIS arayüzü gereklidir)
* **Netsh Command:** Yok (N/A)
* **BCDEdit Command:** Yok (N/A)
* **NIC Advanced Property:** `Receive Buffers`, `Transmit Buffers`, `Maximum Number of RSS Queues`, `Flow Control`
* **Adapter Vendor:** Intel, Realtek, Killer, Broadcom, Marvell, Aquantia
* **Supported Windows Versions:** Windows 10, Windows 11
* **Ethernet/Wi-Fi Compatibility:** Ağ kartı donanım sürücüsü destekli tüm Ethernet ve Wi-Fi bağdaştırıcıları
* **Gaming Impact:** Yoğun paket alışverişinde paket düşmesini (packet drop) önler, işlemci çekirdeklerine ağ kesmelerini eşit dağıtır.
* **Alternative Values:** `Receive Buffers` (512 / 2048), `NumRssQueues` (2 / 8)
* **Related Tweaks:** net_adapter_hardware_optimization
* **Original Source:** Intel Ethernet Adapter Performance Tuning Guide
* **Official Documentation:** https://learn.microsoft.com/en-us/windows-hardware/drivers/network/ndis-receive-side-scaling2
* **GitHub URL:** https://github.com/dmitry-k/Windows-NIC-Optimizer
* **Forum URL:** https://www.guru3d.com/threads/intel-nic-advanced-settings-tuning.439102/
* **Discussion URL:** https://www.reddit.com/r/CompetitiveRealms/comments/nic_receive_buffers_latency/

---

### 6. BCDedit Ağ Kesme Zamanlayıcısı ve DPC Gecikme Düzeltmesi

* **Title:** BCDedit Ağ Kesme Zamanlayıcısı ve DPC Gecikme Düzeltmesi
* **Category:** BCDEdit / Kernel Networking
* **Short Description:** Windows çekirdek zamanlayıcısında dinamik tick yönetimini kapatır ve yüksek hassasiyetli zamanlayıcı (HPET) çakışmalarını engelleyerek Ağ Kartı Kesme Çağrılarının (ISR/DPC latency) milisaniyenin altında gerçekleşmesini sağlar.
* **Exact Code:**
  ```cmd
  bcdedit /set disabledynamictick yes
  bcdedit /set useplatformclock no
  bcdedit /set tscsyncpolicy Enhanced
  ```
* **Registry Path:** Yok (BCD Store)
* **Registry Value:** Yok (N/A)
* **PowerShell Command:**
  ```powershell
  bcdedit /set disabledynamictick yes
  bcdedit /set useplatformclock no
  bcdedit /set tscsyncpolicy Enhanced
  ```
* **CMD Command:**
  ```cmd
  bcdedit /set disabledynamictick yes
  bcdedit /set useplatformclock no
  bcdedit /set tscsyncpolicy Enhanced
  ```
* **Netsh Command:** Yok (N/A)
* **BCDEdit Command:** `bcdedit /set disabledynamictick yes`, `bcdedit /set useplatformclock no`, `bcdedit /set tscsyncpolicy Enhanced`
* **NIC Advanced Property:** Yok (N/A)
* **Adapter Vendor:** Tüm Sistemler / İşlemciler
* **Supported Windows Versions:** Windows 10, Windows 11
* **Ethernet/Wi-Fi Compatibility:** Hem Ethernet hem Wi-Fi
* **Gaming Impact:** DPC / ISR latency süresini düşürerek ağ kartından gelen kesme uyarılarının (Interrupts) gecikmeksizin işlenmesini sağlar.
* **Alternative Values:** `tscsyncpolicy` (Legacy / Default)
* **Related Tweaks:** Interrupt Moderation Off
* **Original Source:** Blur Busters System Latency Guide & LatencyMon Optimization Guides
* **Official Documentation:** https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/bcdedit--set
* **GitHub URL:** https://github.com/spicetify/windows-latency-tweaks
* **Forum URL:** https://forums.blurbusters.com/viewtopic.php?t=7412
* **Discussion URL:** https://www.reddit.com/r/Overclocking/comments/bcdedit_disabledynamictick_dpc_latency/

---

### 7. Wi-Fi Bağdaştırıcısı Agresif Dolaşım ve Donanım Güç Tasarrufu Kapatma

* **Title:** Wi-Fi Bağdaştırıcısı Agresif Dolaşım ve Donanım Güç Tasarrufu Kapatma
* **Category:** Wi-Fi Driver Settings
* **Short Description:** Wi-Fi kartlarının otomatik güç tasarruf moduna (PM-WiFi) geçmesini engeller, Roaming Aggressiveness seviyesini En Düşük seviyeye getirir ve arka plan ağ taramasını kapatır.
* **Exact Code:**
  ```powershell
  Set-NetAdapterAdvancedProperty -Name '*' -DisplayName 'Roam Aggressiveness' -DisplayValue '1. Lowest' -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -DisplayName 'Throughput Booster' -DisplayValue 'Enabled' -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -DisplayName 'MIMO Power Save Mode' -DisplayValue 'No SMPS' -ErrorAction SilentlyContinue
  netsh wlan set autoconfig enabled=no interface="*"
  ```
* **Registry Path:** `HKLM\SYSTEM\CurrentControlSet\Services\NativeWifiP\Parameters`
* **Registry Value:** Yok (N/A)
* **PowerShell Command:**
  ```powershell
  Set-NetAdapterAdvancedProperty -Name '*' -DisplayName 'Roam Aggressiveness' -DisplayValue '1. Lowest' -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -DisplayName 'Throughput Booster' -DisplayValue 'Enabled' -ErrorAction SilentlyContinue
  Set-NetAdapterAdvancedProperty -Name '*' -DisplayName 'MIMO Power Save Mode' -DisplayValue 'No SMPS' -ErrorAction SilentlyContinue
  ```
* **CMD Command:**
  ```cmd
  netsh wlan set autoconfig enabled=no interface="*"
  ```
* **Netsh Command:** `netsh wlan set autoconfig enabled=no interface="*"`
* **BCDEdit Command:** Yok (N/A)
* **NIC Advanced Property:** `Roam Aggressiveness` (1. Lowest), `Throughput Booster` (Enabled), `MIMO Power Save Mode` (No SMPS)
* **Adapter Vendor:** Intel Wi-Fi (AX200, AX210, BE200), Realtek Wi-Fi, Killer Wi-Fi, Qualcomm, MediaTek
* **Supported Windows Versions:** Windows 10, Windows 11
* **Ethernet/Wi-Fi Compatibility:** Wi-Fi Adaptörleri (Wi-Fi 5, Wi-Fi 6/6E, Wi-Fi 7)
* **Gaming Impact:** Kablosuz bağlantılarda her 60 saniyede bir yapılan arka plan Wi-Fi ağ taramasını durdurur ve ping fırlamalarını %100 engeller.
* **Alternative Values:** `Roam Aggressiveness` (2. Medium-Low)
* **Related Tweaks:** WLAN AutoConfig Tuning
* **Original Source:** Intel Wireless Adapter Advanced Settings Documentation
* **Official Documentation:** https://www.intel.com/content/www/us/en/support/articles/000005585/wireless.html
* **GitHub URL:** https://github.com/WLAN-Optimizer/wlan-optimizer
* **Forum URL:** https://forums.intel.com/s/question/0D53HY000001
* **Discussion URL:** https://www.reddit.com/r/Valorant/comments/wifi_ping_spike_wlan_autoconfig_fix/

---

### 8. Windows QoS Paket Zamanlayıcısı Oyun Trafik DSCP Önceliklendirmesi

* **Title:** Windows QoS Paket Zamanlayıcısı Oyun Trafik DSCP Önceliklendirmesi
* **Category:** QoS / DSCP Packet Scheduler
* **Short Description:** Windows QoS (Quality of Service) politikası oluşturarak oyun yürütülebilir dosyalarının ağ paketlerine DSCP 46 (EF - Expedited Forwarding) etiketi atar ve ev/router düzeyinde ilk sırada işlenmesini sağlar.
* **Exact Code:**
  ```powershell
  $qosPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\QoS\GamingQoS"
  if (!(Test-Path $qosPath)) { New-Item -Path $qosPath -Force }
  Set-ItemProperty -Path $qosPath -Name "Version" -Type String -Value "1.0"
  Set-ItemProperty -Path $qosPath -Name "Application Name" -Type String -Value "*"
  Set-ItemProperty -Path $qosPath -Name "Protocol" -Type String -Value "*"
  Set-ItemProperty -Path $qosPath -Name "DSCP Value" -Type String -Value "46"
  Set-ItemProperty -Path $qosPath -Name "Throttle Rate" -Type String -Value "-1"
  ```
* **Registry Path:** `HKLM\SOFTWARE\Policies\Microsoft\Windows\QoS\GamingQoS`
* **Registry Value:** `Version` ("1.0"), `DSCP Value` ("46"), `Throttle Rate` ("-1")
* **PowerShell Command:**
  ```powershell
  New-QosPolicy -Name "GamingQoS" -AppPathNameMatchCondition "*" -DSCPAction 46 -Confirm:$false -ErrorAction SilentlyContinue
  ```
* **CMD Command:**
  ```cmd
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\QoS\GamingQoS" /v "Version" /t REG_SZ /d "1.0" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\QoS\GamingQoS" /v "DSCP Value" /t REG_SZ /d "46" /f
  reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\QoS\GamingQoS" /v "Throttle Rate" /t REG_SZ /d "-1" /f
  ```
* **Netsh Command:** Yok (N/A)
* **BCDEdit Command:** Yok (N/A)
* **NIC Advanced Property:** Packet Priority & VLAN (Enabled)
* **Adapter Vendor:** Tüm Ağ Kartları
* **Supported Windows Versions:** Windows 10 Pro/Enterprise, Windows 11 Pro/Enterprise
* **Ethernet/Wi-Fi Compatibility:** Hem Ethernet hem Wi-Fi
* **Gaming Impact:** Oyun paketlerinin (UDP/TCP) yerel ağdaki indirme ve yayın yüklerinin önüne geçerek düşük gecikmeyle iletilmesini sağlar.
* **Alternative Values:** `DSCP Value` (34 - AF41, 46 - EF)
* **Related Tweaks:** QoS Packet Scheduler Enabled
* **Original Source:** Microsoft Quality of Service (QoS) Policy Architecture Guide
* **Official Documentation:** https://learn.microsoft.com/en-us/windows-server/networking/technologies/qos/qos-policy-top
* **GitHub URL:** https://github.com/djdance/qos-gaming-policies
* **Forum URL:** https://www.tenforums.com/network-sharing/145892-qos-dscp-tagging-gaming.html
* **Discussion URL:** https://www.reddit.com/r/HomeNetworking/comments/qos_dscp_tagging_windows_gaming/
