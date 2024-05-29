import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository 
implements NotificationsRepository
{
  public items: Notification[] = []

  
  async findById(id: string) {
    const notification = this.items.find(item => item.id.toString() === id)
    
    return notification || null
  }
  
  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === notification.id.toString()
    )

    this.items[itemIndex] = notification
  }
  
  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }
}
