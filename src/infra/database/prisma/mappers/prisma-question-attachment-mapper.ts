import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        questionId: new UniqueEntityId(raw.questionId)
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map(attachment =>
      attachment.attachmentId.toString()
    )

    return {
      where: {
        id: {
          in: attachmentsIds
        }
      },
      data: {
        questionId: attachments[0].questionId.toString()
      }
    }
  }
}
