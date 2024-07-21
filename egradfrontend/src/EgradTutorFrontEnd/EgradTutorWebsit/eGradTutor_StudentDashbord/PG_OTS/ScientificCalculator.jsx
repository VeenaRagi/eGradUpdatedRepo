import React, { useState } from "react";
import { evaluate } from "mathjs";
import "./Style/Calculator.css";

const ScientificCalculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("Deg");

  const handleClick = (value) => {
    setInput(input + value);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
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
            <button onClick={() => handleClick("0mod")}>mod</button>
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
            <button
              className="Calculatorbuttons"
              onClick={() => handleClick("MC")}
            >
              MC
            </button>
            <button
              className="Calculatorbuttons"
              onClick={() => handleClick("MR")}
            >
              MR
            </button>
            <button
              className="Calculatorbuttons"
              onClick={() => handleClick("MS")}
            >
              MS
            </button>
            <button
              className="Calculatorbuttons"
              onClick={() => handleClick("M+")}
            >
              M+
            </button>
            <button
              className="Calculatorbuttons"
              onClick={() => handleClick("M-")}
            >
              M-
            </button>
          </div>
        </div>
        <div className="Calculatorline1">
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("sinhd(0)")}
          >
            sinh
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("coshd(0)")}
          >
            cosh
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("tanhd(0)")}
          >
            tanh
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("0e+0")}
          >
            Exp
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("(")}
          >
            (
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick(")")}
          >
            )
          </button>
          <button className="Calculatorbuttons" onClick={handleBackspace}>
            ←
          </button>
          <button className="Calculatorbuttons" onClick={handleClear}>
            C
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("±")}
          >
            +/-
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("sqrt(0)")}
          >
            √
          </button>
        </div>
        <div className="Calculatorline1">
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("sinh-1d(0)")}
          >
            sinh⁻¹
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("cosh-1d(0)")}
          >
            cosh⁻¹
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("tanh-1d(0)")}
          >
            tanh⁻¹
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("logxbase2(0)")}
          >
            log₂x
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("ln(0)")}
          >
            ln
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("log(0)")}
          >
            log
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("7")}
          >
            7
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("8")}
          >
            8
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("9")}
          >
            9
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("/")}
          >
            /
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("%")}
          >
            %
          </button>
        </div>
        <div className="Calculatorline1">
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("3.141592653589793")}
          >
            π
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("2.718281828459045")}
          >
            e
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("fact(0)")}
          >
            n!
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("0logxBasey")}
          >
            log<sub>y</sub>x
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("powe(0)")}
          >
            e<sup>x</sup>
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("powten(0)")}
          >
            10<sup>x</sup>
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("4")}
          >
            4
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("5")}
          >
            5
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("6")}
          >
            6
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("*")}
          >
            *
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("reciproc(0)")}
          >
            1/x
          </button>
        </div>
        <div className="Calculatorline1">
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("sind(0)")}
          >
            sin
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("cosd(0)")}
          >
            cos
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("tand(0)")}
          >
            tan
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("0^")}
          >
            xʸ
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("cube(0)")}
          >
            x³
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("sqr(0)")}
          >
            x²
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("1")}
          >
            1
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("2")}
          >
            2
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("3")}
          >
            3
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("-")}
          >
            -
          </button>
        </div>
        <div className="Calculatorline1">
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("asind(0)")}
          >
            sin⁻¹
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("acosd(0)")}
          >
            cos⁻¹
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("atand(0)")}
          >
            tan⁻¹
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("0yroot")}
          >
            y√x
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("cuberoot(0)")}
          >
            a√x
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("abs(0)")}
          >
            |x|
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("0")}
          >
            0
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick(".")}
          >
            .
          </button>
          <button
            className="Calculatorbuttons"
            onClick={() => handleClick("+")}
          >
            +
          </button>
        </div>
        <div>
          <button onClick={handleCalculate}>=</button>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
