class Calculator {
  constructor() {
    this.display = document.getElementById("display");
    this.currentInput = "0";
    this.previousInput = "";
    this.operator = null;
    this.operatorSymbol = null;
    this.waitingForNewInput = false;
    this.shouldResetDisplay = false;

    this.initializeEventListeners();
  }

  initializeEventListeners() {

    document.querySelectorAll("[data-number]").forEach((button) => {
      button.addEventListener("click", () =>
        this.inputNumber(button.textContent)
      );
    });

    
    document.querySelectorAll("[data-operator]").forEach((button) => {
      button.addEventListener("click", () =>
        this.inputOperator(button.dataset.operator, button.textContent)
      );
    });

    
    document.querySelector("[data-decimal]").addEventListener("click", () => this.inputDecimal());

    
    document.querySelector('[data-action="equals"]').addEventListener("click", () => this.calculate());

    
    document.querySelector('[data-action="clear"]').addEventListener("click", () => this.clear());

    
    document.querySelector('[data-action="clear-all"]').addEventListener("click", () => this.clearAll());

    
    document.addEventListener("keydown", (e) => this.handleKeyboardInput(e));
  }

  inputNumber(number) {
    if (
      this.waitingForNewInput ||
      this.currentInput === "0" ||
      this.shouldResetDisplay
    ) {
      this.currentInput = number;
      this.waitingForNewInput = false;
      this.shouldResetDisplay = false;
    } else {
      this.currentInput += number;
    }
    this.updateDisplay();
  }

  inputOperator(nextOperator, displaySymbol) {
    if (this.currentInput === "Error") return;

    if (this.operator && !this.waitingForNewInput) {
      this.calculate();
    }

    this.previousInput = this.currentInput;
    this.operator = nextOperator;
    this.operatorSymbol = displaySymbol;
    this.waitingForNewInput = true;

    this.updateDisplay();
  }

  inputDecimal() {
    if (this.waitingForNewInput || this.shouldResetDisplay) {
      this.currentInput = "0.";
      this.waitingForNewInput = false;
      this.shouldResetDisplay = false;
    } else if (!this.currentInput.includes(".")) {
      this.currentInput += ".";
    }
    this.updateDisplay();
  }

  clear() {
    if (this.shouldResetDisplay || this.currentInput === "0") {
      this.currentInput = "0";
      this.shouldResetDisplay = false;
    } else {
      this.currentInput = this.currentInput.slice(0, -1) || "0";
    }
    this.updateDisplay();
  }

  clearAll() {
    this.currentInput = "0";
    this.previousInput = "";
    this.operator = null;
    this.operatorSymbol = null;
    this.waitingForNewInput = false;
    this.shouldResetDisplay = false;
    this.updateDisplay();
  }

  calculate() {
    if (
      !this.operator ||
      this.waitingForNewInput ||
      this.currentInput === "Error"
    )
      return;

    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    let result;
    switch (this.operator) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = current !== 0 ? prev / current : "Error";
        break;
      case "%":
        result = prev % current;
        break;
      default:
        return;
    }

    this.currentInput = result.toString();
    this.previousInput = "";
    this.operator = null;
    this.operatorSymbol = null;
    this.shouldResetDisplay = true;

    this.updateDisplay();
  }

  updateDisplay() {
    let displayValue = "";

    if (this.operator && this.waitingForNewInput) {
      displayValue = `${this.formatNumber(this.previousInput)} ${
        this.operatorSymbol
      }`;
    } else if (this.operator && this.previousInput) {
      displayValue = `${this.formatNumber(this.previousInput)} ${
        this.operatorSymbol
      } ${this.formatNumber(this.currentInput)}`;
    } else {
      displayValue = this.formatNumber(this.currentInput);
    }

    this.display.value = displayValue;
  }

  formatNumber(num) {
    if (num === "Error") return "Error";
    let number = parseFloat(num);
    if (isNaN(number)) return "0";

    if (num.length > 12) {
      if (num.includes(".")) {
        return number.toFixed(8).replace(/\.?0+$/, "");
      } else {
        return number.toExponential(6);
      }
    }
    return num.toString();
  }

  handleKeyboardInput(e) {
    if (e.key >= "0" && e.key <= "9") {
      this.inputNumber(e.key);
    } else if (e.key === ".") {
      this.inputDecimal();
    } else if (e.key === "+") {
      this.inputOperator("+", "+");
    } else if (e.key === "-") {
      this.inputOperator("-", "-");
    } else if (e.key === "*") {
      this.inputOperator("*", "×");
    } else if (e.key === "/") {
      this.inputOperator("/", "/");
    } else if (e.key === "%") {
      this.inputOperator("%", "%");
    } else if (e.key === "Enter" || e.key === "=") {
      e.preventDefault();
      this.calculate();
    } else if (e.key === "Escape") {
      this.clearAll();
    } else if (e.key === "Backspace") {
      this.clear();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Calculator();
});
