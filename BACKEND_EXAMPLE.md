# Backend Integration Guide

This chat UI connects to a backend API running locally. Here's an example of how to set up your backend.

## API Endpoint

The frontend expects a `/chat` endpoint at `http://localhost:8000` (configurable in `components/chat-container.tsx`).

## Expected API Format

### Request
```json
POST /chat

// With text only:
{
  "message": "Your message here"
}

// With files (multipart/form-data):
- message: "Your message here"
- files: [File, File, ...]
```

### Response
```json
{
  "response": "AI response text here"
}
```

## Python FastAPI Example

```python
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(
    message: str = Form(...),
    files: Optional[list[UploadFile]] = File(None)
):
    """
    Handle chat messages and optional file uploads.
    
    Args:
        message: The user's message text
        files: Optional list of uploaded files
    
    Returns:
        JSON with 'response' key containing AI response
    """
    
    # Process files if provided
    file_contents = []
    if files:
        for file in files:
            content = await file.read()
            file_contents.append({
                "name": file.filename,
                "content": content
            })
    
    # Your AI logic here
    # This is where you'd call your LLM, process files, etc.
    ai_response = f"Received message: {message}"
    
    if file_contents:
        ai_response += f" with {len(file_contents)} file(s)"
    
    return {"response": ai_response}

# Run with: uvicorn your_file:app --reload --port 8000
```

## Node.js/Express Example

```javascript
const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/chat', upload.array('files'), async (req, res) => {
  const { message } = req.body;
  const files = req.files || [];

  // Your AI logic here
  const response = `Received message: ${message}`;
  
  if (files.length > 0) {
    response += ` with ${files.length} file(s)`;
  }

  res.json({ response });
});

app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
```

## Testing the Connection

1. Start your backend server on `http://localhost:8000`
2. Open the chat UI in your browser
3. Type a message and hit send
4. The response will appear in the chat

## Customization

- **Change the API URL**: Edit `API_URL` in `components/chat-container.tsx`
- **Add authentication**: Modify the fetch request to include headers with auth tokens
- **Stream responses**: Modify the fetch to use `ReadableStream` for streaming responses
- **File handling**: Implement file processing in your backend to analyze/process uploads

## Key Features of the UI

✅ Real-time chat history  
✅ File upload with drag & drop  
✅ Streaming text animation  
✅ Responsive design (mobile & desktop)  
✅ Loading states with animations  
✅ Clear chat history button  
✅ Beautiful purple/blue theme  

Enjoy your AI chat interface! 🚀
