from telethon import TelegramClient, events
import re
from datetime import datetime
from ConnetionToPsql import InsertTOTableMain
from telethon.tl.types import Message, PeerChannel, MessageMediaWebPage, WebPagePending, MessageEntityBold, MessageEntityTextUrl, MessageEntityHashtag
from telethon.tl import types

def parse_message(event):
    
    MessageMediaWebPage = event.media.webpage
    lines = event.message.split('\n')

    # Extract information
    if len(lines) >= 2:
        job_description = lines[0].strip()

        # Extracting company name from the job description line
        company_name = job_description.split(' at ', 1)[1].strip()

        location_line = lines[1].strip()

        # Extracting location from the location line
        location_prefix = 'Location: '
        if location_line.startswith(location_prefix):
            location = location_line[len(location_prefix):].strip()
        else:
            location = None

    return {
        'Job Description': job_description,
        'Company Name': company_name,
        'Location': location,
        'Link': MessageMediaWebPage.url,
        'Date': event.date
    }

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
            print(parse_message(event.message))
            TmpStr = str(event.message)
            parse_message(TmpStr)
            DictionaryOfValues = parse_message(TmpStr)
            InsertTOTableMain(DictionaryOfValues)
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