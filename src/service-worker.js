/**
 Service Worker module
 */
const ServiceWorker = (() => {
  /**
   * Receives a push event and shows the notification to the user
   * @param event
   * @returns {Promise<void>}
   */
  const notify = async (event) => {
    try {
      const data = await getContent(event)
      const title = data.title
      const options = {
        icon: data.icon,
        body: data.body,
        image: data.image,
        requireInteraction: data.require_interaction,
        data: {
          url: data.extra.url_to_open
        }
      }

      await self.registration.showNotification(title, options)
    } catch (err) {
      console.log('Error receiving push notification', err)
    }
  }

  /**
   * Opens the url that comes in the event
   * @param event
   */
  const openWindow = (event) => {
    event.notification.close()

    const url = event.notification.data.url
    self.clients.openWindow(url)
  }

  /**
   * Get the payload
   * @param event
   * @returns {*}
   */
  const getContent = (event) => {
    if (!event.data) {
      throw Error('No payload was sent in the push message')
    }
    return event.data.json()
  }

  return {
    notify,
    openWindow
  }
})()

self.addEventListener('push', async (event) => {
  event.waitUntil(ServiceWorker.notify(event))
})

self.addEventListener('notificationclick', event => {
  event.waitUntil(ServiceWorker.openWindow(event))
})

self.addEventListener('install', () => {
  self.skipWaiting()
})
