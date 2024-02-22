from telethon import TelegramClient, events
from datetime import datetime
from ConnetionToPsql import insert_into_jobs_table
from MessageParser import parse_messages
from telethon.tl.types import Message, PeerChannel, MessageMediaWebPage, WebPagePending, MessageEntityBold, MessageEntityTextUrl, MessageEntityHashtag
from telethon.tl import types
import traceback

async def Connection(api_id, api_hash):
    client = TelegramClient('Test1', api_id, api_hash)
    return client

async def main():
    api_id = 9676030
    api_hash = '868b631e0ef16c82f0a07d15a334fd50'
    channel_username = "HiTech_Jobs_In_Israel"
    try:
        client = await Connection(api_id, api_hash)
        await client.start()
        print("Client connected.")
        
        today = datetime.now().date()
        # Get messages from the last 24 hours
        messages = []
        async for message in client.iter_messages(channel_username, limit=None):
            if message.date.date() == today:
                messages.append(message)
            elif message.date.date() < today:
                break
        
        for message in messages:
            DictionaryOfValues = parse_messages(message.text, today)
            if not(DictionaryOfValues is None):
                insert_into_jobs_table(values = DictionaryOfValues)
                

    except Exception as e:
        print("Had An Error, ", e, ", ", traceback.print_exc())


    # Run the client until it's disconnected
    await client.run_until_disconnected()

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())