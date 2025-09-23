// simple client-side calculator
(function(){
  const display = document.getElementById('display');
  const buttons = document.getElementById('buttons');

  let expression = '';

  function updateDisplay() {
    display.textContent = expression || '0';
  }

  function safeEval(expr) {
    // very small sanitizer: allow only digits/operators parentheses and dot
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      return 'ERR';
    }
    try {
      // Use Function to evaluate arithmetic expression
      // This runs in the browser context; still be cautious with inputs.
      // For this app that's fine because it's purely client-side.
      const result = Function('"use strict"; return (' + expr + ')')();
      if (result === Infinity || result === -Infinity) return 'ERR';
      return Number.isFinite(result) ? result : 'ERR';
    } catch (e) {
      return 'ERR';
    }
  }

  buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const val = btn.dataset.value;

    if (btn.id === 'clear') {
      expression = '';
      updateDisplay();
      return;
    }
    if (btn.id === 'back') {
      expression = expression.slice(0, -1);
      updateDisplay();
      return;
    }
    if (btn.id === 'equals') {
      const out = safeEval(expression);
      expression = (out === 'ERR') ? '' : String(out);
      updateDisplay();
      return;
    }
    // normal button
    expression += val;
    updateDisplay();
  });

  // keyboard support
  window.addEventListener('keydown', (ev) => {
    const key = ev.key;
    if ((/^[0-9+\-*/().]$/).test(key)) {
      expression += key;
      updateDisplay();
      ev.preventDefault();
      return;
    }
    if (key === 'Enter' || key === '=') {
      const out = safeEval(expression);
      expression = (out === 'ERR') ? '' : String(out);
      updateDisplay();
      ev.preventDefault();
      return;
    }
    if (key === 'Backspace') {
      expression = expression.slice(0, -1);
      updateDisplay();
      ev.preventDefault();
      return;
    }
    if (key === 'Escape') {
      expression = '';
      updateDisplay();
      ev.preventDefault();
      return;
    }
  });

  updateDisplay();
})();
