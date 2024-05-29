import { faker } from '@faker-js/faker'

import {
  QuestionCommentProps,
  QuestionComment
} from '@/domain/forum/enterprise/entities/question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      questionId: new UniqueEntityId(),
      ...override
    },
    id
  )

  return questionComment
}
