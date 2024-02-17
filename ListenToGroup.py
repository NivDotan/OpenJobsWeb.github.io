from telethon import TelegramClient, events, sync, types

# These example values won't work. You must get your own api_id and
# api_hash from https://my.telegram.org, under API Development.

def Conncection(api_id, api_hash):
    client = TelegramClient('Test1', api_id, api_hash)
    
    return client
    
    
def IsTheGoupExist(client, channel_username):
    try:
        entity = client.get_entity(channel_username)
        print(type(entity))
        if isinstance(entity, types.Channel):
            chat_id = entity.id
            print(chat_id)
    except:
        print(f"No user has {channel_username} as username")




api_id = 9676030
api_hash = '868b631e0ef16c82f0a07d15a334fd50'
channel_username = "news_kodkodgroup"
client = Conncection(api_id, api_hash)
#client.start()
#print("1")
#client.run_until_disconnected()

@client.on(events.NewMessage(chats=channel_username))
async def my_event_handler(event):
    print(event.raw_text)

async def main():
    await client.start()
    print("Client connected.")

    # Run the client until it's disconnected
    await client.run_until_disconnected()

# Use asyncio.run to run the main function
import asyncio
asyncio.run(main())
