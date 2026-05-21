(function() {
  'use strict';

  const TUTORIAL_COOKIE = 'splitsquad_tutorial';
  const TOTAL_STEPS = 8;
  const STEP_TIMEOUT_MS = 120000;

  const STEPS = [
    {
      id: 'welcome',
      page: '/app/',
      type: 'welcome',
      title: 'Welcome to SplitSquad!',
      body: 'Let\'s set up your account in 2 minutes. We\'ll walk you through adding your UPI ID, connecting WhatsApp, adding contacts, and creating your first split.',
    },
    {
      id: 'upi-setup',
      page: '/app/settings',
      type: 'tooltip',
      target: '#add-upi',
      title: 'Add Your UPI ID',
      body: 'First, add your UPI ID so participants can pay you back. Click "Add" to enter your UPI ID.',
      waitMessage: 'Waiting for you to add a UPI ID...',
      verify: () => waitForElement('#upi-list .brutalist-border-thin, #upi-list > div:not(#upi-empty)'),
    },
    {
      id: 'whatsapp-connect',
      page: '/app/qr',
      type: 'tooltip',
      target: '#connect',
      title: 'Connect WhatsApp',
      body: 'Connect your WhatsApp to send split notifications to participants automatically. Click "Connect" to generate a QR code.',
      waitMessage: 'Waiting for you to click "Connect"...',
      verify: () => waitForClick('#connect'),
    },
    {
      id: 'add-contacts',
      page: '/app/contacts',
      type: 'tooltip',
      target: '#add-manually',
      title: 'Add Your Squad',
      body: 'Add friends, family, or co-workers here. Click "Add Manually" or "Add from Contacts" to get started.',
      waitMessage: 'Waiting for you to add a contact...',
      verify: () => waitForElement('#contacts-list > div:not(.brutalist-border-thin):not(:empty)'),
    },
    {
      id: 'create-split',
      page: '/app/',
      type: 'tooltip',
      target: '#create-split-form',
      title: 'Create Your First Split',
      body: 'Enter a split name, total amount, and add participants. Then click "Create Split".',
      waitMessage: 'Waiting for you to create a split...',
      verify: () => waitForSplitCreation(),
    },
    {
      id: 'send-whatsapp',
      page: '/app/split',
      type: 'tooltip',
      target: '#send-whatsapp',
      title: 'Send via WhatsApp',
      body: 'Click here to send payment requests to all participants via WhatsApp.',
      waitMessage: 'Waiting for you to click "Send via WhatsApp"...',
      requiresSplit: true,
      verify: () => waitForClick('#send-whatsapp'),
    },
    {
      id: 'track-payments',
      page: '/app/split',
      type: 'tooltip',
      target: '#participants-list',
      title: 'Track Payments',
      body: 'See who has paid and who hasn\'t. When participants verify their payment, the badge changes from UNPAID to PAID automatically.',
      autoAdvance: true,
    },
    {
      id: 'scan-qr',
      page: '/app/scan-qr',
      type: 'tooltip',
      target: '#start-scanner',
      title: 'Scan UPI QR Codes',
      body: 'Scan a merchant\'s UPI QR code to auto-fill their payment details. Click "Start Scanner" to try it.',
      waitMessage: 'Waiting for you to click "Start Scanner"...',
      verify: () => waitForClick('#start-scanner'),
    },
    {
      id: 'complete',
      page: '/app/',
      type: 'complete',
      title: 'You\'re All Set!',
      body: 'You now know how to use SplitSquad. Start splitting bills with your squad!',
    },
  ];

  let verificationTimeout = null;
  let verificationAbort = null;

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
    return state && (state.completed === true || state.skipped === true);
  }

  function waitForElement(selector, timeout = 60000) {
    return new Promise((resolve, reject) => {
      const check = () => {
        const el = document.querySelector(selector);
        if (el && el.children.length > 0) {
          resolve(el);
        } else {
          setTimeout(check, 500);
        }
      };
      check();

      setTimeout(() => reject(new Error('timeout')), timeout);
    });
  }

  function waitForClick(selector) {
    return new Promise((resolve) => {
      const el = document.querySelector(selector);
      if (el) {
        el.addEventListener('click', () => resolve(true), { once: true });
      } else {
        setTimeout(() => waitForClick(selector).then(resolve), 500);
      }
    });
  }

  function waitForSplitCreation() {
    return new Promise((resolve) => {
      const check = () => {
        if (window.location.pathname.startsWith('/app/split/') && window.location.pathname.length > 11) {
          resolve(window.location.pathname.split('/').pop());
        } else {
          setTimeout(check, 500);
        }
      };
      check();
    });
  }

  function showWelcome(step) {
    const overlay = document.getElementById('tutorial-welcome');
    if (!overlay) return;

    overlay.querySelector('.welcome-title').textContent = step.title;
    overlay.querySelector('.welcome-body').textContent = step.body;
    overlay.querySelector('.welcome-btn.skip').style.display = '';
    overlay.querySelector('.welcome-btn.start').textContent = 'Start Tutorial';
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

  function showRestartModal(message) {
    const overlay = document.getElementById('tutorial-welcome');
    if (!overlay) return;

    overlay.querySelector('.welcome-title').textContent = 'Tutorial Interrupted';
    overlay.querySelector('.welcome-body').textContent = message || 'It looks like you skipped some setup steps. Would you like to restart the tutorial from the beginning?';
    overlay.querySelector('.welcome-btn.skip').style.display = '';
    overlay.querySelector('.welcome-btn.skip').textContent = 'Skip Tutorial';
    overlay.querySelector('.welcome-btn.start').textContent = 'Restart Tutorial';
    overlay.classList.add('active');

    overlay.querySelector('.welcome-btn.start').onclick = () => {
      overlay.classList.remove('active');
      restartTutorial();
    };

    overlay.querySelector('.welcome-btn.skip').onclick = () => {
      overlay.classList.remove('active');
      skipTutorial();
    };
  }

  function showTooltip(step) {
    const overlay = document.getElementById('tutorial-overlay');
    if (!overlay) return;

    if (step.requiresSplit) {
      const splitId = window.location.pathname.split('/').pop();
      if (!splitId || splitId === 'split' || splitId.length < 6) {
        overlay.classList.remove('active');
        showRestartModal('This step requires a split to be created first. Please restart the tutorial and complete the "Create Your First Split" step.');
        return;
      }
    }

    const target = document.querySelector(step.target);
    if (!target) {
      setTimeout(() => showTooltip(step), 500);
      return;
    }

    const rect = target.getBoundingClientRect();
    const highlight = overlay.querySelector('.tutorial-highlight');
    const tooltip = overlay.querySelector('#tutorial-tooltip');
    const waitMsg = tooltip.querySelector('.tooltip-wait');
    const doneBtn = tooltip.querySelector('.tooltip-btn.done');
    const nextBtn = tooltip.querySelector('.tooltip-btn.next');
    const skipBtn = tooltip.querySelector('.tooltip-btn.skip');

    highlight.style.display = 'block';
    highlight.style.top = rect.top - 4 + 'px';
    highlight.style.left = rect.left - 4 + 'px';
    highlight.style.width = rect.width + 8 + 'px';
    highlight.style.height = rect.height + 8 + 'px';

    tooltip.querySelector('.tooltip-step').textContent = 'Step ' + step.index + ' of ' + TOTAL_STEPS;
    tooltip.querySelector('.tooltip-title').textContent = step.title;
    tooltip.querySelector('.tooltip-body').textContent = step.body;

    overlay.classList.add('active');

    if (step.verify) {
      waitMsg.style.display = 'none';
      doneBtn.style.display = '';
      nextBtn.style.display = 'none';

      doneBtn.disabled = false;
      doneBtn.textContent = 'I\'ve Done It';
      doneBtn.style.opacity = '1';

      const onTargetClick = () => {
        overlay.style.background = 'transparent';
        highlight.style.display = 'none';
        highlight.style.boxShadow = 'none';
      };

      target.addEventListener('click', onTargetClick, { once: true });

      doneBtn.onclick = () => {
        target.removeEventListener('click', onTargetClick);
        doneBtn.disabled = true;
        doneBtn.textContent = 'Checking...';
        doneBtn.style.opacity = '0.5';
        waitMsg.textContent = 'Verifying...';
        waitMsg.style.display = 'block';

        verificationTimeout = setTimeout(() => {
          waitMsg.textContent = 'Taking too long? You can skip this step.';
          skipBtn.textContent = 'Skip This Step';
          skipBtn.style.display = '';
        }, STEP_TIMEOUT_MS);

        step.verify().then(() => {
          clearTimeout(verificationTimeout);
          overlay.classList.remove('active');
          nextStep(step.index + 1);
        }).catch(() => {
          clearTimeout(verificationTimeout);
          doneBtn.disabled = false;
          doneBtn.textContent = 'I\'ve Done It';
          doneBtn.style.opacity = '1';
          waitMsg.textContent = 'Not detected yet. Make sure you completed the step, then try again.';
          waitMsg.style.display = 'block';
        });
      };
    } else if (step.autoAdvance) {
      waitMsg.style.display = 'none';
      doneBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      skipBtn.style.display = 'none';

      setTimeout(() => {
        overlay.classList.remove('active');
        nextStep(step.index + 1);
      }, 3000);
    } else {
      waitMsg.style.display = 'none';
      doneBtn.style.display = 'none';
      nextBtn.style.display = '';
      nextBtn.textContent = 'Got It →';

      nextBtn.onclick = () => {
        overlay.classList.remove('active');
        nextStep(step.index + 1);
      };
    }

    skipBtn.onclick = () => {
      overlay.classList.remove('active');
      clearTimeout(verificationTimeout);
      if (verificationAbort) verificationAbort();
      nextStep(step.index + 1);
    };
  }

  function showComplete(step) {
    const overlay = document.getElementById('tutorial-welcome');
    if (!overlay) return;

    const state = getTutorialState();
    if (state && state.tutorialSplitId) {
      deleteTutorialSplit(state.tutorialSplitId);
    }

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

  function deleteTutorialSplit(splitId) {
    if (!splitId || splitId.length < 6) return;
    fetch('/api/splits/' + splitId, { method: 'DELETE' }).catch(() => {});
  }

  function nextStep(index) {
    clearTimeout(verificationTimeout);
    if (verificationAbort) verificationAbort();

    if (index >= STEPS.length) {
      completeTutorial();
      return;
    }

    const step = STEPS[index];
    step.index = index;

    const state = getTutorialState() || {};
    state.step = index;
    state.completed = false;
    setTutorialState(state);

    const currentPath = window.location.pathname;
    const isSplitPage = currentPath.startsWith('/app/split/') && currentPath.length > 10;

    if (step.requiresSplit && !isSplitPage) {
      if (state.splitId) {
        window.location.href = '/app/split/' + state.splitId + '?tutorial=' + index;
      } else {
        showRestartModal('This step requires a split to be created first. Please restart the tutorial and complete the "Create Your First Split" step.');
        return;
      }
    } else if (currentPath !== step.page && !currentPath.startsWith(step.page)) {
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
    clearTimeout(verificationTimeout);
    if (verificationAbort) verificationAbort();
    setTutorialState({ step: STEPS.length, completed: true, skipped: true });
  }

  function completeTutorial() {
    clearTimeout(verificationTimeout);
    if (verificationAbort) verificationAbort();
    const state = getTutorialState() || {};
    state.step = STEPS.length;
    state.completed = true;
    setTutorialState(state);
    window.location.href = '/app/';
  }

  function startTutorial() {
    if (isTutorialComplete()) return;
    const state = getTutorialState();
    if (state && state.skipped) return;
    setTutorialState({ step: 0, completed: false });
    nextStep(0);
  }

  function restartTutorial() {
    const state = getTutorialState();
    if (state && state.tutorialSplitId) {
      deleteTutorialSplit(state.tutorialSplitId);
    }
    clearTutorialState();
    setTimeout(() => {
      setTutorialState({ step: 0, completed: false, skipped: false });
      nextStep(0);
    }, 100);
  }

  function replayTutorial() {
    clearTutorialState();
    setTimeout(() => startTutorial(), 100);
  }

  function init() {
    if (window.location.pathname === '/app/login') return;

    const state = getTutorialState();
    if (state && (state.completed || state.skipped)) return;

    const urlParams = new URLSearchParams(window.location.search);
    const tutorialParam = urlParams.get('tutorial');

    if (tutorialParam !== null) {
      const stepIndex = parseInt(tutorialParam, 10);
      if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < STEPS.length) {
        const step = STEPS[stepIndex];
        if (step.requiresSplit) {
          const currentPath = window.location.pathname;
          const isSplitPage = currentPath.startsWith('/app/split/') && currentPath.length > 10;
          if (!isSplitPage) {
            setTimeout(() => showRestartModal('This step requires a split to be created first. Please restart the tutorial and complete the "Create Your First Split" step.'), 500);
            return;
          }
        }
        setTimeout(() => nextStep(stepIndex), 500);
        return;
      }
    }

    if (!state) {
      setTimeout(() => startTutorial(), 1000);
      return;
    }

    if (state.step !== undefined && state.step < STEPS.length) {
      const step = STEPS[state.step];
      if (step.requiresSplit) {
        const currentPath = window.location.pathname;
        const isSplitPage = currentPath.startsWith('/app/split/') && currentPath.length > 10;
        if (!isSplitPage) {
          setTimeout(() => showRestartModal('This step requires a split to be created first. Please restart the tutorial and complete the "Create Your First Split" step.'), 500);
          return;
        }
      }
      setTimeout(() => nextStep(state.step), 500);
    }
  }

  window.SplitSquadTutorial = {
    start: startTutorial,
    restart: restartTutorial,
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
