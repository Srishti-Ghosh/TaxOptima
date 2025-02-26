from fastapi import FastAPI, UploadFile, File
from typing import List
import os
from tax_processor import TaxDocumentProcessor

app = FastAPI()

@app.post("/process-documents/")
async def process_documents(files: List[UploadFile]):
    processor = TaxDocumentProcessor(api_key=os.getenv("OPENAI_API_KEY"))
    results = await processor.process_dashboard_upload(files)
    return results 