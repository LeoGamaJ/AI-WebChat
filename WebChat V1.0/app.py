from flask import Flask, render_template, request, jsonify, Response, stream_with_context
from openai import OpenAI
from dotenv import load_dotenv
from flask_cors import CORS
import os
import logging
import requests
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

openai_api_key = os.getenv("OPENAI_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")
perplexity_api_key = os.getenv("PERPLEXITY_API_KEY")

openai_client = OpenAI(api_key=openai_api_key)
genai.configure(api_key=gemini_api_key)

@app.route('/')
def index():
    return render_template('index.html')

# Mantemos a rota original para compatibilidade
@app.route('/ask', methods=['POST'])
def ask():
    user_message = request.json.get('message', '')
    max_tokens = request.json.get('max_tokens', 1500)
    temperature = request.json.get('temperature', 0.7)
    model = request.json.get('model', 'gpt-4152-mini')
    top_p = request.json.get('top_p', 1)
    frequency_penalty = request.json.get('frequency_penalty', 0)
    presence_penalty = request.json.get('presence_penalty', 0)
    api_provider = request.json.get('api_provider', 'openai')

    if not user_message:
        logging.error("Mensagem do usuário não fornecida.")
        return jsonify({"error": "Mensagem do usuário não fornecida."}), 400

    try:
        logging.info(f"Mensagem recebida: {user_message}")
        logging.info(f"Configurações: max_tokens={max_tokens}, temperature={temperature}, model={model}, "
                     f"top_p={top_p}, frequency_penalty={frequency_penalty}, presence_penalty={presence_penalty}, "
                     f"api_provider={api_provider}")

        if not isinstance(user_message, str):
            logging.error("Mensagem não é uma string.")
            return jsonify({"error": "Mensagem deve ser uma string."}), 400

        if api_provider == 'openai':
            response = openai_client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "user", "content": user_message}
                ],
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=top_p,
                frequency_penalty=frequency_penalty,
                presence_penalty=presence_penalty
            )
            assistant_response = response.choices[0].message.content

        elif api_provider == 'gemini':
            generation_config = {
              "temperature": temperature,
              "top_p": top_p,
              "top_k": 64,
              "max_output_tokens": max_tokens,
              "response_mime_type": "text/plain",
            }

            gemini_model = genai.GenerativeModel(
                model_name=model,
                generation_config=generation_config,
                system_instruction=" "
            )

            chat_session = gemini_model.start_chat()
            response = chat_session.send_message(user_message)
            assistant_response = response.text

        elif api_provider == 'perplexity':
            url = 'https://api.perplexity.ai/chat/completions'
            headers = {
                'Authorization': f'Bearer {perplexity_api_key}'
            }
            data = {
                "model": model,
                "messages": [{"role": "user", "content": user_message}],
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": top_p
            }
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            assistant_response = response.json()['choices'][0]['message']['content']
        else:
            logging.error(f"Provedor de API inválido: {api_provider}")
            return jsonify({"error": "Provedor de API inválido."}), 400

        logging.info(f"Resposta gerada: {assistant_response}")
        return jsonify({"response": assistant_response})

    except Exception as e:
        logging.error(f"Erro ao gerar resposta: {e}")
        return jsonify({"error": "Erro ao processar sua solicitação."}), 500

# Nova rota para streaming
@app.route('/ask_stream', methods=['POST'])
def ask_stream():
    try:
        user_message = request.json.get('message', '')
        model = request.json.get('model', 'gpt-4-mini')
        temperature = request.json.get('temperature', 0.7)
        api_provider = request.json.get('api_provider', 'openai')

        if not user_message:
            return jsonify({"error": "Mensagem do usuário não fornecida."}), 400

        def generate():
            try:
                if api_provider == 'openai':
                    for chunk in openai_client.chat.completions.create(
                        model=model,
                        messages=[{"role": "user", "content": user_message}],
                        temperature=temperature,
                        stream=True
                    ):
                        if chunk.choices[0].delta.content is not None:
                            yield f"data: {chunk.choices[0].delta.content}\n\n"
                elif api_provider == 'gemini':
                    generation_config = {
                        "temperature": temperature,
                        "response_mime_type": "text/plain",
                    }

                    gemini_model = genai.GenerativeModel(
                        model_name=model,
                        generation_config=generation_config
                    )

                    response = gemini_model.generate_content(
                        user_message,
                        stream=True
                    )

                    for chunk in response:
                        if chunk.text:
                            yield f"data: {chunk.text}\n\n"

            except Exception as e:
                logging.error(f"Erro no streaming: {e}")
                yield f"data: [ERRO: {str(e)}]\n\n"

        return Response(stream_with_context(generate()), mimetype='text/event-stream')

    except Exception as e:
        logging.error(f"Erro ao iniciar streaming: {e}")
        return jsonify({"error": "Erro ao processar sua solicitação."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)