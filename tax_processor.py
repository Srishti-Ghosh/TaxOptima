from langchain.document_loaders import UnstructuredFileLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.summarize import load_summarize_chain
from langchain.llms import OpenAI
import requests
from bs4 import BeautifulSoup
import os

class TaxDocumentProcessor:
    def __init__(self, api_key):
        self.llm = OpenAI(api_key=api_key)
        self.embeddings = OpenAIEmbeddings(api_key=api_key)
        self.supported_formats = ['.pdf', '.docx', '.txt', '.doc']  # Add supported formats
        
    def validate_file(self, file):
        # Get file extension
        file_ext = os.path.splitext(file.name)[1].lower()
        if file_ext not in self.supported_formats:
            raise ValueError(f"Unsupported file format. Supported formats: {', '.join(self.supported_formats)}")
        return True

    async def process_dashboard_upload(self, files):
        results = []
        
        for file in files:
            try:
                # Validate file format
                self.validate_file(file)
                
                # Create a temporary file to process
                temp_path = f"temp_{file.name}"
                with open(temp_path, 'wb') as temp_file:
                    temp_file.write(await file.read())
                
                # Process the document
                result = self.process_document(temp_path)
                
                results.append({
                    "file_name": file.name,
                    "analysis": result,
                    "status": "success"
                })
                
                # Clean up temporary file
                os.remove(temp_path)
                
            except Exception as e:
                results.append({
                    "file_name": file.name,
                    "error": str(e),
                    "status": "failed"
                })
        
        return results

    def process_document(self, file_path):
        # Load and process document
        loader = UnstructuredFileLoader(file_path)
        documents = loader.load()
        
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        splits = text_splitter.split_documents(documents)
        
        # Generate document summary
        chain = load_summarize_chain(self.llm, chain_type="map_reduce")
        summary = chain.run(splits)
        
        # Fetch tax-related information
        tax_info = self.scrape_tax_website()
        
        # Generate deductions analysis
        analysis_prompt = f"""
        Based on the following document summary and tax information, identify possible tax deductions:
        
        Document Summary:
        {summary}
        
        Tax Information:
        {tax_info}
        
        Please list all applicable deductions and relevant sections of the Income Tax Act.
        """
        
        deductions_analysis = self.llm.predict(analysis_prompt)
        
        return {
            "summary": summary,
            "deductions_analysis": deductions_analysis
        }
    
    def scrape_tax_website(self):
        # Add URLs for specific tax deduction pages
        tax_urls = [
            "https://incometaxindia.gov.in/Pages/default.aspx",
            # Add more relevant URLs
        ]
        
        scraped_data = []
        
        for url in tax_urls:
            try:
                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')
                # Customize the selectors based on the website structure
                relevant_content = soup.find_all(['p', 'li', 'h2', 'h3'])
                scraped_data.extend([item.text.strip() for item in relevant_content])
            except Exception as e:
                print(f"Error scraping {url}: {str(e)}")
                
        return "\n".join(scraped_data)

# Usage example
def process_tax_documents(file_paths):
    processor = TaxDocumentProcessor(api_key=os.getenv("OPENAI_API_KEY"))
    
    results = []
    for file_path in file_paths:
        result = processor.process_document(file_path)
        results.append({
            "file": file_path,
            "analysis": result
        })
    
    return results

files = ['path/to/document1.pdf', 'path/to/document2.pdf']
results = process_tax_documents(files)

for result in results:
    print(f"\nFile: {result['file']}")
    print(f"Summary: {result['analysis']['summary']}")
    print(f"Deductions Analysis: {result['analysis']['deductions_analysis']}")