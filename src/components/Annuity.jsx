import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';

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
    },
    step2: {
      title: "How does each variable affect the present value?",
      questions: [
        {
          variable: "PMT",
          text: "If the monthly payment (PMT) increases, the present value will:",
          options: ["Increase", "Decrease", "Stay the same"],
          correct: "Increase"
        },
        {
          variable: "r",
          text: "If the interest rate (r) increases, the present value will:",
          options: ["Increase", "Decrease", "Stay the same"],
          correct: "Decrease"
        },
        {
          variable: "n",
          text: "If the number of periods (n) increases, the present value will:",
          options: ["Increase", "Decrease", "Stay the same"],
          correct: "Increase"
        }
      ]
    }
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
      title: "Identify the values from the problem, then drag and drop the values into the formula:",
      equation: "FV = [PMT] × ((1 + [r])[n] - 1) ÷ [r]",
      hints: {
        PMT: "Look for the monthly deposit amount in the problem",
        r: "Convert the annual interest rate to a monthly decimal",
        n: "Calculate the total number of monthly deposits"
      }
    },
    step2: {
      title: "How does each variable affect the future value?",
      questions: [
        {
          variable: "PMT",
          text: "If the monthly deposit (PMT) increases, the future value will:",
          options: ["Increase", "Decrease", "Stay the same"],
          correct: "Increase"
        },
        {
          variable: "r",
          text: "If the interest rate (r) increases, the future value will:",
          options: ["Increase", "Decrease", "Stay the same"],
          correct: "Increase"
        },
        {
          variable: "n",
          text: "If the number of periods (n) increases, the future value will:",
          options: ["Increase", "Decrease", "Stay the same"],
          correct: "Increase"
        }
      ]
    }
  }
];

const Annuity = () => {
  const [practiceType, setPracticeType] = useState('present');
  const [questionIndices, setQuestionIndices] = useState({
    present: 0,
    future: 0
  });
  const [currentSteps, setCurrentSteps] = useState({
    present: 1,
    future: 1
  });
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
    present: {
      PMT: null,
      r1: null,
      r2: null,
      n: null
    },
    future: {
      PMT: null,
      r1: null,
      r2: null,
      n: null
    }
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
    present: {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false
    },
    future: {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false
    }
  });
  const [stepAnswers, setStepAnswers] = useState({
    step1: ''
  });
  const [completedSteps, setCompletedSteps] = useState({
    present: {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false
    },
    future: {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false
    }
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
    present: {
      PMT: null,
      r1: null,
      r2: null,
      n: null
    },
    future: {
      PMT: null,
      r1: null,
      r2: null,
      n: null
    }
  });
  const [step2Answers, setStep2Answers] = useState({
    present: {
      PMT: null,
      r1: null,
      r2: null,
      n: null
    },
    future: {
      PMT: null,
      r1: null,
      r2: null,
      n: null
    }
  });
  const [step5Answer, setStep5Answer] = useState({
    present: '',
    future: ''
  });
  const [isGlowActive, setIsGlowActive] = useState(true);
  const [showNavigationButtons, setShowNavigationButtons] = useState({
    present: false,
    future: false
  });
  const [navigationDirection, setNavigationDirection] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState({
    present: [],
    future: []
  });
  const [isNavigating, setIsNavigating] = useState({
    present: false,
    future: false
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
    const currentIndex = questionIndices[practiceType];
    const currentQuestion = questions[currentIndex];
    setDraggableBoxes([
      { id: 'payment-1', value: `$${currentQuestion.payment}`, type: 'payment' },
      { id: 'rate-1', value: `${currentQuestion.rate}%`, type: 'rate' },
      { id: 'periods-1', value: currentQuestion.periods, type: 'periods' }
    ]);
  }, [practiceType, questionIndices]);

  useEffect(() => {
    const allStepsCompleted = Object.values(completedSteps[practiceType]).every(step => step === true);
    if (allStepsCompleted) {
      setShowNavigationButtons(prev => ({
        ...prev,
        [practiceType]: true
      }));
      setIsNavigating(prev => ({
        ...prev,
        [practiceType]: true
      }));
    }
  }, [completedSteps, practiceType]);

  const calculatePresentValue = (pmt, r, n) => {
    return pmt * (1 - Math.pow(1 + r, -n)) / r;
  };

  const calculateFutureValue = (pmt, r, n) => {
    return pmt * (Math.pow(1 + r, n) - 1) / r;
  };

  const nextQuestion = () => {
    if (currentSteps[practiceType] < 5) {
      setCurrentSteps(prev => ({
        ...prev,
        [practiceType]: prev[practiceType] + 1
      }));
    } else {
      const questions = practiceType === 'present' ? presentQuestions : futureQuestions;
      const currentIndex = questionIndices[practiceType];
      const nextIndex = (currentIndex + 1) % questions.length;
      
      setQuestionIndices(prev => ({
        ...prev,
        [practiceType]: nextIndex
      }));
      
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
      setCurrentSteps(prev => ({
        ...prev,
        [practiceType]: 1
      }));
      setCompletedSteps(prev => ({
        ...prev,
        [practiceType]: {
          step1: false,
          step2: false,
          step3: false,
          step4: false,
          step5: false
        }
      }));
      setHasError(prev => ({
        ...prev,
        [practiceType]: {
          step1: false,
          step2: false,
          step3: false,
          step4: false,
          step5: false
        }
      }));
      setStepAnswers({
        step1: ''
      });
      setDraggedNumber(null);
      setDroppedNumbers(prev => ({
        ...prev,
        [practiceType]: {
          PMT: null,
          r1: null,
          r2: null,
          n: null
        }
      }));
      setValidationResults(prev => ({
        ...prev,
        [practiceType]: {
          PMT: null,
          r1: null,
          r2: null,
          n: null
        }
      }));
      setStep2Answers(prev => ({
        ...prev,
        [practiceType]: {
          PMT: null,
          r1: null,
          r2: null,
          n: null
        }
      }));
      setStep5Answer({
        present: '',
        future: ''
      });
    }
  };

  const toggleAnnuityType = () => {
    setPracticeType(prev => {
      const newType = prev === 'present' ? 'future' : 'present';
      const questions = newType === 'present' ? presentQuestions : futureQuestions;
      const currentIndex = questionIndices[newType];
      const question = questions[currentIndex];
      setPayment(question.payment);
      setRate(question.rate);
      setPeriods(question.periods);
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
    setCompletedSteps(prev => ({
      ...prev,
      [practiceType]: {
        ...prev[practiceType],
        [`step${step}`]: true
      }
    }));
    if (step < 3) {
      setCurrentSteps(prev => ({
        ...prev,
        [practiceType]: step + 1
      }));
    }
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
      
      currentX = rect.left - parentRect.left;
      currentY = rect.top - parentRect.top;
      
      setOriginalPosition({ x: currentX, y: currentY });
      
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      setIsDragging(true);
      setIsReturning(false);
      setDraggedNumber(element.textContent);
      
      // Create placeholder with same order as the original element
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.visibility = 'hidden';
      
      // Get the index of the current element
      const flexContainer = element.parentElement;
      const flexItems = Array.from(flexContainer.children);
      const currentIndex = flexItems.indexOf(element);
      
      // Set the same order as the original element
      placeholder.style.order = currentIndex === 0 ? '2' : currentIndex === 1 ? '0' : '1';
      
      element.parentNode.insertBefore(placeholder, element);
      
      element.classList.add('dragging');
      element.style.position = 'fixed';
      element.style.left = `${rect.left}px`;
      element.style.top = `${rect.top}px`;
      element.style.zIndex = '1000';
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
            [practiceType]: {
              ...prev[practiceType],
              [position]: element.textContent
            }
          }));
        }
      } else {
        if (isDroppedBox) {
          const position = element.getAttribute('data-position');
          if (position) {
            setDroppedNumbers(prev => ({
              ...prev,
              [practiceType]: {
                ...prev[practiceType],
                [position]: null
              }
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
      setDroppedNumbers(prev => ({
        ...prev,
        [practiceType]: {
          ...prev[practiceType],
          [position]: draggedNumber
        }
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
      [practiceType]: {
        ...prev[practiceType],
        [position]: ''
      }
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
        r1: { value: rate, validate: input => validateNumeric(input, rate, 'r1') },
        r2: { value: rate, validate: input => validateNumeric(input, rate, 'r2') },
        n: { value: periods, validate: input => validateNumeric(input, periods, 'n') }
      }
    };

    const userInputs = {
      PMT: droppedNumbers[practiceType].PMT,
      r1: droppedNumbers[practiceType].r1,
      r2: droppedNumbers[practiceType].r2,
      n: droppedNumbers[practiceType].n
    };

    let allCorrect = true;
    const validationResults = {};

    Object.keys(userInputs).forEach(key => {
      const isValid = answers[step][key].validate(userInputs[key]);
      validationResults[key] = isValid;
      if (!isValid) allCorrect = false;
    });

    setHasError(prev => ({
      ...prev,
      [practiceType]: {
        ...prev[practiceType],
        [`step${step}`]: !allCorrect
      }
    }));
    setValidationResults(prev => ({
      ...prev,
      [practiceType]: validationResults
    }));
    
    if (allCorrect) {
      setStepAnswers(prev => ({ ...prev, [`step${step}`]: answers[step] }));
      setCompletedSteps(prev => ({
        ...prev,
        [practiceType]: {
          ...prev[practiceType],
          [`step${step}`]: true
        }
      }));
    }
    
    return allCorrect;
  };

  const handleStep2Answer = (variable, answer) => {
    setStep2Answers(prev => ({
      ...prev,
      [practiceType]: {
        ...prev[practiceType],
        [variable]: answer
      }
    }));
    // Reset error state when a new answer is selected
    setHasError(prev => ({
      ...prev,
      [practiceType]: {
        ...prev[practiceType],
        [`step${currentSteps[practiceType]}`]: false
      }
    }));
  };

  const checkStep2Answer = () => {
    const currentQuestion = (practiceType === 'present' 
      ? presentQuestions[questionIndices.present].step2.questions 
      : futureQuestions[questionIndices.future].step2.questions)[currentSteps[practiceType] - 2];
    
    const isCorrect = step2Answers[practiceType][currentQuestion.variable] === currentQuestion.correct;
    
    if (isCorrect) {
      setCompletedSteps(prev => ({
        ...prev,
        [practiceType]: {
          ...prev[practiceType],
          [`step${currentSteps[practiceType]}`]: true
        }
      }));
    } else {
      setHasError(prev => ({
        ...prev,
        [practiceType]: {
          ...prev[practiceType],
          [`step${currentSteps[practiceType]}`]: true
        }
      }));
    }
  };

  const checkStep5Answer = () => {
    const r = rate / 100;
    const correctAnswer = practiceType === 'present'
      ? calculatePresentValue(payment, r, periods)
      : calculateFutureValue(payment, r, periods);
    
    const userAnswer = parseFloat(step5Answer[practiceType]);
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.1;
    
    if (isCorrect) {
      setCompletedSteps(prev => ({
        ...prev,
        [practiceType]: {
          ...prev[practiceType],
          step5: true
        }
      }));
    } else {
      setHasError(prev => ({
        ...prev,
        [practiceType]: {
          ...prev[practiceType],
          step5: true
        }
      }));
    }
  };

  const handleNavigateHistory = (direction) => {
    setNavigationDirection(direction);
    
    if (direction === 'back' && currentSteps[practiceType] > 1) {
      setCurrentSteps(prev => ({
        ...prev,
        [practiceType]: prev[practiceType] - 1
      }));
    } else if (direction === 'forward' && currentSteps[practiceType] < 5) {
      setCurrentSteps(prev => ({
        ...prev,
        [practiceType]: prev[practiceType] + 1
      }));
    }

    // Reset direction after animation
    setTimeout(() => {
      setNavigationDirection(null);
    }, 300);
  };

  return (
    <div className="w-[500px] mx-auto mt-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg select-none">
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        @keyframes rotating {
          from {
            --r: 0deg;
          }
          to {
            --r: 360deg;
          }
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .nav-button {
          opacity: 1;
          cursor: default !important;
          position: relative;
          z-index: 2;
          outline: 2px white solid;
        }

        .nav-button-orbit {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          z-index: 0;
        }

        .nav-button-orbit::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }

        .nav-button svg {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#5750E3] text-sm font-medium select-none">Annuity Explorer</h2>
          <div className="flex gap-2">
            <Button 
              onClick={toggleAnnuityType}
              className="bg-[#008545] hover:bg-[#00783E] text-white text-sm px-3 py-1 rounded-md select-none touch-manipulation"
            >
              {practiceType === 'present' ? 'Future' : 'Present'} Annuity
            </Button>
          </div>
        </div>

        <div className="text-center text-sm mb-4 select-none">
          <div className="font-mono">
            {practiceType === 'present' 
              ? presentQuestions[questionIndices.present].description 
              : futureQuestions[questionIndices.future].description}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="w-full p-2 bg-white border border-[#5750E3]/30 rounded-md">
            {currentSteps[practiceType] === 1 && (
              <>
                <p className="text-sm mb-2 font-bold text-center select-none">{practiceType === 'present' ? presentQuestions[questionIndices.present].step1.title : futureQuestions[questionIndices.future].step1.title}</p>
                <div className="flex flex-wrap gap-2 mb-4 relative justify-center">
                  <div className="flex gap-2 relative z-10">
                    {draggableBoxes.map((box, index) => (
                      <div
                        key={box.id}
                        className={`px-3 py-1 bg-[#5750E3]/10 text-[#5750E3] rounded-md draggable-box hover:bg-[#5750E3]/20 transition-transform duration-200 select-none touch-manipulation ${
                          isDragging && draggedNumber === box.value ? 'scale-110' : ''
                        }`}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, box)}
                        style={{
                          order: index === 0 ? 2 : index === 1 ? 0 : 1
                        }}
                      >
                        {box.value}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 absolute top-0 left-0 z-0 justify-center w-full">
                    <div
                      className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-md select-none transition-transform duration-200 ghost-box border border-gray-300`}
                      style={{ order: 2 }}
                    >
                      ${practiceType === 'present' ? presentQuestions[questionIndices.present].payment : futureQuestions[questionIndices.future].payment}
                    </div>
                    <div
                      className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-md select-none transition-transform duration-200 ghost-box border border-gray-300`}
                      style={{ order: 0 }}
                    >
                      {practiceType === 'present' ? presentQuestions[questionIndices.present].rate : futureQuestions[questionIndices.future].rate}%
                    </div>
                    <div
                      className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-md select-none transition-transform duration-200 ghost-box border border-gray-300`}
                      style={{ order: 1 }}
                    >
                      {practiceType === 'present' ? presentQuestions[questionIndices.present].periods : futureQuestions[questionIndices.future].periods}
                    </div>
                  </div>
                </div>
                {completedSteps[practiceType].step1 ? (
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
                    Object.values(validationResults[practiceType]).every(result => result === true) ? 'text-green-600' : ''
                  }`}>
                    <span>{practiceType === 'present' ? 'PV' : 'FV'} = </span>
                    <div
                      className={`w-16 mx-1 text-center border-2 border-dashed rounded-md drop-zone touch-manipulation ${
                        validationResults[practiceType].PMT === true 
                          ? 'bg-green-100 border-green-500' 
                          : validationResults[practiceType].PMT === false 
                            ? 'bg-yellow-100 border-yellow-500' 
                            : hasError[practiceType].step1 
                              ? 'border-red-500' 
                              : 'border-gray-400'
                      } ${isDragging ? 'drag-over' : ''}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'PMT')}
                      data-position="PMT"
                    >
                      <div className="flex items-center justify-between w-full min-h-[2rem]">
                        <div className="flex-1 text-center">
                          <span className={droppedNumbers[practiceType].PMT ? '' : 'text-gray-400'}>
                            {droppedNumbers[practiceType].PMT || 'PMT'}
                          </span>
                        </div>
                        {droppedNumbers[practiceType].PMT && (
                          <button 
                            className="ml-1 text-gray-400 hover:text-gray-600 touch-manipulation"
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
                          className={`w-16 mx-1 text-center border-2 border-dashed rounded-md drop-zone touch-manipulation ${
                            validationResults[practiceType].r1 === true 
                              ? 'bg-green-100 border-green-500' 
                              : validationResults[practiceType].r1 === false 
                                ? 'bg-yellow-100 border-yellow-500' 
                                : hasError[practiceType].step1 
                                  ? 'border-red-500' 
                                  : 'border-gray-400'
                          } ${isDragging ? 'drag-over' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'r1')}
                          data-position="r1"
                        >
                          <div className="flex items-center justify-between w-full min-h-[2rem]">
                            <div className="flex-1 text-center">
                              <span className={droppedNumbers[practiceType].r1 ? '' : 'text-gray-400'}>
                                {droppedNumbers[practiceType].r1 || 'r'}
                              </span>
                            </div>
                            {droppedNumbers[practiceType].r1 && (
                              <button 
                                className="ml-1 text-gray-400 hover:text-gray-600 touch-manipulation"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove('r1');
                                }}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                        <span>{practiceType === 'present' ? `)⁻` : `)`}</span>
                        <div
                          className={`w-16 mx-1 text-center border-2 border-dashed rounded-md drop-zone relative -top-2 touch-manipulation ${
                            validationResults[practiceType].n === true 
                              ? 'bg-green-100 border-green-500' 
                              : validationResults[practiceType].n === false 
                                ? 'bg-yellow-100 border-yellow-500' 
                                : hasError[practiceType].step1 
                                  ? 'border-red-500' 
                                  : 'border-gray-400'
                          } ${isDragging ? 'drag-over' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'n')}
                          data-position="n"
                        >
                          <div className="flex items-center justify-between w-full min-h-[2rem]">
                            <div className="flex-1 text-center">
                              <span className={droppedNumbers[practiceType].n ? '' : 'text-gray-400'}>
                                {droppedNumbers[practiceType].n || 'n'}
                              </span>
                            </div>
                            {droppedNumbers[practiceType].n && (
                              <button 
                                className="ml-1 text-gray-400 hover:text-gray-600 touch-manipulation"
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
                          className={`w-16 text-center border-2 border-dashed rounded-md drop-zone touch-manipulation ${
                            validationResults[practiceType].r2 === true 
                              ? 'bg-green-100 border-green-500' 
                              : validationResults[practiceType].r2 === false 
                                ? 'bg-yellow-100 border-yellow-500' 
                                : hasError[practiceType].step1 
                                  ? 'border-red-500' 
                                  : 'border-gray-400'
                          } ${isDragging ? 'drag-over' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, 'r2')}
                          data-position="r2"
                        >
                          <div className="flex items-center justify-between w-full min-h-[2rem]">
                            <div className="flex-1 text-center">
                              <span className={droppedNumbers[practiceType].r2 ? '' : 'text-gray-400'}>
                                {droppedNumbers[practiceType].r2 || 'r'}
                              </span>
                            </div>
                            {droppedNumbers[practiceType].r2 && (
                              <button 
                                className="ml-1 text-gray-400 hover:text-gray-600 touch-manipulation"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove('r2');
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
                <div className="mt-8 flex justify-end items-center gap-4">
                  {!completedSteps[practiceType].step1 ? (
                    <>
                      {Object.values(validationResults[practiceType]).some(result => result === false) && (
                        <span className="text-yellow-600 font-bold select-none">Try again!</span>
                      )}
                      <div className={`glow-button ${isGlowActive ? 'simple-glow' : ''}`}>
                        <button 
                          onClick={() => checkStepAnswer(1)}
                          className="px-4 py-2 bg-[#008545] text-white rounded-md hover:bg-[#00783E] transition-colors duration-200 select-none touch-manipulation"
                        >
                          Check
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
                      {!isNavigating[practiceType] && (
                        <>
                          <span className="text-green-600 font-bold select-none">Great Job!</span>
                          <div className={`glow-button ${isGlowActive ? 'simple-glow' : ''}`}>
                            <button 
                              onClick={nextQuestion}
                              className="px-4 py-2 bg-[#008545] text-white rounded-md hover:bg-[#00783E] transition-colors duration-200 select-none touch-manipulation"
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            {currentSteps[practiceType] >= 2 && currentSteps[practiceType] <= 4 && (
              <>
                <div className="space-y-6">
                  {(practiceType === 'present' 
                    ? presentQuestions[questionIndices.present].step2.questions 
                    : futureQuestions[questionIndices.future].step2.questions)
                    .filter((_, index) => index === currentSteps[practiceType] - 2)
                    .map((question, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm font-medium select-none">{question.text}</p>
                      <div className="flex gap-2 justify-center">
                        {question.options.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() => handleStep2Answer(question.variable, option)}
                            disabled={completedSteps[practiceType][`step${currentSteps[practiceType]}`]}
                            className={`w-34 px-4 py-2 rounded-md transition-colors duration-200 select-none touch-manipulation ${
                              step2Answers[practiceType][question.variable] === option
                                ? completedSteps[practiceType][`step${currentSteps[practiceType]}`]
                                  ? 'bg-green-500 text-white'
                                  : hasError[practiceType][`step${currentSteps[practiceType]}`] && step2Answers[practiceType][question.variable] === option
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-[#5750E3] text-white'
                                : 'bg-[#5750E3]/10 text-[#5750E3] hover:bg-[#5750E3]/20'
                            } ${completedSteps[practiceType][`step${currentSteps[practiceType]}`] ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-end items-center gap-4">
                  {completedSteps[practiceType][`step${currentSteps[practiceType]}`] ? (
                    <div className="flex items-center gap-4">
                      {!isNavigating[practiceType] && (
                        <>
                          <span className="text-green-600 font-bold select-none">Great Job!</span>
                          <div className={`glow-button ${isGlowActive ? 'simple-glow' : ''}`}>
                            <button 
                              onClick={nextQuestion}
                              className="px-4 py-2 bg-[#008545] text-white rounded-md hover:bg-[#00783E] transition-colors duration-200 select-none touch-manipulation"
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      {hasError[practiceType][`step${currentSteps[practiceType]}`] && (
                        <span className="text-yellow-600 font-bold select-none">Try again!</span>
                      )}
                      <div className={`glow-button ${isGlowActive ? 'simple-glow' : ''}`}>
                        <button 
                          onClick={checkStep2Answer}
                          className="px-4 py-2 bg-[#008545] text-white rounded-md hover:bg-[#00783E] transition-colors duration-200 select-none touch-manipulation"
                        >
                          Check
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {currentSteps[practiceType] === 5 && (
              <>
                <p className="text-sm mb-4 font-bold text-center select-none">Now solve the equation with the values you identified (round to the nearest hundredth):</p>
                <div className="space-y-6">
                  <div className="text-center font-mono text-lg select-none">
                    <div className="flex items-center justify-center">
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
                  <div className="flex items-center gap-4">
                    {!completedSteps[practiceType].step5 ? (
                      <>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={step5Answer[practiceType]}
                            onChange={(e) => {
                              setStep5Answer(prev => ({
                                ...prev,
                                [practiceType]: e.target.value
                              }));
                              setHasError(prev => ({
                                ...prev,
                                [practiceType]: {
                                  ...prev[practiceType],
                                  step5: false
                                }
                              }));
                            }}
                            placeholder="Enter your answer"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5750E3] select-none touch-manipulation ml-2"
                          />
                        </div>
                        {hasError[practiceType].step5 && !completedSteps[practiceType].step5 && (
                          <span className="text-yellow-600 font-bold select-none ml-2">Try again!</span>
                        )}
                        <div className={`glow-button ${isGlowActive ? 'simple-glow' : ''}`}>
                          <button
                            onClick={checkStep5Answer}
                            className="px-4 py-2 bg-[#008545] text-white rounded-md hover:bg-[#00783E] transition-colors duration-200 select-none touch-manipulation"
                          >
                            Check
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full p-4 bg-green-100 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-bold select-none">Great Job!</span>
                          <span className="text-green-600 font-bold select-none">
                            {practiceType === 'present' ? 'PV' : 'FV'} = {step5Answer[practiceType]}
                          </span>
                        </div>
                        <div className="mt-2 text-left text-green-600 select-none">
                          You've successfully navigated through {practiceType} annuities!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Update the navigation buttons section */}
        <div 
          className="flex items-center justify-center gap-2 mt-4"
          style={{
            display: showNavigationButtons[practiceType] ? 'flex' : 'none'
          }}
        >
          <div
            className="nav-orbit-wrapper"
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              visibility: currentSteps[practiceType] > 1 ? 'visible' : 'hidden',
              opacity: currentSteps[practiceType] > 1 ? 1 : 0,
              pointerEvents: currentSteps[practiceType] > 1 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease',
            }}
          >
            <div className="nav-button-orbit"></div>
            {/* Mask to hide orbit under button */}
            <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
            <button
              onClick={() => handleNavigateHistory('back')}
              className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50 grow-in`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          </div>
          <span className="text-sm text-gray-500 min-w-[100px] text-center">
            Step {currentSteps[practiceType]} of 5
          </span>
          <div
            className="nav-orbit-wrapper"
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              visibility: currentSteps[practiceType] < 5 ? 'visible' : 'hidden',
              opacity: currentSteps[practiceType] < 5 ? 1 : 0,
              pointerEvents: currentSteps[practiceType] < 5 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease',
            }}
          >
            <div className="nav-button-orbit"></div>
            {/* Mask to hide orbit under button */}
            <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
            <button
              onClick={() => handleNavigateHistory('forward')}
              className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annuity;