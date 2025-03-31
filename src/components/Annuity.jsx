import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const Annuity = () => {
  const [exampleType, setExampleType] = useState('present');
  const generateInitialProblem = () => {
    const payment = (Math.floor(Math.random() * 10) + 2) * 50;
    const rate = ((Math.floor(Math.random() * 4) + 1) * 25) / 100;
    const periods = Math.floor(Math.random() * 6) + 3;
    return { payment, rate, periods, type: Math.random() < 0.5 ? 'present' : 'future' };
  };

  const initial = generateInitialProblem();
  const [payment, setPayment] = useState(initial.payment);
  const [rate, setRate] = useState(initial.rate);
  const [periods, setPeriods] = useState(initial.periods);
  const [practiceType, setPracticeType] = useState(initial.type);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [correctInputs, setCorrectInputs] = useState({
    payment: false,
    rate: false,
    periods: false,
    firstPart: false,
    numerator: false,
    denominator: false
  });
  // Step 1 inputs
  const [userInput1, setUserInput1] = useState('');
  const [userInput2, setUserInput2] = useState('');
  const [userInput3, setUserInput3] = useState('');
  
  // Step 2 inputs
  const [formulaFirstPart, setFormulaFirstPart] = useState('');
  const [formulaNumerator, setFormulaNumerator] = useState('');
  const [formulaDenominator, setFormulaDenominator] = useState('');
  const [hasError, setHasError] = useState({
    step1: false,
    step2FirstPart: false,
    step2Numerator: false,
    step2Denominator: false,
    step3: false
  });
  const [stepAnswers, setStepAnswers] = useState({
    step1: '',
    step2: '',
    step3: ''
  });
  const [completedSteps, setCompletedSteps] = useState({
    step1: false,
    step2: false,
    step3: false
  });

  const calculatePresentValue = (pmt, r, n) => {
    return pmt * (1 - Math.pow(1 + r, -n)) / r;
  };

  const calculateFutureValue = (pmt, r, n) => {
    return pmt * (Math.pow(1 + r, n) - 1) / r;
  };

  const generateNewProblem = () => {
    const newProblem = generateInitialProblem();
    setPayment(newProblem.payment);
    setRate(newProblem.rate);
    setPeriods(newProblem.periods);
    setPracticeType(newProblem.type);
    
    // Clear all input fields
    setUserInput1('');
    setUserInput2('');
    setUserInput3('');
    setFormulaFirstPart('');
    setFormulaNumerator('');
    setFormulaDenominator('');
    
    setCurrentStep(1);
    setCompletedSteps({
      step1: false,
      step2: false,
      step3: false
    });
    setHasError({
      step1: false,
      step2FirstPart: false,
      step2Numerator: false,
      step2Denominator: false,
      step3: false
    });
    setStepAnswers({
      step1: '',
      step2: '',
      step3: ''
    });
    setShowSteps(false);
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

  const checkStepAnswer = (step) => {
    const r = rate / 100;
    
    // Helper function to normalize input
    const normalizeInput = (input) => {
      return input.toString()
        .replace(/\s+/g, '') // Remove all whitespace
        .replace(/\$/, '')   // Remove dollar signs
        .replace(/÷/g, '/')  // Replace division symbol with forward slash
        .replace(/⁻/g, '-')  // Replace superscript minus with regular minus
        .toLowerCase();      // Convert to lowercase
    };

    // Helper function to validate numeric inputs with tolerance
    const validateNumeric = (input, expected) => {
      const normalized = normalizeInput(input);
      return Math.abs(parseFloat(normalized) - expected) < 0.1;
    };

    // Helper function to validate formula parts
    const validateFormulaPart = (input, part) => {
      const r = rate / 100;
      switch (part) {
        case 'firstPart':
          return validateNumeric(input, payment);
        case 'numerator':
          const expectedNum = practiceType === 'present'
            ? `1-(1+${r})^-${periods}`
            : `(1+${r})^${periods}-1`;
          return normalizeInput(input).replace(/\s+/g, '') === normalizeInput(expectedNum).replace(/\s+/g, '');
        case 'denominator':
          return validateNumeric(input, r);
        default:
          return false;
      }
    };

    const answers = {
      1: {
        payment: { value: payment, validate: input => validateNumeric(input, payment) },
        rate: { value: rate, validate: input => validateNumeric(input, rate) },
        periods: { value: periods, validate: input => validateNumeric(input, periods) }
      },
      2: {
        firstPart: { value: payment, validate: input => validateFormulaPart(input, 'firstPart') },
        numerator: { 
          value: practiceType === 'present'
            ? `1-(1+${rate/100})^-${periods}`
            : `(1+${rate/100})^${periods}-1`,
          validate: input => validateFormulaPart(input, 'numerator')
        },
        denominator: { 
          value: rate/100,
          validate: input => validateFormulaPart(input, 'denominator')
        }
      },
      3: practiceType === 'present'
          ? calculatePresentValue(payment, rate/100, periods)
          : calculateFutureValue(payment, rate/100, periods)
    };

    const checkFinalAnswer = () => {
      const userAnswer = parseFloat(normalizeInput(userInput3));
      const correctAnswer = answers[3];
      const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.1;
      
      setHasError(prev => ({ ...prev, step3: !isCorrect }));
      
      if (isCorrect) {
        setStepAnswers(prev => ({ ...prev, step3: correctAnswer.toFixed(1) }));
        setCompletedSteps(prev => ({ ...prev, step3: true }));
      }
      
      return isCorrect;
    };

    const userInputs = {
      1: userInput1,
      2: userInput2,
      3: userInput3
    };

    const isCorrect = answers[step].validate(userInputs[step]);
    
    if (isCorrect) {
      setStepAnswers(prev => ({ ...prev, [`step${step}`]: answers[step] }));
      setCompletedSteps(prev => ({ ...prev, [`step${step}`]: true }));
      if (step < 3) setCurrentStep(step + 1);
    }
    
    setHasError(prev => ({ ...prev, [`step${step}`]: !isCorrect }));
    return isCorrect;
  };

  return (
    <div className="bg-gray-100 p-8 w-full max-w-4xl mx-auto">
      <Card className="w-full shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg">
          <h1 className="text-sky-900 text-2xl font-bold">Annuity Calculations</h1>
          <p className="text-sky-800">Learn to calculate both present and future values of annuities!</p>
        </div>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">Understanding Annuities</h2>
            <p className="text-blue-600 mb-4">
              An annuity is a series of equal payments made at regular intervals. The difference between a present annuity and a future annuity lies in the timing of the payments:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Present Annuity</h3>
                <div className="my-2 text-blue-600 text-base flex items-center justify-center">
                  <span className="mr-2">𝑃𝐴 = 𝑃𝑀𝑇 ×</span>
                  <div className="inline-block">
                    <div className="border-b border-blue-600">1 - (1 + 𝑟)⁻ⁿ</div>
                    <div className="text-center">𝑟</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Payments are made at the beginning of each period. For example, rent payments are often made at the start of each month.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Future Annuity</h3>
                <div className="my-2 text-blue-600 text-base flex items-center justify-center">
                  <span className="mr-2">𝐹𝐴 = 𝑃𝑀𝑇 ×</span>
                  <div className="inline-block">
                    <div className="border-b border-blue-600">(1 + 𝑟)ⁿ - 1</div>
                    <div className="text-center">𝑟</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Payments are made at the end of each period. For example, most loan payments are made at the end of each month.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Examples</h2>
            <div className="flex space-x-4 mb-4">
              <Button
                onClick={() => setExampleType('present')}
                className={exampleType === 'present' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}
              >
                Present Annuity
              </Button>
              <Button
                onClick={() => setExampleType('future')}
                className={exampleType === 'future' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}
              >
                Future Annuity
              </Button>
            </div>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-lg mb-6 mt-8">
                    {exampleType === 'present' 
                      ? "Example: Find the present value of $300 monthly payments for 5 years (60 periods) at 6% annual interest (0.5% monthly)"
                      : "Example: Find the future value of $300 monthly deposits for 5 years (60 periods) at 6% annual interest (0.5% monthly)"}
                  </p>
                  
                  <div>
                    <p className="font-medium">Step 1: Identify the values</p>
                    <ul className="ml-8 space-y-1 my-2">
                      <li>PMT = $300</li>
                      <li>r = 0.005 (0.5%)</li>
                      <li>n = 60 periods</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium">Step 2: Use the formula</p>
                    <div className="ml-8 my-2">
                      {exampleType === 'present' ? (
                        <div className="inline-flex items-center">
                          <span className="mr-2">PV = $300 ×</span>
                          <div className="inline-block mx-2">
                            <div className="border-b border-black">1 - (1 + 0.005)⁻⁶⁰</div>
                            <div className="text-center">0.005</div>
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center">
                          <span className="mr-2">FV = $300 ×</span>
                          <div className="inline-block mx-2">
                            <div className="border-b border-black">(1 + 0.005)⁶⁰ - 1</div>
                            <div className="text-center">0.005</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Step 3: Calculate the result</p>
                    <p className="ml-8 font-mono">
                      {exampleType === 'present' 
                        ? `${calculatePresentValue(300, 0.005, 60).toFixed(2)}`
                        : `${calculateFutureValue(300, 0.005, 60).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice Time!</h2>
              <Button 
                onClick={generateNewProblem}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Problem
              </Button>
            </div>

            <div className="text-center text-2xl mb-4 space-y-2">
              <div className="font-mono">
                Calculate the {practiceType} value of {payment} monthly {practiceType === 'present' ? 'payments' : 'deposits'} over {periods} months at {rate}% monthly interest
              </div>
            </div>

            <Button 
              onClick={() => setShowSteps(true)}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3"
            >
              Solve Step by Step
            </Button>

            {showSteps && (
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="mb-4">1. Identify the values:</p>
                {completedSteps.step1 ? (
                  <div className="text-green-600 font-bold mb-6">
                    PMT = {payment}, r = {rate}%, n = {periods}
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-2">Payment (PMT)</label>
                        {correctInputs.payment ? (
                          <div className="text-green-600 font-bold p-2 bg-green-50 rounded border border-green-200">
                            {payment}
                          </div>
                        ) : (
                          <Input 
                            type="text"
                            value={userInput1}
                            onChange={(e) => {
                              setUserInput1(e.target.value);
                              setCorrectInputs(prev => ({ ...prev, payment: false }));
                            }}
                            placeholder="Enter payment"
                            className={`w-full ${hasError.step1 ? 'border-red-500' : 'border-blue-300'}`}
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2">Interest Rate (%)</label>
                        {correctInputs.rate ? (
                          <div className="text-green-600 font-bold p-2 bg-green-50 rounded border border-green-200">
                            {rate}%
                          </div>
                        ) : (
                          <Input 
                            type="text"
                            value={formulaFirstPart}
                            onChange={(e) => {
                              setFormulaFirstPart(e.target.value);
                              setCorrectInputs(prev => ({ ...prev, rate: false }));
                            }}
                            placeholder="Enter rate"
                            className={`w-full ${hasError.step1 ? 'border-red-500' : 'border-blue-300'}`}
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2">Number of Periods</label>
                        {correctInputs.periods ? (
                          <div className="text-green-600 font-bold p-2 bg-green-50 rounded border border-green-200">
                            {periods}
                          </div>
                        ) : (
                          <Input 
                            type="text"
                            value={formulaDenominator}
                            onChange={(e) => {
                              setFormulaDenominator(e.target.value);
                              setCorrectInputs(prev => ({ ...prev, periods: false }));
                            }}
                            placeholder="Enter periods"
                            className={`w-full ${hasError.step1 ? 'border-red-500' : 'border-blue-300'}`}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        onClick={() => {
                          const normalizeInput = (input) => {
                            return input.toString()
                              .replace(/\s+/g, '')
                              .replace(/\$/, '')
                              .toLowerCase();
                          };

                          const pmtValid = Math.abs(parseFloat(normalizeInput(userInput1)) - payment) < 0.1;
                          const rateValid = Math.abs(parseFloat(normalizeInput(userInput2)) - rate) < 0.1;
                          const periodsValid = Math.abs(parseFloat(normalizeInput(userInput3)) - periods) < 0.1;
                          
                          setCorrectInputs(prev => ({
                            ...prev,
                            payment: pmtValid,
                            rate: rateValid,
                            periods: periodsValid
                          }));
                          
                          if (pmtValid && rateValid && periodsValid) {
                            setCompletedSteps(prev => ({ ...prev, step1: true }));
                            setCurrentStep(2);
                          } else {
                            setHasError(prev => ({ ...prev, step1: !pmtValid || !rateValid || !periodsValid }));
                          }
                        }}
                        className="bg-blue-400 hover:bg-blue-500"
                      >
                        Check
                      </Button>
                      <Button
                        onClick={() => {
                          setCompletedSteps(prev => ({ ...prev, step1: true }));
                          setCurrentStep(2);
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white"
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep >= 2 && (
                  <>
                    <p className="mb-4">2. Write the formula:</p>
                    {completedSteps.step2 ? (
                      <div className="text-green-600 font-bold mb-6">
                        <div className="inline-flex items-center">
                          <span className="mr-2">{`${practiceType === 'present' ? 'PV' : 'FV'} = ${payment} ×`}</span>
                          <div className="inline-block">
                            <div className="border-b border-green-600">
                              {practiceType === 'present' 
                                ? `1 - (1 + ${rate/100})⁻${periods}`
                                : `(1 + ${rate/100})${periods} - 1`}
                            </div>
                            <div className="text-center">{rate/100}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="flex items-center mb-4">
                          <div className="w-72">
                            <Input 
                              type="text"
                              value={formulaFirstPart}
                              onChange={(e) => {
                                setFormulaFirstPart(e.target.value);
                                // Reset the specific error to false when input changes
                                setHasError(prev => ({ ...prev, step2FirstPart: false }));
                              }}
                              placeholder="e.g. $300 or 300"
                              className={`w-full ${hasError.step2FirstPart ? 'border-red-500 text-red-500' : 'border-blue-300'}`}
                            />
                          </div>
                          <span className="text-lg font-medium mx-4">=</span>
                          <div className="flex flex-col gap-2 w-72">
                            <Input 
                              type="text"
                              value={formulaNumerator}
                              placeholder={practiceType === 'present' 
                                ? "e.g. 1 - (1 + 0.005)^-60 or 1 - (1 + 0.005)⁻60"
                                : "e.g. (1 + 0.005)^60 - 1 or (1 + 0.005)⁶⁰ - 1"}
                              className={`w-full ${hasError.step2Numerator ? 'border-red-500 text-red-500' : 'border-blue-300'}`}
                              onChange={(e) => {
                                setFormulaNumerator(e.target.value);
                                // Reset the specific error to false when input changes
                                setHasError(prev => ({ ...prev, step2Numerator: false }));
                              }}
                            />
                            <div className="border-t border-black w-full"></div>
                            <Input 
                              type="text"
                              value={formulaDenominator}
                              placeholder="e.g. 0.005"
                              className={`w-full ${hasError.step2Denominator ? 'border-red-500 text-red-500' : 'border-blue-300'}`}
                              onChange={(e) => {
                                setFormulaDenominator(e.target.value);
                                // Reset the specific error to false when input changes
                                setHasError(prev => ({ ...prev, step2Denominator: false }));
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => {
                              console.log('Inputs:', {
                                firstPart: formulaFirstPart,
                                numerator: formulaNumerator,
                                denominator: formulaDenominator,
                                practiceType,
                                rate,
                                periods
                              });

                              const normalizeInput = (input) => {
                                return input.toString()
                                  .replace(/\s+/g, '')
                                  .replace(/\$/, '')
                                  .toLowerCase();
                              };

                              // Specific validation logic
                              const firstPartValid = formulaFirstPart.trim() === payment.toString();
                              
                              const expectedNumerator = practiceType === 'present'
                                ? `1-(1+${rate/100})^-${periods}`
                                : `(1+${rate/100})^${periods}-1`;
                              
                              const numeratorValid = normalizeInput(formulaNumerator).replace(/\^/g, '') === 
                                                     normalizeInput(expectedNumerator).replace(/\^/g, '');
                              
                              const denominatorValid = Math.abs(parseFloat(formulaDenominator) - (rate/100)) < 0.001;

                              console.log('Validation results:', {
                                firstPartValid,
                                numeratorValid,
                                denominatorValid
                              });

                              // Update error states
                              setHasError(prev => ({
                                ...prev,
                                step2FirstPart: !firstPartValid,
                                step2Numerator: !numeratorValid,
                                step2Denominator: !denominatorValid
                              }));
                              
                              // Check if all are valid
                              if (firstPartValid && numeratorValid && denominatorValid) {
                                setCompletedSteps(prev => ({ ...prev, step2: true }));
                                setCurrentStep(3);
                              }
                            }}
                            className="bg-blue-400 hover:bg-blue-500"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => showStepAnswer(2)}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {currentStep >= 3 && (
                  <>
                    <p className="mb-4">3. Calculate final result (round to nearest 0.1):</p>
                    {completedSteps.step3 ? (
                      <>
                        <div className="text-green-600 font-bold mb-6">
                          {practiceType === 'present' ? 'Present' : 'Future'} Value = {stepAnswers.step3}
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                          <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                          <p className="text-green-700">
                            You've successfully calculated the {practiceType} value of the annuity!
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-4 mb-6">
                        <Input 
                          type="number"
                          value={userInput3}
                          onChange={(e) => {
                            setUserInput3(e.target.value);
                            // Clear error state when input changes
                            setHasError(prev => ({ ...prev, step3: false }));
                          }}
                          placeholder="Enter final value"
                          step="0.1"
                          className={`flex-1 ${hasError.step3 ? 'border-red-500' : 'border-blue-300'}`}
                        />
                        <div className="flex gap-4">
                          <Button
                            onClick={() => {
                              console.log('Final Value Inputs:', {
                                userInput: userInput3,
                                practiceType,
                                payment,
                                rate,
                                periods
                              });

                              const normalizeInput = (input) => {
                                return input.toString()
                                  .replace(/\s+/g, '')
                                  .replace(/\$/, '')
                                  .toLowerCase();
                              };

                              const expectedValue = practiceType === 'present'
                                ? calculatePresentValue(payment, rate/100, periods)
                                : calculateFutureValue(payment, rate/100, periods);

                              const userValue = parseFloat(normalizeInput(userInput3));
                              const isValid = Math.abs(userValue - expectedValue) < 0.1;

                              console.log('Validation results:', {
                                userValue,
                                expectedValue,
                                isValid
                              });

                              setHasError(prev => ({
                                ...prev,
                                step3: !isValid
                              }));
                              
                              if (isValid) {
                                setCompletedSteps(prev => ({ ...prev, step3: true }));
                                setStepAnswers(prev => ({ 
                                  ...prev, 
                                  step3: expectedValue.toFixed(1) 
                                }));
                              }
                            }}
                            className="bg-blue-400 hover:bg-blue-500"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => showStepAnswer(3)}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Understanding annuities is crucial for financial planning!
      </p>
    </div>
  );
};

export default Annuity;