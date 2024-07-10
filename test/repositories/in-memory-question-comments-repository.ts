import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

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

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ) {
    const comments = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map(comment => {
        const author = this.studentsRepository.items.find(student =>
          student.id.equals(comment.authorId)
        )

        if (!author) {
          throw new Error(
            `Author with id "${comment.authorId.toString}" does not exist`
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name
        })
      })

    return comments
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
