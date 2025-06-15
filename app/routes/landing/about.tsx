export default function About() {
    return (
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mx-auto text-center">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              뚝딱: 아이디어를 한순간에 앱/웹으로 구현하세요!
            </h2>
            <p className="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400">
              복잡함은 저 멀리, 이제 상상이 현실이 됩니다. 뚝딱이는 누구나 손쉽게 앱/웹 아이디어를 구현하고 검증할 수 있는 도구입니다.
            </p>
          </div>
  
          <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="mb-4 text-2xl font-bold dark:text-white">
                뚝딱이를 만든 이유
              </h3>
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                많은 <strong>창의적인 개인들과 비전문가들</strong>은 훌륭한 아이디어가 있어도, 이를 실제로 구현하고 시험하는 데에 큰 장벽을 느낍니다. 특히 Figma나 AdobeXd 같은 <strong>복잡한 디자인 툴은 접근이 어려워</strong>, 아이디어를 시작하기도 전에 지치게 만듭니다.
              </p>
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                아이디어가 있어도 복잡한 과정 때문에 <strong>시간과 비용</strong>을 낭비하거나, 심지어 포기하는 경우가 많습니다. 한국시장에서 더 직관적이고 접근성 높은 도구의 필요성이 절실했습니다.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                현재 시장은 기획, 개발, 배포가 <strong>파편화되어 있어</strong>, 아이디어 구상부터 출시까지 매끄러운 경험을 제공하지 못합니다. AI 기술이 발전했지만, 여전히 초기 아이디어를 시각화하는 데는 <strong>명확한 지시와 기술적 이해가 필요</strong>합니다.
              </p>
            </div>
  
            <div>
              <h3 className="mb-4 text-2xl font-bold dark:text-white">
                뚝딱이의 특별함
              </h3>
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                '뚝딱이'는 레고를 조립하듯, <strong>누구나 쉽게 앱/웹 아이디어를 시각적으로 구현</strong>할 수 있도록 돕습니다. 우리의 목표는 다음과 같습니다.
              </p>
              <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                <li>
                  <strong>쉬운 시작:</strong> 복잡한 디자인 툴의 장벽을 허물고, 쉽게 아이디어를 구체화할 수 있도록 합니다.
                </li>
                <li>
                  <strong>빠른 시각화:</strong> 즉시 아이디어를 화면으로 구현하고, 빠른 반복을 통해 최적의 디자인을 찾을 수 있습니다.
                </li>
                <li>
                  <strong>개발 연계:</strong> 스케치한 아이디어를 코드로 연결하여 실제 애플리케이션으로 발전시킬 수 있도록 지원합니다.
                </li>
                <li>
                  <strong>통합 솔루션:</strong> 아이디어 구상부터 초기 화면 구현, 실제 개발까지를 하나의 도구로 해결합니다.
                </li>
              </ul>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                '뚝딱이'는 핵심 아이디어에 집중하여, 당신의 상상을 <strong>신속하게 현실로</strong> 만들어 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }