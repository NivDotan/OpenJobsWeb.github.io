import re

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

result = parse_job_description(text)
print(result)
print(result["Job Description"])
print(result["Company Name"])
print(result["Location"])
print(result["Apply Link"])
