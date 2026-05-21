// SettlementCheck Standalone Embeddable Calculator Web Component
(function () {
  // Resolve host origin from current script tag to allow cross-origin assets/calls
  const scriptUrl = new URL(document.currentScript ? document.currentScript.src : 'https://settlementcheck.co.uk/widget.js');
  const origin = scriptUrl.origin;

  // Contracts and rates configuration for 2026/27
  const STATUTORY_RATES = {
    weeklyCapGB: 751,
    maxServiceYears: 20,
    taxFreeLimit: 30000,
  };

  const NOTICE_WEEKS_MAP = {
    statutory: 0,
    '1m_or_less': 4,
    '2_3m': 10,
    '4_6m': 20,
    '6plus': 39,
    unsure: 0,
  };

  const REASON_MAP = {
    redundancy_individual: 'redundancy',
    redundancy_collective: 'redundancy_collective',
    performance: 'dismissal',
    constructive: 'dismissal',
    mutual: 'mutual',
    unsure: 'other',
  };

  class SettlementCheckCalculator extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.currentStep = 1;
      this.formData = {
        salary: '',
        age: '',
        yearsNum: '',
        monthsNum: '',
        offer: '',
        noticeOption: null,
        reason: null,
        discrimination: null,
        name: '',
        email: '',
        phone: '',
        consent: false
      };
      this.calculatedResult = null;
      this.loadingInterval = null;
    }

    static get observedAttributes() {
      return ['theme', 'primary-color', 'partner-id', 'capture-leads'];
    }

    connectedCallback() {
      this.renderBaseTemplate();
      this.renderStep();
    }

    attributeChangedCallback() {
      if (this.shadowRoot && this.shadowRoot.innerHTML) {
        this.renderBaseTemplate();
        this.renderStep();
      }
    }

    get theme() {
      return this.getAttribute('theme') || 'light';
    }

    get primaryColor() {
      return this.getAttribute('primary-color') || '#D9603B';
    }

    get partnerId() {
      return this.getAttribute('partner-id') || '';
    }

    get captureLeads() {
      return this.getAttribute('capture-leads') === 'true';
    }

    renderBaseTemplate() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --primary-color: ${this.primaryColor};
            --bg-color: ${this.theme === 'dark' ? '#0B1F3A' : '#F7F4EE'};
            --card-bg: ${this.theme === 'dark' ? '#142844' : '#FFFFFF'};
            --text-color: ${this.theme === 'dark' ? '#F7F4EE' : '#0B1F3A'};
            --muted-text: ${this.theme === 'dark' ? '#A4B2C6' : '#5B6577'};
            --border-color: ${this.theme === 'dark' ? '#233957' : '#E2DCCE'};
            --shadow: ${this.theme === 'dark' ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(11, 31, 58, 0.05)'};
            --font-sans: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            --font-serif: 'Playfair Display', Georgia, serif;
          }
        </style>
        <link rel="stylesheet" href="${origin}/widget.css">
        <div class="widget-card">
          <div class="widget-header">
            <div class="logo-area">
              <div class="logo-check">
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7.5L6 11L12 3.5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span><span class="logo-settlement">Settlement</span>Check</span>
            </div>
            <div class="progress-container" id="header-progress">
              <span id="step-number-text">Question 1 of 7</span>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" id="progress-bar-fill" style="width: 14.3%;"></div>
              </div>
            </div>
          </div>
          <div id="step-content"></div>
          <div class="widget-disclosure">
            Powered by <a href="https://settlementcheck.co.uk" target="_blank" rel="noopener noreferrer">SettlementCheck.co.uk</a>. Vetted solicitors, free independent reviews.
          </div>
        </div>
      `;
    }

    renderStep() {
      const stepContent = this.shadowRoot.getElementById('step-content');
      if (!stepContent) return;

      const totalSteps = this.captureLeads ? 8 : 7;
      const stepNumberText = this.shadowRoot.getElementById('step-number-text');
      const progressBarFill = this.shadowRoot.getElementById('progress-bar-fill');
      const progressPercent = Math.min(100, (this.currentStep / 7) * 100);

      if (stepNumberText && progressBarFill) {
        if (this.currentStep > 7) {
          stepNumberText.textContent = `Intake Form`;
          progressBarFill.style.width = '100%';
        } else {
          stepNumberText.textContent = `Question ${this.currentStep} of 7`;
          progressBarFill.style.width = `${progressPercent}%`;
        }
      }

      stepContent.innerHTML = '';
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-container';

      switch (this.currentStep) {
        case 1:
          this.renderStep1(stepDiv);
          break;
        case 2:
          this.renderStep2(stepDiv);
          break;
        case 3:
          this.renderStep3(stepDiv);
          break;
        case 4:
          this.renderStep4(stepDiv);
          break;
        case 5:
          this.renderStep5(stepDiv);
          break;
        case 6:
          this.renderStep6(stepDiv);
          break;
        case 7:
          this.renderStep7(stepDiv);
          break;
        case 8:
          this.renderStep8(stepDiv);
          break;
      }

      stepContent.appendChild(stepDiv);
      this.setupInputListeners();
      this.focusFirstInput();
    }

    focusFirstInput() {
      setTimeout(() => {
        const input = this.shadowRoot.querySelector('input:not([type="checkbox"])');
        if (input) {
          input.focus();
        }
      }, 100);
    }

    setupInputListeners() {
      const backBtn = this.shadowRoot.getElementById('btn-back');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.goBack());
      }

      const nextBtn = this.shadowRoot.getElementById('btn-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.goNext());
      }

      // Handle salary format on type
      const salaryInput = this.shadowRoot.getElementById('salary-input');
      if (salaryInput) {
        salaryInput.addEventListener('input', (e) => {
          this.formData.salary = e.target.value.replace(/[^0-9]/g, '');
        });
        salaryInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') this.goNext();
        });
      }

      // Handle age limit
      const ageInput = this.shadowRoot.getElementById('age-input');
      if (ageInput) {
        ageInput.addEventListener('input', (e) => {
          this.formData.age = e.target.value.replace(/[^0-9]/g, '');
        });
        ageInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') this.goNext();
        });
      }

      // Length of service inputs
      const yearsInput = this.shadowRoot.getElementById('years-input');
      const monthsInput = this.shadowRoot.getElementById('months-input');
      if (yearsInput) {
        yearsInput.addEventListener('input', (e) => {
          this.formData.yearsNum = e.target.value.replace(/[^0-9]/g, '');
        });
        yearsInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && monthsInput) {
            e.preventDefault();
            monthsInput.focus();
          }
        });
      }
      if (monthsInput) {
        monthsInput.addEventListener('input', (e) => {
          this.formData.monthsNum = e.target.value.replace(/[^0-9]/g, '');
        });
        monthsInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') this.goNext();
        });
      }

      // Offer input
      const offerInput = this.shadowRoot.getElementById('offer-input');
      if (offerInput) {
        offerInput.addEventListener('input', (e) => {
          this.formData.offer = e.target.value.replace(/[^0-9]/g, '');
          const warning = this.shadowRoot.getElementById('offer-warning');
          if (warning) warning.style.display = 'none';
        });
        offerInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') this.goNext();
        });
      }

      // Step 8 Lead Inputs
      const leadName = this.shadowRoot.getElementById('lead-name');
      const leadEmail = this.shadowRoot.getElementById('lead-email');
      const leadPhone = this.shadowRoot.getElementById('lead-phone');
      const leadConsent = this.shadowRoot.getElementById('lead-consent');

      if (leadName) leadName.addEventListener('input', (e) => this.formData.name = e.target.value);
      if (leadEmail) leadEmail.addEventListener('input', (e) => this.formData.email = e.target.value);
      if (leadPhone) leadPhone.addEventListener('input', (e) => this.formData.phone = e.target.value);
      if (leadConsent) leadConsent.addEventListener('change', (e) => this.formData.consent = e.target.checked);
    }

    renderStep1(container) {
      container.innerHTML = `
        <h2 class="step-question">What is your annual salary?</h2>
        <p class="step-helper">Use your basic salary before tax. Bonus and commission are not included in the statutory calculation.</p>
        <div class="input-group">
          <div class="input-wrapper">
            <span class="input-prefix">£</span>
            <input type="text" id="salary-input" class="form-input" inputmode="numeric" pattern="[0-9]*" placeholder="42,000" value="${this.formData.salary}" />
          </div>
          <span class="error-message" id="salary-error">Please enter your salary to continue.</span>
        </div>
        <div class="actions-row">
          <button class="btn-primary" id="btn-next">That is my salary</button>
        </div>
      `;
    }

    renderStep2(container) {
      container.innerHTML = `
        <h2 class="step-question">How old are you?</h2>
        <p class="step-helper">UK law applies different redundancy multipliers at ages 22 and 41. Your age directly affects your statutory entitlement.</p>
        <div class="input-group">
          <div class="input-wrapper">
            <input type="text" id="age-input" class="form-input" inputmode="numeric" pattern="[0-9]*" placeholder="38" value="${this.formData.age}" />
            <span class="input-suffix">years old</span>
          </div>
          <span class="error-message" id="age-error">Please enter an age between 16 and 80 to continue.</span>
        </div>
        <div class="actions-row">
          <button class="btn-back" id="btn-back">Back</button>
          <button class="btn-primary" id="btn-next">That is my age</button>
        </div>
      `;
    }

    renderStep3(container) {
      container.innerHTML = `
        <h2 class="step-question">How long have you worked there?</h2>
        <p class="step-helper">Only complete years count toward statutory redundancy pay, but months affect other parts of your calculation.</p>
        <div class="double-input-row">
          <div class="input-group">
            <div class="input-wrapper">
              <input type="text" id="years-input" class="form-input" inputmode="numeric" pattern="[0-9]*" placeholder="6" value="${this.formData.yearsNum}" />
              <span class="input-suffix">years</span>
            </div>
          </div>
          <div class="input-group">
            <div class="input-wrapper">
              <input type="text" id="months-input" class="form-input" inputmode="numeric" pattern="[0-9]*" placeholder="4" value="${this.formData.monthsNum}" />
              <span class="input-suffix">months</span>
            </div>
          </div>
        </div>
        <span class="error-message" id="service-error" style="margin-top: -10px; margin-bottom: 15px;">Please check the service duration values.</span>
        <div class="actions-row">
          <button class="btn-back" id="btn-back">Back</button>
          <button class="btn-primary" id="btn-next">That is my service length</button>
        </div>
      `;
    }

    renderStep4(container) {
      const showWarning = this.checkSalaryWarning();
      container.innerHTML = `
        <h2 class="step-question">What has your employer offered?</h2>
        <p class="step-helper">Enter the total settlement figure. If no offer has been made yet, enter 0 and we will show you what to expect.</p>
        <div class="input-group">
          <div class="input-wrapper">
            <span class="input-prefix">£</span>
            <input type="text" id="offer-input" class="form-input" inputmode="numeric" pattern="[0-9]*" placeholder="18,000" value="${this.formData.offer}" />
          </div>
          <div class="warning-box" id="offer-warning" style="${showWarning ? 'display: block;' : 'display: none;'}">
            Just to confirm: is this the total settlement figure, not a monthly amount?
          </div>
          <span class="error-message" id="offer-error">Please enter an offer (use 0 if none).</span>
        </div>
        <div class="actions-row">
          <button class="btn-back" id="btn-back">Back</button>
          <button class="btn-primary" id="btn-next">
            ${(!this.formData.offer || parseFloat(this.formData.offer) === 0) ? 'No offer made yet' : 'That is what they have offered'}
          </button>
        </div>
      `;
    }

    checkSalaryWarning() {
      const o = parseFloat(this.formData.offer);
      const s = parseFloat(this.formData.salary);
      if (!isNaN(o) && !isNaN(s) && s > 0 && o > 0) {
        const monthly = s / 12;
        if (Math.abs(o - monthly) / monthly < 0.05) {
          return true;
        }
      }
      return false;
    }

    renderStep5(container) {
      const options = [
        { value: 'statutory', label: 'Statutory only (1 week per year of service, max 12)' },
        { value: '1m_or_less', label: '1 month or less' },
        { value: '2_3m', label: '2 to 3 months' },
        { value: '4_6m', label: '4 to 6 months' },
        { value: '6plus', label: 'More than 6 months' },
        { value: 'unsure', label: 'I am not sure' }
      ];

      container.innerHTML = `
        <h2 class="step-question">What does your contract say about notice?</h2>
        <p class="step-helper">Check your written contract. The written term governs what notice pay you are owed.</p>
        <div class="options-list">
          ${options.map(opt => `
            <button class="option-button ${this.formData.noticeOption === opt.value ? 'selected' : ''}" data-value="${opt.value}">
              ${opt.label}
            </button>
          `).join('')}
        </div>
        <span class="error-message" id="notice-error" style="margin-bottom: 15px;">Please select an option to continue.</span>
        <div class="actions-row" style="margin-top: 0;">
          <button class="btn-back" id="btn-back">Back</button>
        </div>
      `;

      const buttons = container.querySelectorAll('.option-button');
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const val = btn.getAttribute('data-value');
          this.formData.noticeOption = val;
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          
          // Auto-advance with short delay
          setTimeout(() => this.goNext(), 300);
        });
      });
    }

    renderStep6(container) {
      const options = [
        { value: 'redundancy_individual', label: 'Redundancy' },
        { value: 'redundancy_collective', label: 'Redundancy: part of a group (20 or more people)' },
        { value: 'performance', label: 'Performance or disciplinary process' },
        { value: 'constructive', label: 'Constructive dismissal' },
        { value: 'mutual', label: 'Mutual agreement' },
        { value: 'unsure', label: 'I am not sure' }
      ];

      const isCollective = this.formData.reason === 'redundancy_collective';

      container.innerHTML = `
        <h2 class="step-question">Why is your employment ending?</h2>
        <p class="step-helper">This affects which legal entitlements apply to your calculation.</p>
        <div class="options-list">
          ${options.map(opt => `
            <button class="option-button ${this.formData.reason === opt.value ? 'selected' : ''}" data-value="${opt.value}">
              ${opt.label}
            </button>
          `).join('')}
        </div>
        <div class="collective-box" id="collective-note" style="${isCollective ? 'display: block;' : 'display: none;'}">
          You may be entitled to a Protective Award of up to 90 days pay if your employer failed to consult properly. We will show this in your results.
        </div>
        <span class="error-message" id="reason-error" style="margin-bottom: 15px;">Please select a reason to continue.</span>
        <div class="actions-row" style="margin-top: 0;">
          <button class="btn-back" id="btn-back">Back</button>
        </div>
      `;

      const buttons = container.querySelectorAll('.option-button');
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const val = btn.getAttribute('data-value');
          this.formData.reason = val;
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          
          const note = this.shadowRoot.getElementById('collective-note');
          if (val === 'redundancy_collective') {
            if (note) note.style.display = 'block';
          } else {
            if (note) note.style.display = 'none';
          }

          // Auto-advance with short delay
          setTimeout(() => this.goNext(), 300);
        });
      });
    }

    renderStep7(container) {
      const options = [
        { value: 'no', label: 'No' },
        { value: 'not_sure', label: 'Not sure' },
        { value: 'yes', label: 'Yes' }
      ];

      container.innerHTML = `
        <h2 class="step-question">Was discrimination involved?</h2>
        <p class="step-helper">Were you treated differently because of age, gender, race, disability, pregnancy, or another protected characteristic?</p>
        <p class="step-helper" style="margin-top: -10px;">If not certain, choose "Not sure". Employment Tribunal awards are uncapped if discrimination is present.</p>
        <div class="options-list">
          ${options.map(opt => `
            <button class="option-button ${this.formData.discrimination === opt.value ? 'selected' : ''}" data-value="${opt.value}" style="min-height: 56px;">
              ${opt.label}
            </button>
          `).join('')}
        </div>
        <span class="error-message" id="discrimination-error" style="margin-bottom: 15px;">Please select an option to continue.</span>
        <div class="actions-row" style="margin-top: 0;">
          <button class="btn-back" id="btn-back">Back</button>
          <button class="btn-primary" id="btn-next">Review calculations</button>
        </div>
      `;

      const buttons = container.querySelectorAll('.option-button');
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const val = btn.getAttribute('data-value');
          this.formData.discrimination = val;
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
      });
    }

    renderStep8(container) {
      container.innerHTML = `
        <h2 class="step-question">Your calculations are ready</h2>
        <p class="step-helper">Please provide your contact information to view your full results report and get matched with a solicitor.</p>
        
        <div class="input-group">
          <div class="input-wrapper">
            <input type="text" id="lead-name" class="form-input" placeholder="Your full name" value="${this.formData.name}" required />
          </div>
          <span class="error-message" id="name-error">Please enter your name.</span>
        </div>

        <div class="input-group">
          <div class="input-wrapper">
            <input type="email" id="lead-email" class="form-input" placeholder="you@example.com" value="${this.formData.email}" required />
          </div>
          <span class="error-message" id="email-error">Please enter a valid email address.</span>
        </div>

        <div class="input-group">
          <div class="input-wrapper">
            <input type="tel" id="lead-phone" class="form-input" placeholder="07123 456789" value="${this.formData.phone}" required />
          </div>
          <span class="error-message" id="phone-error">Please enter your phone number.</span>
        </div>

        <label class="checkbox-container">
          <input type="checkbox" id="lead-consent" ${this.formData.consent ? 'checked' : ''} required />
          <div class="custom-checkbox">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          I consent to SettlementCheck sharing my details with a matched vetted solicitor who will review my agreement for free.
        </label>
        <span class="error-message" id="consent-error" style="margin-top: -15px; margin-bottom: 15px;">You must provide consent to proceed.</span>

        <div class="actions-row">
          <button class="btn-back" id="btn-back">Back</button>
          <button class="btn-primary" id="btn-next">Get My Free Match & Results →</button>
        </div>
      `;
    }

    goBack() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.renderStep();
      }
    }

    goNext() {
      if (this.validateStep()) {
        const totalSteps = this.captureLeads ? 8 : 7;
        if (this.currentStep === 7) {
          this.startLoadingPhase();
        } else if (this.currentStep === 8) {
          this.submitLead();
        } else {
          this.currentStep++;
          this.renderStep();
        }
      }
    }

    validateStep() {
      // Hide all errors first
      const errors = this.shadowRoot.querySelectorAll('.error-message');
      errors.forEach(e => e.classList.remove('visible'));

      if (this.currentStep === 1) {
        const s = parseFloat(this.formData.salary);
        if (!this.formData.salary || isNaN(s) || s <= 0) {
          const err = this.shadowRoot.getElementById('salary-error');
          if (err) err.classList.add('visible');
          this.shakeCard();
          return false;
        }
      } else if (this.currentStep === 2) {
        const a = parseInt(this.formData.age, 10);
        if (!this.formData.age || isNaN(a) || a < 16 || a > 80) {
          const err = this.shadowRoot.getElementById('age-error');
          if (err) err.classList.add('visible');
          this.shakeCard();
          return false;
        }
      } else if (this.currentStep === 3) {
        const y = parseInt(this.formData.yearsNum || '0', 10);
        const m = parseInt(this.formData.monthsNum || '0', 10);
        if (isNaN(y) || isNaN(m) || y < 0 || m < 0 || (y === 0 && m === 0)) {
          const err = this.shadowRoot.getElementById('service-error');
          if (err) err.classList.add('visible');
          this.shakeCard();
          return false;
        }
      } else if (this.currentStep === 4) {
        const o = parseFloat(this.formData.offer);
        if (this.formData.offer === '' || isNaN(o) || o < 0) {
          const err = this.shadowRoot.getElementById('offer-error');
          if (err) err.classList.add('visible');
          this.shakeCard();
          return false;
        }
      } else if (this.currentStep === 5) {
        if (!this.formData.noticeOption) {
          const err = this.shadowRoot.getElementById('notice-error');
          if (err) err.classList.add('visible');
          this.shakeCard();
          return false;
        }
      } else if (this.currentStep === 6) {
        if (!this.formData.reason) {
          const err = this.shadowRoot.getElementById('reason-error');
          if (err) err.classList.add('visible');
          this.shakeCard();
          return false;
        }
      } else if (this.currentStep === 7) {
        if (!this.formData.discrimination) {
          const err = this.shadowRoot.getElementById('discrimination-error');
          if (err) err.classList.add('visible');
          this.shakeCard();
          return false;
        }
      } else if (this.currentStep === 8) {
        let valid = true;
        
        if (!this.formData.name.trim()) {
          const err = this.shadowRoot.getElementById('name-error');
          if (err) err.classList.add('visible');
          valid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.formData.email.trim() || !emailRegex.test(this.formData.email)) {
          const err = this.shadowRoot.getElementById('email-error');
          if (err) err.classList.add('visible');
          valid = false;
        }

        if (!this.formData.phone.trim() || this.formData.phone.trim().length < 6) {
          const err = this.shadowRoot.getElementById('phone-error');
          if (err) err.classList.add('visible');
          valid = false;
        }

        if (!this.formData.consent) {
          const err = this.shadowRoot.getElementById('consent-error');
          if (err) err.classList.add('visible');
          valid = false;
        }

        if (!valid) {
          this.shakeCard();
          return false;
        }
      }

      return true;
    }

    shakeCard() {
      const card = this.shadowRoot.querySelector('.widget-card');
      if (card) {
        card.classList.add('sc-shake');
        card.style.animation = 'shake 0.4s ease-in-out';
        setTimeout(() => {
          card.style.animation = '';
        }, 450);
      }
    }

    // ── Local Calculations Engine (Exact replication of calculations.ts) ──
    runCalculations() {
      const salary = parseFloat(this.formData.salary);
      const age = parseInt(this.formData.age, 10);
      const y = parseInt(this.formData.yearsNum || '0', 10);
      const m = parseInt(this.formData.monthsNum || '0', 10);
      const offer = parseFloat(this.formData.offer) || 0;
      const totalMonths = y * 12 + m;
      const mappedReason = REASON_MAP[this.formData.reason] || 'other';
      const discrimination = this.formData.discrimination || 'no';
      const noticeWeeks = NOTICE_WEEKS_MAP[this.formData.noticeOption] || 0;
      
      const weeklyCapUsed = STATUTORY_RATES.weeklyCapGB;
      const isCollectiveRedundancy = mappedReason === 'redundancy_collective';
      const hasStatutoryFloor = mappedReason === 'redundancy' || mappedReason === 'redundancy_collective' || mappedReason === 'dismissal';

      // 1. Redundancy (SRP)
      let redundancy = 0;
      if (mappedReason === 'redundancy' || mappedReason === 'redundancy_collective') {
        const weeklyPay = Math.min(salary / 52, weeklyCapUsed);
        const completedYears = Math.min(Math.floor(totalMonths / 12), STATUTORY_RATES.maxServiceYears);
        for (let i = 0; i < completedYears; i++) {
          const ageInYear = age - i;
          const multiplier = ageInYear < 22 ? 0.5 : ageInYear <= 40 ? 1.0 : 1.5;
          redundancy += weeklyPay * multiplier;
        }
        redundancy = Math.round(redundancy);
      }

      // 2. Unfair dismissal basic award
      const basicAward = mappedReason === 'dismissal' ? redundancy : 0;

      // 3. PILON (Notice pay)
      const weeklyPayUncapped = salary / 52;
      const statWeeks = totalMonths < 1 ? 0 : totalMonths < 24 ? 1 : Math.min(Math.floor(totalMonths / 12), 12);
      const weeksUsed = Math.max(statWeeks, noticeWeeks);
      const pilon = Math.round(weeklyPayUncapped * weeksUsed);

      const minimum = redundancy + basicAward + pilon;

      // 4. Typical outcome range
      const monthSalary = salary / 12;
      const typicalLowCalc = minimum + monthSalary * 1.5;
      
      const completedYears = Math.floor(totalMonths / 12);
      let typicalHighCalc = salary * 0.5;
      if (completedYears > 15) typicalHighCalc *= 1.25;
      else if (completedYears > 10) typicalHighCalc *= 1.15;
      typicalHighCalc = Math.min(typicalHighCalc, salary * 2);
      typicalHighCalc = Math.max(typicalHighCalc, typicalLowCalc * 1.5);

      // 5. Discrimination
      const discriminationFlag = discrimination === 'yes' || discrimination === 'not_sure';
      const typicalHighUncapped = discrimination === 'yes';

      // 6. Verdict
      let verdict;
      if (hasStatutoryFloor && offer < minimum) {
        verdict = 'BELOW_MINIMUM';
      } else if (offer < typicalLowCalc) {
        verdict = 'BELOW_TYPICAL';
      } else if (typicalHighUncapped || offer <= typicalHighCalc) {
        verdict = 'WITHIN_RANGE';
      } else {
        verdict = 'ABOVE_TYPICAL';
      }

      this.calculatedResult = {
        verdict,
        minimum: Math.round(minimum),
        typicalLow: Math.round(typicalLowCalc),
        typicalHigh: Math.round(typicalHighCalc),
        typicalHighUncapped,
        discrimination,
        discriminationFlag,
        redundancy,
        basicAward,
        pilon,
        noticeWeeksUsed: weeksUsed,
        totalMonths
      };
    }

    startLoadingPhase() {
      // Run calculations locally to populate loading copy
      this.runCalculations();

      const headerProgress = this.shadowRoot.getElementById('header-progress');
      if (headerProgress) headerProgress.style.display = 'none';

      const stepContent = this.shadowRoot.getElementById('step-content');
      if (!stepContent) return;

      const y = parseInt(this.formData.yearsNum || '0', 10);
      const serviceText = `${y} ${y === 1 ? 'year' : 'years'}`;
      const offerNum = parseFloat(this.formData.offer) || 0;
      const offerText = offerNum > 0 ? `£${offerNum.toLocaleString('en-GB')}` : 'minimum entitlement';

      const loadingMessages = [
        `Checking your ${serviceText} of service against 2026 statutory rates…`,
        `Calculating your redundancy entitlement at £${STATUTORY_RATES.weeklyCapGB} per week…`,
        offerNum > 0 ? `Comparing your offer of ${offerText} against typical outcomes…` : 'Establishing your statutory floors…'
      ];

      stepContent.innerHTML = `
        <div class="loading-container">
          <div class="logo-area" style="font-size: 22px; margin-bottom: 10px;">
            <div class="logo-check" style="width: 22px; height: 22px; border-width: 2px;">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7.5L6 11L12 3.5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span><span class="logo-settlement">Settlement</span>Check</span>
          </div>
          <p class="loading-text" id="loading-text-el">${loadingMessages[0]}</p>
          <div class="loading-bar-wrap">
            <div class="loading-bar-fill" id="loading-bar-fill-el"></div>
          </div>
          <div class="loading-footer">
            Comparing inputs with verified 2026/27 UK employment laws.
          </div>
        </div>
      `;

      const textEl = this.shadowRoot.getElementById('loading-text-el');
      const barEl = this.shadowRoot.getElementById('loading-bar-fill-el');

      let currentProgress = 0;
      const totalDuration = 4500; // 4.5 seconds loading state
      const intervalMs = 50;
      const steps = totalDuration / intervalMs;
      const stepIncrement = 100 / steps;

      if (barEl) {
        barEl.style.transition = `width ${intervalMs}ms linear`;
      }

      this.loadingInterval = setInterval(() => {
        currentProgress += stepIncrement;
        if (barEl) {
          barEl.style.width = `${Math.min(100, currentProgress)}%`;
        }

        // Cycle loading messages
        if (textEl) {
          if (currentProgress >= 66) {
            textEl.textContent = loadingMessages[2];
          } else if (currentProgress >= 33) {
            textEl.textContent = loadingMessages[1];
          }
        }

        if (currentProgress >= 100) {
          clearInterval(this.loadingInterval);
          if (textEl) textEl.textContent = 'Your results are ready.';
          
          setTimeout(() => {
            if (this.captureLeads) {
              this.currentStep = 8;
              this.renderStep();
              const headerProgress = this.shadowRoot.getElementById('header-progress');
              if (headerProgress) headerProgress.style.display = 'flex';
            } else {
              this.redirectToResults();
            }
          }, 600);
        }
      }, intervalMs);
    }

    redirectToResults(emailPrefill = '') {
      const r = this.calculatedResult;
      const queryParams = new URLSearchParams({
        salary: this.formData.salary,
        yearsNum: this.formData.yearsNum || '0',
        monthsNum: this.formData.monthsNum || '0',
        age: this.formData.age,
        offer: this.formData.offer || '0',
        reason: REASON_MAP[this.formData.reason] || 'other',
        discrimination: this.formData.discrimination || 'no',
        contractualNotice: String(NOTICE_WEEKS_MAP[this.formData.noticeOption] || 0),
        partner_id: this.partnerId
      });

      if (emailPrefill) {
        queryParams.append('email', emailPrefill);
      }

      // Redirect the parent window
      window.top.location.href = `${origin}/results?${queryParams.toString()}`;
    }

    async submitLead() {
      const nextBtn = this.shadowRoot.getElementById('btn-next');
      if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Submitting...';
      }

      const r = this.calculatedResult;
      const payload = {
        first_name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        verdict: r.verdict,
        offer_amount: parseFloat(this.formData.offer) || 0,
        salary: parseFloat(this.formData.salary),
        months_service: r.totalMonths,
        consent: true,
        partner_id: this.partnerId,
        source_url: window.location.href,
        benchmark_data: {
          minimum: r.minimum,
          typicalLow: r.typicalLow,
          typicalHigh: r.typicalHigh,
          typicalHighUncapped: r.typicalHighUncapped,
          discrimination: r.discrimination
        }
      };

      try {
        const response = await fetch(`${origin}/api/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          this.showSuccess();
        } else {
          throw new Error('Failed to submit');
        }
      } catch (err) {
        console.error('Lead submission failed:', err);
        // If API fails, fall back to redirecting so we don't lose the user
        this.redirectToResults(this.formData.email);
      }
    }

    showSuccess() {
      const headerProgress = this.shadowRoot.getElementById('header-progress');
      if (headerProgress) headerProgress.style.display = 'none';

      const stepContent = this.shadowRoot.getElementById('step-content');
      if (!stepContent) return;

      stepContent.innerHTML = `
        <div class="success-container">
          <div class="success-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 class="success-title">Thank you, ${this.formData.name.split(' ')[0]}</h2>
          <p class="success-message">
            Your legal report is ready. We are connecting you with a vetted specialist employment solicitor who will review your agreement for free.
          </p>
          <p class="success-message" style="font-size: 13px; margin-top: -12px;">
            Redirecting you to your detailed statutory breakdown report...
          </p>
        </div>
      `;

      // Redirect after 2.5 seconds to show results page with email prefilled
      setTimeout(() => {
        this.redirectToResults(this.formData.email);
      }, 2500);
    }
  }

  customElements.define('settlement-check-calculator', SettlementCheckCalculator);
})();
