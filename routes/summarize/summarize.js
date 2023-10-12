const router =  require("express").Router();
const auth = require("../auth/authVerify")
const bodyParser = require('body-parser');
const natural = require('natural');
const wordTokenizer = new natural.WordTokenizer();
const sentenceTokenizer = new natural.SentenceTokenizer();
// Todo: Move to file
const stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']

router.post('/summarize', auth, async (req, res) => {
    var wordTokens = wordTokenizer.tokenize(req.body.text + '');
    var sentTokens = sentenceTokenizer.tokenize(req.body.text + '');

    var freq = new Map();

    wordTokens.forEach(word => {
        if (!stopwords.includes(word.toLowerCase())) {
            if (freq.has(word)) {
                freq.set(word, freq.get(word) + 1);
            } else {
                freq.set(word, 1);
            }
        }
    });

    // Normalize
    var maxFeq = Math.max(...freq.values())
    for (let word of freq.keys()) {
        freq.set(word, freq.get(word)/maxFeq);
    }


    var sentenceScore = new Map();
    sentTokens.forEach(sentence => { 
        var words = wordTokenizer.tokenize(sentence.toLowerCase());

        if (words.length < 30) { // Omit long sentences
            words.forEach(word => {
                if (freq.has(word)) {
                    if (!sentenceScore.has(sentence)) {
                        sentenceScore.set(sentence, freq.get(word));
                    } else {
                        sentenceScore.set(sentence, parseFloat(freq.get(word)) + parseFloat(freq.get(word)));
                    }
                }
            });
        }

    });


    // Rank sentences based on score
    const sentSorted = new Map([...sentenceScore.entries()].sort((a, b) => b[1] - a[1]));

    // Build summary with top 3 sentences, (ToDo: make this configurable)
    var summText =  "";    
    for(let i = 0; i < 3; i++) {
        summText += " " + [...sentSorted][i][0]
    }

    res.status(200);
    res.json({summary: summText});
});

module.exports = router;