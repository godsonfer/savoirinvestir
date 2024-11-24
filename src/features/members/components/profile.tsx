/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { AlertTriangle, MailIcon, Router, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { SpinLoader } from "@/components/spin-loader";
import Link from "next/link";

import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";

import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-get-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";


interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}
type Role = "admin" | "teacher" | "assistant" | "student" | "member" | "moderator" | "content_manager" | "communication_manager";

interface MemberRoleProps { role: Role; }
export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const { data: member, isLoading: isLoadingMember } = useGetMember({ id: memberId, });
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: currentMember, isLoading: currentMemberLoading, } = useCurrentMember({ workspaceId, });
  const [LeaveDialog, confirmLeave] = useConfirm("Voulez-vous quitter la communauté ? ", "Si vous quittez la communauté, vous ne pourrez pas revenir.");
  const [RemoveDialog, confirmRemove] = useConfirm("Voulez-vous sortir ce membre de la communauté ? ", "Si vous sortez ce membre de la communauté, vous nve pouvez plus le ramener.");
  const [UpdateDialog, confirmUpdate] = useConfirm("Voulez-vous mettre a jour le role de ce membre ? ", "Cet utilisateur aura un nouveau role dans la communauté.");

  const {
    mutate: updateMember, isPending: isLoadingUpdate, } = useUpdateMember();
  const { mutate: removeMember, isPending: isLoadingRemove, } = useRemoveMember();

  if (isLoadingMember || currentMemberLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex  h-[49px] justify-between items-center px-4  border-b">
          <p className="text-l font-bod">Profile </p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <X />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full  justify-center items-center">
          <SpinLoader size="size-5" />
        </div>
      </div>
    );
  }
  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex  h-[49px] justify-between items-center px-4  border-b">
          <p className="text-l font-bod">Profile </p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <X />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full  justify-center items-center">
          <AlertTriangle className="text-red-400 size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Membre introuvable</p>
        </div>
      </div>
    );
  }

  const onRemoveMember = async () => {
    const ok = await confirmRemove()

    if (!ok) return;
    removeMember({ id: memberId }, {
      onSuccess: () => {
        toast.success("Membre supprimé avec succès");
        onClose();
      },
      onError: () => toast.error("Erreur lors de la suppression du membre")
    });
  }
  const onLeaveMember = async () => {
    const ok = await confirmLeave()
    if (!ok) return;
    removeMember({ id: memberId }, {
      onSuccess: () => {
        toast.success("Vous avez quitté la communauté");
        onClose();
        router.replace(`/workspace/${workspaceId}`);
      },
      onError: () => toast.error("Erreur lors de la démission de la communauté")
    });
  }

  const onUpdate = async ({ role }: MemberRoleProps) => {
    const ok = await confirmUpdate()
    if (!ok) return;
    updateMember({ id: memberId, role }, {
      onSuccess: () => {
        toast.success("Modification du role avec succès");
        onClose();
      },
      onError: () => toast.error("Erreur lors de la modification du role")
    });
  }
  const avataFallback = member.user.name?.charAt(0).toUpperCase();

  return (
    <>
      <LeaveDialog />
      <RemoveDialog />
      <UpdateDialog />

      <div className="h-full flex flex-col">
        <div className="flex  h-[49px] justify-between items-center px-4  border-b">
          <p className="text-l font-bod">Profile </p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <X />
          </Button>
        </div>
        <div className="flex flex-col p-4 justify-center  items-center">
          <Avatar className="max-w-[256px] w-[256px] size-full">
            <AvatarImage src={member.user?.image} alt="image" />
            <AvatarFallback className="text-9xl size-full bg-orange-500 aspect-square">
              {avataFallback}
            </AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="flex flex-col p-4">
            <p className="font-bold text-xl text-center justify-center items-center">
              {member.user?.name}
            </p>
            {currentMember?.role === "admin" && currentMember?._id !== memberId ?
              (
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        onClick={() => { }}
                        className="w-full capitalize"
                        size="sm"
                        variant="outline">
                        {member.role} <ChevronDownIcon className="size-4  ml-4  items-end justify-end  " />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full ">
                      <DropdownMenuRadioGroup value={member.role} onValueChange={(role) => onUpdate({ role } as MemberRoleProps)}>
                        <DropdownMenuRadioItem value="admin">
                          Admin
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="teacher" >
                          Enseignant
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="assistant" >
                          Assistant
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="student" >
                          Etudiant
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="member" >
                          Membre
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="moderator"  >
                          Moderateur
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="content_manager">
                          Gestionnaire
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="communication_manager" >
                          Manager
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button size="sm" variant="outline" onClick={onRemoveMember} className="w-full">
                    Supprimer
                  </Button>
                </div>
              ) :
              currentMember?._id === memberId && currentMember?.role !== "admin" ?
                (
                  <div className="flex gap-2">
                    <Button
                      onClick={onLeaveMember}
                      className="w-full capitalize"
                      size="sm"
                      variant="destructive">
                      Quitter
                    </Button>
                  </div>
                ) : null
            }


          </div>
          <p className=" text-xm text-muted-foreground text-center justify-center items-center">
            Absent{" "}
          </p>
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="font-bold text-sm mb-4 text-center justify-center items-center">
            Informations{" "}
          </p>
          <div className="flex items-center gap-2">
            <div className="size-9 bg-muted flex  rounded-md items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] text-muted-foreground text-semilibold">
                Adresse Email
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-[13px] hover:underline text-[#3b82f6]  text-muted-foreground text-semilibold"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};
