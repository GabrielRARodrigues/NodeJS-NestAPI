import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name
    )
  }

  private async sendNewQuestionCommentNotification({
    questionComment
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString()
    )

    console.log(question?.id)

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova comentário na pergunta "${question.title
          .substring(0, 20)
          .concat('...')}"`,
        content: questionComment.content.substring(0, 40).concat('...')
      })
    }
  }
}
