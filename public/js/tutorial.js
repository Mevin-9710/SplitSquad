(function() {
  'use strict';

  const TUTORIAL_COOKIE = 'splitsquad_tutorial';
  const TOTAL_STEPS = 8;

  const STEPS = [
    {
      id: 'welcome',
      page: '/',
      type: 'welcome',
      title: 'Welcome to SplitSquad!',
      body: 'Let\'s set up your account in 2 minutes. We\'ll walk you through adding your UPI ID, connecting WhatsApp, adding contacts, and creating your first split.',
    },
    {
      id: 'upi-setup',
      page: '/settings',
      type: 'tooltip',
      target: '#upi-list, #add-upi',
      title: 'Add Your UPI ID',
      body: 'First, add your UPI ID so participants can pay you back. This is required for "I Paid" splits. Click "Add" to enter your UPI ID.',
      position: 'left',
      requireAction: 'upi-added',
    },
    {
      id: 'whatsapp-connect',
      page: '/qr',
      type: 'tooltip',
      target: '#connect',
      title: 'Connect WhatsApp',
      body: 'Connect your WhatsApp to send split notifications to participants automatically. Click "Connect" to generate a QR code.',
      position: 'bottom',
    },
    {
      id: 'add-contacts',
      page: '/contacts',
      type: 'tooltip',
      target: '#add-manually',
      title: 'Add Your Squad',
      body: 'Add friends, family, or co-workers here. You\'ll select them when creating splits. Click "Add Manually" or "Add from Contacts" to get started.',
      position: 'bottom',
    },
    {
      id: 'create-split',
      page: '/',
      type: 'tooltip',
      target: '#create-split-form',
      title: 'Create Your First Split',
      body: 'Enter a split name, total amount, and add participants. "I Paid" means you collect money. "Pay Merchant" (after scanning a QR) means everyone pays the merchant directly.',
      position: 'top',
      requireAction: 'split-created',
    },
    {
      id: 'send-whatsapp',
      page: '/split',
      type: 'tooltip',
      target: '#send-whatsapp',
      title: 'Send via WhatsApp',
      body: 'Click here to send payment requests to all participants via WhatsApp. They\'ll receive a link to verify their payment after paying.',
      position: 'bottom',
    },
    {
      id: 'track-payments',
      page: '/split',
      type: 'tooltip',
      target: '.brutalist-border:has(.font-label-md:contains("Participants"))',
      title: 'Track Payments',
      body: 'See who has paid and who hasn\'t. When participants verify their payment via the link you sent, the badge changes from UNPAID to PAID automatically.',
      position: 'top',
    },
    {
      id: 'scan-qr',
      page: '/scan-qr',
      type: 'tooltip',
      target: '#start-scanner',
      title: 'Scan UPI QR Codes',
      body: 'Scan a merchant\'s UPI QR code to auto-fill their payment details. This enables "Pay Merchant" mode for direct payments to the merchant.',
      position: 'top',
    },
    {
      id: 'complete',
      page: '/',
      type: 'complete',
      title: 'You\'re All Set!',
      body: 'You now know how to use SplitSquad. Start splitting bills with your squad!',
    },
  ];

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  }

  function getTutorialState() {
    const raw = getCookie(TUTORIAL_COOKIE);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function setTutorialState(state) {
    setCookie(TUTORIAL_COOKIE, JSON.stringify(state), 30);
  }

  function clearTutorialState() {
    setCookie(TUTORIAL_COOKIE, '', -1);
  }

  function isTutorialComplete() {
    const state = getTutorialState();
    return state && state.completed === true;
  }

  function showWelcome(step) {
    const overlay = document.getElementById('tutorial-welcome');
    if (!overlay) return;

    overlay.querySelector('.welcome-title').textContent = step.title;
    overlay.querySelector('.welcome-body').textContent = step.body;
    overlay.classList.add('active');

    overlay.querySelector('.welcome-btn.start').onclick = () => {
      overlay.classList.remove('active');
      nextStep(1);
    };

    overlay.querySelector('.welcome-btn.skip').onclick = () => {
      overlay.classList.remove('active');
      skipTutorial();
    };
  }

  function showTooltip(step) {
    const overlay = document.getElementById('tutorial-overlay');
    if (!overlay) return;

    const target = document.querySelector(step.target);
    if (!target) {
      setTimeout(() => showTooltip(step), 500);
      return;
    }

    const rect = target.getBoundingClientRect();
    const highlight = overlay.querySelector('.tutorial-highlight');
    const tooltip = overlay.querySelector('#tutorial-tooltip');

    highlight.style.top = rect.top - 4 + 'px';
    highlight.style.left = rect.left - 4 + 'px';
    highlight.style.width = rect.width + 8 + 'px';
    highlight.style.height = rect.height + 8 + 'px';

    tooltip.querySelector('.tooltip-step').textContent = 'Step ' + step.index + ' of ' + TOTAL_STEPS;
    tooltip.querySelector('.tooltip-title').textContent = step.title;
    tooltip.querySelector('.tooltip-body').textContent = step.body;

    let tooltipTop, tooltipLeft;
    switch (step.position) {
      case 'top':
        tooltipTop = Math.max(16, rect.top - 200);
        tooltipLeft = Math.min(rect.left, window.innerWidth - 360);
        break;
      case 'bottom':
        tooltipTop = rect.bottom + 16;
        tooltipLeft = Math.min(rect.left, window.innerWidth - 360);
        break;
      case 'left':
        tooltipTop = Math.max(16, rect.top - 50);
        tooltipLeft = Math.max(16, rect.left - 360);
        break;
      case 'right':
      default:
        tooltipTop = Math.max(16, rect.top - 50);
        tooltipLeft = rect.right + 16;
        break;
    }

    tooltip.style.top = tooltipTop + 'px';
    tooltip.style.left = tooltipLeft + 'px';

    overlay.classList.add('active');

    const nextBtn = tooltip.querySelector('.tooltip-btn.next');
    const skipBtn = tooltip.querySelector('.tooltip-btn.skip');

    nextBtn.onclick = () => {
      overlay.classList.remove('active');
      nextStep(step.index + 1);
    };

    skipBtn.onclick = () => {
      overlay.classList.remove('active');
      skipTutorial();
    };
  }

  function showComplete(step) {
    const overlay = document.getElementById('tutorial-welcome');
    if (!overlay) return;

    overlay.querySelector('.welcome-title').textContent = step.title;
    overlay.querySelector('.welcome-body').textContent = step.body;
    overlay.querySelector('.welcome-btn.start').textContent = 'Start Using SplitSquad';
    overlay.querySelector('.welcome-btn.skip').style.display = 'none';
    overlay.classList.add('active');

    overlay.querySelector('.welcome-btn.start').onclick = () => {
      overlay.classList.remove('active');
      completeTutorial();
    };
  }

  function nextStep(index) {
    if (index >= STEPS.length) {
      completeTutorial();
      return;
    }

    const step = STEPS[index];
    step.index = index;

    setTutorialState({ step: index, completed: false });

    if (window.location.pathname !== step.page && !step.page.startsWith(window.location.pathname)) {
      window.location.href = step.page + '?tutorial=' + index;
      return;
    }

    setTimeout(() => {
      switch (step.type) {
        case 'welcome':
          showWelcome(step);
          break;
        case 'tooltip':
          showTooltip(step);
          break;
        case 'complete':
          showComplete(step);
          break;
      }
    }, 300);
  }

  function skipTutorial() {
    clearTutorialState();
  }

  function completeTutorial() {
    setTutorialState({ step: STEPS.length, completed: true });
  }

  function startTutorial() {
    setTutorialState({ step: 0, completed: false });
    nextStep(0);
  }

  function replayTutorial() {
    clearTutorialState();
    setTimeout(() => startTutorial(), 100);
  }

  function init() {
    const state = getTutorialState();
    const urlParams = new URLSearchParams(window.location.search);
    const tutorialParam = urlParams.get('tutorial');

    if (tutorialParam !== null) {
      const stepIndex = parseInt(tutorialParam, 10);
      if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < STEPS.length) {
        setTimeout(() => nextStep(stepIndex), 500);
        return;
      }
    }

    if (!state) {
      setTimeout(() => startTutorial(), 1000);
      return;
    }

    if (state.completed) return;

    if (state.step !== undefined && state.step < STEPS.length) {
      setTimeout(() => nextStep(state.step), 500);
    }
  }

  window.SplitSquadTutorial = {
    start: startTutorial,
    replay: replayTutorial,
    skip: skipTutorial,
    complete: completeTutorial,
    isComplete: isTutorialComplete,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
