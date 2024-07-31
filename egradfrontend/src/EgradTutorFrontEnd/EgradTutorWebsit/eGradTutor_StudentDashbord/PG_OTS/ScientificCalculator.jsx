// import React, { useState } from "react";
// import { evaluate, log, sqrt, sinh, cosh, tanh, asinh, acosh, atanh } from "mathjs";
// import "./Style/Calculator.css";

// const ScientificCalculator = () => {
//   const [input, setInput] = useState("");
//   const [result, setResult] = useState("");
//   const [mode, setMode] = useState("Deg");
//   const [lastFunction, setLastFunction] = useState("");

//   const handleClick = (value) => {
//     if (!isNaN(value) || value === ".") {
//       if (lastFunction) {
//         const expression = `${lastFunction}(${value})`;
//         const calculatedResult = evaluate(expression);
//         setInput(expression);
//         setResult(calculatedResult);
//         setLastFunction(""); // Clear last function after use
//       } else {
//         setInput(input + value);
//         setResult(result + value);
//       }
//     } else if (value === "=") {
//       handleCalculate();
//     } else if (value === "C") {
//       handleClear();
//     } else if (value === "←") {
//       handleBackspace();
//     } else if (value === "±") {
//       setInput(input + "-");
//     } else if (["+", "-", "*", "/"].includes(value)) {
//       setInput(input + value);
//       setResult(result + value);
//     } else {
//       setLastFunction(value);
//       setInput(value + "(");
//     }
//   };

//   const handleClear = () => {
//     setInput("");
//     setResult("");
//     setLastFunction("");
//   };

//   const handleBackspace = () => {
//     setInput(input.slice(0, -1));
//     setResult(result.slice(0, -1));
//   };

//   const handleCalculate = () => {
//     try {
//       setResult(evaluate(input));
//     } catch (error) {
//       setResult("Error");
//     }
//   };

//   const handleModeChange = (event) => {
//     setMode(event.target.value);
//   };

//   return (
//     <div className="calculator">
//       <div className="display">
//         <input type="text" value={input} readOnly />
//         <input type="text" value={result} readOnly />
//       </div>
//       <div className="buttonscontainer">
//         <div className="Calculatordiv1">
//           <div className="Calculatorline1">
//             <button onClick={() => handleClick("mod")}>mod</button>
//             <div className="mode">
//               <label>
//                 <input
//                   type="radio"
//                   value="Deg"
//                   checked={mode === "Deg"}
//                   onChange={handleModeChange}
//                 />
//                 Deg
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   value="Rad"
//                   checked={mode === "Rad"}
//                   onChange={handleModeChange}
//                 />
//                 Rad
//               </label>
//             </div>
//           </div>
//           <div className="calculatorsubdiv">
//             <button className="Calculatorbuttons" onClick={() => handleClick("MC")}>
//               MC
//             </button>
//             <button className="Calculatorbuttons" onClick={() => handleClick("MR")}>
//               MR
//             </button>
//             <button className="Calculatorbuttons" onClick={() => handleClick("MS")}>
//               MS
//             </button>
//             <button className="Calculatorbuttons" onClick={() => handleClick("M+")}>
//               M+
//             </button>
//             <button className="Calculatorbuttons" onClick={() => handleClick("M-")}>
//               M-
//             </button>
//           </div>
//         </div>
//         <div className="Calculatorline1">
//           <button className="Calculatorbuttons" onClick={() => handleClick("sinh")}>
//             sinh
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("cosh")}>
//             cosh
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("tanh")}>
//             tanh
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("exp")}>
//             Exp
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("(")}>
//             (
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick(")")}>
//             )
//           </button>
//           <button className="Calculatorbuttons" onClick={handleBackspace}>
//             ←
//           </button>
//           <button className="Calculatorbuttons" onClick={handleClear}>
//             C
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("±")}>
//             +/-
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("sqrt")}>
//             √
//           </button>
//         </div>
//         <div className="Calculatorline1">
//           <button className="Calculatorbuttons" onClick={() => handleClick("asinh")}>
//             sinh⁻¹
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("acosh")}>
//             cosh⁻¹
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("atanh")}>
//             tanh⁻¹
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("log2")}>
//             log₂x
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("ln")}>
//             ln
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("log")}>
//             log
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("7")}>
//             7
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("8")}>
//             8
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("9")}>
//             9
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("/")}>
//             /
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("%")}>
//             %
//           </button>
//         </div>
//         <div className="Calculatorline1">
//           <button className="Calculatorbuttons" onClick={() => handleClick("pi")}>
//             π
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("e")}>
//             e
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("n!")}>
//             n!
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("log")}>
//             log<sub>y</sub>x
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("exp")}>
//             e<sup>x</sup>
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("10^")}>
//             10<sup>x</sup>
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("4")}>
//             4
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("5")}>
//             5
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("6")}>
//             6
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("*")}>
//             *
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("1/x")}>
//             1/x
//           </button>
//         </div>
//         <div className="Calculatorline1">
//           <button className="Calculatorbuttons" onClick={() => handleClick("sin")}>
//             sin
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("cos")}>
//             cos
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("tan")}>
//             tan
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("x^")}>
//             xʸ
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("x^3")}>
//             x³
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("x^2")}>
//             x²
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("1")}>
//             1
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("2")}>
//             2
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("3")}>
//             3
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("-")}>
//             -
//           </button>
//         </div>
//         <div className="Calculatorline1">
//           <button className="Calculatorbuttons" onClick={() => handleClick("x!")}>
//             x!
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("3√x")}>
//             ³√x
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("∛")}>
//             ∛
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("n!")}>
//             n!
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("0")}>
//             0
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick(".")}>
//             .
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("+")}>
//             +
//           </button>
//           <button className="Calculatorbuttons" onClick={() => handleClick("=")}>
//             =
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScientificCalculator;

// css code
// import React, { useState } from "react";
// import * as math from "mathjs";
// import "./Style/Calculator.css";
// const ScientificCalculator = () => {
//   const [input, setInput] = useState("");
//   const [result, setResult] = useState("");
//   const [mode, setMode] = useState("Deg");
//  const handleButtonClick = (value) => {
//   if (value === "π") {
//     setInput(input + Math.PI);
//   } else if (value === "e") {
//     setInput(input + Math.E);
//   } else {
//     setInput(input + value);
//   }
// };
// const handleClear = () => {
//   setInput("");
//   setResult("");
// };

// const handleEvaluate = () => {
//   try {
//     setResult(math.evaluate(input));
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handleBackspace = () => {
//   setInput(input.slice(0, -1));
//   setResult(result.slice(0, -1));
// };

// const handleSqrt = () => {
//   try {
//     setResult(Math.sqrt(math.evaluate(input)));
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handleModeChange = (event) => {
//   setMode(event.target.value);
// };

// const handleTrigFunction = (func) => {
//   try {
//     let value = mode === "Deg" ? math.evaluate(input) * (Math.PI / 180) : math.evaluate(input);
//     switch (func) {
//       case "sin":
//         setResult(math.sin(value));
//         break;
//       case "cos":
//         setResult(math.cos(value));
//         break;
//       case "tan":
//         setResult(math.tan(value));
//         break;
//       case "asin":
//         setResult(mode === "Deg" ? math.asin(math.evaluate(input)) * (180 / Math.PI) : math.asin(math.evaluate(input)));
//         break;
//       case "acos":
//         setResult(mode === "Deg" ? math.acos(math.evaluate(input)) * (180 / Math.PI) : math.acos(math.evaluate(input)));
//         break;
//       case "atan":
//         setResult(mode === "Deg" ? math.atan(math.evaluate(input)) * (180 / Math.PI) : math.atan(math.evaluate(input)));
//         break;
//       case "sinh":
//         setResult(math.sinh(math.evaluate(input)));
//         break;
//       case "cosh":
//         setResult(math.cosh(math.evaluate(input)));
//         break;
//       case "tanh":
//         setResult(math.tanh(math.evaluate(input)));
//         break;
//       case "asinh":
//         setResult(math.asinh(math.evaluate(input)));
//         break;
//       case "acosh":
//         setResult(math.acosh(math.evaluate(input)));
//         break;
//       case "atanh":
//         setResult(math.atanh(math.evaluate(input)));
//         break;
//       default:
//         break;
//     }
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handleLogFunction = (func) => {
//   try {
//     switch (func) {
//       case "log":
//         setResult(math.log10(math.evaluate(input)));
//         break;
//       case "log2":
//         setResult(math.log2(math.evaluate(input)));
//         break;
//       case "loge":
//         setResult(math.log(math.evaluate(input)));
//         break;
//       case "logxy":
//         const [x, y] = input.split(",").map((val) => math.evaluate(val));
//         setResult(math.log(x, y));
//         break;
//       default:
//         break;
//     }
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handlePowerFunction = (func) => {
//   try {
//     switch (func) {
//       case "exp":
//         setResult(math.exp(math.evaluate(input)));
//         break;
//       case "10^x":
//         setResult(math.pow(10, math.evaluate(input)));
//         break;
//       case "x^2":
//         setResult(math.square(math.evaluate(input)));
//         break;
//       case "x^3":
//         setResult(math.cube(math.evaluate(input)));
//         break;
//       case "x^y":
//         const [base, exp] = input.split(",").map((val) => math.evaluate(val));
//         setResult(math.pow(base, exp));
//         break;
//       default:
//         break;
//     }
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handleMod = () => {
//   try {
//     const [x, y] = input.split(",").map((val) => math.evaluate(val));
//     setResult(math.mod(x, y));
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handleFactorial = () => {
//   try {
//     setResult(math.factorial(math.evaluate(input)));
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handlePercentage = () => {
//   try {
//     setResult(math.evaluate(input) / 100);
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handleInverse = () => {
//   try {
//     setResult(1 / math.evaluate(input));
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handleCubRoot = () => {
//   try {
//     setResult(math.cbrt(math.evaluate(input)));
//   } catch (error) {
//     setResult("Error");
//   }
// };

// const handleAbs = () => {
//   try {
//     setResult(math.abs(math.evaluate(input)));
//   } catch (error) {
//     setResult("Error");
//   }
// };

//   return (
//     <div className="Calculatormaindiv">
//       <div className="Calculatorheader">
//         {" "}
//         <h6>Scientific Calculator</h6>{" "}
//         <div className="Calculatorheaderright">
//           <button className="Calculatorhelp">Help</button>
//           <i class="fa-solid fa-minus"></i>
//           <i class="fa-solid fa-xmark"></i>
//         </div>
//       </div>

//       <div className="calculator1">
//         <input type="text" value={input} readOnly className="calculatorinput" />
//         <div className="result">{result}</div>
//         <div className="calculatorbuttons">
//           <div className="firstcolom">
//               <button className="calculatorbutton" onClick={handleMod}>mod</button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("sinh")}
//             >
//               sinh
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("asinh")}
//             >
//               sinh⁻¹
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("π")}
//             >
//               {" "}
//               π
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("sin")}
//             >
//               sin
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("asin")}
//             >
//               sin⁻¹
//             </button>
//           </div>
//           <div className="firstcolom">
//             <div className="mode">
//               <label>
//                 <input
//                   type="radio"
//                   value="Deg"
//                   checked={mode === "Deg"}
//                   onChange={handleModeChange}
//                 />
//                 Deg
//               </label>
//             </div>

//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("cosh")}
//             >
//               cosh
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("acosh")}
//             >
//               cosh⁻¹
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("e")}
//             >
//               e
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("cos")}
//             >
//               cos
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("acos")}
//             >
//               cos⁻¹
//             </button>
//           </div>
//           <div className="firstcolom">
//           <div className="mode">
//           <label>
//               <input
//                 type="radio"
//                 value="Rad"
//                 checked={mode === "Rad"}
//                 onChange={handleModeChange}
//               />
//               Rad
//             </label>
//           </div>

//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("tanh")}
//             >
//               tanh
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("atanh")}
//             >
//               tanh⁻¹
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("n!")}
//             >
//               n!
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("tan")}
//             >
//               tan
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleTrigFunction("atan")}
//             >
//               tan⁻¹
//             </button>
//           </div>
//           <div className="threedcolom">
//             <button className="calculatorbutton">Exp</button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleLogFunction("log2")}
//             >
//               log₂X
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleLogFunction("logxy")}
//             >
//               logₓy
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handlePowerFunction("x^y")}
//             >
//               xʸ
//             </button>
//             <button className="calculatorbutton">³√x</button>
//           </div>
//           <div className="threedcolom">
//             <button className="calculatorbutton">(</button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleLogFunction("loge")}
//             >
//               ln
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handlePowerFunction("exp")}
//             >
//               eˣ
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handlePowerFunction("x^3")}
//             >
//               x³
//             </button>
//             <button className="calculatorbutton"> ∛ </button>
//           </div>

//           <div className="threedcolom">
//             <button className="calculatorbutton">)</button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleLogFunction("log")}
//             >
//               log
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handlePowerFunction("10^x")}
//             >
//               10ˣ
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handlePowerFunction("x^2")}
//             >
//               x²
//             </button>
//             <button className="calculatorbutton">|X|</button>
//           </div>
//           <div className="calculatortoplines">
//             <div className="firstlineright">
//               <button className="calculatorbutton">MC</button>
//               <button className="calculatorbutton">MR</button>
//               <button className="calculatorbutton">MS</button>
//               <button className="calculatorbutton">M+</button>
//               <button className="calculatorbutton">M-</button>
//             </div>
//             <div className="firstlineright">
//               <button
//                 className="calculatorbutton calculatorBackspace"
//                 onClick={handleBackspace}
//               >
//                 <i class="fa-solid fa-arrow-left"></i>
//               </button>
//               <button
//                 className="calculatorbutton calculatorClear"
//                 onClick={handleClear}
//               >
//                 C
//               </button>
//               <button className="calculatorbutton calculatorClear">+/-</button>
//               <button className="calculatorbutton" onClick={handleSqrt}>
//                 √
//               </button>
//             </div>
//             <div className="firstlineright">
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("7")}
//             >
//               7
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("8")}
//             >
//               8
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("9")}
//             >
//               9
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("/")}
//             >
//               /
//             </button>
//             <button   className="calculatorbutton">%</button>

//             </div>
//             <div className="firstlineright">
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("4")}
//             >
//               4
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("5")}
//             >
//               5
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("6")}
//             >
//               6
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("*")}
//             >
//               *
//             </button>
//             <button className="calculatorbutton">1/x</button>
//             </div>
//             <div className="secondlineright">
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("1")}
//             >
//               1
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("2")}
//             >
//               2
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("3")}
//             >
//               3
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("-")}
//             >
//               -
//             </button>
//             </div>

//             <div className="calculatorequalto">
//             <button className="calculatorbutton calculatorequalto1" onClick={handleEvaluate}>
//             =
//           </button>
//             </div>
//             <div className="secondlineright" >
//             <button
//               className="calculatorbutton calculatorzero"
//               onClick={() => handleButtonClick("0")}
//             >
//               0
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick(".")}
//             >
//               .
//             </button>
//             <button
//               className="calculatorbutton"
//               onClick={() => handleButtonClick("+")}
//             >
//               +
//             </button>
//             </div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default ScientificCalculator;

// new code with css

import React, { useState } from "react";
import * as math from "mathjs";
import "./Style/Calculator.css";

const ScientificCalculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("Deg");

  const handleButtonClick = (value) => {
    if (value === "π") {
      setInput(input + Math.PI);
    } else if (value === "e") {
      setInput(input + Math.E);
    } else {
      setInput(input + value);
    }
  };
  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleEvaluate = () => {
    try {
      setResult(math.evaluate(input));
    } catch (error) {
      setResult("Error");
    }
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
    setResult(result.slice(0, -1));
  };

  const handleSqrt = () => {
    try {
      setResult(Math.sqrt(math.evaluate(input)));
    } catch (error) {
      setResult("Error");
    }
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleTrigFunction = (func) => {
    try {
      let value =
        mode === "Deg"
          ? math.evaluate(input) * (Math.PI / 180)
          : math.evaluate(input);
      switch (func) {
        case "sin":
          setResult(math.sin(value));
          break;
        case "cos":
          setResult(math.cos(value));
          break;
        case "tan":
          setResult(math.tan(value));
          break;
        case "asin":
          setResult(
            mode === "Deg"
              ? math.asin(math.evaluate(input)) * (180 / Math.PI)
              : math.asin(math.evaluate(input))
          );
          break;
        case "acos":
          setResult(
            mode === "Deg"
              ? math.acos(math.evaluate(input)) * (180 / Math.PI)
              : math.acos(math.evaluate(input))
          );
          break;
        case "atan":
          setResult(
            mode === "Deg"
              ? math.atan(math.evaluate(input)) * (180 / Math.PI)
              : math.atan(math.evaluate(input))
          );
          break;
        case "sinh":
          setResult(math.sinh(math.evaluate(input)));
          break;
        case "cosh":
          setResult(math.cosh(math.evaluate(input)));
          break;
        case "tanh":
          setResult(math.tanh(math.evaluate(input)));
          break;
        case "asinh":
          setResult(math.asinh(math.evaluate(input)));
          break;
        case "acosh":
          setResult(math.acosh(math.evaluate(input)));
          break;
        case "atanh":
          setResult(math.atanh(math.evaluate(input)));
          break;
        default:
          break;
      }
    } catch (error) {
      setResult("Error");
    }
  };

  const handleLogFunction = (func) => {
    try {
      switch (func) {
        case "log":
          setResult(math.log10(math.evaluate(input)));
          break;
        case "log2":
          setResult(math.log2(math.evaluate(input)));
          break;
        case "loge":
          setResult(math.log(math.evaluate(input)));
          break;
        case "logxy":
          const [x, y] = input.split(",").map((val) => math.evaluate(val));
          setResult(math.log(x, y));
          break;
        default:
          break;
      }
    } catch (error) {
      setResult("Error");
    }
  };

  const handlePowerFunction = (func) => {
    try {
      switch (func) {
        case "exp":
          setResult(math.exp(math.evaluate(input)));
          break;
        case "10^x":
          setResult(math.pow(10, math.evaluate(input)));
          break;
        case "x^2":
          setResult(math.square(math.evaluate(input)));
          break;
        case "x^3":
          setResult(math.cube(math.evaluate(input)));
          break;
        case "x^y":
          const [base, exp] = input.split(",").map((val) => math.evaluate(val));
          setResult(math.pow(base, exp));
          break;
        default:
          break;
      }
    } catch (error) {
      setResult("Error");
    }
  };

  const handleMod = () => {
    try {
      const [x, y] = input.split(",").map((val) => math.evaluate(val));
      setResult(math.mod(x, y));
    } catch (error) {
      setResult("Error");
    }
  };

  const handleFactorial = () => {
    try {
      setResult(math.factorial(math.evaluate(input)));
    } catch (error) {
      setResult("Error");
    }
  };

  const handlePercentage = () => {
    try {
      setResult(math.evaluate(input) / 100);
    } catch (error) {
      setResult("Error");
    }
  };

  const handleInverse = () => {
    try {
      setResult(1 / math.evaluate(input));
    } catch (error) {
      setResult("Error");
    }
  };

  const handleCubRoot = () => {
    try {
      setResult(math.cbrt(math.evaluate(input)));
    } catch (error) {
      setResult("Error");
    }
  };

  const handleAbs = () => {
    try {
      setResult(math.abs(math.evaluate(input)));
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <div className="Calculatormaindiv">
      <div className="Calculatorheader">
        {" "}
        <h6>Scientific Calculator</h6>{" "}
        <div className="Calculatorheaderright">
          <button className="Calculatorhelp">Help</button>
          <i className="fa-solid fa-minus"></i>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>

      <div className="calculator1">
        <input type="text" value={input} readOnly className="calculatorinput" />
        <div className="calculatorinput">{result}</div>
        <div className="calculatorbuttons">
          <div className="firstcolom">
            <button className="calculatorbutton" onClick={handleMod}>
              mod
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("sinh")}
            >
              sinh
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("asinh")}
            >
              sinh⁻¹
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleButtonClick("π")}
            >
              π
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("sin")}
            >
              sin
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("asin")}
            >
              sin⁻¹
            </button>
          </div>
          <div className="firstcolom">
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
            </div>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("cosh")}
            >
              cosh
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("acosh")}
            >
              cosh⁻¹
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleButtonClick("e")}
            >
              e
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("cos")}
            >
              cos
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("acos")}
            >
              cos⁻¹
            </button>
          </div>
          <div className="firstcolom">
            <div className="mode">
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
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("tanh")}
            >
              tanh
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("atanh")}
            >
              tanh⁻¹
            </button>
            <button className="calculatorbutton" onClick={handleFactorial}>
              n!
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("tan")}
            >
              tan
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleTrigFunction("atan")}
            >
              tan⁻¹
            </button>
          </div>
          <div className="threedcolom">
            <button
              className="calculatorbutton"
              onClick={() => handlePowerFunction("exp")}
            >
              Exp
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleLogFunction("log2")}
            >
              log₂X
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleLogFunction("logxy")}
            >
              logₓy
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handlePowerFunction("x^y")}
            >
              xʸ
            </button>
            <button className="calculatorbutton" onClick={handleCubRoot}>
              ³√x
            </button>
          </div>
          <div className="threedcolom">
            <button
              className="calculatorbutton"
              onClick={() => handleButtonClick("(")}
            >
              (
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleLogFunction("loge")}
            >
              ln
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handlePowerFunction("exp")}
            >
              eˣ
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handlePowerFunction("x^3")}
            >
              x³
            </button>
            <button className="calculatorbutton" onClick={handleCubRoot}>
              {" "}
              ∛{" "}
            </button>
          </div>
          <div className="threedcolom">
            <button
              className="calculatorbutton"
              onClick={() => handleButtonClick(")")}
            >
              )
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handleLogFunction("log")}
            >
              log
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handlePowerFunction("10^x")}
            >
              10ˣ
            </button>
            <button
              className="calculatorbutton"
              onClick={() => handlePowerFunction("x^2")}
            >
              x²
            </button>
            <button className="calculatorbutton" onClick={handleAbs}>
              |X|
            </button>
          </div>
          <div className="calculatortoplines">
            <div className="firstlineright">
              <button className="calculatorbutton">MC</button>
              <button className="calculatorbutton">MR</button>
              <button className="calculatorbutton">MS</button>
              <button className="calculatorbutton">M+</button>
              <button className="calculatorbutton">M-</button>
            </div>
            <div className="firstlineright">
              <button
                className="calculatorbutton calculatorBackspace"
                onClick={handleBackspace}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button
                className="calculatorbutton calculatorClear"
                onClick={handleClear}
              >
                C
              </button>
              <button className="calculatorbutton">+/-</button>
              <button className="calculatorbutton" onClick={handleSqrt}>
                √
              </button>
            </div>
            <div className="firstlineright">
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("7")}
              >
                7
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("8")}
              >
                8
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("9")}
              >
                9
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("/")}
              >
                /
              </button>
              <button className="calculatorbutton" onClick={handlePercentage}>
                %
              </button>
            </div>
            <div className="firstlineright">
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("4")}
              >
                4
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("5")}
              >
                5
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("6")}
              >
                6
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("*")}
              >
                *
              </button>
              <button className="calculatorbutton" onClick={handleInverse}>
                1/x
              </button>
            </div>
            <div className="secondlineright">
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("1")}
              >
                1
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("2")}
              >
                2
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("3")}
              >
                3
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("-")}
              >
                -
              </button>
            </div>
            <div className="calculatorequalto">
              <button
                className="calculatorbutton calculatorequalto1"
                onClick={handleEvaluate}
              >
                =
              </button>
            </div>
            <div className="secondlineright">
              <button
                className="calculatorbutton calculatorzero"
                onClick={() => handleButtonClick("0")}
              >
                0
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick(".")}
              >
                .
              </button>
              <button
                className="calculatorbutton"
                onClick={() => handleButtonClick("+")}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
