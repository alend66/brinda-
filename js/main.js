/**
 * BRINDA T B // CYBER DEFENSE & INVESTIGATION OPERATIVE
 * Interactive Engine & Anime Effects
 * Language: English
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. AUDIO SYNTHESIZER (Web Audio API) ---
  let audioContext = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
  }

  function playCyberSound(type) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioContext) return;
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      const now = audioContext.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.04);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'scan') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.15);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'alert') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'triage') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn('Audio synthesis not supported or blocked:', e);
    }
  }

  // Audio Toggle Button
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      initAudio();
      audioToggleBtn.classList.toggle('active', soundEnabled);
      const icon = audioToggleBtn.querySelector('.audio-status-text');
      if (icon) {
        icon.textContent = soundEnabled ? 'SFX: ON' : 'SFX: OFF';
      }
      if (soundEnabled) playCyberSound('click');
      showToast(soundEnabled ? 'Audio Telemetry Online' : 'Audio Telemetry Muted');
    });
  }

  // Scanline Toggle Button
  const scanlinesToggleBtn = document.getElementById('scanlinesToggleBtn');
  const scanlineOverlay = document.getElementById('scanlineOverlay');
  if (scanlinesToggleBtn && scanlineOverlay) {
    scanlinesToggleBtn.addEventListener('click', () => {
      const isDisabled = scanlineOverlay.classList.toggle('disabled');
      scanlinesToggleBtn.classList.toggle('active', !isDisabled);
      const text = scanlinesToggleBtn.querySelector('.scan-status-text');
      if (text) {
        text.textContent = isDisabled ? 'HUD: FLAT' : 'HUD: CRT';
      }
      playCyberSound('click');
      showToast(isDisabled ? 'CRT Scanlines Disabled' : 'CRT Scanlines Active');
    });
  }

  // Add sound triggers on buttons and interactive items
  document.querySelectorAll('a, button, .interactive-btn').forEach(elem => {
    elem.addEventListener('mouseenter', () => playCyberSound('hover'));
    elem.addEventListener('click', () => playCyberSound('click'));
  });

  // --- 2. PARTICLES & CYBER MATRIX CANVAS ---
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

    class CyberParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.6 ? '#00f0ff' : Math.random() > 0.5 ? '#ff007f' : '#9d4edd';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new CyberParticle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00f0ff';
            ctx.globalAlpha = (1 - dist / 110) * 0.12;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --- 3. TYPING EFFECT FOR HERO SUBTITLE ---
  const typeTarget = document.getElementById('typewriter-text');
  if (typeTarget) {
    const roles = [
      'SOC ANALYST // SECURITY MONITORING',
      'DIGITAL FORENSICS INVESTIGATOR',
      'ETHICAL DEFENDER & THREAT HUNTER',
      'CRIMINOLOGIST // CYBERCRIME PROFILER'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeLoop() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typeTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 40;
      } else {
        typeTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeDelay = 2000; // pause at peak
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeDelay = 400;
      }
      setTimeout(typeLoop, typeDelay);
    }
    typeLoop();
  }

  // --- 4. HEADER SCROLL & MOBILE DRAWER ---
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  if (mobileToggle && mobileNavDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('open');
      playCyberSound('click');
    });
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
      });
    });
  }

  // --- 5. SKILL MATRIX FILTERING ---
  const filterButtons = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-hud-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetCategory = btn.getAttribute('data-category');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
      playCyberSound('scan');
    });
  });

  // --- 6. SPLUNK LOG QUERY SIMULATOR (PROJECT 1) ---
  const splunkSimButtons = document.querySelectorAll('.sim-btn-splunk');
  const splunkConsoleOutput = document.getElementById('splunkConsoleOutput');

  const splunkQueries = {
    ssh_failed: `[SPLUNK SEARCH: index=security sourcetype=syslog "Failed password"]
> Parsing 14,289 events across cluster...
[ALERT // HIGH] Multiple authentication failures detected!
Timestamp: 2026-10-27 10:14:02 UTC
Target: SSH Daemon (Port 22) - Host: SRV-APP-PROD-01
Attacking IP: 185.220.101.5 [TOR Exit Node / Netherlands]
Failures in 60s: 84 attempts (Brute-Force Dictionary Signature)
Pattern: Repeated attempts for users root, admin, test, deploy
ACTION TAKEN: Automated iptables null-route applied for IP 185.220.101.5`,

    port_scan: `[SPLUNK SEARCH: index=firewall action=blocked | stats count by src_ip]
> Scanning network ingress logs (Last 15 minutes)...
[ALERT // MEDIUM] Horizontal port scan reconnaissance detected.
Source IP: 45.133.1.82 -> Target Subnet: 10.0.4.0/24
Ports Probed: 21 (FTP), 22 (SSH), 23 (Telnet), 80, 443, 3389 (RDP)
Packets Flagged: SYN packets with zero ACK flag
Threat Level: RECONNAISSANCE DETECTED
ACTION TAKEN: Rate-limiting engaged; IP blacklisted in edge firewall ruleset.`,

    malicious_ip: `[SPLUNK SEARCH: index=proxy url="*" | lookup threat_intel_feed domain]
> Threat Intel Feeds Correlated: AlienVault OTX, AbuseIPDB, VirusTotal
[ALERT // CRITICAL] Outbound connection to known C2 Beacon!
Endpoint: WORKSTATION-FINANCE-04 (IP: 10.0.2.14)
Destination Domain: c2-command-relay.darknet.top
Port: 8443 (Encrypted TLS Tunnel with untrusted self-signed cert)
IOC Match: Lumma Stealer C2 infrastructure signature
ACTION TAKEN: Host WORKSTATION-FINANCE-04 isolated from VLAN; forensic dump initiated.`,

    exfil_data: `[SPLUNK SEARCH: index=network bytes_out > 500000000 by src_ip, dest_ip]
> Evaluating anomaly threshold (> 500 MB outbound in < 5 mins)...
[ALERT // WARNING] Unusual large data transfer detected.
Source: DB-ARCHIVE-02 (10.0.1.18) -> Destination: 198.51.100.89
Volume: 1.28 GB compressed archive via SCP
Status: Flagged for compliance review; SOC Analyst investigating authorization ticket.`
  };

  splunkSimButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      splunkSimButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const queryKey = btn.getAttribute('data-query');
      if (splunkConsoleOutput && splunkQueries[queryKey]) {
        splunkConsoleOutput.innerHTML = `<span style="color:#00f0ff;">Executing Splunk SPL query...</span><br><br>` + 
          escapeHtml(splunkQueries[queryKey]).replace(/\n/g, '<br>');
        playCyberSound('scan');
      }
    });
  });

  // --- 7. NMAP RECON SIMULATOR (PROJECT 2) ---
  const nmapSimButtons = document.querySelectorAll('.sim-btn-nmap');
  const nmapConsoleOutput = document.getElementById('nmapConsoleOutput');

  const nmapScans = {
    syn_scan: `$ nmap -sS -T4 192.168.1.105
Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-27 10:14 IST
Nmap scan report for target-host.lan (192.168.1.105)
Host is up (0.00042s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql
8080/tcp open  http-proxy
MAC Address: 08:00:27:E4:91:3B (Oracle VirtualBox virtual NIC)
Nmap done: 1 IP address (1 host up) scanned in 1.48 seconds`,

    version_scan: `$ nmap -sV -sC -p 22,80,443,3306,8080 192.168.1.105
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 71:4a:d9:e3:12:44:a9:6b:31:02:44 (ECDSA)
80/tcp   open  http    Apache httpd 2.4.52 ((Ubuntu))
|_http-server-header: Apache/2.4.52 (Ubuntu)
|_http-title: Corporate Security Portal - Internal Gateway
443/tcp  open  ssl/http Apache httpd 2.4.52
3306/tcp open  mysql   MySQL 8.0.35-0ubuntu0.22.04.1
8080/tcp open  http    Apache Tomcat 9.0.58
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`,

    vuln_scan: `$ nmap --script vuln -p 80,8080 192.168.1.105
PORT     STATE SERVICE
80/tcp   open  http
| http-csrf: 
|_  Portal login form lacking anti-CSRF token verification
| http-dombased-xss: 
|_  Vulnerable parameter found in /search.php?query=
8080/tcp open  http-proxy
| http-cve2020-1938:
|_  Tomcat AJP connector misconfiguration (CVE-2020-1938 Ghostcat) mitigated.
ANALYSIS: Recommended disabling exposed Apache Tomcat test endpoints and hardening MySQL port 3306 bind address.`,

    os_scan: `$ nmap -O --osscan-guess 192.168.1.105
Device type: general purpose
Running: Linux 5.X
OS CPE: cpe:/o:linux:linux_kernel:5.15
OS details: Linux 5.4 - 5.19
Network Distance: 1 hop
TCP Sequence Prediction: Difficulty=259 (Good luck!)
IP ID Sequence Generation: Incremental`
  };

  nmapSimButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      nmapSimButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scanKey = btn.getAttribute('data-scan');
      if (nmapConsoleOutput && nmapScans[scanKey]) {
        nmapConsoleOutput.innerHTML = `<span style="color:#00ffa3;">Executing Nmap command in lab environment...</span><br><br>` + 
          escapeHtml(nmapScans[scanKey]).replace(/\n/g, '<br>');
        playCyberSound('scan');
      }
    });
  });

  // Helper escape HTML
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- 8. LIVE SOC RADAR CANVAS & THREAT SIMULATOR ---
  const radarCanvas = document.getElementById('radarCanvas');
  if (radarCanvas) {
    const rCtx = radarCanvas.getContext('2d');
    const rSize = 280;
    radarCanvas.width = rSize;
    radarCanvas.height = rSize;
    const centerX = rSize / 2;
    const centerY = rSize / 2;
    const maxRadius = rSize / 2 - 10;
    let angle = 0;

    const blips = [
      { r: 45, theta: 0.8, color: '#ff2a5f', life: 1, label: 'SSH Brute-Force' },
      { r: 85, theta: 2.3, color: '#ffb703', life: 1, label: 'Port Sweep' },
      { r: 105, theta: 4.1, color: '#00f0ff', life: 1, label: 'Known DNS Beacon' },
      { r: 65, theta: 5.4, color: '#ff2a5f', life: 1, label: 'Ransomware IOC' }
    ];

    function drawRadar() {
      rCtx.fillStyle = 'rgba(5, 7, 14, 0.12)';
      rCtx.fillRect(0, 0, rSize, rSize);

      // Concentric circles
      rCtx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      rCtx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        rCtx.beginPath();
        rCtx.arc(centerX, centerY, (maxRadius / 4) * i, 0, Math.PI * 2);
        rCtx.stroke();
      }

      // Crosshairs
      rCtx.beginPath();
      rCtx.moveTo(centerX, 10);
      rCtx.lineTo(centerX, rSize - 10);
      rCtx.moveTo(10, centerY);
      rCtx.lineTo(rSize - 10, centerY);
      rCtx.stroke();

      // Sweeping line
      const sweepX = centerX + Math.cos(angle) * maxRadius;
      const sweepY = centerY + Math.sin(angle) * maxRadius;
      rCtx.beginPath();
      rCtx.moveTo(centerX, centerY);
      rCtx.lineTo(sweepX, sweepY);
      rCtx.strokeStyle = '#00f0ff';
      rCtx.lineWidth = 2;
      rCtx.stroke();

      // Sweep gradient fan
      const gradient = rCtx.createRadialGradient(centerX, centerY, 5, centerX, centerY, maxRadius);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
      rCtx.fillStyle = gradient;
      rCtx.beginPath();
      rCtx.moveTo(centerX, centerY);
      rCtx.arc(centerX, centerY, maxRadius, angle - 0.45, angle);
      rCtx.closePath();
      rCtx.fill();

      // Blips
      blips.forEach(blip => {
        const bx = centerX + Math.cos(blip.theta) * blip.r;
        const by = centerY + Math.sin(blip.theta) * blip.r;

        // Check if sweep passes blip
        const diff = Math.abs(angle - blip.theta);
        if (diff < 0.08) {
          blip.life = 1;
        }

        if (blip.life > 0.05) {
          rCtx.beginPath();
          rCtx.arc(bx, by, 4, 0, Math.PI * 2);
          rCtx.fillStyle = blip.color;
          rCtx.globalAlpha = blip.life;
          rCtx.shadowColor = blip.color;
          rCtx.shadowBlur = 10;
          rCtx.fill();
          rCtx.shadowBlur = 0;
          rCtx.globalAlpha = 1;
          blip.life -= 0.003;
        }
      });

      angle += 0.025;
      if (angle > Math.PI * 2) angle = 0;

      requestAnimationFrame(drawRadar);
    }
    drawRadar();
  }

  // Triage Action Handlers
  document.querySelectorAll('.triage-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('.alert-row');
      if (row) {
        const action = e.target.getAttribute('data-action') || 'Threat Neutralized';
        btn.textContent = 'CONTAINED';
        btn.style.background = '#00ffa3';
        btn.style.borderColor = '#00ffa3';
        btn.style.color = '#05070e';
        row.style.borderLeftColor = '#00ffa3';
        playCyberSound('triage');
        showToast(`Incident Contained: ${action} applied successfully.`);
      }
    });
  });

  // --- 9. INTERACTIVE CYBER TERMINAL (BRINDA-OS) ---
  const termInput = document.getElementById('termInput');
  const termBody = document.getElementById('terminalBody');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

  const termHelp = `
<span class="term-cyan">AVAILABLE COMMANDS:</span>
  <span class="term-green">help</span>       - Displays all terminal commands
  <span class="term-green">whoami</span>     - Operative identification & background dossier
  <span class="term-green">skills</span>     - Core technical & investigative cybersecurity capabilities
  <span class="term-green">projects</span>   - Declassified security monitoring & network scanning operations
  <span class="term-green">education</span>  - Academic & Certified Ethical Hacking credentials
  <span class="term-green">resume</span>     - Official attached PDF resume & ATS document
  <span class="term-green">contact</span>    - Direct encrypted comms channels
  <span class="term-green">scan</span>       - Run automated perimeter vulnerability check
  <span class="term-green">forensics</span>  - View digital evidence & criminology integration
  <span class="term-green">clear</span>      - Clear terminal screen
`;

  const termWhoami = `
<span class="term-magenta">OPERATIVE PROFILE: BRINDA T B</span>
========================================
<span class="term-cyan">Designation:</span> Cyber Security Operative & Digital Forensics Enthusiast
<span class="term-cyan">Location:</span> Thrissur, Kerala, India
<span class="term-cyan">Background:</span> Bachelor's in Criminology and Police Science
<span class="term-cyan">Specialization:</span> Advanced Cyber Defence & Certified Ethical Hacking (RedTeam Hacker Academy)
<span class="term-cyan">Core Philosophy:</span> Bridging behavioural criminal science with high-tech SOC monitoring and threat mitigation.
`;

  const termSkills = `
<span class="term-cyan">SECURITY CAPABILITIES MATRIX:</span>
--------------------------------------------------
[✓] Cyber Security Fundamentals & Defense-in-Depth
[✓] Log Analysis & Security Monitoring (Splunk Enterprise)
[✓] Networking Basics (TCP/IP, DNS, HTTP, Port Protocols)
[✓] SIEM Basics & Incident Alert Triaging
[✓] Windows & Linux Operating Environments
[✓] Digital Forensics Concepts & Evidence Integrity
[✓] Criminology, Behavioral Profiling & Crime Investigation
[✓] Soft Skills: Analytical Thinking, Investigation & Detailed Reporting
`;

  const termProjects = `
<span class="term-yellow">DECLASSIFIED MISSIONS:</span>
--------------------------------------------------
<span class="term-cyan">[01] Log Analysis using Splunk Enterprise:</span>
     Monitored enterprise logs, engineered SPL queries, identified brute-force
     anomalies, and triaged critical security incidents.

<span class="term-cyan">[02] Network Scanning & Service Enumeration using Nmap:</span>
     Defensive reconnaissance, port discovery, banner enumeration, and vulnerability
     surface mapping across simulated lab environments.
`;

  const termEducation = `
<span class="term-cyan">ACADEMIC & PROFESSIONAL CREDENTIALS:</span>
--------------------------------------------------
1. <span class="term-magenta">Advanced Diploma in Cyber Defence & Certified Ethical Hacking</span>
   Institution: RedTeam Hacker Academy, Thrissur (Pursuing)

2. <span class="term-green">Bachelor of Arts in Criminology and Police Science</span>
   Institution: St. Thomas' College (Autonomous), Thrissur
`;

  const termContact = `
<span class="term-cyan">OPERATIVE COMMS CHANNELS:</span>
--------------------------------------------------
<span class="term-yellow">Email:</span>    brindababu2435@gmail.com
<span class="term-yellow">Phone:</span>    +91 9847602435
<span class="term-yellow">LinkedIn:</span> linkedin.com/in/brinda-t-b
<span class="term-yellow">Location:</span> Thrissur, Kerala, India
`;

  const termForensics = `
<span class="term-cyan">CRIMINOLOGY & DIGITAL FORENSICS NEXUS:</span>
--------------------------------------------------
Dual-disciplinary advantage: Combining criminal motive analysis, chain-of-custody
preservation, and investigative interviews with memory dump analysis, log correlation,
and network packet forensics to build air-tight cyber incident reports.
`;

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    printLine(`<span class="term-prompt">operative@brinda-os:~$</span> ${escapeHtml(rawCmd)}`);

    if (!cmd) return;

    switch (cmd) {
      case 'help':
        printLine(termHelp);
        break;
      case 'whoami':
        printLine(termWhoami);
        break;
      case 'skills':
        printLine(termSkills);
        break;
      case 'projects':
        printLine(termProjects);
        break;
      case 'education':
        printLine(termEducation);
        break;
      case 'resume':
      case 'cv':
        playCyberSound('click');
        printLine(`
<span class="term-cyan">OFFICIAL ATTACHED RESUME DOSSIER:</span>
--------------------------------------------------
<span class="term-green">[✓] PDF File Attached:</span> <a href="assets/Brinda_TB_Resume.pdf" download="Brinda_TB_Resume.pdf" style="color:#00ffa3; text-decoration:underline;">assets/Brinda_TB_Resume.pdf</a>
<span class="term-green">[✓] Standalone ATS Document:</span> <a href="resume.html" target="_blank" style="color:#00f0ff; text-decoration:underline;">resume.html (Open Full Page)</a>
<span class="term-dim">Launching interactive resume viewer...</span>
`);
        setTimeout(() => openResume(), 400);
        break;
      case 'contact':
        printLine(termContact);
        break;
      case 'forensics':
        printLine(termForensics);
        break;
      case 'scan':
        playCyberSound('scan');
        printLine(`<span class="term-cyan">Initiating perimeter vulnerability scan...</span>`);
        setTimeout(() => {
          printLine(`<span class="term-green">[SUCCESS] Local interfaces monitored: eth0, lo, tun0. Firewalls armed. Zero intrusion vectors open.</span>`);
        }, 600);
        break;
      case 'clear':
        termBody.innerHTML = '';
        return;
      default:
        printLine(`<span class="term-magenta">Command not recognized: '${escapeHtml(cmd)}'. Type '<span class="term-cyan">help</span>' for available commands.</span>`);
        break;
    }

    playCyberSound('click');
    termBody.scrollTop = termBody.scrollHeight;
  }

  function printLine(content) {
    const line = document.createElement('div');
    line.className = 'term-output-line';
    line.innerHTML = content;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = termInput.value;
        termInput.value = '';
        executeCommand(val);
      }
    });
  }

  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });

  // --- 10. RESUME MODAL & PRINT HANDLER ---
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const heroResumeBtn = document.getElementById('heroResumeBtn');
  const closeResumeBtn = document.getElementById('closeResumeBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  function openResume() {
    if (resumeModal) {
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playCyberSound('click');
    }
  }

  function closeResume() {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      playCyberSound('click');
    }
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', (e) => { e.preventDefault(); openResume(); });
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', (e) => { e.preventDefault(); openResume(); });
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResume();
      }
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      playCyberSound('click');
      window.print();
    });
  }

  // --- 11. COMMS CONTACT FORM CONNECTED TO BRINDA GMAIL ---
  const commsForm = document.getElementById('commsForm');
  const openGmailDirectBtn = document.getElementById('openGmailDirectBtn');
  const dispatchSuccessNotice = document.getElementById('dispatchSuccessNotice');
  const launchGmailLink = document.getElementById('launchGmailLink');

  function buildGmailUrls() {
    const name = document.getElementById('commsName')?.value.trim() || 'Security Collaborator';
    const email = document.getElementById('commsEmail')?.value.trim() || 'collaborator@security.org';
    const subject = document.getElementById('commsSubject')?.value.trim() || 'Cyber Security Inquiry // SOC Operations';
    const message = document.getElementById('commsMessage')?.value.trim() || 'Inquiry regarding cyber defense operations and collaboration.';

    const fullSubject = `[CYBER INQUIRY] ${subject}`;
    const fullBody = `Hello Brinda,\n\nSender Designation / Name: ${name}\nReturn Comms Email: ${email}\n\nMission Objective / Message:\n${message}\n\n---\nTransmitted via Brinda T B Cyber Security Operative Portfolio`;

    const encodedSubject = encodeURIComponent(fullSubject);
    const encodedBody = encodeURIComponent(fullBody);

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=brindababu2435@gmail.com&su=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:brindababu2435@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

    return { name, email, fullSubject, fullBody, gmailWebUrl, mailtoUrl };
  }

  if (openGmailDirectBtn) {
    openGmailDirectBtn.addEventListener('click', () => {
      playCyberSound('click');
      const { gmailWebUrl } = buildGmailUrls();
      showToast('Connecting directly to Brinda\'s Gmail (brindababu2435@gmail.com)...');
      window.open(gmailWebUrl, '_blank');
    });
  }

  if (commsForm) {
    commsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playCyberSound('triage');

      const submitBtn = document.getElementById('dispatchSubmitBtn') || commsForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const { name, email, fullSubject, fullBody, gmailWebUrl, mailtoUrl } = buildGmailUrls();

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>ENCRYPTING & ROUTING TO GMAIL...</span>`;

      // Update notice link
      if (launchGmailLink) {
        launchGmailLink.setAttribute('href', gmailWebUrl);
      }

      // Background submission via FormSubmit AJAX to deliver into brindababu2435@gmail.com
      fetch('https://formsubmit.co/ajax/brindababu2435@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: fullSubject,
          name: name,
          email: email,
          message: fullBody
        })
      }).catch(err => {
        console.warn('Background FormSubmit relay notice (fallback to Gmail client):', err);
      });

      setTimeout(() => {
        submitBtn.innerHTML = `<span>DISPATCHED TO GMAIL ✓</span>`;
        submitBtn.style.background = '#00ffa3';
        submitBtn.style.color = '#05070e';

        if (dispatchSuccessNotice) {
          dispatchSuccessNotice.style.display = 'block';
        }

        showToast('Connected to Brinda\'s Gmail: brindababu2435@gmail.com');

        // Automatically launch pre-filled Gmail composer
        try {
          window.open(gmailWebUrl, '_blank');
        } catch (e) {
          window.location.href = mailtoUrl;
        }

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 4000);
      }, 1000);
    });
  }

  // --- 12. CYBER TOAST NOTIFIER ---
  const cyberToast = document.getElementById('cyberToast');
  let toastTimer = null;

  function showToast(message) {
    if (!cyberToast) return;
    const msgElem = cyberToast.querySelector('.toast-msg');
    if (msgElem) msgElem.textContent = message;
    cyberToast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cyberToast.classList.remove('show');
    }, 3800);
  }
});
