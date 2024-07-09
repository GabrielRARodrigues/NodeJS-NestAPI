import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryAnswersRepository implements AnswersRepository {
  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  public items: Answer[] = []

  async findById(id: string) {
    const answer = this.items.find(item => item.id.toString() === id)

    return answer || null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === answer.id.toString()
    )

    this.items[itemIndex] = answer

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems()
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems()
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === answer.id.toString()
    )

    this.items.splice(itemIndex, 1)

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
