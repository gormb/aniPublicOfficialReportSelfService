import requests
import json

api_id = 'ur09x7zb'

# This endpoint is now publicly accessible
# https://sessionize.com/api/v2/ur09x7zb/view/Sessions
api_url = f'https://sessionize.com/api/v2/{api_id}/view/Sessions'

try:
    response = requests.get(api_url)
    response.raise_for_status() # This should no longer raise an error

    sessions = response.json()

    print("Talk Suggestions:")
    print("------------------")

    for session in sessions:
        title = session.get('title')
        speakers = session.get('speakers')

        speaker_names = []
        if speakers:
            for speaker in speakers:
                speaker_names.append(speaker.get('fullName'))

        print(f"Title: {title}")
        print(f"Speakers: {', '.join(speaker_names)}")
        print("-" * 20)

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
except json.JSONDecodeError:
    print("Error: Could not decode JSON from the response.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")