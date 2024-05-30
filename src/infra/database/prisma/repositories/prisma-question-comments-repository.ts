import { Injectable } from '@nestjs/common'

import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  async findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.')
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }

  async create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
