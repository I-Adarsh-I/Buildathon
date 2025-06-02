from flask import Flask, request, jsonify
from openai import OpenAI
from textwrap import dedent
import requests
from elasticsearch import Elasticsearch
# Initialize Elasticsearch client
es = Elasticsearch(['http://localhost:9200'])
# create index if it doesn't exist
if not es.indices.exists(index='influencer_personas'):
    es.indices.create(index='influencer_personas')

# ollama_url = 'http://localhost:11434/api/generate'
client = OpenAI(api_key='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')

classifier_prompt = """
You are a content classifier. Your task is to classify the content of the input text into one of the following categories:
- Lifestyle
- Beauty
- Fitness & Health
- Tech
- Travel
- Food
- Gaming
- Business / Finance
- Parenting
- Education
- Entertainment


Your response should be a single word indicating the category of the content, without any additional text or explanation.
If the content does not fit into any of the specified categories, respond with "Other".
"""

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Hello, Flask!"})


@app.route('/create_influencer_persona', methods=['POST'])
def create_persona():
    data = request.json
    response = client.responses.create(
        model="gpt-4o",
        input=[
            {
            "role": "system",
            "content": [
                {
                "type": "input_text",
                "text": dedent(classifier_prompt)
                }
            ]
            },
            {
            "role": "user",
            "content": [
                {
                "type": "input_text",
                "text": ""
                }
            ]
            }
        ],
    )
    print(response)
    print(response.output[0].content[0].text)
    return jsonify(data)


@app.route('/create_advert', methods=['POST'])
def create_advert():
    data = request.json

    # Classify the advert text
    response = client.responses.create(
        model="gpt-4o",
        input=[
            {
                "role": "system",
                "content": [
                    {
                        "type": "input_text",
                        "text": dedent(classifier_prompt)
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": ""
                    }
                ]
            }
        ],
    )
    
    category = response.output[0].content[0].text.strip()
    
    # Store the advert in Elasticsearch
    # es.index(index='influencer_personas', body={
    #     'advert_text': advert_text,
    #     'influencer_persona': influencer_persona,
    #     'category': category
    # })

    return jsonify({"category": category, "message": "Advert category assigned successfully."})

if __name__ == '__main__':
    app.run(debug=True)