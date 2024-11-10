import deepl

translator = deepl.Translator('a1cdee85-aff7-4933-8b4b-0904fbad11b5:fx')

def deepl_translate_text(text, target_language='FR'):
    """Translates text into the target language using DeepL."""
    result = translator.translate_text(text, target_lang=target_language)
    return result.text
