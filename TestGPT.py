from telethon import TelegramClient, events

async def Connection(api_id, api_hash):
    client = TelegramClient('Test1', api_id, api_hash)
    return client

async def main():
    api_id = 9676030
    api_hash = '868b631e0ef16c82f0a07d15a334fd50'
    channel_username = "HiTech_Jobs_In_Israel"

    client = await Connection(api_id, api_hash)

    @client.on(events.NewMessage(chats=channel_username))
    async def my_event_handler(event):
        print(event.raw_text)

    await client.start()
    print("Client connected.")

    # Run the client until it's disconnected
    await client.run_until_disconnected()

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())