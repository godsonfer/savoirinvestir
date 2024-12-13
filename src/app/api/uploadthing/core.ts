import { createUploadthing, type FileRouter } from "uploadthing/next";

// import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

export const ourFileRouter = {
  courseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete( () => {
      
  }),
  imageUploader: f({ image: { maxFileSize: "4MB" } })
  .onUploadComplete(async ({  file }) => {
    return { url: file.url };
  }),

  courseAttachment: f([
    "text",
    "image",
    "video",
    "audio",
    "pdf",
  ]).onUploadComplete( () => {
   
  }),
  chapterVideo: f({
    video: { maxFileCount: 1, maxFileSize: "256MB" },
  }).onUploadComplete( () => {
   
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
