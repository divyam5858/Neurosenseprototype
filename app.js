// Application Data
const APPLICATION_DATA = {
  neurodegenerative_diseases: [
    {
      name: "Alzheimer's Disease",
      code: "AD",
      description: "Progressive neurodegenerative disorder affecting memory, thinking, and behavior",
      symptoms: ["Memory loss", "Confusion", "Difficulty with familiar tasks", "Language problems"],
      risk_factors: ["Age", "Family history", "APOE gene", "Cardiovascular disease"]
    },
    {
      name: "Parkinson's Disease", 
      code: "PD",
      description: "Movement disorder affecting dopamine-producing neurons",
      symptoms: ["Tremor", "Bradykinesia", "Rigidity", "Postural instability"],
      risk_factors: ["Age", "Gender (male)", "Environmental toxins", "Family history"]
    },
    {
      name: "Dementia with Lewy Bodies",
      code: "DLB", 
      description: "Dementia associated with Lewy body protein deposits",
      symptoms: ["Cognitive fluctuations", "Visual hallucinations", "Parkinsonian features", "Sleep disorders"],
      risk_factors: ["Age", "Gender (male)", "Family history", "REM sleep behavior disorder"]
    },
    {
      name: "Frontotemporal Dementia",
      code: "FTD",
      description: "Group of disorders affecting frontal and temporal lobes",
      symptoms: ["Personality changes", "Language difficulties", "Executive dysfunction", "Behavioral changes"],
      risk_factors: ["Family history", "Genetic mutations", "Age (younger onset)", "Head trauma"]
    }
  ],
  sample_diagnosis_data: {
    patient_id: "NS001234",
    timestamp: "2025-08-15T10:30:00Z",
    ai_predictions: {
      AD: {probability: 0.78, confidence: 0.85},
      PD: {probability: 0.12, confidence: 0.72},
      DLB: {probability: 0.08, confidence: 0.68},
      FTD: {probability: 0.02, confidence: 0.55}
    },
    recommendations: [
      "Follow-up neuropsychological testing in 6 months",
      "Consider amyloid PET scan for confirmation",
      "Lifestyle interventions: cognitive training, aerobic exercise",
      "Monitor for depression and sleep disturbances"
    ]
  },
  progression_data: [
    {
      date: "2025-02-15",
      mmse_score: 26,
      moca_score: 24,
      notes: "Baseline assessment - normal cognition"
    },
    {
      date: "2025-05-15", 
      mmse_score: 24,
      moca_score: 22,
      notes: "Mild decline in memory and attention"
    },
    {
      date: "2025-08-15",
      mmse_score: 22,
      moca_score: 20,
      notes: "Continued cognitive decline, increasing care needs"
    }
  ]
};

// Global state
let currentUser = null;
let currentSection = 'dashboard';
let assessmentData = {};
let uploadedFiles = {
  clinical: [],
  genetic: [],
  scans: []
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  // Add small delay to ensure all elements are rendered
  setTimeout(() => {
    initializeApp();
  }, 100);
});

function initializeApp() {
  console.log('Initializing app...');
  
  // Check if user is already logged in
  try {
    const savedUser = localStorage.getItem('neuroSenseUser');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
      console.log('Found saved user:', currentUser);
      showMainApp();
    } else {
      console.log('No saved user found, showing auth');
      showAuthSection();
    }
  } catch (e) {
    console.error('Error loading saved user:', e);
    showAuthSection();
  }
  
  setupEventListeners();
}

function setupEventListeners() {
  console.log('Setting up event listeners...');

  // Authentication - Use proper event delegation
  setupAuthenticationHandlers();
  setupNavigationHandlers();
  setupFeatureCardHandlers();
  setupFormHandlers();
  setupFileUploadHandlers();
  setupProgressionHandlers();

  console.log('All event listeners set up');
}

function setupAuthenticationHandlers() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin(e);
    });
  }

  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleRegister(e);
    });
  }

  // Auth links - prevent default and handle explicitly
  const showRegisterLink = document.getElementById('show-register');
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Show register clicked');
      showRegisterForm();
    });
  }

  const showLoginLink = document.getElementById('show-login');
  if (showLoginLink) {
    showLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Show login clicked');
      showLoginForm();
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleLogout();
    });
  }
}

function setupNavigationHandlers() {
  const navButtons = [
    { id: 'nav-dashboard', section: 'dashboard' },
    { id: 'nav-assessment', section: 'assessment' },
    { id: 'nav-diagnosis', section: 'diagnosis' },
    { id: 'nav-tracking', section: 'tracking' }
  ];

  navButtons.forEach(({ id, section }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Navigation clicked:', section);
        showSection(section);
      });
    }
  });
}

function setupFeatureCardHandlers() {
  const featureCards = [
    { id: 'card-assessment', section: 'assessment' },
    { id: 'card-diagnosis', section: 'diagnosis' },
    { id: 'card-tracking', section: 'tracking' }
  ];

  featureCards.forEach(({ id, section }) => {
    const card = document.getElementById(id);
    if (card) {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Feature card clicked:', section);
        showSection(section);
      });
      
      // Also add click handler to the button inside the card
      const button = card.querySelector('.btn');
      if (button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Feature button clicked:', section);
          showSection(section);
        });
      }
    }
  });
}

function setupFormHandlers() {
  // Assessment form
  const assessmentForm = document.getElementById('assessment-form');
  if (assessmentForm) {
    assessmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleAssessmentSubmit(e);
    });
  }

  // Process diagnosis button
  const processBtn = document.getElementById('process-diagnosis');
  if (processBtn) {
    processBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleDiagnosisProcess();
    });
  }
}

function setupFileUploadHandlers() {
  const fileInputs = [
    { id: 'clinical-files', category: 'clinical' },
    { id: 'genetic-files', category: 'genetic' },
    { id: 'scan-files', category: 'scans' }
  ];

  fileInputs.forEach(({ id, category }) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('change', function(e) {
        handleFileUpload(e, category);
      });
    }
  });
}

function setupProgressionHandlers() {
  const addProgressBtn = document.getElementById('add-progression-data');
  if (addProgressBtn) {
    addProgressBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleAddProgressionData();
    });
  }
}

// Authentication Functions
function handleLogin(e) {
  console.log('Login form submitted');
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  console.log('Login attempt with email:', email);

  // Basic validation
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  // Create user session
  currentUser = {
    id: generateId(),
    email: email,
    name: email.split('@')[0],
    loginTime: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('neuroSenseUser', JSON.stringify(currentUser));
    console.log('User logged in:', currentUser);
    showMainApp();
  } catch (e) {
    console.error('Error saving user:', e);
    showMainApp();
  }
}

function handleRegister(e) {
  console.log('Register form submitted');
  
  const name = document.getElementById('reg-name').value.trim();
  const age = document.getElementById('reg-age').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  console.log('Registration attempt for:', email);

  // Basic validation
  if (!name || !age || !email || !phone || !password) {
    alert('Please fill in all required fields');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  const ageNum = parseInt(age);
  if (ageNum < 18 || ageNum > 120) {
    alert('Please enter a valid age between 18 and 120');
    return;
  }
  
  currentUser = {
    id: generateId(),
    name: name,
    age: ageNum,
    email: email,
    phone: phone,
    medicalId: document.getElementById('reg-medical-id').value.trim(),
    emergencyContact: document.getElementById('reg-emergency').value.trim(),
    registrationTime: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('neuroSenseUser', JSON.stringify(currentUser));
    console.log('User registered:', currentUser);
    showMainApp();
  } catch (e) {
    console.error('Error saving user:', e);
    showMainApp();
  }
}

function handleLogout() {
  console.log('Logging out user');
  currentUser = null;
  
  try {
    localStorage.removeItem('neuroSenseUser');
    localStorage.removeItem('assessmentResults');
    localStorage.removeItem('progressionData');
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
  
  showAuthSection();
}

function showRegisterForm() {
  console.log('Switching to register form');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (loginForm) loginForm.classList.add('hidden');
  if (registerForm) registerForm.classList.remove('hidden');
}

function showLoginForm() {
  console.log('Switching to login form');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (registerForm) registerForm.classList.add('hidden');
  if (loginForm) loginForm.classList.remove('hidden');
}

// Navigation Functions
function showAuthSection() {
  console.log('Showing auth section');
  const authSection = document.getElementById('auth-section');
  const mainApp = document.getElementById('main-app');
  const navbar = document.getElementById('navbar');
  
  if (authSection) authSection.classList.remove('hidden');
  if (mainApp) mainApp.classList.add('hidden');
  if (navbar) navbar.classList.add('hidden');
}

function showMainApp() {
  console.log('Showing main app');
  const authSection = document.getElementById('auth-section');
  const mainApp = document.getElementById('main-app');
  const navbar = document.getElementById('navbar');
  
  if (authSection) authSection.classList.add('hidden');
  if (mainApp) mainApp.classList.remove('hidden');
  if (navbar) navbar.classList.remove('hidden');
  
  showSection('dashboard');
}

function showSection(section) {
  console.log('Showing section:', section);
  
  // Hide all sections
  const sections = ['dashboard', 'assessment', 'diagnosis', 'tracking'];
  sections.forEach(s => {
    const sectionEl = document.getElementById(s + '-section');
    if (sectionEl) sectionEl.classList.add('hidden');
  });
  
  // Show target section
  const targetSection = document.getElementById(section + '-section');
  if (targetSection) {
    targetSection.classList.remove('hidden');
  } else {
    console.error('Section not found:', section + '-section');
    return;
  }
  
  // Update navigation
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('nav-' + section);
  if (activeBtn) activeBtn.classList.add('active');
  
  currentSection = section;
  
  // Initialize section-specific functionality
  if (section === 'tracking') {
    setTimeout(() => initializeProgressionTracking(), 100);
  }
}

// Assessment Functions
function handleAssessmentSubmit(e) {
  console.log('Assessment form submitted');
  
  const formData = new FormData(e.target);
  assessmentData = {};
  
  for (let [key, value] of formData.entries()) {
    assessmentData[key] = value;
  }
  
  console.log('Assessment data collected:', assessmentData);
  
  // Validate required fields
  const requiredFields = ['age', 'gender', 'family_dementia', 'family_parkinson', 'exercise', 'smoking', 'memory_issues', 'confusion', 'movement_issues'];
  const missingFields = requiredFields.filter(field => !assessmentData[field]);
  
  if (missingFields.length > 0) {
    alert('Please complete all required fields');
    return;
  }
  
  // Show processing animation
  showLoadingModal();
  
  // Simulate AI processing
  setTimeout(() => {
    hideLoadingModal();
    generateRiskAssessment();
    showAssessmentResults();
  }, 2000);
}

function generateRiskAssessment() {
  console.log('Generating risk assessment');
  
  const results = {
    AD: calculateRisk('AD'),
    PD: calculateRisk('PD'),
    DLB: calculateRisk('DLB'),
    FTD: calculateRisk('FTD')
  };
  
  const recommendations = generateRecommendations();
  
  const assessmentResults = {
    results,
    recommendations,
    timestamp: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
  } catch (e) {
    console.error('Error saving assessment results:', e);
  }
  
  console.log('Risk assessment generated:', results);
  return assessmentResults;
}

function calculateRisk(disease) {
  let riskScore = 0;
  
  // Age factor
  const age = parseInt(assessmentData.age);
  if (age > 65) riskScore += 30;
  else if (age > 50) riskScore += 15;
  
  // Family history
  if (assessmentData.family_dementia === 'yes') riskScore += 25;
  if (assessmentData.family_parkinson === 'yes' && disease === 'PD') riskScore += 20;
  
  // Lifestyle factors
  if (assessmentData.exercise === 'never') riskScore += 10;
  if (assessmentData.smoking === 'current') riskScore += 15;
  
  // Symptoms
  if (assessmentData.memory_issues === 'often' || assessmentData.memory_issues === 'very-often') {
    if (disease === 'AD' || disease === 'DLB' || disease === 'FTD') riskScore += 20;
  }
  
  if (assessmentData.movement_issues === 'often' || assessmentData.movement_issues === 'very-often') {
    if (disease === 'PD' || disease === 'DLB') riskScore += 20;
  }
  
  // Add some randomization
  riskScore += Math.random() * 10;
  riskScore = Math.min(riskScore, 100);
  
  return {
    score: Math.round(riskScore),
    level: riskScore < 20 ? 'low' : riskScore < 50 ? 'moderate' : 'high'
  };
}

function generateRecommendations() {
  const recommendations = [];
  
  if (parseInt(assessmentData.age) > 65) {
    recommendations.push("Regular cognitive screening is recommended for individuals over 65");
  }
  
  if (assessmentData.exercise === 'never') {
    recommendations.push("Increase physical activity - regular exercise can reduce risk by up to 30%");
  }
  
  if (assessmentData.smoking === 'current') {
    recommendations.push("Consider smoking cessation programs - smoking increases neurodegeneration risk");
  }
  
  if (assessmentData.family_dementia === 'yes') {
    recommendations.push("Genetic counseling may be beneficial given family history of dementia");
  }
  
  if (assessmentData.memory_issues === 'often' || assessmentData.memory_issues === 'very-often') {
    recommendations.push("Consider neuropsychological evaluation for memory concerns");
  }
  
  recommendations.push("Maintain a Mediterranean diet rich in omega-3 fatty acids");
  recommendations.push("Engage in regular mental stimulation activities");
  recommendations.push("Ensure adequate sleep (7-9 hours nightly)");
  
  return recommendations;
}

function showAssessmentResults() {
  console.log('Showing assessment results');
  
  let savedResults;
  try {
    savedResults = JSON.parse(localStorage.getItem('assessmentResults'));
  } catch (e) {
    console.error('Error loading assessment results:', e);
    return;
  }
  
  if (!savedResults) {
    console.error('No assessment results found');
    return;
  }
  
  const { results, recommendations } = savedResults;
  
  // Update risk cards
  Object.keys(results).forEach(disease => {
    const card = document.getElementById(disease.toLowerCase() + '-risk');
    const scoreElement = document.getElementById(disease.toLowerCase() + '-score');
    const levelElement = document.getElementById(disease.toLowerCase() + '-level');
    
    if (card && scoreElement && levelElement) {
      const { score, level } = results[disease];
      
      scoreElement.textContent = score + '%';
      levelElement.textContent = level.charAt(0).toUpperCase() + level.slice(1) + ' Risk';
      
      // Update card styling based on risk level
      card.className = `risk-card ${level}-risk`;
    }
  });
  
  // Update recommendations
  const recommendationsList = document.getElementById('recommendations-list');
  if (recommendationsList) {
    recommendationsList.innerHTML = recommendations.map(rec => 
      `<div class="recommendation-item">• ${rec}</div>`
    ).join('');
  }
  
  // Show results section
  const resultsSection = document.getElementById('assessment-results');
  if (resultsSection) {
    resultsSection.classList.remove('hidden');
    
    // Scroll to results
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}

// File Upload Functions
function handleFileUpload(e, category) {
  console.log('File upload for category:', category);
  const files = Array.from(e.target.files);
  uploadedFiles[category] = files;
  
  const infoElement = document.getElementById(category + '-info');
  if (infoElement) {
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).slice(0, 3);
      const displayText = files.length <= 3 ? 
        `${files.length} file(s): ${fileNames.join(', ')}` :
        `${files.length} files including: ${fileNames.join(', ')}...`;
      infoElement.textContent = displayText;
    } else {
      infoElement.textContent = 'No files selected';
    }
  }
  
  updateProcessButton();
}

function updateProcessButton() {
  const processBtn = document.getElementById('process-diagnosis');
  if (processBtn) {
    const hasFiles = uploadedFiles.clinical.length > 0 || 
                     uploadedFiles.genetic.length > 0 || 
                     uploadedFiles.scans.length > 0;
    
    processBtn.disabled = !hasFiles;
    console.log('Process button state:', hasFiles ? 'enabled' : 'disabled');
  }
}

function handleDiagnosisProcess() {
  console.log('Processing diagnosis');
  
  const processingState = document.getElementById('processing-state');
  const uploadContainer = document.getElementById('upload-container');
  
  if (processingState) processingState.classList.remove('hidden');
  if (uploadContainer) uploadContainer.style.opacity = '0.5';
  
  simulateProcessingSteps();
  
  setTimeout(() => {
    generateDiagnosis();
    showDiagnosisResults();
  }, 4000);
}

function simulateProcessingSteps() {
  const steps = document.querySelectorAll('.step');
  let currentStep = 0;
  
  const interval = setInterval(() => {
    if (currentStep > 0 && steps[currentStep - 1]) {
      steps[currentStep - 1].classList.remove('active');
    }
    if (currentStep < steps.length && steps[currentStep]) {
      steps[currentStep].classList.add('active');
      currentStep++;
    } else {
      clearInterval(interval);
    }
  }, 800);
}

function generateDiagnosis() {
  console.log('Generating diagnosis');
  
  const baseData = APPLICATION_DATA.sample_diagnosis_data.ai_predictions;
  const diagnosis = {};
  
  Object.keys(baseData).forEach(disease => {
    const variation = (Math.random() - 0.5) * 0.2;
    diagnosis[disease] = {
      probability: Math.max(0.01, Math.min(0.99, baseData[disease].probability + variation)),
      confidence: Math.max(0.5, Math.min(0.95, baseData[disease].confidence + (Math.random() - 0.5) * 0.1))
    };
  });
  
  const diagnosisResults = {
    diagnosis,
    recommendations: APPLICATION_DATA.sample_diagnosis_data.recommendations,
    timestamp: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('diagnosisResults', JSON.stringify(diagnosisResults));
  } catch (e) {
    console.error('Error saving diagnosis results:', e);
  }
  
  console.log('Diagnosis generated:', diagnosis);
}

function showDiagnosisResults() {
  console.log('Showing diagnosis results');
  
  const processingState = document.getElementById('processing-state');
  const uploadContainer = document.getElementById('upload-container');
  
  if (processingState) processingState.classList.add('hidden');
  if (uploadContainer) uploadContainer.style.opacity = '1';
  
  let savedResults;
  try {
    savedResults = JSON.parse(localStorage.getItem('diagnosisResults'));
  } catch (e) {
    console.error('Error loading diagnosis results:', e);
    return;
  }
  
  if (!savedResults) {
    console.error('No diagnosis results found');
    return;
  }
  
  const { diagnosis, recommendations } = savedResults;
  
  // Find primary diagnosis
  let primaryDisease = '';
  let highestProb = 0;
  
  Object.keys(diagnosis).forEach(disease => {
    if (diagnosis[disease].probability > highestProb) {
      highestProb = diagnosis[disease].probability;
      primaryDisease = disease;
    }
  });
  
  // Update primary diagnosis display
  const diseaseInfo = APPLICATION_DATA.neurodegenerative_diseases.find(d => d.code === primaryDisease);
  const primaryNameEl = document.getElementById('primary-diagnosis-name');
  const primaryScoreEl = document.getElementById('primary-score');
  const primaryConfidenceEl = document.getElementById('primary-confidence');
  
  if (diseaseInfo && primaryNameEl && primaryScoreEl && primaryConfidenceEl) {
    primaryNameEl.textContent = diseaseInfo.name;
    primaryScoreEl.textContent = Math.round(diagnosis[primaryDisease].probability * 100) + '%';
    primaryConfidenceEl.textContent = `High Confidence (${Math.round(diagnosis[primaryDisease].confidence * 100)}%)`;
  }
  
  // Update all predictions
  const predictionList = document.getElementById('prediction-list');
  if (predictionList) {
    predictionList.innerHTML = '';
    
    Object.keys(diagnosis).forEach(disease => {
      const diseaseInfo = APPLICATION_DATA.neurodegenerative_diseases.find(d => d.code === disease);
      if (diseaseInfo) {
        const predictionItem = document.createElement('div');
        predictionItem.className = 'prediction-item';
        predictionItem.innerHTML = `
          <span class="prediction-name">${diseaseInfo.name}</span>
          <span class="prediction-score">${Math.round(diagnosis[disease].probability * 100)}%</span>
        `;
        predictionList.appendChild(predictionItem);
      }
    });
  }
  
  // Update recommendations
  const recommendationsList = document.getElementById('clinical-recommendations-list');
  if (recommendationsList) {
    recommendationsList.innerHTML = recommendations.map(rec => 
      `<div class="recommendation-item">• ${rec}</div>`
    ).join('');
  }
  
  // Show results
  const resultsSection = document.getElementById('diagnosis-results');
  if (resultsSection) {
    resultsSection.classList.remove('hidden');
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}

// Progression Tracking Functions
function initializeProgressionTracking() {
  console.log('Initializing progression tracking');
  loadProgressionData();
  updateTimeline();
  createProgressionChart();
}

function loadProgressionData() {
  try {
    const savedData = localStorage.getItem('progressionData');
    if (savedData) {
      APPLICATION_DATA.progression_data = JSON.parse(savedData);
    }
  } catch (e) {
    console.error('Error loading progression data:', e);
  }
}

function updateTimeline() {
  const timeline = document.getElementById('health-timeline');
  if (!timeline) return;
  
  timeline.innerHTML = '';
  
  APPLICATION_DATA.progression_data.forEach((entry, index) => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    const date = new Date(entry.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    timelineItem.innerHTML = `
      <div class="timeline-date">${date}</div>
      <div class="timeline-content">
        <h4>Assessment Results</h4>
        <p>MMSE: ${entry.mmse_score}/30, MOCA: ${entry.moca_score}/30</p>
        <p>${entry.notes}</p>
      </div>
    `;
    
    timeline.appendChild(timelineItem);
  });
}

function createProgressionChart() {
  const canvas = document.getElementById('progression-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  canvas.width = 400;
  canvas.height = 300;
  
  const data = APPLICATION_DATA.progression_data;
  if (!data || data.length === 0) return;
  
  const chartWidth = canvas.width;
  const chartHeight = canvas.height;
  const padding = 60;
  
  // Clear canvas
  ctx.clearRect(0, 0, chartWidth, chartHeight);
  
  // Draw background
  ctx.fillStyle = '#f9f9f9';
  ctx.fillRect(0, 0, chartWidth, chartHeight);
  
  // Draw axes
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, chartHeight - padding);
  ctx.lineTo(chartWidth - padding, chartHeight - padding);
  ctx.stroke();
  
  // Draw MMSE line
  ctx.strokeStyle = '#1FB8CD';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  data.forEach((point, index) => {
    const x = padding + (index * (chartWidth - 2 * padding) / (data.length - 1));
    const y = chartHeight - padding - (point.mmse_score / 30 * (chartHeight - 2 * padding));
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // Draw points
  ctx.fillStyle = '#1FB8CD';
  data.forEach((point, index) => {
    const x = padding + (index * (chartWidth - 2 * padding) / (data.length - 1));
    const y = chartHeight - padding - (point.mmse_score / 30 * (chartHeight - 2 * padding));
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Add labels
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.fillText('MMSE Score', 10, chartHeight / 2);
  ctx.fillText('Timeline', chartWidth / 2 - 20, chartHeight - 10);
}

function handleAddProgressionData() {
  console.log('Adding progression data');
  
  const date = document.getElementById('test-date').value;
  const mmseScore = parseInt(document.getElementById('mmse-score').value);
  const mocaScore = parseInt(document.getElementById('moca-score').value);
  const notes = document.getElementById('test-notes').value;
  
  if (!date) {
    alert('Please select a test date');
    return;
  }
  
  if (!mmseScore || mmseScore < 0 || mmseScore > 30) {
    alert('Please enter a valid MMSE score (0-30)');
    return;
  }
  
  if (!mocaScore || mocaScore < 0 || mocaScore > 30) {
    alert('Please enter a valid MOCA score (0-30)');
    return;
  }
  
  const newEntry = {
    date,
    mmse_score: mmseScore,
    moca_score: mocaScore,
    notes: notes || 'No additional notes'
  };
  
  APPLICATION_DATA.progression_data.push(newEntry);
  
  try {
    localStorage.setItem('progressionData', JSON.stringify(APPLICATION_DATA.progression_data));
  } catch (e) {
    console.error('Error saving progression data:', e);
  }
  
  // Clear form
  document.getElementById('test-date').value = '';
  document.getElementById('mmse-score').value = '';
  document.getElementById('moca-score').value = '';
  document.getElementById('test-notes').value = '';
  
  // Update displays
  updateTimeline();
  createProgressionChart();
  
  alert('Test results added successfully!');
}

// Utility Functions
function generateId() {
  return 'NS' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function showLoadingModal() {
  const modal = document.getElementById('loading-modal');
  if (modal) modal.classList.remove('hidden');
}

function hideLoadingModal() {
  const modal = document.getElementById('loading-modal');
  if (modal) modal.classList.add('hidden');
}

// Debug
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
});

// Prevent any interfering behaviors
document.addEventListener('click', function(e) {
  // Remove any potential click interference
  if (e.target.matches('a[href="#"]')) {
    e.preventDefault();
  }
}, true);