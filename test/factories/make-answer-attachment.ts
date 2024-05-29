import {
  AnswerAttachmentProps,
  AnswerAttachment
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

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
