import re
import datetime
from telethon.tl import types
from telethon.tl.types import Message, PeerChannel, MessageMediaWebPage, WebPagePending, MessageEntityBold, MessageEntityTextUrl, MessageEntityHashtag


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

# Example usage
text = """
Product Manager at Agmatix 
Location: Ramat Gan
Press here (https://www.comeet.com/jobs/agmatix/16.003/product-manager/11.34D) to apply
"""

#result = parse_job_description(text)
#print(result)
#print(result["Job Description"])
#print(result["Company Name"])
#print(result["Location"])
#print(result["Apply Link"])


def parse_message(message_string):
    # Regular expression for extracting information
    match = re.match(r"Message\(id=(\d+), peer_id=PeerChannel\(channel_id=(\d+)\), date=datetime\.datetime\((\d+), (\d+), (\d+), (\d+), (\d+), (\d+), tzinfo=datetime\.timezone\.utc\), message='(.+?)', .*?url='(.+?)'\)", message_string, re.DOTALL)
    
    if match:
        message_id, channel_id, year, month, day, hour, minute, second, message_content, link = match.groups()
        
        # Extracting job description, company name, and location
        job_desc_match = re.search(r'(.+) at (.+)\nLocation: (.+)\n', message_content)
        if job_desc_match:
            job_desc = job_desc_match.group(1).strip()
            company_name = job_desc_match.group(2).strip()
            location = job_desc_match.group(3).strip()

            return {
                'Date': datetime(int(year), int(month), int(day)),
                'Job Description': job_desc,
                'Company Name': company_name,
                'Location': location,
                'Link': link
            }

    return None

# Example usage with the provided message string


def parse_telegram_message(event):
    
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

message_string = Message(id=77481, peer_id=PeerChannel(channel_id=1281025780), date=datetime.datetime(2024, 2, 18, 12, 0, 10, tzinfo=datetime.timezone.utc), message='Student Software Engineer at Genesys\nLocation: Tel Aviv, Israel\nPress here to apply\n#StudentPositions', out=False, mentioned=False, media_unread=False, silent=True, post=True, from_scheduled=False, legacy=False, edit_hide=False, pinned=False, noforwards=False, invert_media=False, from_id=None, saved_peer_id=None, fwd_from=None, via_bot_id=None, reply_to=None, media=MessageMediaWebPage(webpage=WebPagePending(id=828568495621228423, date=datetime.datetime(2024, 2, 18, 12, 2, 10, tzinfo=datetime.timezone.utc), url='https://genesys.wd1.myworkdayjobs.com/Genesys/job/Tel-Aviv-Israel/Student-Software-Engineer_JR103659'), force_large_media=False, force_small_media=False, manual=False, safe=False), reply_markup=None, entities=[MessageEntityBold(offset=0, length=25), MessageEntityTextUrl(offset=70, length=4, url='https://genesys.wd1.myworkdayjobs.com/Genesys/job/Tel-Aviv-Israel/Student-Software-Engineer_JR103659'), MessageEntityHashtag(offset=84, length=17)], views=1, forwards=0, replies=None, edit_date=None, post_author=None, grouped_id=None, reactions=None, restriction_reason=[], ttl_period=None)
parsed_info = parse_telegram_message(message_string)
print(parsed_info)

#TODO:
#Handle this message:
#Senior product manager- Microsoft Defender for Cloud at Microsoft
#Location: Herzliya, Tel Aviv, Israel
#Send your CV + the link below to our admin who works there t.me/abaaabb ✌🏻 or press here to apply on your own
#
#Interested in advertising in this channel? Reach us out 👇
#רוצה לפרסם אצלנו ולהגיע למעל 3000 מחפשי עבודה? דבר/י איתנו 👇
#@abaaabb