import { faker } from '@faker-js/faker'

import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override
    },
    id
  )

  return answer
}
