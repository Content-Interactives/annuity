import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const presentQuestions = [
  {
    payment: 2000,
    rate: 0.5,
    periods: 60,
    description: "You're planning to buy a car and the dealership offers a 5-year loan with monthly payments of $2,000. The annual interest rate is 6% (0.5% monthly). What is the present value of this loan?",
    equation: "PV = PMT × (1 - (1 + r)⁻ⁿ) ÷ r",
    inputs: {
      PMT: "Monthly payment amount",
      r: "Monthly interest rate (as a decimal)",
      n: "Total number of payments"
    },
    step1: {
      title: "Identify the values from the problem, then drag and drop the values into the formula:",
      equation: "PV = [PMT] × (1 - (1 + [r])⁻[n]) ÷ [r]",
      hints: {
        PMT: "Look for the monthly payment amount in the problem",
        r: "Convert the annual interest rate to a monthly decimal",
        n: "Calculate the total number of monthly payments"
      }
    }
  },
  {
    payment: 1000,
    rate: 0.75,
    periods: 36,
    description: "Find the present value of $1000 monthly payments for 3 years (36 periods) at 9% annual interest (0.75% monthly)"
  },
  {
    payment: 250,
    rate: 0.25,
    periods: 48,
    description: "Find the present value of $250 monthly payments for 4 years (48 periods) at 3% annual interest (0.25% monthly)"
  },
  {
    payment: 750,
    rate: 1,
    periods: 24,
    description: "Find the present value of $750 monthly payments for 2 years (24 periods) at 12% annual interest (1% monthly)"
  },
  {
    payment: 1500,
    rate: 0.4,
    periods: 72,
    description: "Find the present value of $1500 monthly payments for 6 years (72 periods) at 4.8% annual interest (0.4% monthly)"
  }
];

const futureQuestions = [
  {
    payment: 500,
    rate: 0.5,
    periods: 60,
    description: "You decide to save $500 every month for your child's college education. If you invest this money in an account earning 6% annual interest (0.5% monthly), how much will you have after 5 years?",
    equation: "FV = PMT × ((1 + r)ⁿ - 1) ÷ r",
    inputs: {
      PMT: "Monthly deposit amount",
      r: "Monthly interest rate (as a decimal)",
      n: "Total number of deposits"
    },
    step1: {
      title: "Identify the values from the problem",
      equation: "FV = [PMT] × ((1 + [r])[n] - 1) ÷ [r]",
      hints: {
        PMT: "Look for the monthly deposit amount in the problem",
        r: "Convert the annual interest rate to a monthly decimal",
        n: "Calculate the total number of monthly deposits"
      }
    }
  },
  {
    payment: 800,
    rate: 0.75,
    periods: 36,
    description: "Find the future value of $800 monthly deposits for 3 years (36 periods) at 9% annual interest (0.75% monthly)"
  },
  {
    payment: 400,
    rate: 0.25,
    periods: 48,
    description: "Find the future value of $400 monthly deposits for 4 years (48 periods) at 3% annual interest (0.25% monthly)"
  },
  {
    payment: 1200,
    rate: 1,
    periods: 24,
    description: "Find the future value of $1200 monthly deposits for 2 years (24 periods) at 12% annual interest (1% monthly)"
  },
  {
    payment: 600,
    rate: 0.4,
    periods: 72,
    description: "Find the future value of $600 monthly deposits for 6 years (72 periods) at 4.8% annual interest (0.4% monthly)"
  }
];

const Annuity = () => {
  const [practiceType, setPracticeType] = useState('present');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [payment, setPayment] = useState(presentQuestions[0].payment);
  const [rate, setRate] = useState(presentQuestions[0].rate);
  const [periods, setPeriods] = useState(presentQuestions[0].periods);
  const [currentStep, setCurrentStep] = useState(1);
  const [correctInputs, setCorrectInputs] = useState({
    payment: false,
    rate: false,
    periods: false
  });
  const [draggableBoxes, setDraggableBoxes] = useState([
    { id: 'payment-1', value: `$${presentQuestions[0].payment}`, type: 'payment' },
    { id: 'rate-1', value: `${presentQuestions[0].rate}%`, type: 'rate' },
    { id: 'periods-1', value: presentQuestions[0].periods, type: 'periods' }
  ]);
  const [droppedNumbers, setDroppedNumbers] = useState({
    PMT: null,
    r: null,
    n: null
  });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNumber, setDraggedNumber] = useState(null);
  const [userInput1, setUserInput1] = useState('');
  const [userInput2, setUserInput2] = useState('');
  const [userInput3, setUserInput3] = useState('');
  
  const [formulaFirstPart, setFormulaFirstPart] = useState('');
  const [formulaNumerator, setFormulaNumerator] = useState('');
  const [formulaDenominator, setFormulaDenominator] = useState('');
  const [hasError, setHasError] = useState({
    step1: false
  });
  const [stepAnswers, setStepAnswers] = useState({
    step1: ''
  });
  const [completedSteps, setCompletedSteps] = useState({
    step1: false
  });
  const [draggedPosition, setDraggedPosition] = useState({ x: 0, y: 0 });
  const [isReturning, setIsReturning] = useState(false);
  const [originalPosition, setOriginalPosition] = useState({ x: 0, y: 0 });
  const [originalBoxes, setOriginalBoxes] = useState({
    payment: { value: payment, element: null },
    rate: { value: rate, element: null },
    periods: { value: periods, element: null }
  });
  const [validationResults, setValidationResults] = useState({
    PMT: null,
    r: null,
    n: null
  });

  useEffect(() => {
    setOriginalBoxes({
      payment: { value: payment, element: null },
      rate: { value: rate, element: null },
      periods: { value: periods, element: null }
    });
  }, [payment, rate, periods]);

  useEffect(() => {
    const questions = practiceType === 'present' ? presentQuestions : futureQuestions;
    const currentQuestion = questions[currentQuestionIndex];
    setDraggableBoxes([
      { id: 'payment-1', value: `$${currentQuestion.payment}`, type: 'payment' },
      { id: 'rate-1', value: `${currentQuestion.rate}%`, type: 'rate' },
      { id: 'periods-1', value: currentQuestion.periods, type: 'periods' }
    ]);
  }, [practiceType, currentQuestionIndex]);

  const calculatePresentValue = (pmt, r, n) => {
    return pmt * (1 - Math.pow(1 + r, -n)) / r;
  };

  const calculateFutureValue = (pmt, r, n) => {
    return pmt * (Math.pow(1 + r, n) - 1) / r;
  };

  const nextQuestion = () => {
    const questions = practiceType === 'present' ? presentQuestions : futureQuestions;
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    const question = questions[nextIndex];
    setPayment(question.payment);
    setRate(question.rate);
    setPeriods(question.periods);
    
    setUserInput1('');
    setUserInput2('');
    setUserInput3('');
    setFormulaFirstPart('');
    setFormulaNumerator('');
    setFormulaDenominator('');
    setCurrentStep(1);
    setCompletedSteps({
      step1: false
    });
    setHasError({
      step1: false
    });
    setStepAnswers({
      step1: ''
    });
    setDraggedNumber(null);
    setDroppedNumbers({
      PMT: null,
      r: null,
      n: null
    });
  };

  const toggleAnnuityType = () => {
    setPracticeType(prev => {
      const newType = prev === 'present' ? 'future' : 'present';
      const questions = newType === 'present' ? presentQuestions : futureQuestions;
      const question = questions[0];
      setPayment(question.payment);
      setRate(question.rate);
      setPeriods(question.periods);
      setCurrentQuestionIndex(0);
      return newType;
    });
  };

  const showStepAnswer = (step) => {
    const r = rate / 100;
    const answers = {
      1: payment.toString(),
      2: practiceType === 'present' 
         ? `(1 + (1 + ${r})⁻${periods}) ÷ ${r}`.toString() 
         : `(1 + ${r})${periods} - 1 ÷ ${r}`.toString(),
      3: (practiceType === 'present'
          ? calculatePresentValue(payment, r, periods)
          : calculateFutureValue(payment, r, periods)).toFixed(1)
    };
    
    setStepAnswers(prev => ({ ...prev, [`step${step}`]: answers[step] }));
    setCompletedSteps(prev => ({ ...prev, [`step${step}`]: true }));
    if (step < 3) setCurrentStep(step + 1);
  };

  const dragElement = (element) => {
    let initialX = 0;
    let initialY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDroppedBox = element.classList.contains('has-value');
    
    const dragMouseDown = (e) => {
      e = e || window.event;
      e.preventDefault();
      
      initialX = e.clientX;
      initialY = e.clientY;
      
      const rect = element.getBoundingClientRect();
      const parentRect = element.parentElement.getBoundingClientRect();
      
      const flexContainer = element.parentElement;
      const flexItems = Array.from(flexContainer.children);
      const currentIndex = flexItems.indexOf(element);
      const previousItems = flexItems.slice(0, currentIndex);
      const totalPreviousWidth = previousItems.reduce((sum, item) => {
        const itemRect = item.getBoundingClientRect();
        return sum + itemRect.width;
      }, 0);
      
      currentX = rect.left - parentRect.left - totalPreviousWidth;
      currentY = rect.top - parentRect.top;
      
      setOriginalPosition({ x: currentX, y: currentY });
      
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      setIsDragging(true);
      setIsReturning(false);
      setDraggedNumber(element.textContent);
      
      element.classList.add('dragging');
      element.style.position = 'fixed';
      element.style.left = `${rect.left}px`;
      element.style.top = `${rect.top}px`;
      element.style.zIndex = '1000';
      
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.visibility = 'hidden';
      element.parentNode.insertBefore(placeholder, element);
    };

    const elementDrag = (e) => {
      e = e || window.event;
      e.preventDefault();
      
      const deltaX = e.clientX - initialX;
      const deltaY = e.clientY - initialY;
      
      element.style.left = `${parseFloat(element.style.left) + deltaX}px`;
      element.style.top = `${parseFloat(element.style.top) + deltaY}px`;
      
      initialX = e.clientX;
      initialY = e.clientY;
      
      setDraggedPosition({ x: e.clientX, y: e.clientY });

      const dropZones = document.querySelectorAll('.drop-zone');
      const elementRect = element.getBoundingClientRect();
      const elementCenter = {
        x: elementRect.left + elementRect.width / 2,
        y: elementRect.top + elementRect.height / 2
      };

      dropZones.forEach(zone => {
        const zoneRect = zone.getBoundingClientRect();
        const zoneCenter = {
          x: zoneRect.left + zoneRect.width / 2,
          y: zoneRect.top + zoneRect.height / 2
        };

        const distance = Math.sqrt(
          Math.pow(elementCenter.x - zoneCenter.x, 2) +
          Math.pow(elementCenter.y - zoneCenter.y, 2)
        );

        if (distance < 50) {
          zone.classList.add('snap-target');
        } else {
          zone.classList.remove('snap-target');
        }
      });
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
      setIsDragging(false);
      
      const dropZones = document.querySelectorAll('.drop-zone');
      const elementRect = element.getBoundingClientRect();
      const elementCenter = {
        x: elementRect.left + elementRect.width / 2,
        y: elementRect.top + elementRect.height / 2
      };

      let nearestZone = null;
      let minDistance = Infinity;

      dropZones.forEach(zone => {
        const zoneRect = zone.getBoundingClientRect();
        const zoneCenter = {
          x: zoneRect.left + zoneRect.width / 2,
          y: zoneRect.top + zoneRect.height / 2
        };

        const distance = Math.sqrt(
          Math.pow(elementCenter.x - zoneCenter.x, 2) +
          Math.pow(elementCenter.y - zoneCenter.y, 2)
        );

        if (distance < minDistance && distance < 50) {
          minDistance = distance;
          nearestZone = zone;
        }
      });

      if (nearestZone) {
        const position = nearestZone.getAttribute('data-position');
        if (position) {
          setDroppedNumbers(prev => ({
            ...prev,
            [position]: element.textContent
          }));
        }
      } else {
        if (isDroppedBox) {
          const position = element.getAttribute('data-position');
          if (position) {
            setDroppedNumbers(prev => ({
              ...prev,
              [position]: null
            }));
          }
        }
      }

      const placeholder = element.parentNode.querySelector('.placeholder');
      if (placeholder) {
        placeholder.remove();
      }

      element.classList.remove('dragging');
      element.style.position = '';
      element.style.left = '';
      element.style.top = '';
      element.style.zIndex = '';
      setIsReturning(false);
      setDraggedNumber(null);

      dropZones.forEach(zone => {
        zone.classList.remove('snap-target');
      });
    };

    element.onmousedown = dragMouseDown;
  };

  const handleDragStart = (e, box) => {
    // Store the exact value from the box
    setDraggedNumber(box.value);
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', box.value);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, position) => {
    e.preventDefault();
    setIsDragging(false);
    if (draggedNumber) {
      // Simply copy the exact value to the slot
      setDroppedNumbers(prev => ({
        ...prev,
        [position]: draggedNumber
      }));
      
      const droppedElement = document.querySelector('.draggable-box[style*="opacity: 0"]');
      if (droppedElement) {
        droppedElement.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        droppedElement.style.transform = 'translate(0, 0)';
        droppedElement.style.opacity = '1';
        droppedElement.style.display = '';
      }
    }
  };

  const handleRemove = (position) => {
    setDroppedNumbers(prev => ({
      ...prev,
      [position]: ''
    }));
  };

  useEffect(() => {
    const draggableElements = document.querySelectorAll('.draggable-box');
    draggableElements.forEach(element => {
      element.onmousedown = null;
      dragElement(element);
    });
  }, [draggableBoxes]);

  const checkStepAnswer = (step) => {
    const r = rate / 100;
    
    const validateNumeric = (input, expected, type) => {
      if (!input) return false;
      // Extract just the numeric part for comparison
      const numericValue = parseFloat(input.replace(/[^0-9.-]/g, ''));
      return Math.abs(numericValue - expected) < 0.1;
    };

    const answers = {
      1: {
        PMT: { value: payment, validate: input => validateNumeric(input, payment, 'PMT') },
        r: { value: rate, validate: input => validateNumeric(input, rate, 'r') },
        n: { value: periods, validate: input => validateNumeric(input, periods, 'n') }
      }
    };

    const userInputs = {
      PMT: droppedNumbers.PMT,
      r: droppedNumbers.r,
      n: droppedNumbers.n
    };

    let allCorrect = true;
    const validationResults = {};

    Object.keys(userInputs).forEach(key => {
      const isValid = answers[step][key].validate(userInputs[key]);
      validationResults[key] = isValid;
      if (!isValid) allCorrect = false;
    });

    setHasError(prev => ({ ...prev, [`step${step}`]: !allCorrect }));
    setValidationResults(validationResults);
    
    if (allCorrect) {
      setStepAnswers(prev => ({ ...prev, [`step${step}`]: answers[step] }));
      setCompletedSteps(prev => ({ ...prev, [`step${step}`]: true }));
    }
    
    return allCorrect;
  };

  return (
    <div className="w-[500px] mx-auto mt-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#5750E3] text-sm font-medium">Annuity Explorer</h2>
          <div className="flex gap-2">
            <Button 
              onClick={toggleAnnuityType}
              className="bg-[#5750E3] hover:bg-[#4a42c7] text-white text-sm px-3 py-1 rounded-md"
            >
              {practiceType === 'present' ? 'Future' : 'Present'} Annuity
            </Button>
          </div>
        </div>

        <div className="text-center text-sm mb-4">
          <div className="font-mono">
            {practiceType === 'present' ? presentQuestions[currentQuestionIndex].description : futureQuestions[currentQuestionIndex].description}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="w-full p-2 bg-white border border-[#5750E3]/30 rounded-md">
            {currentStep === 1 && (
              <>
                <p className="text-sm mb-2 font-bold text-center">{practiceType === 'present' ? presentQuestions[currentQuestionIndex].step1.title : futureQuestions[currentQuestionIndex].step1.title}</p>
                <div className="flex flex-wrap gap-2 mb-4 relative justify-center">
                  <div className="flex gap-2 relative z-10">
                    {draggableBoxes.map(box => (
                      <div
                        key={box.id}
                        className={`px-3 py-1 bg-[#5750E3]/10 text-[#5750E3] rounded-md draggable-box hover:bg-[#5750E3]/20 transition-transform duration-200 ${
                          isDragging && draggedNumber === box.value ? 'scale-110' : ''
                        }`}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, box)}
                      >
                        {box.value}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 absolute top-0 left-0 z-0 justify-center w-full">
                    <div
                      className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-md select-none transition-transform duration-200 ghost-box border border-gray-300`}
                    >
                      ${practiceType === 'present' ? presentQuestions[currentQuestionIndex].payment : futureQuestions[currentQuestionIndex].payment}
                    </div>
                    <div
                      className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-md select-none transition-transform duration-200 ghost-box border border-gray-300`}
                    >
                      {practiceType === 'present' ? presentQuestions[currentQuestionIndex].rate : futureQuestions[currentQuestionIndex].rate}%
                    </div>
                    <div
                      className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-md select-none transition-transform duration-200 ghost-box border border-gray-300`}
                    >
                      {practiceType === 'present' ? presentQuestions[currentQuestionIndex].periods : futureQuestions[currentQuestionIndex].periods}
                    </div>
                  </div>
                </div>
                {completedSteps.step1 ? (
                  <div className="text-green-600 font-bold select-none">
                    <div className="flex items-center justify-center font-mono text-lg">
                      <span>{practiceType === 'present' ? 'PV' : 'FV'} = {payment} × </span>
                      <div className="flex flex-col items-center mx-0.5">
                        <div className="border-b border-black min-w-[120px] flex items-center justify-center py-2">
                          {practiceType === 'present' 
                            ? <span>(1 - (1 + {rate/100})<sup>-{periods}</sup>)</span>
                            : <span>((1 + {rate/100})<sup>{periods}</sup> - 1)</span>}
                        </div>
                        <div className="mt-1 min-w-[120px] text-center">
                          {rate/100}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`flex items-center justify-center font-mono text-lg select-none ${
                    Object.values(validationResults).every(result => result === true) ? 'text-green-600' : ''
                  }`}>
                    <span>{practiceType === 'present' ? 'PV' : 'FV'} = </span>
                    <div
                      className={`w-16 mx-1 text-center border-2 border-dashed rounded-md drop-zone ${
                        validationResults.PMT === true 
                          ? 'bg-green-100 border-green-500' 
                          : validationResults.PMT === false 
                            ? 'bg-yellow-100 border-yellow-500' 
                            : hasError.step1 
                              ? 'border-red-500' 
                              : 'border-gray-400'
                      } ${isDragging ? 'drag-over' : ''}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'PMT')}
                      data-position="PMT"
                    >
                      <div className="flex items-center justify-between w-full min-h-[2rem]">
                        <div className="flex-1 text-center">
                          <span className={droppedNumbers.PMT ? '' : 'text-gray-400'}>
                            {droppedNumbers.PMT || 'PMT'}
                          </span>
                        </div>
                        {droppedNumbers.PMT && (
                          <button 
                            className="ml-1 text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove('PMT');
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="mx-0.5">×</span>
                    <div className="flex flex-col items-center mx-0.5">
                      <div className="border-b border-black min-w-[120px] flex items-center justify-center py-2">
                        <span>{practiceType === 'present' ? `(1 - (1 + ` : `((1 + `}</span>
                        <div
                          className={`w-16 mx-1 text-center border-2 border-dashed rounded-md drop-zone ${
                            validationResults.r === true 
                              ? 'bg-green-100 border-green-500' 
                              : validationResults.r === false 
                                ? 'bg-yellow-100 border-yellow-500' 
                                : hasError.step1 
                                  ? 'border-red-500' 
                                  : 'border-gray-400'
                          } ${isDragging ? 'drag-over' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'r')}
                          data-position="r"
                        >
                          <div className="flex items-center justify-between w-full min-h-[2rem]">
                            <div className="flex-1 text-center">
                              <span className={droppedNumbers.r ? '' : 'text-gray-400'}>
                                {droppedNumbers.r || 'r'}
                              </span>
                            </div>
                            {droppedNumbers.r && (
                              <button 
                                className="ml-1 text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove('r');
                                }}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                        <span>{practiceType === 'present' ? `)⁻` : `)`}</span>
                        <div
                          className={`w-16 mx-1 text-center border-2 border-dashed rounded-md drop-zone ${
                            validationResults.n === true 
                              ? 'bg-green-100 border-green-500' 
                              : validationResults.n === false 
                                ? 'bg-yellow-100 border-yellow-500' 
                                : hasError.step1 
                                  ? 'border-red-500' 
                                  : 'border-gray-400'
                          } ${isDragging ? 'drag-over' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'n')}
                          data-position="n"
                        >
                          <div className="flex items-center justify-between w-full min-h-[2rem]">
                            <div className="flex-1 text-center">
                              <span className={droppedNumbers.n ? '' : 'text-gray-400'}>
                                {droppedNumbers.n || 'n'}
                              </span>
                            </div>
                            {droppedNumbers.n && (
                              <button 
                                className="ml-1 text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove('n');
                                }}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                        <span>{practiceType === 'present' ? `)` : ` - 1)`}</span>
                      </div>
                      <div className="mt-1 min-w-[120px] text-center">
                        <div
                          className={`w-16 text-center border-2 border-dashed rounded-md drop-zone ${
                            validationResults.r === true 
                              ? 'bg-green-100 border-green-500' 
                              : validationResults.r === false 
                                ? 'bg-yellow-100 border-yellow-500' 
                                : hasError.step1 
                                  ? 'border-red-500' 
                                  : 'border-gray-400'
                          } ${isDragging ? 'drag-over' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'r')}
                          data-position="r"
                        >
                          <div className="flex items-center justify-between w-full min-h-[2rem]">
                            <div className="flex-1 text-center">
                              <span className={droppedNumbers.r ? '' : 'text-gray-400'}>
                                {droppedNumbers.r || 'r'}
                              </span>
                            </div>
                            {droppedNumbers.r && (
                              <button 
                                className="ml-1 text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove('r');
                                }}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-8 flex justify-start items-center gap-4">
                  <button 
                    onClick={() => checkStepAnswer(1)}
                    className="px-4 py-2 bg-[#5750E3] text-white rounded-full hover:bg-[#4a42c7] transition-colors duration-200"
                  >
                    Check
                  </button>
                  {Object.values(validationResults).some(result => result === false) && (
                    <span className="text-yellow-600 font-bold">Try again!</span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="w-24 p-1 rounded-md bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </Button>
            <span className="text-sm text-gray-500">
              Step {currentStep} of 1
            </span>
            <Button
              onClick={() => setCurrentStep(prev => Math.min(1, prev + 1))}
              disabled={currentStep === 1 || !completedSteps[`step${currentStep}`]}
              className="w-24 p-1 rounded-md bg-[#5750E3] text-white text-sm hover:bg-[#4a42c7] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annuity;