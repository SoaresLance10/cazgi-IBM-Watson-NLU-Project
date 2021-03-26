import './bootstrap.min.css'
import './App.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'

const isObjectEmpty = object => {
  return Object.keys(object).length === 0 && 
    object.constructor === Object
}

const App = () => {
  const [mode, setMode] = useState("text")
  const [text, setText] = useState("")
  const [sentimentResult, setSentimentResult] = useState("")
  const [emotionResult, setEmotionResult] = useState({})

  const MODE_URL = "url"
  const MODE_TEXT = "text"

  useEffect(() => document.title = "Sentiment Analyzer" , [])

  const analyzeSentiment = () => {
    if (text === "") {
      return
    }

    let url = "."

    if (mode === MODE_URL) {
      url = `${url}/url/sentiment?url=${text}`
    } else {
      url = `${url}/text/sentiment?text=${text}`
    }

    axios
      .get(url)
      .then(response => {
        setSentimentResult(response.data.sentiment)
        setEmotionResult({})
      })
  }

  const analyzeEmotion = () => {
    if (text === "") {
      return
    }

    let url = "."

    if (mode === MODE_URL) {
      url = `${url}/url/emotion?url=${text}`
    } else {
      url = `${url}/text/emotion/?text=${text}`
    }

    axios
      .get(url)
      .then((response) => {
        setSentimentResult("")
        setEmotionResult(response.data)
      })
  }

  return (
    <div className="App">
      <button 
        className={classnames("btn", {
          "btn-dark": mode !== MODE_TEXT,
          "btn-info": mode === MODE_TEXT,
        })}
        onClick={() => {
          if (mode !== MODE_TEXT) {
            setMode(MODE_TEXT)
            setText("")
            setSentimentResult("")
            setEmotionResult({})
          }
        }}
      >
        Text
      </button>
      <button 
        className={classnames("btn", {
          "btn-dark": mode !== MODE_URL,
          "btn-info": mode === MODE_URL,
        })}
        onClick={() => {
          if (mode !== MODE_URL) {
            setMode(MODE_URL)
            setText("")
            setSentimentResult("")
            setEmotionResult({})
          }
        }}
      >
        URL
      </button>
      <br /><br />
      {mode === MODE_URL ? (
        <input 
          type="text" 
          value={text}
          onChange={event => setText(event.target.value)}
          style={{
            width: "400px",
            marginBottom: "5px",
          }}
        />
      ) : (
        <textarea 
          rows={4}
          cols="50" 
          value={text}
          onChange={event => setText(event.target.value)}
        />
      )}
      <br />
      <button className="btn-primary" onClick={analyzeSentiment}>
        Analyze Sentiment
      </button>
      <button className="btn-primary" onClick={analyzeEmotion}>
        Analyze Emotion
      </button>
      <br />
      {sentimentResult === "positive" && (
        <div 
          style={{
            color: "green", 
            fontSize: 20
          }}
        >
          Positive
        </div>
      )}
      {sentimentResult === "negative" && (
        <div 
          style={{
            color: "red", 
            fontSize: 20
          }}
        >
          Negative
        </div>
      )}
      {(
        sentimentResult &&
        sentimentResult !== "positive" &&
        sentimentResult !== "negative"
      ) && (
        <div 
          style={{
            color: "orange", 
            fontSize: 20
          }}
        >
          Neutral
        </div>
      )}
      {!isObjectEmpty(emotionResult) && (
        <div 
          style={{
            margin: "0 auto",
            marginTop: "20px",
            width: "50%",
          }}
        >
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Emotion</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(emotionResult).map(emotion => (
                <tr>
                  <td>{emotion}</td>
                  <td>{emotionResult[emotion]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App