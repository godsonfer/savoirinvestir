import { Progress } from "@/components/ui/progress"
import { Progress as ProgressType } from "../types"

interface ProgressIndicatorProps {
  progress?: ProgressType
  label?: string
}

export default function ProgressIndicator({ progress, label }: ProgressIndicatorProps) {
  if (!progress) return null

  return (
    <div className="space-y-2">
      {label && <div className="text-sm text-gray-600">{label}</div>}
      <div className="flex items-center gap-4">
        <Progress value={progress.score} className="flex-1" />
        <span className="text-sm font-medium">{progress.score}%</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{progress.attempts} tentative{progress.attempts > 1 ? 's' : ''}</span>
        {progress.submittedAt && (
          <span>
            Dernière soumission : {new Date(progress.submittedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
} 
