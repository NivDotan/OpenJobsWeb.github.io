from telethon import TelegramClient, events
import datetime
from ConnetionToPsql import insert_into_jobs_table
from MessageParser import parse_message
from telethon.tl.types import Message, PeerChannel, MessageMediaWebPage, WebPagePending, MessageEntityBold, MessageEntityTextUrl, MessageEntityHashtag
from telethon.tl import types

async def Connection(api_id, api_hash):
    client = TelegramClient('Test1', api_id, api_hash)
    return client

async def main():
    api_id = 9676030
    api_hash = '868b631e0ef16c82f0a07d15a334fd50'
    channel_username = "HiTech_Jobs_In_Israel"
    try:
        client = await Connection(api_id, api_hash)
        
        @client.on(events.NewMessage(chats=channel_username))
        async def my_event_handler(event):
            print(event.raw_text)
            print(event.message)
            DictionaryOfValues = parse_message(event.message)
            print(DictionaryOfValues)
            insert_into_jobs_table(values = DictionaryOfValues)
    except:
        print("Had An Error")

        
        #InsertTOTableMain(parse_job_description(event.raw_text))

    await client.start()
    print("Client connected.")

    # Run the client until it's disconnected
    await client.run_until_disconnected()

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())