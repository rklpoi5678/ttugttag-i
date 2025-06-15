
export default function PrivacyPolicy() {
  return (

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 mt-24">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">개인정보처리방침</h1>
          <p className="text-gray-600">마지막 업데이트: 2024년 3월 20일</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 수집하는 개인정보</h2>
            <p className="text-gray-600 mb-4">
              MetaOS는 다음과 같은 개인정보를 수집합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>이메일 주소</li>
              <li>이름</li>
              <li>프로필 사진</li>
              <li>사용자 활동 데이터</li>
              <li>결제 정보 (유료 서비스 이용 시)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 개인정보의 이용 목적</h2>
            <p className="text-gray-600">
              수집된 개인정보는 다음 목적으로 이용됩니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
              <li>서비스 제공 및 운영</li>
              <li>회원 관리 및 인증</li>
              <li>고객 지원 및 문의 응답</li>
              <li>서비스 개선 및 개발</li>
              <li>마케팅 및 프로모션</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 개인정보의 보유 및 이용기간</h2>
            <p className="text-gray-600">
              회원 탈퇴 시 또는 개인정보 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관련 법령에 따라 보존할 필요가 있는 경우에는 해당 기간 동안 보관합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-600">
              MetaOS는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 개인정보의 안전성 확보 조치</h2>
            <p className="text-gray-600">
              MetaOS는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
              <li>개인정보 암호화</li>
              <li>접근 권한 관리</li>
              <li>보안 프로그램 설치 및 주기적 갱신</li>
              <li>정기적인 보안 점검</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 개인정보 보호책임자</h2>
            <p className="text-gray-600">
              개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">이름: [보호책임자 이름]</p>
              <p className="text-gray-600">이메일: privacy@metaos.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 권익침해 구제방법</h2>
            <p className="text-gray-600">
              정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등로 임의적 분쟁해결이나 상담 등을 받을 수 있습니다.
            </p>
          </section>
        </div>
      </div>
  )
} 