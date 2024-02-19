import re
import datetime
from telethon.tl import types
from telethon.tl.types import Message, PeerChannel, MessageMediaWebPage, WebPagePending, MessageEntityBold, MessageEntityTextUrl, MessageEntityHashtag

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

#from ConnetionToPsql import insert_into_jobs_table
#DictionaryOfValues = parse_message(Message(id=77483, peer_id=PeerChannel(channel_id=1281025780), date=datetime.datetime(2024, 2, 18, 12, 0, 13, tzinfo=datetime.timezone.utc), message='File Systems Engineer at Apple\nLocation: Haifa\nPress here to apply', out=False, mentioned=False, media_unread=False, silent=True, post=True, from_scheduled=False, legacy=False, edit_hide=False, pinned=False, noforwards=False, invert_media=False, from_id=None, saved_peer_id=None, fwd_from=None, via_bot_id=None, reply_to=None, media=MessageMediaWebPage(webpage=WebPagePending(id=2493719960074899712, date=datetime.datetime(2024, 2, 18, 12, 2, 13, tzinfo=datetime.timezone.utc), url='https://jobs.apple.com/en-il/details/200539408'), force_large_media=False, force_small_media=False, manual=False, safe=False), reply_markup=None, entities=[MessageEntityBold(offset=0, length=21), MessageEntityTextUrl(offset=53, length=4, url='https://jobs.apple.com/en-il/details/200539408')], views=1, forwards=0, replies=None, edit_date=None, post_author=None, grouped_id=None, reactions=None, restriction_reason=[], ttl_period=None))
#print(DictionaryOfValues)
#insert_into_jobs_table(values = DictionaryOfValues)

#TODO:
#Handle this message:
#Senior product manager- Microsoft Defender for Cloud at Microsoft
#Location: Herzliya, Tel Aviv, Israel
#Send your CV + the link below to our admin who works there t.me/abaaabb ✌🏻 or press here to apply on your own
#
#Interested in advertising in this channel? Reach us out 👇
#רוצה לפרסם אצלנו ולהגיע למעל 3000 מחפשי עבודה? דבר/י איתנו 👇
#@abaaabb
#INSERT INTO public.jobsfromtelegram (Company, JobDesc, City, Date, Link) VALUES 
#( Student Software Engineer at Genesys, Genesys, Tel Aviv, Israel, 2024-02-18, https://genesys.wd1.myworkdayjobs.com/Genesys/job/Tel-Aviv-Israel/Student-Software-Engineer_JR103659);



def parse_messages(message, today_date):
    job_description_match = re.search(r'\*\*(.*?)\*\* at', message)
    company_name_match = re.search(r'\*\*(.*?)\*\* at', message)
    location_match = re.search(r'Location: (.+?)\n', message)
    link_match = re.search(r'\[here\]\((.*?)\)', message)

    if job_description_match and company_name_match and location_match and link_match:
        job_description = job_description_match.group(1).strip()
        company_name = company_name_match.group(1).strip()
        location = location_match.group(1).strip()
        link = link_match.group(1).strip()

        # Check if location is too long
        if len(location) > 255:
            location = 'Multiple Locations'
            
        return {
            'Job Description': job_description,
            'Company Name': company_name,
            'Location': location,
            'Date': today_date,
            'Link': link
            
        }
    else:
        return None