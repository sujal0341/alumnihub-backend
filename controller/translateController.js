const fetch = require('node-fetch');

// Recursive function to handle translation of strings, arrays, and objects
const translateData = async (data, targetLang) => {
    if (typeof data === 'string') {
        // If the data is a string, translate it using the Microsoft Translator API
        const url = 'https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&profanityAction=NoAction&textType=plain';
        
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': 'a1b2dc5266mshd9d656c8dcf58bap1ec6c1jsn41796b8b39bc', // Your RapidAPI key here
                'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{
                Text: data
            }])
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            // Extract the translated text from the API response
            return result[0].translations[0].text;
        } catch (error) {
            console.error('Error during translation:', error);
            throw new Error('Translation failed');
        }
    } else if (Array.isArray(data)) {
        // If the data is an array, translate each element
        const translatedArray = await Promise.all(data.map(item => translateData(item, targetLang)));
        return translatedArray;
    } else if (typeof data === 'object') {
        // If the data is an object, recursively translate each value
        const translatedObject = {};
        for (const key in data) {
            translatedObject[key] = await translateData(data[key], targetLang);
        }
        return translatedObject;
    }

    return data; // Return data as is if it's not a string, array, or object
};

// Controller function to handle translation request
const translateContent = async (req, res) => {
    try {
        const { content, targetLang } = req.body;
        const translatedContent = await translateData(content, targetLang);
        res.json({ translatedContent });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
};

module.exports = { translateContent };
