import os
from dotenv import load_dotenv, find_dotenv
from langchain_groq import ChatGroq

_ = load_dotenv(find_dotenv())
GROQ_API_KEY = os.environ["GROQ_API_KEY"]

model = ChatGroq(model="openai/gpt-oss-120b")
