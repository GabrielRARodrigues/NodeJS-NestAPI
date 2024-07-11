import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository
  ) {}

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === question.id.toString()
    )

    this.items[itemIndex] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems()
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(id: string) {
    const question = this.items.find(item => item.id.toString() === id)

    return question || null
  }

  async findBySlug(slug: string) {
    const question = this.items.find(item => item.slug.value === slug)

    return question || null
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find(item => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find(student =>
      student.id.equals(question.authorId)
    )

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist"`
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      questionAttachment => {
        return questionAttachment.questionId.equals(question.id)
      }
    )

    const attachments = questionAttachments.map(questionAttachment => {
      const attachment = this.attachmentsRepository.items.find(attachment =>
        attachment.id.equals(questionAttachment.attachmentId)
      )

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist"`
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      attachments
    })
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === question.id.toString()
    )

    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    )
  }
}
