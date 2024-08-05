
const getRecipeSuggestions = async () => {
    const pantryItems = pantry.map(item => item.name).join(', ');
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt: `Suggest recipes based on the following pantry items: ${pantryItems}`,
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer sk-svcacct-GiOePj5OpEx6g3-k0s8mX_DH5qmB-sSAjQmSt60cKyOBOpmNRRESswggUT3BlbkFJeEWFUu692wPaPTVvZbIxyFtjsxMUVNyoFwWn1K7ZiurxiurWjtqqjtmAA`,
                    'Content-Type': 'application/json',
                },
            }
        );
        setRecipes(response.data.choices[0].text.trim().split('\n'));
        handleRecipeModalOpen();
    } catch (error) {
        console.error('Error fetching recipe suggestions:', error);
    }
};

export default getRecipeSuggestions;
