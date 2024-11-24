"use client";


import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({
  onChange,
  endpoint
}: FileUploadProps) => {
  return (
    <div className="w-50">
      <UploadDropzone
        endpoint={endpoint}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClientUploadComplete={async (res: any) => {
           onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`);
        }}
      />
    </div>
  )
}
