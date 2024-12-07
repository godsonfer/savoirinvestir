export interface Certificate {
  id: string
  title: string
  issueDate: string
  status: 'pending' | 'issued'
  type: 'purchase' | 'gift'
  student: {
    name: string
    email: string
  }
  course: {
    title: string
    duration: string
    startDate: string
    endDate: string
  }
  instructor: {
    name: string
    title: string
  }
  completionRate: number
} 
