import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
// todo::  Il reste blogs, posts, and tags tables.
const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean() || false),
    role:
      v.union(
        v.literal("admin"),
        v.literal("teacher"),
        v.literal("assistant"),
        v.literal("student"),
        v.literal("member"),
        v.literal("moderator"),
        v.literal("content_manager"),
        v.literal("communication_manager"),
      ) || "member",
  }).index("email", ["email"]),
  // settings table
  settings: defineTable({
    homePageMenuBar: v.optional(
      v.array(
        v.object({
          menuName: v.string(),
          menuItem: v.array(
            v.object({
              title: v.string(),
              url: v.string(),
            }),
          ),
        }),
      ),
    ),
    homePageHero: v.optional(
      v.object({
        title: v.string(),
        content: v.object({
          title: v.string(),
          description: v.string(),
          cover: v.optional(v.string()),
          fileType: v.optional(v.union(v.literal("image"), v.literal("video"))),
          fileUrl: v.optional(v.string()),
          buttonText: v.optional(v.string()),
        }),
      }),
    ),
    homePageCarroussel: v.optional(
      v.array(
        v.object({
          title: v.string(),
          carrouselText: v.string(),
          fileType: v.optional(v.union(v.literal("image"), v.literal("video"))),
          fileUrl: v.optional(v.string()),
        }),
      ),
    ),
    HomePageTrendigText: v.optional(
      v.object({
        text: v.string(),
        subText: v.string(),
      }),
    ),
    homePageAbout: v.optional(
      v.object({
        text: v.string(),
        subText: v.string(),
        about: v.array(
          v.object({
            title: v.string(),
            text: v.string(),
            icons: v.optional(v.string()),
            buttonText: v.string(),
          }),
        ),
      }),
    ),
    homePageContact: v.optional(
      v.array(
        v.object({
          contact: v.string(),
          link: v.string(),
          icon: v.string(),
        }),
      ),
    ),
    homePageFeatures: v.optional(
      v.array(
        v.object({
          title: v.string(),
          subTitle: v.string(),
          content: v.optional(
            v.array(
              v.object({
                coverUrl: v.string(),
                coverType: v.optional(
                  v.union(v.literal("image"), v.literal("video")),
                ),
                icon: v.optional(v.string()),
                title: v.string(),
                description: v.string(),
              }),
            ),
          ),
        }),
      ),
    ),
    homePageSubHeader: v.optional(
      v.object({
        text: v.string(),
        contactInf: v.array(
          v.object({
            title: v.string(),
            icon: v.string(),
            content: v.string(),
            url: v.string(),
          }),
        ),
      }),
    ),
    homePageFooter: v.optional(
      v.object({
        companyDescription: v.string(),
        companyName: v.string(),
        companyAddres: v.optional(v.string()),
        companyContact: v.optional(v.string()),
        webstite: v.optional(
          v.array(
            v.object({
              title: v.string(),
              urlTitle: v.string(),
              url: v.string(),
            }),
          ),
        ),
      }),
    ),
    teachers: v.optional(
      v.object({
        title: v.string(),
        subTitle: v.string(),
        calloutButton: v.string(),
        calloutLink: v.string(),
        teachers: v.array(
          v.object({
            name: v.string(),
            image: v.string(),
            jobTitle: v.string(),
            bio: v.string(),
            rating: v.number(),
            socialMedia: v.array(
              v.object({
                name: v.string(),
                url: v.string(),
              }),
            ),
          }),
        ),
      }),
    ),
    homePageFaqs: v.optional(
      v.object({
        title: v.string(),
        subTitle: v.string(),
        cover: v.string(),
        faqs: v.array(
          v.object({
            question: v.string(),
            answer: v.string(),
          }),
        ),
      }),
    ),
    otherInformation: v.optional(
      v.object({
        title: v.string(),
        subTitle: v.string(),
        content: v.optional(
          v.array(
            v.object({
              icon: v.string(),
              title: v.string(),
              content: v.string(),
            }),
          ),
        ),
      }),
    ),
  }),

  // new letters
  newletters: defineTable({
    email: v.array(v.object({ email: v.string() })),
  }),
  // marketings table
  marketing: defineTable({
    title: v.string(),
    description: v.string(),
    marketingType: v.optional(
      v.union(v.literal("banner"), v.literal("snackbar")),
    ),
    isHomePage: v.optional(v.boolean() || false),
    isPublic: v.optional(v.boolean() || false),
    coverImage: v.optional(v.string()),
    discount: v.optional(v.string()),
    validDate: v.optional(v.number()),
    bannerPosition: v.optional(v.union(v.literal("top"), v.literal("bottom"))), //position de la bannière
    calloutButtonText: v.optional(v.string()), //texte a afficher pour profiter à la promotion
  }),
  // worskpace table
  workspaces: defineTable({
    name: v.string(),
    color: v.optional(v.string()),
    logo: v.optional(v.string()),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  // members table
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    isNew: v.optional(v.boolean() || false),
    isBanned: v.optional(v.boolean() || false),
    isMuted: v.optional(v.boolean() || false),
    isDeleted: v.optional(v.boolean() || false),
    statusChangeDateTieme: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("online"),
        v.literal("meeting"),
        v.literal("vacation"),
        v.literal("sick"),
        v.literal("working"),
      ),
    ),
    warning: v.optional(
      v.union(v.literal("banned"), v.literal("muted"), v.literal("warned")),
    ),
    role: v.union(
      v.literal("admin"),
      v.literal("teacher"),
      v.literal("assistant"),
      v.literal("student"),
      v.literal("member"),
      v.literal("moderator"),
      v.literal("content_manager"),
      v.literal("communication_manager"),
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),

  // channels table
  channels: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    theme: v.optional(v.string()),
    isNew: v.optional(v.boolean() || false),
    isPinned: v.optional(v.boolean() || false),
    isArchived: v.optional(v.boolean() || false),
    position: v.optional(v.number() || 0),
    type: v.optional(
      v.union(
        v.literal("audio"),
        v.literal("live"),
        v.literal("default"),
        v.literal("poll"),
        v.literal("post"),
        v.literal("board"),
        v.literal("course"),
      ),
    ),
    author: v.id("users"),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
    workspaceId: v.id("workspaces"),
  }).index("by_workspace_id", ["workspaceId"]),

  // conversation table
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  }).index("by_workspaceId", ["workspaceId"]),

  // messages table
  messages: defineTable({
    body: v.string(),
    file: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),

  // reactions table
  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),

  // course table
  courses: defineTable({
    title: v.string(),
    userId: v.id("users"),
    workspaceId: v.optional(v.id("workspaces")),
    categoryId: v.optional(v.id("categories")),
    cover: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    isPublished: v.optional(v.boolean() || false),
    imageUrl: v.optional(v.array(v.string())),
    duration: v.optional(v.number()),
    skills: v.optional(v.array(v.string())),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_user_id", ["userId"])
    .index("by_category_id", ["categoryId"]),

  // categorie table
  categories: defineTable({
    title: v.string(),
    userId: v.id("users"),
  }).index("by_user_id", ["userId"]),

  // attachment table
  attachments: defineTable({
    courseId: v.id("courses"),
    chapterId: v.optional(v.id("chapters")),
    name: v.optional(v.string()),
    url: v.string(),
  })
    .index("by_course_id", ["courseId"])
    .index("by_course_id_chapter_id", ["courseId", "chapterId"])
    .index("by_chapter_id", ["chapterId"]),

  // chapter table
  chapters: defineTable({
    title: v.string(),
    courseId: v.id("courses"),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    position: v.optional(v.number()),
    isPublished: v.optional(v.boolean() || false),
    isFree: v.optional(v.boolean() || false),
  })
    .index("by_course_id", ["courseId"])
    .index("by_position_course_id", ["position", "courseId"]),
  // lessons table
  lessons: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    position: v.optional(v.number()),
    isPublished: v.optional(v.boolean() || false),
    isFree: v.optional(v.boolean() || false),
    duration: v.optional(v.number()),
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
  })
    .index("by_chapter_id", ["chapterId"])
    .index("by_course_id", ["courseId"])
    .index("by_chapter_id_course_id", ["chapterId", "courseId"]),

  // muxt data
  muxData: defineTable({
    assetId: v.string(),
    lessonId: v.id("lessons"),
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
    playback: v.optional(v.string()),
  })
    .index("by_chapter_id", ["chapterId"])
    .index("by_course_id", ["courseId"])
    .index("by_chapter_id_course_id", ["chapterId", "courseId"])
    .index("by_lesson_id", ["lessonId"]),

  // user progress table
  userProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    isCompleted: v.optional(v.boolean() || false),
    completionDate: v.optional(v.number()),
    progress: v.optional(v.number()),
  })
    .index("by_user_id", ["userId"])
    .index("by_lesson_id", ["lessonId"])
    .index("by_user_id_by_lesson_id", ["userId", "lessonId"]),

  // transactions table
  purchases: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    purchaseDate: v.number(),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("cancelled"),
        v.literal("successful"),
      ),
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_course_id", ["userId", "courseId"])
    .index("by_course_id", ["courseId"]),

  // customer table
  paymentCustomer: defineTable({
    userId: v.id("users"),
    customerId: v.string(),
    paymentMethod: v.union(
      v.literal("crypto"),
      v.literal("card"),
      v.literal("cfa"),
      v.literal("paypal"),
      v.literal("stripe"),
    ),
    paymentIntentId: v.string(),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_customer_id", ["customerId"])
    .index("by_payment_method", ["paymentMethod"]),

  // trading journal table
  journals: defineTable({}),

  // certificats table
  certificats: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    certificateUrl: v.optional(v.id("_storage")),
  })
    .index("by_user_id", ["userId"])
    .index("by_course_id", ["courseId"])
    .index("by_user_id_course_id", ["userId", "courseId"]),

  exercices: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
    poll: v.optional(
      v.array(
        v.object({
          question: v.string(),
          supposedAnsewer: v.string(),
          isRequired: v.boolean(),
          needMark: v.number(),
          note: v.optional(v.string()),
        }),
      ),
    ),
  }),
  // exercices done table
  useExercices: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    mark: v.optional(v.number()),
    exerciseId: v.array(
      v.object({
        exercicesId: v.id("exercises"),
        executedDate: v.number(),
        answer: v.string(),
        note: v.optional(v.string()),
      }),
    ),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user_id", ["userId"])
    .index("by_exercices_id", ["exerciseId"])
    .index("by_user_id_course_id", ["userId", "courseId"])
    .index("by_user_id_course_id_exercise_id", [
      "userId",
      "courseId",
      "exerciseId",
    ]),
  // comments
  comments: defineTable({
    userId: v.id("users"),
    lessonId: v.optional(v.id("lessons")),
    chapterId: v.id("chapters"),
    file: v.optional(v.array(v.id("_storage"))),
    comment: v.string(),
    upatedAt: v.optional(v.number()),
  })
    .index("by_chapter_id", ["chapterId"])
    .index("by_user_id", ["userId"])
    .index("by_lesson_id", ["lessonId"])
    .index("by_user_id_lesson_id", ["userId", "lessonId"])
    .index("by_user_id_lesson_chapter_id", ["userId", "lessonId", "chapterId"]),

  // reviews
  review: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    rating: v.number(),
    review: v.optional(v.string()),
    updateAt: v.optional(v.number()),
  })
    .index("by_user_id", ["userId"])
    .index("by_course_id", ["courseId"])
    .index("by_user_id_course_id", ["userId", "courseId"]),

  // notifications
  notifications: defineTable({
    userId: v.id("users"),
    workspaceId: v.optional(v.id("workspaces")),
    channelId: v.optional(v.id("channels")),
    courseId: v.optional(v.id("courses")),
    chapterId: v.optional(v.id("chapters")),
    lessonId: v.optional(v.id("lessons")),
    purchassId: v.optional(v.id("purchases")),
    type: v.string(),
    message: v.string(),
    isRead: v.optional(v.boolean() || false),
    readAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_channel_id", ["channelId"])
    .index("by_course_id", ["courseId"])
    .index("by_chapter_id", ["chapterId"])
    .index("by_lessons_id", ["lessonId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_purchases_id", ["purchassId"])
    .index("by_user_id_channel_id_workspace_id", [
      "userId",
      "channelId",
      "workspaceId",
    ])
    .index("by_user_id_course_id", ["userId", "courseId"])
    .index("by_user_id_chapter_id", ["userId", "chapterId"])
    .index("by_user_id_lessons_id", ["userId", "lessonId"])
    .index("by_user_id_purchases_id", ["userId", "purchassId"])
    .index("by_user_id_channel_id_course_id", [
      "userId",
      "channelId",
      "courseId",
    ])
    .index("by_user_id_channel_id_chapter_id", [
      "userId",
      "channelId",
      "chapterId",
    ])
    .index("by_user_id_channel_id_lessons_id", [
      "userId",
      "channelId",
      "lessonId",
    ])
    .index("by_user_id_channel_id_purchases_id", [
      "userId",
      "channelId",
      "purchassId",
    ])
    .index("by_user_id_workspace_id_course_id", [
      "userId",
      "workspaceId",
      "courseId",
    ])
    .index("by_user_id_workspace_id", ["userId", "workspaceId"]),
});
export default schema;
