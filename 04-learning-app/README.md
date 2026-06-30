# LeArNiNg ApP

The basic idea is to build a fully functional ML model that can ask users questions on specific topics. The most interesting feature is that users can provide their own documents, and the model will generate and ask questions based on the content of those documents.


## There are three ways we can generate questions from the data

* **Use online resources:** The model can collect questions from existing online sources. However, this approach has a limitation not everyone knows where to find high-quality resources or relevant questions.

* **Generate questions from a PDF:** Users can simply upload a subject PDF, and the model will analyze the content and generate questions for revision and practice.

* **Learn from books and example questions:** We can provide the AI with textbooks and a set of sample questions so that it learns the pattern and style of question generation, allowing it to create similar questions automatically.

* **Syllabus-driven question generation:** The model can generate targeted questions based on a specific syllabus, ensuring that students focus only on the topics that are relevant to their course or exam.

## System architecture

### **HLD** (High Level Design)
The core challenge of this system is that AI generation takes time. If a user uploads a 50-page PDF, the server cannot keep the HTTP request open for 5 minutes while the LLM generates 100 questions. You need an asynchronous, event-driven architecture. (in future...)


### for now The Local Utility Architecture (Low-Level Design)

[Local PDF/Text File] ──> 1. File Reader Module ──> 2. Chunker Module ──> 3. AI Sequential Loop ──> [local_quiz_bank.json]

- File Reader Module: Uses a local library to load the target book or document into memory as a giant string.

- Chunker Module: A small utility function that cuts that giant string into small, manageable pieces so you don't breach the AI's processing limits.

- AI Sequential Loop: A synchronous or controlled asynchronous loop that takes one chunk at a time, makes a direct API call to the model, and appends the resulting questions to a local array.



### tools
- customtkinter for UI