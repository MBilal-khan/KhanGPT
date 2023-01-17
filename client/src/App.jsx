import { useState, useEffect } from 'react';
import send from './assets/send.svg';
import loadingIcon from './assets/loader.svg';
import logo from './assets/logo.png';
import user from './assets/user.png';
import bot from './assets/bot.png';
import axios from 'axios';

function App() {
  // let arr = [
  //   { type: 'user', post: 'this is from user' },
  //  ,
  // ];
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector('.layout').scrollTop =
      document.querySelector('.layout').scrollHeight;
  }, [posts]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      'http://localhost:4000',
      { input },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return data;
  };

  const onSubmit = async () => {
    if (input.trim() === '') return;
    updatePost(input);
    updatePost('loading...', false, true);
    setInput('');
    fetchBotResponse().then((res) => {
      console.log(res);
      updatePost(res.bot.trim(), true);
    });
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop();
          if (lastItem.type !== 'bot') {
            prevState.push({ type: 'bot', post: text.charAt(index - 1) });
          } else {
            prevState.push({
              type: 'bot',
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 0);
  };

  const updatePost = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [...prevState, { type: isLoading ? 'loading' : 'user', post }];
      });
    }
  };
  const onKeyUp = (e) => {
    if (e.key === 'Enter' || e.which === 13) {
      onSubmit();
    }
  };
  
  return (
    <main className='khanGPT-app'>
      <section className='chat-container'>
        <div className='layout'>
          {posts.map((post, index) => {
            return (
              <div
                key={index}
                className={`chat-bubble ${
                  post.type === 'bot' || post.type === 'loading' ? 'bot' : ''
                }`}
              >
                <div className='avatar'>
                  <img
                    src={
                      post.type === 'bot' || post.type === 'loading'
                        ? bot
                        : user
                    }
                  />
                </div>
                {post.type === 'loading' ? (
                  <div className='loader'>
                    <img src={loadingIcon} alt='' />
                  </div>
                ) : (
                  <div className='post'>{post.post}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <footer>
        <input
          value={input}
          type='text'
          className='composeBar'
          autoFocus
          placeholder='Ask me anything you want'
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className='send-button' onClick={onSubmit}>
          <img src={send} alt='' />
        </div>
      </footer>
    </main>
  );
}

export default App;
