from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pptx import Presentation
from fpdf import FPDF
import base64
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()
api_key = os.getenv('openaikey')

file_path = "uploads/pp.pptx"

client = OpenAI(
    api_key=api_key
)

def makeGpt(prompt):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                'role':'user',
                'content': f'you are to read this entire powerpoint, then create a one to two page summary of it so that it will be written into a cheat sheet. you must format it so that it can go into a string that will become a pdf later. you can add bullet points if you want here is the thing {prompt}'
            }
        ],
        model='gpt-3.5-turbo'
    )
    return(chat_completion.choices[0].message.content)

def getText(file):
    prs = Presentation(file)
    text = ''
    for slide in prs.slides:
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            text += shape.text_frame.text
            
    # text = text.replace('\n', '')   
    text = text.replace("•", ">")
    text=text.replace('\n', '')
    return text

def makePdf(words):
    pdf = FPDF()
    pdf.add_page()
    pdf.add_font('newFont', '',r'indie.ttf', uni=True )
    pdf.set_font('newFont', '', 14)
    pdf.cell(0,10, txt='CHEET SHEET', align='C',ln=1)
    pdf.set_font('newFont', '', size=13)
    pdf.multi_cell(0,10, txt= words, border = 0, align='L', fill= False)
    pdf.output('text.pdf')



def fileTo64(filePath):
    with open(filePath, 'rb') as file:
        fileBytes = base64.b64encode(file.read())
        b64 = fileBytes.decode('ascii')
    return b64

app = Flask(__name__)
CORS(app)
# Ensure the "uploads" folder exists
UPLOAD_FOLDER = "./uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the file to the "uploads" folder
    file_path = os.path.join(UPLOAD_FOLDER, 'pp.pptx')
    file.save(file_path)
    
    text = getText(file_path)
    text = makeGpt(text)
    makePdf(text)
    encoded = fileTo64('text.pdf')
    return jsonify({'pdfEncoded': encoded}), 200

if __name__ == "__main__":
    app.run(debug=True)

