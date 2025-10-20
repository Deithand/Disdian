import React, { useState } from 'react';
import { FileText, Search, Palette, Gamepad2, Rocket, X } from 'lucide-react';
import '../styles/Onboarding.css';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <FileText size={64} />,
      title: 'Добро пожаловать в Disdian!',
      description: 'Мощный редактор заметок с поддержкой Markdown и интеграцией Discord',
      details: [
        'Создавайте и организуйте заметки',
        'Полная поддержка Markdown синтаксиса',
        'Автоматическое сохранение',
        'Иерархическая структура папок'
      ]
    },
    {
      icon: <Search size={64} />,
      title: 'Быстрая навигация',
      description: 'Найдите любую заметку за секунды',
      details: [
        'Ctrl+N - Создать новую заметку',
        'Ctrl+F - Поиск по всем заметкам',
        'Ctrl+B - Боковая панель',
        'Ctrl+T - Переключить тему'
      ]
    },
    {
      icon: <Palette size={64} />,
      title: 'Стилизация текста',
      description: 'Форматируйте текст с помощью контекстного меню',
      details: [
        'Выделите текст и нажмите правую кнопку мыши',
        'Жирный, курсив, зачеркнутый текст',
        'Заголовки, списки, ссылки',
        'Блоки кода и цитаты'
      ]
    },
    {
      icon: <Gamepad2 size={64} />,
      title: 'Discord интеграция',
      description: 'Покажите друзьям, что вы работаете над заметками',
      details: [
        'Автоматическое отображение активности',
        'Показ текущей заметки',
        'Счетчик слов в реальном времени',
        'Настройка в Ctrl+,'
      ]
    },
    {
      icon: <Rocket size={64} />,
      title: 'Всё готово!',
      description: 'Начните создавать свои заметки прямо сейчас',
      details: [
        'Нажмите Ctrl+N для первой заметки',
        'Используйте Markdown для форматирования',
        'Организуйте заметки в папки',
        'Настройте приложение под себя'
      ]
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        <button className="onboarding-close" onClick={handleSkip}>
          <X size={24} />
        </button>

        <div className="onboarding-content">
          <div className="onboarding-icon">
            {currentStepData.icon}
          </div>

          <h1 className="onboarding-title">{currentStepData.title}</h1>
          <p className="onboarding-description">{currentStepData.description}</p>

          <ul className="onboarding-features">
            {currentStepData.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>

          <div className="onboarding-dots">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`onboarding-dot ${index === currentStep ? 'active' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          <div className="onboarding-actions">
            {currentStep > 0 && (
              <button className="btn btn-secondary" onClick={handlePrev}>
                Назад
              </button>
            )}
            
            <button className="btn btn-primary" onClick={handleNext}>
              {currentStep < steps.length - 1 ? 'Далее' : 'Начать работу'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;

