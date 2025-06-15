import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { CheckCircle, Crown, CreditCard, XCircle } from "lucide-react"; // Icons for success, premium, payment, error
import { useState, useEffect } from "react";
import Link from "next/link"; // Assuming Next.js for routing

// Define a type for your user's subscription
interface UserSubscription {
  tier: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  status: 'active' | 'inactive' | 'trialing' | 'canceled';
  nextBillingDate?: string; // ISO string
  features: string[];
  price?: number; // Price per period
  period?: 'monthly' | 'yearly';
}

// Define a type for available plans
interface PaymentPlan {
  id: string;
  name: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  price: number; // Price per month for simplicity
  period: 'monthly' | 'yearly';
  features: string[];
  description: string;
  isCurrent?: boolean; // To mark the user's current plan
}

export default function PaymentManagement() {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] = useState<PaymentPlan | null>(null);

  useEffect(() => {
    // In a real application, you'd fetch this from your backend
    const fetchPaymentData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call for user's current subscription
        const userSubResponse = await new Promise<UserSubscription>(resolve => setTimeout(() => {
          resolve({
            tier: 'Basic', // Example: Current user is on Basic tier
            status: 'active',
            nextBillingDate: '2025-07-15',
            price: 9.99,
            period: 'monthly',
            features: [
              "50 Mockups",
              "Basic Collaboration",
              "Standard Templates",
              "Email Support"
            ],
          });
        }, 500));

        // Simulate API call for all available plans
        const plansResponse = await new Promise<PaymentPlan[]>(resolve => setTimeout(() => {
          resolve([
            {
              id: 'plan_free',
              name: 'Free',
              price: 0,
              period: 'monthly',
              description: '아이디어를 스케치하고 공유하기 위한 시작점',
              features: ["10 Mockups", "Limited Collaboration", "Basic Templates", "Community Support"],
            },
            {
              id: 'plan_basic',
              name: 'Basic',
              price: 9.99,
              period: 'monthly',
              description: '아이디어를 빠르게 시각화하고 검증',
              features: ["50 Mockups", "Basic Collaboration", "Standard Templates", "Email Support"],
            },
            // {
            //   id: 'plan_pro',
            //   name: 'Pro',
            //   price: 29.99,
            //   period: 'monthly',
            //   description: '고급 협업 및 확장된 기능으로 프로젝트 가속화',
            //   features: ["Unlimited Mockups", "Advanced Collaboration", "Premium Templates", "Priority Support", "Version History"],
            // },
            // {
            //   id: 'plan_enterprise',
            //   name: 'Enterprise',
            //   price: 0, // Contact for pricing
            //   period: 'yearly',
            //   description: '대규모 팀과 엔터프라이즈 환경을 위한 맞춤형 솔루션',
            //   features: ["Custom Features", "Dedicated Account Manager", "SLA", "On-premise Options"],
            // },
          ]);
        }, 500));

        setUserSubscription(userSubResponse);
        // Mark the current plan in the available plans list
        setAvailablePlans(plansResponse.map(plan => ({
          ...plan,
          isCurrent: plan.name === userSubResponse.tier
        })));

      } catch (err) {
        console.error("Failed to fetch payment data:", err);
        setError("결제 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const handleUpgradeClick = (plan: PaymentPlan) => {
    setSelectedPlanToUpgrade(plan);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentConfirm = () => {
    if (!selectedPlanToUpgrade) return;

    // In a real app, this would redirect to a payment gateway
    // or trigger a backend API call to create a checkout session.
    console.log(`Initiating payment for ${selectedPlanToUpgrade.name} plan...`);
    alert(`${selectedPlanToUpgrade.name} 플랜 결제 페이지로 이동합니다. (실제 결제 로직은 백엔드 및 결제 게이트웨이 연동 필요)`);

    // Close dialog after "payment" initiation
    setIsPaymentDialogOpen(false);
    setSelectedPlanToUpgrade(null);
    // You might want to refresh user subscription status after actual payment success
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500 dark:text-gray-400">결제 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-red-500 dark:text-red-400">
        <XCircle className="h-12 w-12 mb-4" />
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">다시 시도</Button>
      </div>
    );
  }

  const getStatusDisplay = (status: UserSubscription['status']) => {
    switch (status) {
      case 'active': return { text: '활성', color: 'text-green-500' };
      case 'trialing': return { text: '체험 중', color: 'text-blue-500' };
      case 'inactive': return { text: '비활성', color: 'text-red-500' };
      case 'canceled': return { text: '취소됨', color: 'text-red-500' };
      default: return { text: '알 수 없음', color: 'text-gray-500' };
    }
  };

  const currentStatus = userSubscription ? getStatusDisplay(userSubscription.status) : { text: '정보 없음', color: 'text-gray-500' };


  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">결제 및 구독 관리</h1>
      <p className="text-gray-600 dark:text-gray-400">현재 구독 상태를 확인하고, 더 많은 기능을 위해 업그레이드하세요.</p>

      {/* Current Subscription Card */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            나의 현재 티어: {userSubscription?.tier}
          </CardTitle>
          {userSubscription?.tier !== 'Enterprise' && ( // Enterprise Tier는 '문의하기'이므로 제외
            <Button variant="outline" asChild>
              <Link href="/settings/payment-history">
                결제 내역 보기
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-sm">
            <p className="mb-2">
              <span className="font-semibold">상태: </span>
              <span className={`${currentStatus.color} font-bold`}>{currentStatus.text}</span>
            </p>
            {userSubscription?.status === 'active' && userSubscription.nextBillingDate && (
              <p className="mb-2">
                <span className="font-semibold">다음 결제일: </span>
                {new Date(userSubscription.nextBillingDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
            {userSubscription?.price !== undefined && userSubscription.price > 0 && (
              <p className="mb-2">
                <span className="font-semibold">월 {userSubscription.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</span> (부가세 별도)
              </p>
            )}
            <p className="font-semibold mt-4 mb-2">포함된 기능:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {userSubscription?.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        {userSubscription?.tier !== 'Enterprise' && ( // Enterprise Tier는 '문의하기'이므로 제외
          <CardFooter>
             <Button variant="ghost" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
               구독 취소
             </Button>
           </CardFooter>
        )}
      </Card>

      {/* Available Plans Section */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">플랜 둘러보기</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">더 많은 기능과 향상된 경험을 위해 업그레이드하세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {availablePlans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col rounded-xl shadow-lg border-2 ${
              plan.isCurrent ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
            } ${
              plan.name === 'Pro' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl' : 'bg-white dark:bg-gray-800'
            }`}
          >
            <CardHeader className={`${plan.name === 'Pro' ? 'text-white' : 'text-gray-900 dark:text-white'} pb-4`}>
              {plan.isCurrent && (
                <div className="text-center text-sm font-semibold mb-2 flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-400" /> 현재 플랜
                </div>
              )}
              <CardTitle className="text-3xl font-extrabold text-center">
                {plan.name === 'Pro' ? <Crown className="inline-block mr-2 h-7 w-7 text-yellow-300" /> : null}
                {plan.name}
              </CardTitle>
              <CardDescription className={`text-center mt-2 ${plan.name === 'Pro' ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between pt-0 pb-4 px-6">
              <div className="text-center mb-6">
                {plan.price === 0 ? (
                  <span className={`text-5xl font-extrabold ${plan.name === 'Pro' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>무료</span>
                ) : (
                  <span className={`text-5xl font-extrabold ${plan.name === 'Pro' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </span>
                )}
                {plan.price !== 0 && plan.name !== 'Enterprise' && (
                  <span className={`text-xl font-medium ${plan.name === 'Pro' ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    /{plan.period === 'monthly' ? '월' : '년'}
                  </span>
                )}
                {plan.name === 'Enterprise' && (
                  <span className={`text-xl font-medium ${plan.name === 'Enterprise' ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    (문의)
                  </span>
                )}
              </div>
              <ul className={`space-y-3 ${plan.name === 'Pro' ? 'text-purple-100' : 'text-gray-700 dark:text-gray-300'}`}>
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <CheckCircle className={`h-4 w-4 mr-2 flex-shrink-0 ${plan.name === 'Pro' ? 'text-green-300' : 'text-green-500'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              {plan.isCurrent ? (
                <Button disabled className="w-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed">
                  현재 플랜
                </Button>
              ) : plan.name === 'Enterprise' ? (
                <Button className={`w-full ${plan.name === 'Enterprise' ? 'bg-white text-purple-600 hover:bg-purple-100' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                  문의하기
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgradeClick(plan)}
                  className={`w-full ${plan.name === 'Pro' ? 'bg-white text-purple-600 hover:bg-purple-100' : 'bg-blue-500 hover:bg-blue-600 text-white'} transition-all duration-300 transform hover:scale-105`}
                >
                  {userSubscription?.tier === 'Free' ? '시작하기' : '업그레이드'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 rounded-lg">
          <DialogHeader>
            <DialogTitle>결제 확인</DialogTitle>
            <DialogDescription>
              {selectedPlanToUpgrade?.name} 플랜으로 변경하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          {selectedPlanToUpgrade && (
            <div className="py-4 space-y-2">
              <p className="text-lg font-semibold">{selectedPlanToUpgrade.name} 플랜</p>
              {selectedPlanToUpgrade.price && selectedPlanToUpgrade.price > 0 ? (
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedPlanToUpgrade.price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}/{selectedPlanToUpgrade.period === 'monthly' ? '월' : '년'}
                </p>
              ) : (
                <p className="text-2xl font-bold">무료</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                선택하신 플랜으로 업그레이드하시면 더 많은 기능을 이용하실 수 있습니다.
              </p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handlePaymentConfirm} className="bg-blue-600 hover:bg-blue-700 text-white">
              <CreditCard className="mr-2 h-4 w-4" /> 결제 진행
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}