async function uploadFiles(files) {
    const formData = new FormData();
    
    for (const file of files) {
        formData.append('files', file);
    }
    
    try {
        const response = await fetch('/process-documents/', {
            method: 'POST',
            body: formData
        });
        
        const results = await response.json();
        
        // Handle results
        results.forEach(result => {
            if (result.status === 'success') {
                console.log(`File ${result.file_name} processed successfully`);
                console.log('Summary:', result.analysis.summary);
                console.log('Deductions:', result.analysis.deductions_analysis);
            } else {
                console.error(`Error processing ${result.file_name}:`, result.error);
            }
        });
        
    } catch (error) {
        console.error('Upload failed:', error);
    }
} 