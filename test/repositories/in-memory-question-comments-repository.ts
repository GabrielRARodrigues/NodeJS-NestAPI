import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryQuestionCommentsRepository
implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async findById(id: string) {
    const questionComment = this.items.find(item => item.id.toString() === id)

    return questionComment || null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)

    DomainEvents.dispatchEventsForAggregate(questionComment.id)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === questionComment.id.toString()
    )

    this.items.splice(itemIndex, 1)
  }
}
