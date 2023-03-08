import React from 'react'
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault();

    if(loading){
      return
    }

    setLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/generate-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText: questionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      // setResult(data.result);
      setResult(data.result.replaceAll("\n", "<br />"));
      setQuestionInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Ask me</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Enter a question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <input type="submit" value="Answer question" />
        </form>
        {loading && (
          <div>
            <h2>Thinking hard...</h2>
            <img src="/cat-what.gif" className={styles.loading}/>
          </div>
        )}
        {/* <div className={styles.result}>{result}</div> */}
        {result && <div className={styles.result} dangerouslySetInnerHTML={{__html: result}}/>}
      </main>
    </div>
  );
}
