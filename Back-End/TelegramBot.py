from telethon import TelegramClient, events
from datetime import datetime
from ConnetionToPsql import InsertTOTableMain, connectionTODB
from MessageParser import parse_messages
from telethon.tl.types import Message, PeerChannel, MessageMediaWebPage, WebPagePending, MessageEntityBold, MessageEntityTextUrl, MessageEntityHashtag
from telethon.tl import types
import traceback
import os
from os.path import join, dirname
from dotenv import load_dotenv





async def Connection(api_id, api_hash):
    client = TelegramClient('Test1', api_id, api_hash)
    return client

async def main():
    current_directory = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = join(dirname(__file__), '.env')
    load_dotenv(dotenv_path)
    api_id = os.environ.get("api_id")
    api_hash = os.environ.get("api_hash")
    channel_username = os.environ.get("channel_username")

    try:
        client = await Connection(api_id, api_hash)
        await client.start()
        print("Client connected.")
        
        today = datetime.now().date()
        yesterday_date = datetime(2024, 3, 9).date()
        today = yesterday_date
        # Get messages from the last 24 hours
        messages = []
        async for message in client.iter_messages(channel_username, limit=None):
            if message.date.date() == today:
                messages.append(message)
            elif message.date.date() < today:
                break
        print(f"Inserting {len(messages)} records.")
        conn = connectionTODB()
        for message in messages:
            DictionaryOfValues = parse_messages(message.text, today)
            if not(DictionaryOfValues is None):
                InsertTOTableMain(conn, DictionaryOfValues)
        print(f"Finished Inserting {len(messages)} records.")
    except Exception as e:
        print("Had An Error, ", e, ", ", traceback.print_exc())


    # Run the client until it's disconnected
    #await client.run_until_disconnected()

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())