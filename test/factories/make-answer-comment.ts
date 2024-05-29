import { faker } from '@faker-js/faker'

import {
  AnswerCommentProps,
  AnswerComment
} from '@/domain/forum/enterprise/entities/answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      answerId: new UniqueEntityId(),
      ...override
    },
    id
  )

  return answerComment
}
