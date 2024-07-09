import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'

describe('Edit Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory
      ]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const firstAttachment = await attachmentFactory.makePrismaAttachment()
    const secondAttachment = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: firstAttachment.id,
      questionId: question.id
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: secondAttachment.id,
      questionId: question.id
    })

    const thirtyAttachment = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New title',
        content: 'New content',
        attachments: [
          firstAttachment.id.toString(),
          thirtyAttachment.id.toString()
        ]
      })

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New title'
      }
    })

    expect(questionOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id
      }
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstAttachment.id.toString()
        }),
        expect.objectContaining({
          id: thirtyAttachment.id.toString()
        })
      ])
    )
  })
})
