import re
import requests
from bs4 import BeautifulSoup


def getSingleString(HtmlItem):
    for string in HtmlItem.stripped_strings:
        strings = string
    return strings


def cleanListFromPattern(list, pattern):
    cleaned_texts = []
    for text in list:
        # Buscar la primera coincidencia del patrón en el texto
        match = pattern.search(text)
        if match:
            cleaned_texts.append(match.group())
    return cleaned_texts

def count_elements_with_classes(html, class_names):
    """
    Cuenta los elementos que tienen todas las clases especificadas en class_names.
    :param html: Objeto BeautifulSoup que representa el HTML.
    :param class_names: Lista de clases que se deben cumplir.
    :return: Número de elementos que cumplen la condición.
    """
    def has_all_classes(element):
        return all(cls in element.get("class", []) for cls in class_names)
    
    # Filtrar los elementos que contienen todas las clases
    elements = html.find_all(has_all_classes)
    return len(elements)

def getRMVCUrl(weekUrl) :
    response = requests.get(weekUrl)
    base_url = "https://wol.jw.org"
    soup = BeautifulSoup(response.text, 'html.parser')

    # Encuentra el <a> que contiene el enlace RMVC
    link_tag = soup.find("a", class_=re.compile(r"\bjwac\b.*\btoday\b"))

    if link_tag and link_tag.has_attr("href"):
        full_url = base_url + link_tag["href"]
        return full_url
    else:
        raise ValueError("No se encontró el enlace RMVC en la página.")