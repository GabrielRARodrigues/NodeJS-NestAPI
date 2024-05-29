import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name
    )
  }

  private async sendNewAnswerCommentNotification({
    answerComment
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString()
    )

    console.log(answer?.id)

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Nova comentário na resposta "${answer.excerpt}"`,
        content: answerComment.content.substring(0, 40).concat('...')
      })
    }
  }
}
