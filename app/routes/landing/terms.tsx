'use client'


export default function TermsOfService() {
  return (

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 mt-24">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">이용약관</h1>
          <p className="text-gray-600">마지막 업데이트: 2024년 3월 20일</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 약관의 적용</h2>
            <p className="text-gray-600">
              본 약관은 MetaOS 서비스{'(이하 "서비스")'} 를 이용하는 모든 사용자에게 적용됩니다.
              서비스를 이용함으로써 본 약관에 동의하게 됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 서비스 이용</h2>
            <p className="text-gray-600 mb-4">
              서비스 이용자는 다음의 의무를 준수해야 합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>타인의 개인정보를 무단으로 수집, 저장, 공개하는 행위</li>
              <li>서비스의 운영을 고의로 방해하는 행위</li>
              <li>타인의 지적재산권을 침해하는 행위</li>
              <li>서비스를 이용하여 법령 또는 공서양속에 반하는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 계정 관리</h2>
            <p className="text-gray-600">
              사용자는 자신의 계정 정보를 안전하게 관리할 책임이 있습니다.
              계정 정보의 부정사용으로 인한 모든 책임은 사용자에게 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 서비스 변경 및 중단</h2>
            <p className="text-gray-600">
              MetaOS는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.
              서비스 변경 시에는 변경된 서비스의 내용 및 제공일자를 명시하여 현재 서비스 초기화면에 게시하거나 기타 방법으로 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 책임 제한</h2>
            <p className="text-gray-600">
              MetaOS는 서비스 이용과 관련하여 이용자에게 발생한 손해에 대하여 책임을 지지 않습니다.
              단, MetaOS의 고의 또는 중대한 과실로 인하여 발생한 손해의 경우는 제외합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 분쟁 해결</h2>
            <p className="text-gray-600">
              서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우,
              MetaOS의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 기타</h2>
            <p className="text-gray-600">
              본 약관에 명시되지 않은 사항은 관련 법령의 규정에 따릅니다.
            </p>
          </section>
        </div>
      </div>
  )
} 