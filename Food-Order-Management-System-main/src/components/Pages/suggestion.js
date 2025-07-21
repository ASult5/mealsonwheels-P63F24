import React, { useState } from 'react';
import axios from 'axios';
import Footer from "../Footer/Footer";

const skinQuestions = [
 
];

const makeupQuestions = [
  
];

const faqs = [
  
];

const PersonalizedQuiz = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
    const toggleFAQ = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  const [quizType, setQuizType] = useState('');
  const [responses, setResponses] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const questions = quizType === 'skin' ? skinQuestions : makeupQuestions;
  const apiKey = "sk-*********";
  // const apiKey = "sk-*********";

  const handleOptionSelect = (option) => {
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = option;
    setResponses(updatedResponses);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitResponses();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitResponses = async () => {
    setLoading(true);
    const prompt = generatePrompt(quizType, questions, responses);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      // Format response to numbered bullet points
      let rawResult = response.data.choices[0].message.content.trim();
      const formattedResult = rawResult
        .split(/\n+/)
        .filter(line => line.trim() !== '')
        .map((line, idx) => <li key={idx} style={{marginBottom: '0.5rem'}}>{line}</li>);

      setResult(formattedResult);
    } catch (error) {
      console.error('Error fetching data from OpenAI:', error);
      setResult(<p style={{ color: 'red' }}>An error occurred while fetching recommendations.</p>);
    } finally {
      setLoading(false);
    }
  };

  const generatePrompt = (type, questions, answers) => {
    let prompt = '';
    for (let i = 0; i < questions.length; i++) {
      prompt += `${questions[i].question}\nAnswer: ${answers[i]}\n\n`;
    }
    prompt += type === 'skin'
      ? 'Based on the above answers, provide personalized skincare recommendations in a numbered list.'
      : 'Based on the above answers, provide personalized makeup recommendations in a numbered list.';
    return prompt;
  };

  const handleQuizTypeSelection = (type) => {
    setQuizType(type);
    setResponses([]);
    setCurrentQuestionIndex(0);
    setResult('');
  };

  return (
    <>
      <style>{`
        .quiz-container {
          background: white;
          width: 100%;
          padding: 2.5rem 7rem;
          box-shadow: 0 20px 40px rgba(255, 105, 180, 0.3);
          animation: fadeInScale 0.5s ease forwards;
          position: relative;
        }
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        h2 {
          text-align: center;
          color: #d6336c;
          margin-bottom: 1rem;
          letter-spacing: 1.5px;
        }
        h3 {
          color: #a80055;
          margin-bottom: 1rem;
          font-weight: 600;
          letter-spacing: 1px;
        }
        p {
          color: #555;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        button {
          background-color: #d6336c;
          color: white;
          border: none;
          padding: 0.7rem 1.8rem;
          margin: 0.5rem 0.4rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(214, 51, 108, 0.3);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }
        button:disabled {
          background-color: #f1c6d6;
          cursor: not-allowed;
          box-shadow: none;
        }
        button:hover:not(:disabled) {
          background-color: #b02253;
          box-shadow: 0 8px 25px rgba(176, 18, 63, 0.6);
        }
        label {
          display: block;
          margin-bottom: 0.6rem;
          font-size: 1rem;
          color: #444;
          cursor: pointer;
          user-select: none;
          transition: color 0.3s ease;
        }
        label:hover {
          color: #d6336c;
        }
        input[type="radio"] {
          margin-right: 0.7rem;
          cursor: pointer;
          transform: scale(1.1);
          vertical-align: middle;
          transition: accent-color 0.3s ease;
          accent-color: #d6336c;
        }
        ul.recommendations {
          list-style-type: decimal;
          padding-left: 1.5rem;
          color: #a80055;
          font-size: 1.1rem;
          font-weight: 500;
          line-height: 1.6;
          animation: slideInFromLeft 0.5s ease forwards;
        }
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .nav-buttons {
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .quiz-type-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
      `}</style>
<div className="w-100">
      <div className="quiz-container" role="main" aria-live="polite" aria-atomic="true">
       <h2 style={{ fontWeight: 'bold' }}>AI PERSONALIZED RECOMMENDATIONS</h2>


        {!quizType ? (
          <div className="quiz-type-buttons" aria-label="Select quiz type">
            <p style={{ textAlign: 'center' }}>What's your concern ?</p>
            <button onClick={() => handleQuizTypeSelection('skin')} aria-pressed={quizType === 'skin'}>
              Skin
            </button>
            <button onClick={() => handleQuizTypeSelection('makeup')} aria-pressed={quizType === 'makeup'}>
              Makeup
            </button>
          </div>
        ) : result ? (
          <div>
            <h3>Your AI Personalized Recommendations:</h3>
            <ul className="recommendations">{result}</ul>
            <div className="nav-buttons">
              <button onClick={() => handleQuizTypeSelection('')} disabled={loading}>
                Restart
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>Question {currentQuestionIndex + 1} of {questions.length}:</strong></p>
            <p style={{ fontWeight: '600', marginBottom: '1rem', color: '#a80055' }}>{questions[currentQuestionIndex].question}</p>

            <div role="radiogroup" aria-labelledby="question-label">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    checked={responses[currentQuestionIndex] === option}
                    onChange={() => handleOptionSelect(option)}
                    disabled={loading}
                  />
                  {option}
                </label>
              ))}
            </div>

            <div className="nav-buttons" style={{ justifyContent: 'space-between' }}>
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0 || loading}
                aria-disabled={currentQuestionIndex === 0 || loading}
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={!responses[currentQuestionIndex] || loading}
                aria-disabled={!responses[currentQuestionIndex] || loading}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>

            {loading && <p style={{ textAlign: 'center', marginTop: '1rem', color: '#d6336c' }}>Loading recommendations...</p>}
          </div>
        )}
            
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
                  <div style={{ margin: 0, padding: 0, backgroundColor: "#fff", fontFamily: "Segoe UI, sans-serif" }}>
            <style>{`
              .faq-container {
                max-width: 800px;
                margin: 3rem auto;
                padding: 2rem;
                background-color: #fff;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
              }
      
              .faq-title {
                text-align: center;
                font-size: 2rem;
                margin-bottom: 2rem;
                color: #e91e63;
              }
      
              .faq-item {
                border-bottom: 1px solid #f8bbd0;
                padding: 1rem 0;
                cursor: pointer;
                transition: background 0.3s;
              }
      
              .faq-item:hover {
                background-color: #fff0f5;
              }
      
              .faq-question {
                font-weight: 600;
                font-size: 1.1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #444;
              }
      
              .faq-answer {
                max-height: 0;
                opacity: 0;
                overflow: hidden;
                transition: all 0.5s ease;
                color: #666;
                white-space: pre-wrap;
                line-height: 1.6;
                font-size: 0.95rem;
              }
      
              .faq-answer.open {
                max-height: 500px;
                opacity: 1;
                margin-top: 0.5rem;
              }
      
              .arrow {
                transition: transform 0.3s ease;
                color: #e91e63;
              }
      
              .arrow.open {
                transform: rotate(180deg);
              }
      
              .webview-wrapper {
                height: 100vh;
              }
      
              iframe {
                height: 100%;
                width: 100%;
                border: none;
              }
            `}</style>
      
            {/* FAQ Section */}
            <div className="faq-container">
              <h2 className="faq-title">Frequently Asked Questions</h2>
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item" onClick={() => toggleFAQ(index)}>
                  <div className="faq-question">
                    {faq.question}
                    <span className={`arrow ${openIndex === index ? "open" : ""}`}>▼</span>
                  </div>
                  <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
      </div>

          
           <br></br>
            <Footer />
      </div>
    </>
  );
};

export default PersonalizedQuiz;
