from telethon import TelegramClient, events
import re
from ConnetionToPsql import InsertTOTableMain

def parse_job_description(text):
    # Define the regex patterns for job description, company name, location, and link
    job_desc_pattern = re.compile(r'^(.+?) at (.+?)\s*Location: (.+?)\s*Press here \((.+?)\) to apply$', re.DOTALL)

    # Match the regex pattern against the text
    match = job_desc_pattern.match(text)

    if match:
        job_desc = match.group(1).strip()
        company_name = match.group(2).strip()
        location = match.group(3).strip()
        apply_link = match.group(4).strip()

        return {
            'Job Description': job_desc,
            'Company Name': company_name,
            'Location': location,
            'Apply Link': apply_link
        }
    else:
        return None

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
        InsertTOTableMain(parse_job_description(event.raw_text))

    await client.start()
    print("Client connected.")

    # Run the client until it's disconnected
    await client.run_until_disconnected()

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())