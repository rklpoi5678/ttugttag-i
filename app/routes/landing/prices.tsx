import { useState } from "react";

export default function PricesPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: '무료 (Starter)',
      price: billingCycle === 'monthly' ? 'Free' : 'Free',
      period: '월',
      description: '뚝딱이 서비스를 부담 없이 시작해보세요.',
      features: [
        '기본 AI 기능',
        '개인 사용',
        '월 10개 프로젝트',
        '기본 보고서',
        '커뮤니티 지원'
      ],
      highlight: false,
      buttonText: '지금 시작하기'
    },
    {
      name: '프로 (Pro)',
      price: billingCycle === 'monthly' ? '5,000원' : '54,000원',
      originalPrice: '60,000원',
      discount: '10%',
      period: billingCycle === 'monthly' ? '월' : '년',
      description: '고급 AI 기능과 확장된 사용량을 경험하세요.',
      features: [
        '향상된 AI 기능',
        '최대 5인 팀',
        '월 50개 프로젝트',
        '고급 보고서',
        '우선 지원',
        'API 접근'
      ],
      highlight: true,
      buttonText: '프로 플랜 선택'
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          뚝딱이 가격 플랜
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-16">
          뚝딱이는 당신의 생산성을 높이기 위한 다양한 플랜을 제공합니다.
          <br className="hidden sm:inline-block"/> 당신에게 가장 적합한 플랜을 선택하세요!
        </p>
        <div className="flex justify-center mb-10">
          <label className="inline-flex items-center mr-8">
            <input
              type="radio"
              name="billing"
              value="monthly"
              className="form-radio h-5 w-5 text-blue-600"
              checked={billingCycle === 'monthly'}
              onChange={() => setBillingCycle('monthly')}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">한달</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="billing"
              value="yearly"
              className="form-radio h-5 w-5 text-blue-600"
              checked={billingCycle === 'yearly'}
              onChange={() => setBillingCycle('yearly')}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">연간</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300
                ${plan.highlight ? 'border-4 border-blue-600 dark:border-blue-500' : 'border border-gray-200 dark:border-gray-700'}
              `}
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {plan.name}
              </h3>
              <p className="text-md text-gray-500 dark:text-gray-400 mb-6 h-12 flex items-center justify-center">
                {plan.description}
              </p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                {plan.originalPrice && (
                  <>
                    <span className="text-xl font-medium text-gray-600 dark:text-gray-400 line-through ml-2">{plan.originalPrice}</span>
                    <span className="text-xl font-medium text-gray-600 dark:text-gray-400 ml-2">{plan.discount}</span>
                  </>
                )}
                <span className="text-xl font-medium text-gray-600 dark:text-gray-400">/{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-10 text-left">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`
                  w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors duration-300
                  ${
                    plan.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }
                `}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}