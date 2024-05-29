import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete an answer comment', async () => {
    const newAnswerComment = makeAnswerComment()

    inMemoryAnswerCommentsRepository.create(newAnswerComment)

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)

    await sut.execute({
      authorId: newAnswerComment.authorId.toString(),
      answerCommentId: newAnswerComment.id.toString()
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const newAnswer = makeAnswerComment({
      authorId: new UniqueEntityId('author-1')
    })

    inMemoryAnswerCommentsRepository.create(newAnswer)

    const result = await sut.execute({
      answerCommentId: newAnswer.id.toString(),
      authorId: 'author-2'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
