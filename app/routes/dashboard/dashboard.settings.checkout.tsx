import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router"
import {Link} from "react-router"
import { CheckCircle, XCircle, CreditCard, Clock, Calendar, Crown } from "lucide-react" // 필요한 아이콘 추가
import { Badge } from "@/components/ui/badge" // shadcn/ui의 Badge 컴포넌트 사용 가정
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" // shadcn/ui의 Table 컴포넌트 사용 가정


// 실제 데이터 타입 정의 (백엔드와 통신 시 사용)
interface UserSubscription {
  tier: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  status: 'active' | 'inactive' | 'trialing' | 'canceled';
  nextBillingDate?: string; // ISO string
  price?: number; // Price per period
  period?: 'monthly' | 'yearly';
  features: string[]; // 현재 플랜이 제공하는 기능
}

interface Transaction {
  id: string;
  date: string; // ISO string
  description: string; // "Basic 플랜 월 구독"
  amount: number;
  currency: string;
  status: 'completed' | 'failed' | 'pending';
  invoiceUrl?: string; // 인보이스 다운로드 URL
}

export default function PaymentHistoryPage() {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const tabs = [
    { label: "설정", href: "/dashboard/settings" },
    { label: "프로필", href: "/dashboard/settings/profile" },
    { label: "결제", href: "/dashboard/settings/checkout" }, // 현재 페이지
  ];

  useEffect(() => {
    // 실제 애플리케이션에서는 여기서 백엔드 API를 호출하여 데이터를 가져옵니다.
    const fetchPaymentData = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- 가상의 사용자 구독 정보 (이전 코드와 유사) ---
        const userSubData: UserSubscription = {
          tier: 'Pro', // 예시: 현재 Pro 티어 사용 중
          status: 'active',
          nextBillingDate: '2025-07-20T00:00:00Z',
          price: 29.99,
          period: 'monthly',
          features: ["무제한 목업", "고급 협업", "프리미엄 템플릿", "우선 지원", "버전 히스토리"],
        };
        setUserSubscription(userSubData);

        // --- 가상의 결제 내역 데이터 ---
        const transactionData: Transaction[] = [
          {
            id: 'txn_001',
            date: '2025-06-20T00:00:00Z',
            description: 'Pro 플랜 월 구독',
            amount: 29.99,
            currency: 'KRW',
            status: 'completed',
            invoiceUrl: '/invoices/invoice_001.pdf', // 실제 인보이스 URL
          },
          {
            id: 'txn_002',
            date: '2025-05-20T00:00:00Z',
            description: 'Pro 플랜 월 구독',
            amount: 29.99,
            currency: 'KRW',
            status: 'completed',
            invoiceUrl: '/invoices/invoice_002.pdf',
          },
          {
            id: 'txn_003',
            date: '2025-04-20T00:00:00Z',
            description: 'Basic 플랜에서 Pro 플랜으로 업그레이드',
            amount: 19.99, // 차액 결제 예시
            currency: 'KRW',
            status: 'completed',
            invoiceUrl: '/invoices/invoice_003.pdf',
          },
          {
            id: 'txn_004',
            date: '2025-03-20T00:00:00Z',
            description: 'Basic 플랜 월 구독',
            amount: 9.99,
            currency: 'KRW',
            status: 'completed',
            invoiceUrl: '/invoices/invoice_004.pdf',
          },
          {
            id: 'txn_005',
            date: '2025-02-20T00:00:00Z',
            description: 'Basic 플랜 월 구독 (결제 실패)',
            amount: 9.99,
            currency: 'KRW',
            status: 'failed',
            invoiceUrl: undefined,
          },
        ];
        setTransactions(transactionData);

      } catch (err) {
        console.error("Failed to fetch payment history:", err);
        setError("결제 내역을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const getStatusDisplay = (status: UserSubscription['status']) => {
    switch (status) {
      case 'active': return { text: '활성', color: 'bg-green-500 text-white' };
      case 'trialing': return { text: '체험 중', color: 'bg-blue-500 text-white' };
      case 'inactive': return { text: '비활성', color: 'bg-red-500 text-white' };
      case 'canceled': return { text: '취소됨', color: 'bg-gray-500 text-white' };
      default: return { text: '알 수 없음', color: 'bg-gray-500 text-white' };
    }
  };

  const getTransactionStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <Badge variant="default" className="bg-green-100 text-green-700">성공</Badge>;
      case 'failed': return <Badge variant="destructive" className="bg-red-100 text-red-700">실패</Badge>;
      case 'pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">대기 중</Badge>;
      default: return <Badge variant="default">알 수 없음</Badge>;
    }
  };

  // 금액 포맷팅 함수
  const formatCurrency = (amount: number, currency: string = 'KRW') => {
    return amount.toLocaleString('ko-KR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0, // 소수점 제거 (KRW는 보통 정수)
      maximumFractionDigits: 0,
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400">결제 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex flex-col justify-center items-center h-64 text-red-500 dark:text-red-400">
          <XCircle className="h-12 w-12 mb-4" />
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">다시 시도</Button>
        </div>
      </div>
    );
  }

  const currentSubscriptionDisplay = userSubscription ? getStatusDisplay(userSubscription.status) : { text: '정보 없음', color: 'bg-gray-200 text-gray-700' };


  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> {/* 전체 너비 조정 */}
        {/* 가로형 탭 네비게이션 */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-8"> {/* gap 조정 */}
          {tabs.map(tab => (
            <Link
              key={tab.href}
              to={tab.href}
              className={`px-4 py-3 -mb-px border-b-2 text-base font-semibold transition-colors duration-150
                ${location.pathname === tab.href ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"}`} // 색상 조정
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* 결제 내역 콘텐츠 */}
        <div className="space-y-8 py-4">
          {/* 현재 구독 정보 카드 */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                현재 구독 정보
              </CardTitle>
              <Button asChild variant="outline" className="text-sm">
                <Link to="/dashboard/settings/checkout"> {/* 결제 관리 페이지로 이동 */}
                  플랜 변경 또는 관리
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">현재 티어:</span>
                <span className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                  {userSubscription?.tier}
                  {userSubscription?.tier !== 'Free' && <Crown className="h-5 w-5 text-yellow-500" />}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">상태:</span>
                <Badge className={`${currentSubscriptionDisplay.color}`}>
                  {currentSubscriptionDisplay.text}
                </Badge>
              </div>
              {userSubscription?.status === 'active' && userSubscription.nextBillingDate && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold">다음 결제 예정일:</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {new Date(userSubscription.nextBillingDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}
              {userSubscription?.price !== undefined && userSubscription.price > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold">결제 금액:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(userSubscription.price)}{userSubscription.period === 'monthly' ? '/월' : '/년'}
                  </span>
                </div>
              )}
              {userSubscription?.features && userSubscription.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mt-4 mb-2">포함된 주요 기능:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {userSubscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 결제 내역 테이블 */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold">결제 내역</CardTitle>
              <CardDescription>지난 결제 활동을 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>날짜</TableHead>
                      <TableHead>내역</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead className="text-right">인보이스</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <TableCell className="text-sm">
                          {new Date(transaction.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {transaction.description}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getTransactionStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.invoiceUrl ? (
                            <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                              <a href={transaction.invoiceUrl} target="_blank" rel="noopener noreferrer">
                                보기
                              </a>
                            </Button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>아직 결제 내역이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}