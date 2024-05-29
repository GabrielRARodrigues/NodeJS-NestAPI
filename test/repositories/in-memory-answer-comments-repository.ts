import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryAnswerCommentsRepository
implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async findById(id: string) {
    const answerComment = this.items.find(item => item.id.toString() === id)

    return answerComment || null
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter(item => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)

    DomainEvents.dispatchEventsForAggregate(answerComment.id)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === answerComment.id.toString()
    )

    this.items.splice(itemIndex, 1)
  }
}
