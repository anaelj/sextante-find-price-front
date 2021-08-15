import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import api from "./api/api.js";

const Home: NextPage = () => {
  const [textSearch, setTextSearch] = useState("");

  const search = (value : string) => {
    // console.log(value)
    api.get(`/prices?textSearch=${value}`).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <header>
        <label htmlFor="pesquisa">Pesquise</label>
        <input
          type="text"
          name="pesquisa"
          id="pesquisa"
          placeholder="gtx 1660 super"
          value={textSearch}
          onChange={ e =>  setTextSearch(e.target.value)}
        />
        <button onClick={() => search(textSearch)}>Pesquisar</button>
      </header>
    </>
  );
};

export default Home;
