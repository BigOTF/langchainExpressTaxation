## How to run?

1. conda create -n llmapp python=3.11 -y
2. conda activate llmapp
3. pip install -r requirements.txt

run 
python index.py
uvicorn app:app --port 8000