import { useLessonId } from "@/features/lessons/store/user-lessons-id";
import { useProfileMemberId } from "@/features/members/store/user-profile-member-id";
import { useParentMessageId } from "@/features/messages/store/user-parent-message-id";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();
  const [lessonId, setLessonId] = useLessonId();

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };
  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onOpenLesson = (lessonId: string) => {
    setLessonId(lessonId);
  };
  const onCLose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onCLose,
    onOpenProfile,
    profileMemberId,
    lessonId,
    onOpenLesson,
  };
};
