import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment()

    inMemoryQuestionCommentsRepository.create(newQuestionComment)

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)

    await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString()
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const newQuestion = makeQuestionComment({
      authorId: new UniqueEntityId('author-1')
    })

    inMemoryQuestionCommentsRepository.create(newQuestion)

    const result = await sut.execute({
      questionCommentId: newQuestion.id.toString(),
      authorId: 'author-2'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
