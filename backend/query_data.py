import argparse
# from langchain.vectorstores.chroma import Chroma
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama
from typing import Generator

from embedding_function import get_embedding_function

CHEMIN_CHROMA = "chroma"

TEMPLATE_PROMPT = """
Tu es l'assistant conversationnel de la Licence d'Excellence en Intelligence Artificielle. 
Réponds aux questions en français en te basant strictement sur le contexte suivant :

{contexte}

---

Question : {question}
Ton rôle : Fournir une réponse claire, concise et pertinente en français. 
Si tu ne connais pas la réponse, dis simplement que tu ne sais pas.
"""

def main():
    parser = argparse.ArgumentParser(description="Chatbot de la Licence d'Excellence en IA")#analyser
    parser.add_argument("question", type=str, help="La question posée par l'utilisateur")
    args = parser.parse_args()
    repondre_question(args.question)

def repondre_question(question: str):
    
    fonction_embedding = get_embedding_function()
    bd = Chroma(persist_directory=CHEMIN_CHROMA, embedding_function=fonction_embedding)

    resultats = bd.similarity_search_with_score(question, k=3)
    
    # print(TEMPLATE_PROMPT)

    texte_contexte = "\n\n---\n\n".join([doc.page_content for doc, _score in resultats])
    prompt_template = ChatPromptTemplate.from_template(TEMPLATE_PROMPT)
    prompt = prompt_template.format(contexte=texte_contexte, question=question) 

    model = Ollama(model="mistral")
    
    reponse = model.invoke(prompt)

    sources = [doc.metadata.get("source", "Inconnu") for doc, _ in resultats]
    full_response = f"{reponse}\n\nSources: {', '.join(sources)}"
    
    return full_response

if __name__ == "__main__":
    main()