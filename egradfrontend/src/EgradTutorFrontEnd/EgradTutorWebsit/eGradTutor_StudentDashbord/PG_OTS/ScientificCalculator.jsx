import React, { useState } from "react";
import { evaluate, log, sqrt, sinh, cosh, tanh, asinh, acosh, atanh } from "mathjs";
import "./Style/Calculator.css";

const ScientificCalculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("Deg");
  const [lastFunction, setLastFunction] = useState("");

  const handleClick = (value) => {
    if (!isNaN(value) || value === ".") {
      if (lastFunction) {
        const expression = `${lastFunction}(${value})`;
        const calculatedResult = evaluate(expression);
        setInput(expression);
        setResult(calculatedResult);
        setLastFunction(""); // Clear last function after use
      } else {
        setInput(input + value);
        setResult(result + value);
      }
    } else if (value === "=") {
      handleCalculate();
    } else if (value === "C") {
      handleClear();
    } else if (value === "←") {
      handleBackspace();
    } else if (value === "±") {
      setInput(input + "-");
    } else if (["+", "-", "*", "/"].includes(value)) {
      setInput(input + value);
      setResult(result + value);
    } else {
      setLastFunction(value);
      setInput(value + "(");
    }
  };

  const handleClear = () => {
    setInput("");
    setResult("");
    setLastFunction("");
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
    setResult(result.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      setResult(evaluate(input));
    } catch (error) {
      setResult("Error");
    }
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <div className="calculator">
      <div className="display">
        <input type="text" value={input} readOnly />
        <input type="text" value={result} readOnly />
      </div>
      <div className="buttonscontainer">
        <div className="Calculatordiv1">
          <div className="Calculatorline1">
            <button onClick={() => handleClick("mod")}>mod</button>
            <div className="mode">
              <label>
                <input
                  type="radio"
                  value="Deg"
                  checked={mode === "Deg"}
                  onChange={handleModeChange}
                />
                Deg
              </label>
              <label>
                <input
                  type="radio"
                  value="Rad"
                  checked={mode === "Rad"}
                  onChange={handleModeChange}
                />
                Rad
              </label>
            </div>
          </div>
          <div className="calculatorsubdiv">
            <button className="Calculatorbuttons" onClick={() => handleClick("MC")}>
              MC
            </button>
            <button className="Calculatorbuttons" onClick={() => handleClick("MR")}>
              MR
            </button>
            <button className="Calculatorbuttons" onClick={() => handleClick("MS")}>
              MS
            </button>
            <button className="Calculatorbuttons" onClick={() => handleClick("M+")}>
              M+
            </button>
            <button className="Calculatorbuttons" onClick={() => handleClick("M-")}>
              M-
            </button>
          </div>
        </div>
        <div className="Calculatorline1">
          <button className="Calculatorbuttons" onClick={() => handleClick("sinh")}>
            sinh
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("cosh")}>
            cosh
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("tanh")}>
            tanh
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("exp")}>
            Exp
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("(")}>
            (
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick(")")}>
            )
          </button>
          <button className="Calculatorbuttons" onClick={handleBackspace}>
            ←
          </button>
          <button className="Calculatorbuttons" onClick={handleClear}>
            C
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("±")}>
            +/-
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("sqrt")}>
            √
          </button>
        </div>
        <div className="Calculatorline1">
          <button className="Calculatorbuttons" onClick={() => handleClick("asinh")}>
            sinh⁻¹
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("acosh")}>
            cosh⁻¹
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("atanh")}>
            tanh⁻¹
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("log2")}>
            log₂x
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("ln")}>
            ln
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("log")}>
            log
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("7")}>
            7
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("8")}>
            8
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("9")}>
            9
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("/")}>
            /
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("%")}>
            %
          </button>
        </div>
        <div className="Calculatorline1">
          <button className="Calculatorbuttons" onClick={() => handleClick("pi")}>
            π
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("e")}>
            e
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("n!")}>
            n!
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("log")}>
            log<sub>y</sub>x
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("exp")}>
            e<sup>x</sup>
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("10^")}>
            10<sup>x</sup>
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("4")}>
            4
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("5")}>
            5
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("6")}>
            6
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("*")}>
            *
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("1/x")}>
            1/x
          </button>
        </div>
        <div className="Calculatorline1">
          <button className="Calculatorbuttons" onClick={() => handleClick("sin")}>
            sin
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("cos")}>
            cos
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("tan")}>
            tan
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("x^")}>
            xʸ
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("x^3")}>
            x³
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("x^2")}>
            x²
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("1")}>
            1
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("2")}>
            2
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("3")}>
            3
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("-")}>
            -
          </button>
        </div>
        <div className="Calculatorline1">
          <button className="Calculatorbuttons" onClick={() => handleClick("x!")}>
            x!
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("3√x")}>
            ³√x
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("∛")}>
            ∛
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("n!")}>
            n!
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("0")}>
            0
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick(".")}>
            .
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("+")}>
            +
          </button>
          <button className="Calculatorbuttons" onClick={() => handleClick("=")}>
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
