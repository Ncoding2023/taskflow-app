import StatsCards from './StatsCards'
import ProgressChart from './ProgressChart'
import PriorityChart from './PriorityChart'
import ProductivityMetrics from './ProductivityMetrics'

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  due_date?: string
  completed_at?: string
  created_at: string
}

interface StatisticsSectionProps {
  tasks: Task[]
  folders: any[]
}

export default function StatisticsSection({ tasks, folders }: StatisticsSectionProps) {
  // 기본 통계 계산
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = tasks.filter(task => !task.completed).length
  const totalTasks = tasks.length
  const foldersCount = folders.length
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length

  // 우선순위별 통계
  const highPriority = tasks.filter(task => task.priority === 'high').length
  const mediumPriority = tasks.filter(task => task.priority === 'medium').length
  const lowPriority = tasks.filter(task => task.priority === 'low').length

  // 생산성 지표 계산
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const tasksCompletedThisWeek = tasks.filter(task => 
    task.completed && task.completed_at && new Date(task.completed_at) >= oneWeekAgo
  ).length

  const tasksCompletedLastWeek = tasks.filter(task => 
    task.completed && task.completed_at && 
    new Date(task.completed_at) >= twoWeeksAgo && 
    new Date(task.completed_at) < oneWeekAgo
  ).length

  // 평균 완료 시간 계산 (간단한 예시)
  const completedTasksWithTime = tasks.filter(task => task.completed && task.completed_at && task.created_at)
  const averageCompletionTime = completedTasksWithTime.length > 0 
    ? completedTasksWithTime.reduce((total, task) => {
        const created = new Date(task.created_at)
        const completed = new Date(task.completed_at!)
        const hours = (completed.getTime() - created.getTime()) / (1000 * 60 * 60)
        return total + hours
      }, 0) / completedTasksWithTime.length
    : 0

  // 지연된 태스크
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.due_date && new Date(task.due_date) < now
  ).length

  // 다가오는 마감일 (3일 이내)
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const upcomingDeadlines = tasks.filter(task => 
    !task.completed && task.due_date && 
    new Date(task.due_date) <= threeDaysFromNow && 
    new Date(task.due_date) > now
  ).length

  return (
    <div className="space-y-6">
      {/* 기본 통계 카드 */}
      <StatsCards
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        foldersCount={foldersCount}
        highPriorityTasks={highPriorityTasks}
      />

      {/* 상세 통계 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 진행률 차트 */}
        <ProgressChart
          completed={completedTasks}
          total={totalTasks}
          title="전체 진행률"
          size="md"
        />

        {/* 우선순위 분포 */}
        <PriorityChart
          high={highPriority}
          medium={mediumPriority}
          low={lowPriority}
        />

        {/* 생산성 지표 */}
        <ProductivityMetrics
          averageCompletionTime={averageCompletionTime}
          tasksCompletedThisWeek={tasksCompletedThisWeek}
          tasksCompletedLastWeek={tasksCompletedLastWeek}
          overdueTasks={overdueTasks}
          upcomingDeadlines={upcomingDeadlines}
        />
      </div>
    </div>
  )
} 