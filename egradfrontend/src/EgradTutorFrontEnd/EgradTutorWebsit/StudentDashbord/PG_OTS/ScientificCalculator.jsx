
import React, { useEffect, useState } from "react";
import * as math from "mathjs";
import './Style/ScientificCalculator.css'
import Draggable from "react-draggable";
import { FaRegWindowMaximize } from "react-icons/fa";
const ScientificCalculator = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("Deg");
  const [memory, setMemory] = useState(0);
  const [showHelp, setShowHelp] = useState(false)
  const[isMod,setIsMod]=useState(false)
  const[islogXY,setIsLogXY]=useState(false)

  const handleMemoryRecall = () => {
    const operators = ['+', '-', '/', '*'];
    const lastChar = input.charAt(input.length - 1);
    console.log(lastChar, "This is the last charrrrrrr ")
    if (operators.includes(lastChar)) {
      console.log(`The last character is ${lastChar}and is included in the array`);
      setInput(prev => prev + memory.toString());
    }
    else {
      // if (memory !== null)
      setInput(memory.toString());
      console.log("The input value being set issssssssss..........", input);
    }

    console.log(memory, "This is the memory that is stored in the memory variable");
  }
  const handleMemoryClear = () => {
    setMemory(0)
    console.log("The memory is set to 0 again", memory);
    console.log(memory);
  }
  useEffect(() => {
    console.log('Memory:', memory);
    console.log('Result:', result);
  }, [memory, result]); // Dependencies array


  const handleMemoryStore = (event) => {
    // setMemory(event.target.value);
    try {
      const evaluatedResult = math.evaluate(input);
      console.log(evaluatedResult, "This is the evaluated result", result, "Thos os the value that we need to set for the memoru variable")
      console.log(result, "result tat should be displaued pon the input type")
      setResult(evaluatedResult);
      setMemory(evaluatedResult)
    } catch (error) {
      setResult('Error');
    }
  }


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
  const handleBackspace = () => {
    const resultString = result ? result.toString() : "";
    const updatedResult = resultString.slice(0, -1);
    setResult(updatedResult)
    const inputString = input ? input.toString() : "";
    const updatedInput = inputString.slice(0, -1);
    setInput(updatedInput);
    console.log(input, "This is the input after clicking backspace")
  }
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
          const inputValue = math.evaluate(input);
          if (inputValue <= -1 || inputValue >= 1) {
            setResult("NaN ")
          }
          // setResult(math.atanh(math.evaluate(input)));
          else {
            setResult(math.atanh(inputValue).toString());
          }
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
          // const [x, y] = input.split(",").map((val) => math.evaluate(val));
          // setResult(math.log(x, y));
          const [x, y] = input.split(",").map(val => math.evaluate(val.trim()));
          if (x <= 0 || x === 1 || y <= 0) throw new Error("Base must be > 0 and not 1, and argument must be > 0.");
          // setResult(math.log(y) / math.log(x)).toString(); //
          const logBaseY = math.log(y);
          const logBaseX = math.log(x);
          const result = logBaseY / logBaseX;
          return result.toString();
        // break;
        default:
          break;
      }
    } catch (error) {
      setResult("Error");
      console.log(result, "this is the error we got  ", error)
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
  const handleMPlusButton = () => {

    setMemory(prev => prev + parseFloat(input))
    console.log(memory, "This is the memory after clicking the M+ button")
  }
  const handleMMinusButton = () => {
    setMemory(prev => prev - parseFloat(input));
    console.log(memory, "This is the memory after clicking the M- button")
    //if there is a number


  }
  const handleEvaluate = () => {
    if(isMod){
      console.log(input,"this is the input that we have")
      const parts=input.split("Mod");
      console.log(parts,"this is split ")
      if(parts.length===2){
        const valueOne=parseFloat(parts[0].trim());
        console.log(valueOne,"This is value one");
        const valueTwo=parseFloat(parts[1].trim());
        console.log("This is value tow",valueTwo);
        if(!isNaN(valueOne)&&!isNaN(valueTwo)){
          const resultOfMod=math.mod(valueOne,valueTwo)
          console.log(resultOfMod,"This is the result of mod")
          setResult(resultOfMod)
        }

        setIsMod(false)
      }
    }
    else if(islogXY){
      console.log("this is the input for the logxy funciton");
      const parts=input.split("logxBasey");
      console.log(parts,"this is the array that is splitted")
      if(parts.length===2){
        const valueOne=parseFloat(parts[0].trim())
        const valueTwo=parseFloat(parts[1].trim());
        console.log(valueOne,valueTwo,"these are value one and tow for the logxy functions");
        // if(!isNaN(valueOne)&&!isNaN(valueTwo))
        if (!isNaN(valueOne) && !isNaN(valueTwo) && valueTwo !== 1 && valueTwo > 0)
          {
          // const logValue=math.log(valueOne)/math.log(valueTwo)
          const logValue = math.log(valueTwo, valueOne);
          console.log(`log${valueOne}/ log ${valueTwo}`)
          console.log("this is the logyx final result",logValue)
          setResult(logValue)
        }
      }
      setIsLogXY(false)
    }
    else{
    try {
      setResult(math.evaluate(input));
    } catch (error) {
      setResult("Error");
    }
  }
  };
  const handleLogOfXWithBasey=()=>{
    if(input!==null){
      setIsLogXY(true);
      setInput(prev=>prev+"logxBasey")
    }

  }
  const handleMod = () => {
    if(!input.includes("Mod")){
      setInput(prev=>prev+"Mod")
    }
    if(input===null){
      setResult("Error")
    }
    else{
      setIsMod(true)
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

  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const closePopup = () => {
    setIsVisible(false);
  };

  const minimizePopup = () => {
    setIsMinimized(prev => !prev);

  };
  const handleHelpClick = ({ onClose }) => {
    setShowHelp(prev => !prev);
  }
  return (
    <Draggable>
      
      <div className={isMinimized ? "hideTheCalc Calculatormaindivpopup" : "Calculatormaindiv Calculatormaindivpopup"}>
        <div className="Calculatorheader">
          {" "}
          <h4 className="calcName">Scientific Calculator</h4>{" "}
          <div className={`Calculatorheaderright ${isMinimized ? 'minimized' : ''} ${isVisible ? 'show' : ''}`}>
            <button className="Calculatorhelp" onClick={handleHelpClick} >
              {showHelp ? "Back" : "Help"}
            </button>
            {isMinimized ?
              (<FaRegWindowMaximize style={{ fontSize: "28px", cursor: "pointer" }} onClick={minimizePopup} />) :
              (<i className="fa-solid fa-minus minusButton" onClick={minimizePopup}></i>)
            }
            <i className="fa-solid fa-xmark" onClick={onClose}></i>
          </div>
        </div>

        {showHelp ? (<>
          <div className="helpDivInCalc">
            <h2 className="instructionsHeading">Calculator Instructions</h2>
            <div>
              <p> You can operate the calculator using the buttons provided on screen with your mouse. </p>
              <p>
                Allows you to perform basic and complex mathematical operations such as modulus, square root, cube root, trigonometric, exponential, logarithmic, hyperbolic functions, etc.</p>
            </div>
            <h2 className="headdingDos">Do's:</h2>
            <ul>
              <li> Be sure to press [C] when beginning a new calculation.</li>
              <li> Simply an equation using parenthesis and other mathematical operators.</li>
              <li> Use the predefined operations such as p (Pi), log, Exp to save time during calculation.</li>
              <li> Use memory function for calculating cumulative totals.</li>
              <strong>
                [M+]: Will add displayed value to memory.
              </strong>
              <br />
              <strong>
                [MR]: Will recall the value stored in memory.
              </strong>
              <br />
              <strong>
                [M-]: Subtracts the displayed value from memory.
              </strong>
              <br />
              <li> Be sure select the angle unit (Deg or Rad) before beginning any calculation.</li>
              <strong>Note: By default angle unit is set as Degree</strong>
            </ul>
            <h2 className="toBeRed"><span>Don'ts:</span></h2>
            <ul>
              <li>"Perform multiple operations together."</li>
              <li>"Leave parenthesis unbalanced."</li>
              <li>"Change the angle unit (Deg or Rad) while performing a calculation.."</li>
            </ul>
            <h2><span>Limitations:</span></h2>
            <ul>
              <li>"Keyboard operation is disabled."</li>
              <li>"The output for a Factorial calculation is precise up to 14 digits."</li>
              <li>"The output for Logarithmic and Hyperbolic calculations is precise up to 5 digits."</li>
              <li>"Modulus (mod) operation performed on decimal numbers with 15 digits would not be precise."</li>
              <br />
              <strong> Use mod operation only if the number comprises of less than 15 digits i.e. mod operation provides best results for smaller numbers.</strong>
              <br />
              <li>The range of value supported by the calculator is 10(-323) to 10(308).</li>
            </ul>

          </div>
        </>
        ) : (
          <>
            <div className="calculator1 ">
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
                    onClick={
                      // () => handleLogFunction("logxy")
                      handleLogOfXWithBasey

                    }
                  >
                    {/* logₓy */}
                    log<sub>y</sub>x
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
                    <button className="calculatorbutton" onClick={handleMemoryClear}>MC</button>
                    <button className="calculatorbutton" onClick={handleMemoryRecall}>MR</button>
                    <button className="calculatorbutton" onClick={handleMemoryStore} >MS</button>
                    <button className="calculatorbutton" onClick={handleMPlusButton} >M+</button>
                    <button className="calculatorbutton" onClick={handleMMinusButton} >M-</button>
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
                  <div className="secondlineright secondlineright11 ">
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
          </>
        )
        }
      </div>
     </Draggable>
  );
};

export default ScientificCalculator;
