from dotenv import load_dotenv, find_dotenv
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv(find_dotenv())

pdf_docs = DirectoryLoader(
    "./data", 
    glob="*.pdf", 
    loader_cls=PyPDFLoader
)

pdf_loaded_docs = pdf_docs.load()

pdf_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, 
    chunk_overlap=200
)

chunks = pdf_splitter.split_documents(pdf_loaded_docs)

embeddings = FastEmbedEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

FAISS.from_documents(chunks, embeddings).save_local("faiss_index")
print("Index saved")