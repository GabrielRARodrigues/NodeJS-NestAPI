import { Injectable } from '@nestjs/common'

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  async findById(id: string): Promise<Answer | null> {
    throw new Error('Method not implemented.')
  }

  async findManyByQuestionId(
    questionId: string,
    param: PaginationParams
  ): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }

  async create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
