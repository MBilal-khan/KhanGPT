import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'This is an upgrade version of ChatGpt ',
  });
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/', async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: req.body.input, // ham body maa jo input daa raha han os kaa motabiq hama resopnse ayaga
      // ham body maa jo input daa raha han os kaa motabiq hama resopnse ayaga
      temperature: 0.5,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    console.log('PASSED', req.body.input);
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (err) {
    console.log('FAILED', req.body.input);
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
