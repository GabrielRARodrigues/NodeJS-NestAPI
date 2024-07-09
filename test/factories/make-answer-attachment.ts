import { Injectable } from '@nestjs/common'

import {
  AnswerAttachmentProps,
  AnswerAttachment
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const answerAttachment = AnswerAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...override
    },
    id
  )

  return answerAttachment
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentProps> = {}
  ): Promise<AnswerAttachment> {
    const AnswerAttachment = makeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: AnswerAttachment.attachmentId.toString()
      },
      data: {
        answerId: AnswerAttachment.answerId.toString()
      }
    })

    return AnswerAttachment
  }
}
