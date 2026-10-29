from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from operator import itemgetter

load_dotenv(find_dotenv())

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
retriever = vector_db.as_retriever(search_kwargs={"k": 4})

model = ChatGroq(model="openai/gpt-oss-120b")

prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You answer questions about Nigerian tax law using only the context below. "
     "If the context does not contain the answer, say you don't know. "
     "Context: {context}"),
     MessagesPlaceholder("chat_history"),
    ("human", "{question}"),
])

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

chain = (
    {
        "context": itemgetter("question") | retriever | format_docs, 
        "question": itemgetter("question"),
        "chat_history": itemgetter("chat_history")
    }
    | prompt 
    | model 
    | StrOutputParser()
)

sessions = {}
MAX_TURNS = 3

def chat(session_id, question):
    history = sessions.get(session_id, [])
    answer = chain.invoke({"question": question, "chat_history": history})
    history = history + [("human", question), ("ai", answer)]
    sessions[session_id] = history[-MAX_TURNS * 2:]
    return answer

app = FastAPI()

class Ask(BaseModel):
    question: str
    session_id: str = "default"

@app.post("/ask")
def ask(body: Ask):
    return {"answer": chat(body.session_id, body.question)}