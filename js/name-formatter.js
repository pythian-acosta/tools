const input = document.getElementById('inputNames');
const prefixInput = document.getElementById('prefix');
const suffixInput = document.getElementById('suffix');
const enablePrefix = document.getElementById('enablePrefix');
const enableSuffix = document.getElementById('enableSuffix');
const customSeparatorInput = document.getElementById('customSeparator');
const errorDiv = document.getElementById('error');

window.addEventListener('DOMContentLoaded', () => {
  input.value = localStorage.getItem('pythian_acosta_name-formatter_inputNames') || '';
  prefixInput.value = localStorage.getItem('pythian_acosta_name-formatter_prefix') || '';
  suffixInput.value = localStorage.getItem('pythian_acosta_name-formatter_suffix') || '';
  enablePrefix.checked = localStorage.getItem('pythian_acosta_name-formatter_enablePrefix') !== 'false';
  enableSuffix.checked = localStorage.getItem('pythian_acosta_name-formatter_enableSuffix') !== 'false';
  document.getElementById('customCommand').value = localStorage.getItem('pythian_acosta_name-formatter_customCommand') || '';
  customSeparatorInput.value = localStorage.getItem('pythian_acosta_name-formatter_customSeparator') || '';
  updateOutputs();
});

input.addEventListener('input', updateOutputs);
prefixInput.addEventListener('input', updateOutputs);
suffixInput.addEventListener('input', updateOutputs);
enablePrefix.addEventListener('change', updateOutputs);
enableSuffix.addEventListener('change', updateOutputs);
customSeparatorInput.addEventListener('input', updateOutputs);
document.getElementById('customCommand').addEventListener('input', updateOutputs);

function updateOutputs() {
  const customCommand = document.getElementById('customCommand').value;
  localStorage.setItem('pythian_acosta_name-formatter_customCommand', customCommand);
  localStorage.setItem('pythian_acosta_name-formatter_inputNames', input.value);
  localStorage.setItem('pythian_acosta_name-formatter_prefix', prefixInput.value);
  localStorage.setItem('pythian_acosta_name-formatter_suffix', suffixInput.value);
  localStorage.setItem('pythian_acosta_name-formatter_enablePrefix', enablePrefix.checked);
  localStorage.setItem('pythian_acosta_name-formatter_enableSuffix', enableSuffix.checked);
  localStorage.setItem('pythian_acosta_name-formatter_customSeparator', customSeparatorInput.value);

  const rawLines = input.value.trim().split(/\n+/);
  const names = rawLines.filter(name => name.trim() !== '');
  const invalidNames = names.filter(name => name.includes(' '));
  const prefix = enablePrefix.checked ? prefixInput.value : '';
  const suffix = enableSuffix.checked ? suffixInput.value : '';
  const customSeparator = customSeparatorInput.value;

  const invalidPrefixSuffix = [];
  if (prefix.includes(' ')) invalidPrefixSuffix.push(`prefix: "${prefix}"`);
  if (suffix.includes(' ')) invalidPrefixSuffix.push(`suffix: "${suffix}"`);

  if (invalidNames.length > 0 || invalidPrefixSuffix.length > 0) {
    let msg = '';
    if (invalidNames.length > 0) {
      msg += 'Names cannot contain spaces. Invalid name(s): ' + invalidNames.join(', ') + '. ';
    }
    if (invalidPrefixSuffix.length > 0) {
      msg += 'Prefix/suffix cannot contain spaces. Invalid input(s): ' + invalidPrefixSuffix.join(', ') + '.';
    }
    errorDiv.textContent = 'Error: ' + msg;
    clearOutputs();
    return;
  } else {
    errorDiv.textContent = '';
  }

  const transformed = names.map(name => `${prefix}${name}${suffix}`);

  document.getElementById('output1').textContent = transformed.join(' ');
  document.getElementById('output2').textContent = transformed.join('|');
  document.getElementById('output3').textContent = transformed.map(name => `--tag name=${name}`).join(' ');
  document.getElementById('output4').textContent = transformed.map(name => `${customCommand}${name}`).join(' ');
  document.getElementById('output5').textContent = transformed.join(customSeparator);
}

function clearOutputs() {
  document.getElementById('output1').textContent = '';
  document.getElementById('output2').textContent = '';
  document.getElementById('output3').textContent = '';
  document.getElementById('output4').textContent = '';
  document.getElementById('output5').textContent = '';
}

function copyToClipboard(elementId, button) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    flashButtonColor(button, 'green');
  }).catch(() => {
    flashButtonColor(button, 'red');
  });
}

function flashButtonColor(button, color) {
  const originalColor = button.style.backgroundColor;
  button.style.backgroundColor = color;
  setTimeout(() => {
    button.style.backgroundColor = originalColor || '#007bff';
  }, 3000);
}