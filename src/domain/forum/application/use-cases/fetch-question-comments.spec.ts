import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeStudent } from 'test/factories/make-student'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    const firstComment = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id
    })

    const secondComment = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id
    })

    const thirtyComment = makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id
    })

    await inMemoryQuestionCommentsRepository.create(firstComment)

    await inMemoryQuestionCommentsRepository.create(secondComment)

    await inMemoryQuestionCommentsRepository.create(thirtyComment)

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: firstComment.id
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: secondComment.id
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: thirtyComment.id
        })
      ])
    )
  })

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-1'),
          authorId: student.id
        })
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
