"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/utils/uploadthing";
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
        onClientUploadComplete={ (res) => {
          toast.success("Upload réussi!");
          if (res?.[0]) {
            onChange(res[0].url);
          }
        }}
        onUploadAborted={() => {
          toast.error("Upload annulé!");
        }}
        onUploadError={ () => {
          console.log("Upload error:");
          toast.error(`Upload error`);
        }}
      />
    </div>
  )
}
