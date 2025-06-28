import { Card, CardContent } from "@/components/ui/card";
import type { DesignMockup } from "@/lib/dashboard/project";

export default function StatsSummary({ mockups }: { mockups: DesignMockup[] }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{mockups.length}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">전체 목업</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{mockups.filter(m => m.status === 'in-progress').length}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">진행 중인 목업</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{mockups.filter(m => m.status === 'completed').length}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">완료된 목업</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}